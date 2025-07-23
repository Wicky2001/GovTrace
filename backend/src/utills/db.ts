import mongoose from "mongoose";

interface transactionDataOnMongoDb {
  id: string;
  amount: Number;
  description: string;
  department: string;
  transaction_date: Date;
  transaction_mint_date: Date;
  fileName?: string;
}

interface TransactionMetaData {
  amount: number;
  description: string;
  department: string;
  hash: string | boolean;
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

const guestSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const Guest = mongoose.model("Guests", guestSchema);

interface guestData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const saveGuest = async (data: guestData) => {
  try {
    const dataToStore = { ...data, role: "guest" };
    const guest = new Guest(dataToStore);
    const result = guest.save();

    return result;
  } catch (error) {
    throw new Error(
      `ERROR OCCUREED IN SAVING GUEST IN src.utills.saveGuest ${error}`
    );
  }
};

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
});

const Admins = mongoose.model("Admins", adminSchema);

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  transaction_date: { type: Date, required: true },
  transaction_mint_date: { type: Date, required: true },
  fileName: { type: String },
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
