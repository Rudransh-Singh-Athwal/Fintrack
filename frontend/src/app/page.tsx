"use client";
import React, { useEffect, useState, useMemo } from "react";
import "./globals.css";
import Navbar from "../components/navbar/navbar";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

type Transaction = {
  _id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    setIsLoading(true);
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

  const overviewStats = useMemo(() => {
    const income = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const netSavings = income + expenses;

    return [
      {
        title: "Total Expenses",
        amount: Math.abs(expenses),
      },
      {
        title: "Income",
        amount: income,
      },
      {
        title: "Net Savings",
        amount: netSavings,
      },
    ];
  }, [transactions]);

  const monthlyStats = useMemo(() => {
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();
    const lastSixMonthsLabels = Array.from({ length: 6 }, (_, i) => {
      const monthIndex = (currentMonth - i + 12) % 12;
      return labels[monthIndex];
    }).reverse();

    const expensesByMonth = transactions
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => {
        const monthName = labels[new Date(t.date).getMonth()];
        if (lastSixMonthsLabels.includes(monthName)) {
          acc[monthName] = (acc[monthName] || 0) + Math.abs(t.amount);
        }
        return acc;
      }, {} as Record<string, number>);

    const maxExpense = Math.max(...Object.values(expensesByMonth), 1);

    const values = lastSixMonthsLabels.map((label) => ({
      label,
      height: ((expensesByMonth[label] || 0) / maxExpense) * 100,
    }));

    return { labels: lastSixMonthsLabels, values };
  }, [transactions]);

  const categoryStats = useMemo(() => {
    const expenses = transactions.filter((t) => t.amount < 0);
    const totalExpenses = expenses.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      1
    );

    const expensesByCategory = expenses.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      acc[category] = (acc[category] || 0) + Math.abs(amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(expensesByCategory).map(([name, amount]) => ({
      name,
      width: (amount / totalExpenses) * 100,
    }));
  }, [transactions]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">
            Track your financial health at a glance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {overviewStats.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-3xl font-semibold mt-1">
                ₹{item.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Monthly Expenses</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-end h-40 border-b border-gray-200 pb-4">
              {monthlyStats.values.map((value, index) => (
                <div
                  key={index}
                  className="w-1/6 px-2 flex justify-center items-end h-full"
                >
                  <div
                    className="bg-gray-200 rounded-t-md w-full"
                    style={{ height: `${value.height}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-center text-sm text-gray-500 mt-2">
              {monthlyStats.labels.map((label) => (
                <div key={label} className="w-1/6 px-2">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Category Breakdown</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-5">
            {categoryStats.map((category) => (
              <div key={category.name} className="flex items-center gap-4">
                <span className="w-32 text-gray-600 text-sm flex-shrink-0">
                  {category.name}
                </span>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gray-400 h-2.5 rounded-full"
                    style={{ width: `${category.width}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="w-full shadow-lg rounded-2xl overflow-y-auto max-h-[70vh]">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-lg bg-gray-200 sticky top-0 z-10">
                    <th className="text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-2/12">
                      Date
                    </th>
                    <th className="text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl max-w-[200px]">
                      Description
                    </th>
                    <th className="text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-2/12">
                      Category
                    </th>
                    <th className="text-nowrap p-2 text-center text-black text-shadow-gray-900 font-light text-xl  w-1/12">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="text-lg text-[#747474]">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-2xl text-center text-gray-500"
                      >
                        Loading transactions...
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td className="p-2 text-center">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="p-2 text-center max-w-[200px] overflow-hidden text-ellipsis">
                          {transaction.description}
                        </td>
                        <td className="p-2 text-center">
                          {transaction.category}
                        </td>
                        <td className="p-2 text-center text-nowrap">
                          {transaction.amount > 0 ? (
                            <span className="text-green-500">
                              ₹{transaction.amount.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-red-500">
                              ₹{Math.abs(transaction.amount).toFixed(2)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
