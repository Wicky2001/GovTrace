import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { connectToDatabase } from "./utills/db.js";
import passport from "./utills/passport.js";
//Routes
import transactionRoute from "./routes/transactions.js";
import authRoute from "./routes/auth.js";
import cookieParser from "cookie-parser";
import fs from "fs";
import https from "https";

const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "https://localhost:3000", // Your frontend's URL
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(express.json());
app.use(cookieParser());
const port = 4000;
const options = {
  key: fs.readFileSync("./httpsFiles/localhost-key.pem"),
  cert: fs.readFileSync("./httpsFiles/localhost.pem"),
};

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use("/api/transaction", transactionRoute);
app.use("/api/auth", authRoute);

connectToDatabase();

app.get(
  "/api/health",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => {
    res.status(200).json({ message: "server is up" });
  }
);
