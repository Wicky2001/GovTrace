import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import {
  TransactionMetaData,
  storeTransactionOnDb,
  connectToDatabase,
  getDocumentUsingTxHash,
  getAllTransactions,
} from "./db.js";
import {
  storeTransactionDetailsOnChain,
  getHashForData,
  verifyTransaction,
} from "./support.js";
import { BlockfrostProvider, MeshWallet } from "@meshsdk/core";

dotenv.config();
const app = express();
app.use(express.json());
const port = 3000;

connectToDatabase();

const block_forest_key = process.env.BLOCK_FOREST_API_KEY as string;
const mnemonic = process.env.LACE_MEMONIC?.split(" ") as Array<string>;

if (!block_forest_key || block_forest_key.trim() === "") {
  throw new Error("BLOCK FOREST API KEY IS NOT DEFINED OR EMPTY");
}
if (!mnemonic) {
  throw new Error("MNEMONIC KEYS ARE NOT DEFINED");
}

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

app.post("/api/transactions", async (req: Request, res: Response) => {
  const data = req.body;

  console.log(data);

  const dataHash = getHashForData(data);

  if (!dataHash) {
    res.send({ message: "ERROR OCCURED WHEN CREATE HASH CODE FOR THE DATA" });
  }

  const transaction: TransactionMetaData = {
    amount: data.amount,
    description: data.description,
    department: data.department,
    transaction_date: data.date,
    hash: dataHash,
  };

  storeTransactionDetailsOnChain(transaction, wallet)
    .then((blockchainHash) => {
      console.log(`Transaction hash ${blockchainHash}`);

      const transaction_mint_date = new Date();

      const data = {
        ...transaction,
        id: blockchainHash,
        transaction_mint_date: transaction_mint_date,
      };

      storeTransactionOnDb(data).then((status) => {
        if (status) {
          return res.status(200).send({
            message: `successfully stored data on mongo db database`,
            storedData: data,
          });
        } else {
          res.send("data not stored on the db. Try again");
        }
      });
    })
    .catch((error) => {
      console.log(`THERE IS AN ERROR IN STORING DATA ON CHAIN ${error}`);
      res.send({
        message: `THERE IS AN ERROR IN STORING DATA ON CHAIN ${error}`,
      });
    });
});

app.get("/api/verify/:txhash", async (req: Request, res: Response) => {
  const txhash = req.params.txhash;

  console.log(txhash);

  interface DataToGenerateHash {
    amount: number;
    description: string;
    department: string;
    date: Date;
  }

  try {
    const document = await getDocumentUsingTxHash(txhash);

    const dataToGenerateHash = {
      amount: document?.amount,
      description: document?.description,
      department: document?.department,
      date: document?.transaction_date,
    };

    console.log(dataToGenerateHash);

    const verifyStatus = await verifyTransaction(dataToGenerateHash, txhash);

    if (verifyStatus) {
      res
        .status(200)
        .send({
          verifyStatus: verifyStatus,
          message: "Transaction is authentic",
        });
    } else {
      res
        .status(200)
        .send({
          verifyStatus: verifyStatus,
          message: "Transaction is tampered",
        });
    }

    console.log(verifyStatus);
  } catch (error) {
    console.log(
      `ERROR OCUURED WHEN FETCHING DOCUMENT FROM DATABASE USING TXHASH ${error} `
    );
  }
});

app.get("/api/transactions", async (req: Request, res: Response) => {
  try {
    const transactions = await getAllTransactions();

    if (transactions && transactions.length > 0) {
      res.status(200).send({
        message: "Successfully retrieved all transactions",
        transactions: transactions,
      });
    } else {
      res.status(200).send({
        message: "No transactions found",
        transactions: [],
      });
    }
  } catch (error) {
    console.log(`ERROR OCCURRED WHEN FETCHING ALL TRANSACTIONS: ${error}`);
    res.status(500).send({
      message: "Error occurred while fetching transactions",
      error: error,
    });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello, World! Hi wicky" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
