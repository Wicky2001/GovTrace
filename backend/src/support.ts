import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { TransactionMetaData, transactionDataOnMongoDb } from "./db.js";
import { Transaction, ForgeScript, Mint, MeshWallet } from "@meshsdk/core";
import axios from "axios";
import crypto from "crypto";

interface DataToGenerateHash {
  amount?: number;
  description?: string;
  department?: string;
  date?: Date;
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
    console.error(`ERROR FETCHING DATA FROM CARDARNOSCAN`);
    throw error; // Rethrow or handle the error as needed
  }
}

function getHashForData(dataObject: DataToGenerateHash) {
  try {
    const stringyfyObject = JSON.stringify(dataObject);
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

  // console.log(
  //   dataOnChain[0].json_metadata
  //     .df77a07ff08e4381108ef8073a7ffa678b2288511e83c4e37378b3d7.GoveTraceToken
  //     .hash
  // );

  const hashOnchain =
    dataOnChain[0].json_metadata
      .df77a07ff08e4381108ef8073a7ffa678b2288511e83c4e37378b3d7.GoveTraceToken
      .hash;

  const hashGeneratedUsingDb = getHashForData(document);

  console.log("hash on chain = " + hashOnchain);
  console.log("hash using data = " + hashGeneratedUsingDb);

  return hashOnchain === hashGeneratedUsingDb;
}

export { storeTransactionDetailsOnChain, getHashForData, verifyTransaction };
