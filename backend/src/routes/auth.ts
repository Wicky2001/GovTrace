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
  const data = req.body;

  if (isGovermentEmail(data.email)) {
    res
      .status(401)
      .json({ message: "YOU CAN'T USE GOVERMENT EMAIL TO REGISTER AS GUEST" });
  }

  const guest = await Guest.findOne({ email: data.email });
  if (guest) {
    res.status(400).json({ message: "You are already registerd please login" });
  }

  try {
    const guest = await saveGuest(data);
    res.status(200).json({ message: `succssfully saved user ${guest}` });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
});

// authRoute.post("/login/guest", (req: Request, res: Response) => {
//   passport.authenticate(
//     "local",
//     { session: false },
//     (err: any, user: any, info: any) => {
//       if (err) {
//         return res
//           .status(500)
//           .json({ message: "An error occured during authentication" });
//       }
//       if (!user) {
//         return res
//           .status(401)
//           .json({ message: info?.message || "Authentication failed" });
//       }

//       return res.status(200).json({ message: `login successfull` });
//     }
//   )(req, res);
// });

authRoute.post(
  "/login/guest",
  passport.authenticate("local", { session: false }),
  (req: Request, res: Response) => {
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

    res.status(201).json({ message: `jwt token created` });
  }
);

export default authRoute;
