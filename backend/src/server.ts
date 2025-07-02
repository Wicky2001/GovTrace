import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
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
const port = 3000;

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

const transaction1: AssetMetadata = {
  department: "Civil Protection",
  message: "brought two buses",
};

async function storeTransactionDetailsOnChain(
  transactionMetaData: AssetMetadata
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

  return txHash;
}

storeTransactionDetailsOnChain(transaction1)
  .then((transactionHash) => {
    console.log(transactionHash);
  })
  .catch((error) => {
    console.log(
      `THERE IS AN ERROR OCCURED WHEN TRY TO STORE THE TRANSACTION DETAILS ON CHAIN ${error}`
    );
  });

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello, World! Hi wicky" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// wallet
//   .getChangeAddress()
//   .then((address) => {
//     console.log(address);
//   })
//   .catch((error) => {
//     console.log("ERROR OCCUERED WHILE RETREIVING THE WALLET ADRESS {$error}");
//   });
