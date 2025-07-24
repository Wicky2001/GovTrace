import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { connectToDatabase } from "./utills/db.js";

//Routes
import transactionRoute from "./routes/transactions.js";
import authRoute from "./routes/auth.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/transaction", transactionRoute);
app.use("/api/auth", authRoute);

const port = 4000;

connectToDatabase();

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "server is up" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
