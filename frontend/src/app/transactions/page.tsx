"use client";
import Navbar from "@/src/components/navbar/navbar";
import axios from "axios";
import React, { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function TransactionsPage() {
  const initialForm = { date: "", description: "", amount: 0 };
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [transactions, setTransactions] = useState<
    {
      _id: string;
      date: string;
      description: string;
      amount: number;
    }[]
  >([]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API}/api/transactions`);
      const sortedTransactions = await response.data.sort(
        (a: { amount: number }, b: { amount: number }) => b.amount - a.amount
      );
      setTransactions(sortedTransactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async () => {
    if (!form.date || form.amount === 0) {
      setIsSaving(false);
      alert("Please fill in all fields correctly.");
      return;
    }

    if (!form.description) {
      form.description = "Miscellaneous";
    }

    try {
      const newTransaction = {
        ...form,
        date: new Date(form.date).toISOString(),
      };
      const response = await axios.post(
        `${API}/api/transactions`,
        newTransaction
      );
      setTransactions([...transactions, response.data]);
    } catch (err) {
      console.error("Error adding transaction:", err);
    } finally {
      setForm(initialForm);
      setIsAddingNew(false);
      setIsSaving(false);
      fetchTransactions();
    }
  };

  const handleEditTransaction = async (id: string) => {
    if (!editId) return;

    try {
      const updatedTransaction = {
        ...form,
        date: new Date(form.date).toISOString(),
      };

      if (
        !updatedTransaction.date ||
        !updatedTransaction.description ||
        updatedTransaction.amount === 0
      ) {
        setIsSaving(false);
        alert("Please fill in all fields correctly.");
        return;
      }
      await axios.put(`${API}/api/transactions/${id}`, updatedTransaction);
      setTransactions(
        transactions.map((tx) =>
          tx._id === id ? { ...tx, ...updatedTransaction } : tx
        )
      );
    } catch (err) {
      console.error("Error updating transaction:", err);
    } finally {
      setIsEditing(false);
      setEditId(null);
      setForm(initialForm);
      setIsSaving(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete this transaction?`)) {
      setIsDeleting(false);
      setDeleteId(null);
      return;
    }
    try {
      await axios.delete(`${API}/api/transactions/${id}`);
      setTransactions(transactions.filter((tx) => tx._id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="text-3xl text-center bg-white w-full h-screen">
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        <div className="w-[60%] flex flex-col items-center">
          <div className="flex justify-around text-nowrap w-full">
            <h1 className="w-full text-4xl font-bold text-gray-800 mb-6 py-3 text-start">
              Transactions
            </h1>

            <button
              className="bg-[#28a745] hover:cursor-pointer text-white text-lg p-3 h-[60%] rounded-4xl self-center"
              onClick={() => setIsAddingNew(true)}
              disabled={isAddingNew}
            >
              Add transaction
            </button>
          </div>

          <table className="text-left shadow-lg rounded-2xl rounded-tl-2xl rounded-tr-2xl overflow-hidden">
            <thead>
              <tr className="text-lg bg-gray-200">
                <th className="text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-2/12">
                  Date
                </th>
                <th className="text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl max-w-[200px]">
                  Description
                </th>
                <th className="text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-1/12">
                  Amount
                </th>
                <th className="text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-1/12">
                  {/* Actions */}
                </th>
                <th className="text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-1/12">
                  {/* Actions */}
                </th>
              </tr>
            </thead>

            <tbody className="text-lg text-[#747474]">
              {isAddingNew && (
                <tr className="bg-blue-50">
                  <td className="p-2 text-center">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      className="border rounded p-1 w-full"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="text"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="border rounded p-1 w-full"
                      placeholder="Description"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      value={form.amount || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="border rounded p-1 w-full"
                      placeholder="Amount"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      className={`bg-green-500 text-white rounded-lg transition-colors hover:cursor-pointer duration-200 px-3 py-1 disabled:opacity-50 ${
                        isSaving ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        setIsSaving(true);
                        handleAddTransaction();
                      }}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                  </td>

                  <td className="p-2 text-center">
                    <button
                      className={`ml-2 bg-[#888] text-white rounded-lg hover:cursor-pointer transition-colors duration-200 px-3 py-1 ${
                        isSaving ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() => {
                        setIsAddingNew(false);
                        setForm(initialForm);
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              )}

              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-2xl text-center text-gray-500"
                  >
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    {isEditing && editId === tx._id ? (
                      <>
                        <td className="p-2 text-center">
                          <input
                            type="date"
                            value={form.date}
                            onChange={(e) =>
                              setForm({ ...form, date: e.target.value })
                            }
                            className="border rounded p-1 w-full"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="text"
                            value={form.description}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                description: e.target.value,
                              })
                            }
                            className="border rounded p-1 w-full"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="number"
                            value={form.amount}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                amount: parseFloat(e.target.value),
                              })
                            }
                            className="border rounded p-1 w-full"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            disabled={
                              !form.date ||
                              !form.description ||
                              form.amount === 0 ||
                              isSaving
                            }
                            className={`bg-green-500 text-white hover:cursor-pointer rounded-lg hover:bg-green-600 transition-colors duration-200 px-3 py-1 disabled:opacity-50 ${
                              !form.date ||
                              !form.description ||
                              form.amount === 0 ||
                              isSaving
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              handleEditTransaction(tx._id);
                              setIsSaving(true);
                            }}
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                        </td>

                        <td className="p-2 text-center">
                          <button
                            disabled={isSaving}
                            className={`bg-[#888] text-white rounded-lg transition-colors hover:cursor-pointer duration-200 px-3 py-1 disabled:opacity-50 ${
                              isSaving ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            onClick={() => {
                              setIsEditing(false);
                              setEditId(null);
                              setForm(initialForm);
                            }}
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-2 text-center text-nowrap">
                          {new Date(tx.date).toISOString().slice(0, 10)}
                        </td>
                        <td className="p-2 text-center">{tx.description}</td>
                        <td className="p-2 text-center text-nowrap">
                          {tx.amount < 0 ? "-" : ""}₹
                          {Math.abs(tx.amount).toFixed(2)}
                        </td>

                        <td className="p-2 text-center">
                          <button
                            disabled={isDeleting}
                            className={`bg-[#007bff] text-white rounded-lg hover:cursor-pointer transition-colors duration-200 px-3 py-1 disabled:opacity-50 ${
                              isDeleting && tx._id === deleteId
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              setIsEditing(true);
                              setEditId(tx._id);
                              setForm({
                                date: new Date(tx.date)
                                  .toISOString()
                                  .slice(0, 10),
                                description: tx.description,
                                amount: tx.amount,
                              });
                            }}
                          >
                            Edit
                          </button>
                        </td>

                        <td className="p-2 text-center">
                          <button
                            className={`bg-[#dc3545] text-white rounded-lg hover:bg-red-600 hover:cursor-pointer transition-colors duration-200 px-3 py-1 disabled:opacity-50 ${
                              isDeleting && tx._id === deleteId
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={isDeleting}
                            onClick={() => {
                              setDeleteId(tx._id);
                              setIsDeleting(true);
                              handleDeleteTransaction(tx._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
