import * as dotenv from "dotenv";
import { TransactionMetaData, transactionDataOnMongoDb } from "./db.js";
import { Transaction, ForgeScript, Mint, MeshWallet } from "@meshsdk/core";
import axios from "axios";
import crypto from "crypto";
import fs from "fs/promises";

export interface DataToGenerateHash {
  amount?: number;
  description?: string;
  department?: string;
  date?: Date;
  fileName?: string | null;
}

dotenv.config();

const salt_rounds = Number(process.env.SALT);
const salt = process.env.SALT_ROUNDS as string;
const block_forest_key = process.env.BLOCK_FOREST_API_KEY as string;

async function getMetadataFromTxHash(txhash: string) {
  const url = `https://cardano-preprod.blockfrost.io/api/v0/txs/${txhash}/metadata`;

  try {
    const response = await axios.get(url, {
      headers: {
        project_id: block_forest_key,
      },
    });

    const jsonData = JSON.parse(JSON.stringify(response.data));

    // Return the data from the response
    return jsonData;
  } catch (error) {
    throw new Error(`ERROR OCCURED IN support.getMetadataFromTxHash${error}`);
  }
}

async function readFileAsByteSream(filename?: string | null) {
  if (!filename) {
    return null;
  }

  try {
    const data = await fs.readFile(`./fileUploads/${filename}`, "utf8");

    return data;
  } catch (err) {
    console.error(`ERROR OCCURRED IN support.readFileAsByteSream: ${err}`);
    throw new Error(`ERROR OCCURRED IN support.readFileAsByteSream`);
  }
}

async function getHashForData(dataObject: DataToGenerateHash) {
  try {
    const fileData = await readFileAsByteSream(dataObject.fileName);
    // console.log(`fileRead successfully ${fileData?.substring(0, 20)}`);

    const stringyfyObject = JSON.stringify({
      ...dataObject,
      fileData: fileData,
    });

    console.log(`data for hash = ${stringyfyObject}`);
    const hash = crypto
      .createHash("sha256")
      .update(stringyfyObject)
      .digest("hex");

    return hash;
  } catch (error) {
    console.log(`ERROR OCCURED WHEN HASHING PASSWORD ${error}`);
    return false;
  }
}

async function storeTransactionDetailsOnChain(
  transactionMetaData: TransactionMetaData,
  wallet: MeshWallet
) {
  const usedAddress = await wallet.getUsedAddresses();
  const address = usedAddress[0];
  const forgingScript = ForgeScript.withOneSignature(address);

  const tx = new Transaction({ initiator: wallet });

  const asset: Mint = {
    assetName: "GovTraceToken",
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

async function verifyTransaction(document: DataToGenerateHash, txHash: string) {
  const dataOnChain = await getMetadataFromTxHash(txHash);

  // console.log(`Data on chain ${dataOnChain[0]}`);
  // console.log(
  //   dataOnChain[0].json_metadata
  //     .df77a07ff08e4381108ef8073a7ffa678b2288511e83c4e37378b3d7.GovTraceToken
  //     .hash
  // );

  const hashOnchain =
    dataOnChain[0].json_metadata
      .df77a07ff08e4381108ef8073a7ffa678b2288511e83c4e37378b3d7.GovTraceToken
      .hash;

  const hashGeneratedUsingDb = await getHashForData(document);

  console.log("hash on chain = " + hashOnchain);
  console.log("hash using data = " + hashGeneratedUsingDb);

  return hashOnchain === hashGeneratedUsingDb;
}

export const isGovermentEmail = (email: string) => {
  const govEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(gov|gov\.lk)$/;
  return govEmailRegex.test(email);
};

export { storeTransactionDetailsOnChain, getHashForData, verifyTransaction };
