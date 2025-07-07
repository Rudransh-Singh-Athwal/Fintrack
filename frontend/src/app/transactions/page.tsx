/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Navbar from "@/src/components/navbar/navbar";
import axios from "axios";
import React, { useEffect, useState } from "react";


const API = process.env.NEXT_PUBLIC_API_URL;

export default function TransactionsPage() {
    const initialForm = { date: "", description: "", category: "", amount: 0 };
    const [form, setForm] = useState(initialForm);
    const [isEditing, setIsEditing] = useState(true);
    const [editId, setEditId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [transactions, setTransactions] = useState<{ _id: string; date: string; description: string; category: string; amount: number; }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${API}/api/transactions`);
            setTransactions(response.data);
        } catch (err) {
            console.error("Error fetching transactions:", err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleEditTransaction = async (id: string) => {
        if (!editId) return;

        try {
            const updatedTransaction = {
                ...form,
                date: new Date(form.date).toISOString(),
            };
            // Run validation here if needed
            if (!updatedTransaction.date || !updatedTransaction.description || updatedTransaction.amount === 0) {
                setIsSaving(false);
                alert("Please fill in all fields correctly.");
                return;
            }
            await axios.put(`${API}/api/transactions/${id}`, updatedTransaction);
            setTransactions(transactions.map(tx => tx._id === id ? { ...tx, ...updatedTransaction } : tx));
        } catch (err) {
            console.error("Error updating transaction:", err);
        }
        finally {
            setIsEditing(false);
            setEditId(null);
            setForm(initialForm);
            setIsSaving(false);
            // fetchTransactions(); // Refresh the transaction list after editing
        }
    }

    const handleDeleteTransaction = async (id: string) => {
        if (!window.confirm(`Are you sure you want to delete this transaction?`)) {
            setIsDeleting(false);
            setDeleteId(null);
            return;
        }
        try {
            await axios.delete(`${API}/api/transactions/${id}`);
            setTransactions(transactions.filter(tx => tx._id !== id));
        } catch (err) {
            console.error("Error deleting transaction:", err);
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    }

    return (
        <div className="text-3xl text-center bg-white w-full h-screen">
            <Navbar />
            <div className="flex flex-col items-center mt-10">
                <div className="w-[60%] flex flex-col items-center">
                    <h1 className="w-full text-4xl font-bold text-gray-800 mb-6 py-3 text-start">
                        Transactions
                    </h1>

                    <table className="text-left shadow-lg rounded-2xl rounded-tl-2xl rounded-tr-2xl overflow-hidden">
                        <thead>
                            <tr className='text-lg bg-gray-200'>
                                <th className='text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-2/12'>
                                    Date
                                </th>
                                <th className='text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl max-w-[200px]'>
                                    Description
                                </th>
                                <th className='text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-1/12'>
                                    Amount
                                </th>
                                <th className='text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-1/12'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        {isLoading ? (
                            <tbody>
                                <tr>
                                    <td colSpan={5} className="p-4 text-2xl text-center text-gray-500">
                                        Loading transactions...
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody className="text-lg text-[#747474]">
                                {transactions.length > 0 ? (
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
                                                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                                                            className="border rounded p-1 w-full"
                                                        />
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <input
                                                            type="text"
                                                            value={form.description}
                                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                            className="border rounded p-1 w-full"
                                                        />
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <input
                                                            type="number"
                                                            value={form.amount}
                                                            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
                                                            className="border rounded p-1 w-full"
                                                        />
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <button
                                                            disabled={!form.date || !form.description || form.amount === 0 || isSaving}
                                                            className={`bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 ${!form.date || !form.description || form.amount === 0 || isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                                                            onClick={() => {
                                                                handleEditTransaction(tx._id);
                                                                setIsSaving(true);
                                                            }}
                                                        >
                                                            {isSaving ? "Saving..." : "Save"}
                                                        </button>
                                                        <button
                                                            disabled={isSaving}
                                                            className={`ml-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors duration-200 ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
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
                                                        {tx.amount < 0 ? "-" : ""}
                                                        ₹{Math.abs(tx.amount).toFixed(2)}
                                                    </td><td>
                                                        <div>
                                                            <button
                                                                disabled={isDeleting}
                                                                className={`bg-black text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 ${isDeleting && tx._id === deleteId ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                onClick={() => {
                                                                    setIsEditing(true);
                                                                    setEditId(tx._id);
                                                                    setForm({
                                                                        date: new Date(tx.date).toISOString().slice(0, 10),
                                                                        description: tx.description,
                                                                        category: tx.category,
                                                                        amount: tx.amount
                                                                    });
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className={`ml-2  bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 ${isDeleting && tx._id === deleteId ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                disabled={isDeleting}
                                                                onClick={() => {
                                                                    setDeleteId(tx._id);
                                                                    setIsDeleting(true);
                                                                    handleDeleteTransaction(tx._id)
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
                                            colSpan={4}
                                            className="p-4 text-center text-gray-500 italic"
                                        >
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        </div >
    )
}