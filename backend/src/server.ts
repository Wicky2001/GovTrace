import express, { Request, Response } from "express";
import cors from "cors";
import { connectToDatabase } from "./utills/db.js";

import transactionRoute from "./routes/transactions.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/transaction", transactionRoute);
const port = 4000;

connectToDatabase();

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "server is up" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
