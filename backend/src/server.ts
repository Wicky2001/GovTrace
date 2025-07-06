import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import {
  TransactionMetaData,
  storeTransactionOnDb,
  connectToDatabase,
} from "./db.js";
import {
  BlockfrostProvider,
  MeshWallet,
  Transaction,
  ForgeScript,
  AssetMetadata,
  Mint,
} from "@meshsdk/core";

dotenv.config();
const app = express();
app.use(express.json());
const port = 3000;

connectToDatabase();

//Loading env details
const block_forest_key = process.env.BLOCK_FOREST_API_KEY as string;
const mnemonic = process.env.LACE_MEMONIC?.split(" ") as Array<string>;

if (!block_forest_key || block_forest_key.trim() === "") {
  throw new Error("BLOCK FOREST API KEY IS NOT DEFINED OR EMPTY");
}
if (!mnemonic) {
  throw new Error("MNEMONIC KEYS ARE NOT DEFINED");
}

const provider = new BlockfrostProvider(block_forest_key);

//setting up wallet
const wallet = new MeshWallet({
  networkId: 0,
  fetcher: provider,
  submitter: provider,
  key: {
    type: "mnemonic",
    words: mnemonic,
  },
});

async function storeTransactionDetailsOnChain(
  transactionMetaData: TransactionMetaData
) {
  const usedAddress = await wallet.getUsedAddresses();
  const address = usedAddress[0];
  const forgingScript = ForgeScript.withOneSignature(address);

  const tx = new Transaction({ initiator: wallet });

  const asset: Mint = {
    assetName: "GoveTrace 2nd token",
    assetQuantity: "1",
    metadata: transactionMetaData,
    label: "721",
  };

  tx.mintAsset(forgingScript, asset);

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx); //This is the transaction hash

  // console.log(txHash);

  return txHash;
}

app.post("/transactions", (req: Request, res: Response) => {
  console.log(req.body);
  const { amount, description, department, date } = req.body;

  const transaction = {
    amount: amount,
    description: description,
    department: department,
    transaction_date: date,
  };

  storeTransactionDetailsOnChain(transaction)
    .then((transactionHash) => {
      console.log(`Transaction hash ${transactionHash}`);

      const transaction_mint_date = new Date();
      const data = {
        ...transaction,
        id: transactionHash,
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

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello, World! Hi wicky" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
