"use client";
import Navbar from "@/src/components/navbar/navbar";
import axios from "axios";
import React, { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

const spendingCategories = [
  "Salary",
  "Income",
  "Food",
  "Healthcare",
  "Fuel",
  "Entertainment",
  "Shopping",
  "Travel",
  "Miscellaneous",
];

type Transaction = {
  _id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
};

export default function TransactionsPage() {
  const initialForm = {
    date: "",
    description: "",
    amount: 0,
    category: "Miscellaneous",
    type: "Debit",
  };
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API}/api/transactions`);
      setTransactions(response.data);
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
    if (!form.date || form.amount === 0 || !form.description) {
      setIsSaving(false);
      const missingFields = [];
      if (!form.date) missingFields.push("Date");
      if (form.amount === 0) missingFields.push("Amount");
      if (!form.description) missingFields.push("Description");
      alert(
        `Please fill in the following fields correctly: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    try {
      const finalAmount =
        form.type === "Debit" ? -Math.abs(form.amount) : Math.abs(form.amount);
      const newTransaction = {
        date: new Date(form.date).toISOString(),
        description: form.description || "Miscellaneous",
        category: form.category,
        amount: finalAmount,
      };
      await axios.post(`${API}/api/transactions`, newTransaction);
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
      if (!form.date || !form.description || form.amount === 0) {
        setIsSaving(false);
        alert("Please fill in all fields correctly.");
        return;
      }
      const finalAmount =
        form.type === "Debit" ? -Math.abs(form.amount) : Math.abs(form.amount);
      const updatedTransaction = {
        date: new Date(form.date).toISOString(),
        description: form.description,
        category: form.category,
        amount: finalAmount,
      };

      await axios.put(`${API}/api/transactions/${id}`, updatedTransaction);
    } catch (err) {
      console.error("Error updating transaction:", err);
    } finally {
      setIsEditing(false);
      setEditId(null);
      setForm(initialForm);
      setIsSaving(false);
      fetchTransactions();
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete this transaction?`)) {
      setIsDeleting(false);
      return;
    }
    try {
      await axios.delete(`${API}/api/transactions/${id}`);
      setTransactions(transactions.filter((tx) => tx._id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white w-full min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center mt-10 p-4 lg:p-0">
        <div className="w-full lg:w-[80%] flex flex-col items-center">
          <div className="flex flex-col w-full mb-6 lg:flex-row lg:justify-between lg:text-nowrap">
            <h1 className="w-full text-3xl lg:text-4xl font-bold text-gray-800 mb-4 py-3 text-start lg:mb-6">
              Transactions
            </h1>
            <button
              className="bg-[#28a745] hover:cursor-pointer text-white text-lg px-4 py-2 h-fit rounded-lg self-end lg:self-center disabled:opacity-50"
              onClick={() => {
                setIsAddingNew(true);
                setForm(initialForm);
              }}
              disabled={isAddingNew || isEditing}
            >
              Add transaction
            </button>
          </div>

          <div className="w-full shadow-lg rounded-2xl overflow-hidden">
            <div className="overflow-y-auto max-h-[70vh]">
              <table className="w-full text-left">
                <thead className="hidden lg:table-header-group">
                  <tr className="text-lg bg-gray-200 sticky top-0 z-10">
                    <th className="p-2 text-center text-black font-light text-xl">
                      Date
                    </th>
                    <th className="p-2 text-center text-black font-light text-xl">
                      Description
                    </th>
                    <th className="p-2 text-center text-black font-light text-xl">
                      Category
                    </th>
                    <th className="p-2 text-center text-black font-light text-xl">
                      Amount
                    </th>
                    <th className="p-2 text-center text-black font-light text-xl">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-base lg:text-lg text-[#747474]">
                  {isAddingNew && (
                    <tr className="block p-4 border rounded-lg bg-blue-50 mb-4 lg:table-row lg:border-0 lg:p-0 lg:mb-0">
                      <td
                        data-label="Date"
                        className="block p-2 text-right lg:text-center lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                      >
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) =>
                            setForm({ ...form, date: e.target.value })
                          }
                          className="border rounded p-1 w-1/2 lg:w-full"
                        />
                      </td>
                      <td
                        data-label="Description"
                        className="block p-2 text-right lg:text-center lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                      >
                        <input
                          type="text"
                          value={form.description}
                          onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                          }
                          className="border rounded p-1 w-1/2 lg:w-full"
                          placeholder="Description"
                        />
                      </td>
                      <td
                        data-label="Category"
                        className="block p-2 text-right lg:text-center lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                      >
                        <select
                          value={form.category}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                          }
                          className="border rounded p-1.5 w-1/2 lg:w-full"
                        >
                          {spendingCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td
                        data-label="Amount"
                        className="block p-2 text-right lg:text-center lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                      >
                        <div className="flex flex-row gap-2 justify-end lg:justify-center">
                          <select
                            value={form.type}
                            onChange={(e) =>
                              setForm({ ...form, type: e.target.value })
                            }
                            className="border rounded p-1.5"
                          >
                            <option value="Debit">Debit</option>
                            <option value="Credit">Credit</option>
                          </select>
                          <input
                            type="number"
                            value={form.amount || ""}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                amount: Math.abs(
                                  parseFloat(e.target.value) || 0
                                ),
                              })
                            }
                            className="border rounded p-1 w-full"
                            placeholder="Amount"
                          />
                        </div>
                      </td>
                      <td
                        data-label="Actions"
                        className="block p-2 text-right lg:text-center lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                      >
                        <div className="flex gap-2 justify-end lg:justify-center">
                          <button
                            className="bg-green-500 text-white rounded-lg px-3 py-1 disabled:opacity-50"
                            onClick={() => {
                              setIsSaving(true);
                              handleAddTransaction();
                            }}
                            disabled={isSaving}
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                          <button
                            className="bg-[#888] text-white rounded-lg px-3 py-1"
                            onClick={() => {
                              setIsAddingNew(false);
                              setForm(initialForm);
                            }}
                            disabled={isSaving}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-2xl text-center text-gray-500"
                      >
                        Loading transactions...
                      </td>
                    </tr>
                  ) : transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <tr
                        key={tx._id}
                        className="block border shadow-md rounded-lg mb-4 lg:table-row lg:border-0 lg:shadow-none lg:mb-0 lg:border-b hover:bg-gray-50 transition-colors duration-200"
                      >
                        {isEditing && editId === tx._id ? (
                          <>
                            <td
                              data-label="Date"
                              className="block p-2 text-right lg:text-center lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                            >
                              <input
                                type="date"
                                value={form.date}
                                onChange={(e) =>
                                  setForm({ ...form, date: e.target.value })
                                }
                                className="border rounded p-1 w-1/2 lg:w-full"
                              />
                            </td>
                            <td
                              data-label="Description"
                              className="block p-2 text-right lg:text-center lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                            >
                              <input
                                type="text"
                                value={form.description}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    description: e.target.value,
                                  })
                                }
                                className="border rounded p-1 w-1/2 lg:w-full"
                              />
                            </td>
                            <td
                              data-label="Category"
                              className="block p-2 text-right lg:text-center lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                            >
                              <select
                                value={form.category}
                                onChange={(e) =>
                                  setForm({ ...form, category: e.target.value })
                                }
                                className="border rounded p-1.5 w-1/2 lg:w-full"
                              >
                                {spendingCategories.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td
                              data-label="Amount"
                              className="block p-2 text-right lg:text-center lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                            >
                              <div className="flex flex-row gap-2 justify-end lg:justify-center">
                                <select
                                  value={form.type}
                                  onChange={(e) =>
                                    setForm({ ...form, type: e.target.value })
                                  }
                                  className="border rounded p-1.5"
                                >
                                  <option value="Debit">Debit</option>
                                  <option value="Credit">Credit</option>
                                </select>
                                <input
                                  type="number"
                                  value={form.amount}
                                  onChange={(e) =>
                                    setForm({
                                      ...form,
                                      amount: Math.abs(
                                        parseFloat(e.target.value) || 0
                                      ),
                                    })
                                  }
                                  className="border rounded p-1 w-full"
                                />
                              </div>
                            </td>
                            <td
                              data-label="Actions"
                              className="block p-2 text-right lg:text-center lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                            >
                              <div className="flex gap-2 justify-end lg:justify-center">
                                <button
                                  disabled={isSaving}
                                  className="bg-green-500 text-white rounded-lg px-3 py-1 disabled:opacity-50"
                                  onClick={() => {
                                    setIsSaving(true);
                                    handleEditTransaction(tx._id);
                                  }}
                                >
                                  {isSaving ? "Saving..." : "Save"}
                                </button>
                                <button
                                  disabled={isSaving}
                                  className="bg-[#888] text-white rounded-lg px-3 py-1 disabled:opacity-50"
                                  onClick={() => {
                                    setIsEditing(false);
                                    setEditId(null);
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td
                              data-label="Date"
                              className="block p-3 text-right lg:text-center lg:p-2 lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none text-nowrap"
                            >
                              {new Date(tx.date).toISOString().slice(0, 10)}
                            </td>
                            <td
                              data-label="Description"
                              className="block p-3 text-right lg:text-center lg:p-2 lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                            >
                              {tx.description}
                            </td>
                            <td
                              data-label="Category"
                              className="block p-3 text-right lg:text-center lg:p-2 lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                            >
                              {tx.category}
                            </td>
                            <td
                              data-label="Amount"
                              className="block p-3 text-right lg:text-center lg:p-2 lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none text-nowrap"
                            >
                              {tx.amount > 0 ? (
                                <span className="text-green-500 font-semibold">
                                  ₹{tx.amount.toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-red-500 font-semibold">
                                  ₹{Math.abs(tx.amount).toFixed(2)}
                                </span>
                              )}
                            </td>
                            <td
                              data-label="Actions"
                              className="block p-3 text-right lg:text-center lg:p-2 lg:table-cell before:content-[attr(data-label)] before:font-bold before:float-left lg:before:content-none"
                            >
                              <div className="flex gap-2 justify-end lg:justify-center">
                                <button
                                  disabled={
                                    isDeleting || isAddingNew || isEditing
                                  }
                                  className="bg-[#007bff] text-white rounded-lg px-3 py-1 disabled:opacity-50"
                                  onClick={() => {
                                    setIsEditing(true);
                                    setEditId(tx._id);
                                    setForm({
                                      date: new Date(tx.date)
                                        .toISOString()
                                        .slice(0, 10),
                                      description: tx.description,
                                      amount: Math.abs(tx.amount),
                                      category: tx.category || "Miscellaneous",
                                      type: tx.amount < 0 ? "Debit" : "Credit",
                                    });
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="bg-[#dc3545] text-white rounded-lg px-3 py-1 disabled:opacity-50"
                                  disabled={
                                    isDeleting || isAddingNew || isEditing
                                  }
                                  onClick={() => {
                                    setIsDeleting(true);
                                    handleDeleteTransaction(tx._id);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
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
      </div>
    </div>
  );
}
