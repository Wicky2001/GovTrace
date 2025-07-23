import { Router, Request, Response } from "express";
import { isGovermentEmail } from "../utills/support.js";
import { saveGuest } from "../utills/db.js";
const authRoute = Router();

authRoute.post("/register/guest", (req: Request, res: Response) => {
  const data = req.body;

  if (!isGovermentEmail(data.email)) {
    res
      .status(401)
      .json({ message: "YOU CAN'T USE GOVERMENT EMAIL TO REGISTER AS GUEST" });
  }

  try {
    saveGuest(data);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default authRoute;
