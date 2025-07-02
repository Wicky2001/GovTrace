import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import { BlockfrostProvider, MeshWallet } from "@meshsdk/core";
dotenv.config();
const app = express();
const port = 3000;

const block_forest_key = process.env.BLOCK_FOREST_API_KEY as string;
const mnemonic = process.env.LACE_MEMONIC?.split(" ") as Array<string>;

if (!block_forest_key || block_forest_key.trim() === "") {
  throw new Error("BLOCK FOREST API KEY IS NOT DEFINED OR EMPTY");
}
if (!mnemonic) {
  throw new Error("MNEMONIC KEYS ARE NOT DEFINED");
}
console.log(mnemonic);
const provider = new BlockfrostProvider(block_forest_key);

const wallet = new MeshWallet({
  networkId: 0,
  fetcher: provider,
  submitter: provider,
  key: {
    type: "mnemonic",
    words: mnemonic,
  },
});

wallet
  .getChangeAddress()
  .then((address) => {
    console.log(address);
  })
  .catch((error) => {
    console.log("ERROR OCCUERED WHILE RETREIVING THE WALLET ADRESS {$error}");
  });

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello, World! Hi wicky" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
