import { Router, Request, Response } from "express";
import { isGovermentEmail } from "../utills/support.js";
import { saveGuest, Guest } from "../utills/db.js";
import passport from "../utills/passport.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const authRoute = Router();

dotenv.config();
const jwtSecret = String(process.env.SECRET);

authRoute.post("/register/guest", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (isGovermentEmail(data.email)) {
      res.status(401).json({
        message: "YOU CAN'T USE GOVERMENT EMAIL TO REGISTER AS GUEST",
      });
    }

    let guest = await Guest.findOne({ email: data.email });
    if (guest) {
      res
        .status(400)
        .json({ message: "You are already registerd please login" });
    }

    guest = await saveGuest(data);
    res.status(200).json({ message: `succssfully saved user ${guest}` });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
});

authRoute.post(
  "/login/guest",
  (req, res, next) => {
    passport.authenticate(
      "guest-local",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err || !user) {
          return res
            .status(401)
            .json({ message: info?.message || "Authentication failed" });
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  },
  (req, res) => {
    const email = req.body.email;
    const accessToken = jwt.sign({ email: email, role: "guest" }, jwtSecret, {
      expiresIn: "1d",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      domain: "localhost",
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "guest-jwt token created" });
  }
);

authRoute.post(
  "/login/admin",
  (req, res, next) => {
    passport.authenticate(
      "admin-local",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err || !user) {
          return res
            .status(401)
            .json({ message: info.message || "Authentication faild" });
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  },

  (req: Request, res: Response) => {
    const email = req.body.email;

    const accessToken = jwt.sign({ email: email, role: "admin" }, jwtSecret, {
      expiresIn: "1d",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      domain: "localhost",
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: `admin-jwt token created` });
  }
);

authRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

authRoute.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: any, res: any) => {
    const user = req.user;
    const token = jwt.sign(
      {
        googleId: user.googleId,
        role: "guest",
      },
      jwtSecret,
      { expiresIn: "1d" }
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("https://localhost:3000/transactions");
  }
);

export default authRoute;
