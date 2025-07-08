import mongoose from "mongoose";

interface transactionDataOnMongoDb {
  id: String;
  amount: Number;
  description: String;
  department: String;
  transaction_date: Date;
  transaction_mint_date: Date;
}

interface TransactionMetaData {
  amount: Number;
  description: String;
  department: String;
  transaction_date: Date;
  hash: String | Boolean;
}

async function connectToDatabase(
  databaseUrl = "mongodb://localhost:27017/GovTrace"
) {
  try {
    await mongoose.connect(databaseUrl);
    console.log(`Connection succssfull to the database`);
  } catch (error) {
    console.log(`ERROR OCCORD WHEN CONNECTION TO THE MONGO DB ${error}`);
  }
}

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  transaction_date: { type: Date, required: true },
  transaction_mint_date: { type: Date, required: true },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

async function getDocumentUsingTxHash(txHash: string) {
  const transactionData = await Transaction.findOne({ id: txHash });

  return transactionData;
}

async function storeTransactionOnDb(data: transactionDataOnMongoDb) {
  try {
    const transaction = new Transaction(data);
    const result = await transaction.save();
    console.log(`data successfully stored in the database ${result}`);
    return true;
  } catch (error) {
    console.log(
      `ERROR OCCURED WHEN SAVING THE TRANSACTION ON MONGO DB ${error}`
    );
    return false;
  }
}

async function getAllTransactions() {
  try {
    const transactions = await Transaction.find({});
    return transactions;
  } catch (error) {
    console.log(`ERROR OCCURRED WHEN FETCHING ALL TRANSACTIONS: ${error}`);
    return null;
  }
}

export {
  TransactionMetaData,
  connectToDatabase,
  storeTransactionOnDb,
  getDocumentUsingTxHash,
  transactionDataOnMongoDb,
  getAllTransactions,
};
