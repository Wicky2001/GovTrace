/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { SuccessAlert, FaildAlert } from "@/service/alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define the Transaction type
interface Transaction {
  id: string;
  amount: number;
  description: string;
  department: string;
  transaction_date: string;
  hash: string;
  transaction_mint_date: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatAmount = (amount: number) => {
  return `Rs. ${amount.toLocaleString()}`;
};

export default function TransactionsPage() {
  //store  transaction form functions start here

  const fileRef = useRef<HTMLInputElement>(null);

  const StoreTransaction = z.object({
    department: z.string().min(1, "Please select a ministry"),
    description: z
      .string()
      .min(10, "Description must have at least 10 characters"),
    amount: z.string().refine(
      (value) => {
        // Check if the value contains only valid numeric characters
        return /^[0-9]+(\.[0-9]+)?$/.test(value.trim());
      },
      {
        message:
          "Please enter a valid amount (only numbers and decimal point allowed)",
      }
    ),
    transaction_date: z.string().min(1, "Please select a type"),
    // document: z.instanceof(File),
  });

  type StoreTransactionData = z.infer<typeof StoreTransaction>;
  // const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StoreTransactionData>({
    resolver: zodResolver(StoreTransaction),
  });

  const onSubmit = async (data: FieldValues) => {
    // console.log(data);

    // // if (fileRef.current) {
    // //   console.log(`file ref ${fileRef.current.files[0].type}`);
    // // }

    try {
      // @ts-expect-error: Temporarily ignoring the error because the currentfile will not be null
      const supportDocument = fileRef.current.files[0];

      if (supportDocument === undefined) {
        console.log("No file is selected");
        FaildAlert("Please provide supporting document");
      } else {
        console.log("file is selected");
        console.log(supportDocument.type);
        if (supportDocument.type !== "application/pdf") {
          FaildAlert("please provide PDF for suppporting document");
        }

        data = { ...data, supportDocument: supportDocument };
        console.log(data);

        const formData = new FormData();
        formData.append("amount", data.amount);
        formData.append("description", data.description);
        formData.append("department", data.department);
        formData.append("transaction_date", data.transaction_date);
        formData.append("document", data.supportDocument);

        const response = await fetch(
          "https://localhost:4000/api/transaction/store",
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        if (response.status === 401) {
          FaildAlert("You are not authenticated");
          FaildAlert("Please login");
          router.push("/login/guest");
          return;
        }

        if (!response.ok) {
          console.log("submission faild");
          FaildAlert("Error occured. Please try again later");
          return;
        }

        SuccessAlert("Transaction successfully stored on block chain");
        SuccessAlert("Please click refresh to see transaction");
        reset();
        router.push("transactions?tab=track");
        return;
      }
    } catch (error) {
      console.error("Error occurred while submitting:", error);
      FaildAlert("An unexpected error occurred. Please try again later");
      reset(); // Reset form on error
    }
  };
  //Transaction store logic end here

  const router = useRouter();

  async function fetchTransactions() {
    const url = `https://localhost:4000/api/transaction/all`;

    try {
      const response = await fetch(url, {
        cache: "no-store",
        credentials: "include",
      });

      // console.log(response);
      if (response.status === 401) {
        router.push("/login/guest");

        throw new Error("Not authenticated");
      }

      if (!response.ok) {
        // router.push("/error");
        throw new Error("Not authenticated");
      }

      const data = await response.json();
      console.log(data);

      const transactionData: Transaction[] = data.transactions || [];
      console.log(transactionData);

      return transactionData;
    } catch (err) {
      console.log(`error transaction page${err}`);
      return [];
    }
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadTransactions = async () => {
      const transactions = await fetchTransactions();
      setTransactions(transactions);
    };

    loadTransactions();
  }, []);

  const [verifyingStates, setVerifyingStates] = useState<{
    [key: string]: "idle" | "verifying" | "verified" | "error";
  }>({});

  // Access searchParams using useSearchParams hook
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "track"; // Awaited version of searchParams

  // Verify transaction function
  const verifyTransaction = async (
    transactionHash: string,
    transactionId: string
  ) => {
    setVerifyingStates((prev) => ({ ...prev, [transactionId]: "verifying" }));
    const url = `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:4000" //get all transactions
    }/api/transaction/verify/${transactionId}`;

    console.log(url);

    try {
      // const response = await
      //   fetch(`/api/verify/${transactionHash}`);
      const response = await fetch(url, {
        cache: "no-cache",
        credentials: "include",
      });
      const result = await response.json();
      const verifyStaus = result.verifyStatus;

      if (response.ok && verifyStaus === true) {
        setVerifyingStates((prev) => ({
          ...prev,
          [transactionId]: "verified",
        }));
      } else {
        setVerifyingStates((prev) => ({ ...prev, [transactionId]: "error" }));
      }
    } catch (err) {
      console.error("Verification error:", err);
      setVerifyingStates((prev) => ({ ...prev, [transactionId]: "error" }));
    }
  };

  // Get verify button content based on state
  const getVerifyButtonContent = (transaction: Transaction) => {
    const state = verifyingStates[transaction.id] || "idle";

    switch (state) {
      case "verifying":
        return (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-blue-500/50 bg-transparent text-blue-400 text-xs font-medium cursor-not-allowed"
            disabled
          >
            Verifying...
          </Button>
        );
      case "verified":
        return (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-medium cursor-default"
            disabled
          >
            ✓ Verified
          </Button>
        );
      case "error":
        return (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium cursor-default"
            disabled
          >
            ✗ Error
          </Button>
        );
      default:
        return (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-green-500/50 bg-transparent text-green-400 hover:bg-green-500/10 hover:text-green-300 hover:border-green-400 text-xs font-medium cursor-pointer"
            onClick={() => verifyTransaction(transaction.hash, transaction.id)}
          >
            Verify
          </Button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Gov<span className="text-violet-400">Trace</span>
          </Link>
          <div className="hidden md:flex space-x-8 text-white/80">
            <Link href="/" className="hover:text-violet-400 transition-colors">
              Home
            </Link>
            <Link href="/transactions" className="text-violet-400">
              Transactions
            </Link>
            <Link href="#" className="hover:text-violet-400 transition-colors">
              Analytics
            </Link>
            <Link href="#" className="hover:text-violet-400 transition-colors">
              Reports
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Government Transactions</h1>
          <p className="text-white/70 text-lg">
            Track and manage government financial transactions on the blockchain
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/5 rounded-lg p-1 w-fit">
          <Link
            href="/transactions?tab=track"
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "track"
                ? "bg-violet-600 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            Track Transactions
          </Link>
          <Link
            href="/transactions?tab=add"
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === "add"
                ? "bg-violet-600 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            Add Transaction
          </Link>
        </div>

        {/* Tab Content */}
        {activeTab === "track" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-semibold">Transaction History</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-violet-400 min-w-0 sm:min-w-[240px]"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white hover:border-violet-400 whitespace-nowrap cursor-pointer"
                  >
                    Filter
                  </Button>
                  <Button
                    variant="default"
                    className="bg-violet-600 hover:bg-violet-700 whitespace-nowrap cursor-pointer"
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Error State */}

            {/* Transactions Table */}
            <div className="bg-white/5 rounded-lg overflow-hidden">
              {transactions.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-white/70 text-lg">
                    No transactions available
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    Check your connection or try refreshing
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">
                        Transaction ID
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Department
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Verify Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-t border-white/10 hover:bg-white/5"
                      >
                        <td className="px-6 py-4 font-mono text-violet-400 text-sm">
                          {transaction.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4">{transaction.department}</td>
                        <td className="px-6 py-4">{transaction.description}</td>
                        <td className="px-6 py-4 font-semibold">
                          {formatAmount(transaction.amount)}
                        </td>
                        <td className="px-6 py-4">
                          {formatDate(transaction.transaction_date)}
                        </td>
                        <td className="px-6 py-4">
                          {getVerifyButtonContent(transaction)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

        {activeTab === "add" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">Add New Transaction</h2>
            <form
              className="space-y-8"
              // onSubmit={handleSubmit((data) => {
              //   console.log(data);
              // })}

              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Department
                  </label>

                  <select
                    {...register("department")}
                    className="h-12 w-full  bg-black/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-gray-300 focus:bg-gray-700"
                  >
                    <option value="" disabled className="text-white bg-black">
                      Select Ministry
                    </option>
                    <option
                      value="health"
                      className="text-white bg-black hover:bg-gray-700"
                    >
                      Department of Health
                    </option>
                    <option
                      value="education"
                      className="text-white bg-black  hover:bg-gray-700"
                    >
                      Department of Education
                    </option>
                    <option
                      value="transport"
                      className="text-white bg-black  hover:bg-gray-700"
                    >
                      Department of Transportation
                    </option>
                    <option
                      value="defense"
                      className="text-white bg-black  hover:bg-gray-700"
                    >
                      Department of Defense
                    </option>
                  </select>

                  {errors.department && (
                    <p className="text-xs text-red-500">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Transaction Amount
                  </label>
                  <input
                    type="text"
                    placeholder="Rs. 0.00"
                    {...register("amount", { required: "Amount is required" })}
                    className="py-2 w-full px-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-violet-400"
                  />
                  {errors.amount && (
                    <p className="text-xs text-red-500">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    {...register("transaction_date", {
                      required: "Please select a date",
                    })}
                    className="py-2 w-full px-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-violet-400"
                  />
                  {errors.transaction_date && (
                    <p className="text-xs text-red-500">
                      {errors.transaction_date.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Transaction Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  rows={4}
                  placeholder="Enter detailed description of the transaction..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-violet-400 resize-none"
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-gray-500/30 rounded-lg p-8 text-center bg-gray-800/20 relative">
                  <div className="flex flex-col items-center justify-center text-gray-500 mb-3 opacity-50">
                    <div className="w-full">
                      <svg
                        className="w-10 h-10 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>

                    <div className="w-full">
                      <input
                        type="file"
                        name="upLoadFile"
                        accept="application/pdf"
                        ref={fileRef}
                        className="pl-20 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="h-12 flex-1 bg-violet-600 hover:bg-violet-700 text-white cursor-pointer font-medium"
                >
                  Submit Transaction
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
