import { Router, Request, Response } from "express";
import { isGovermentEmail } from "../utills/support.js";
import { saveGuest, Guest } from "../utills/db.js";

const authRoute = Router();

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

export default authRoute;
