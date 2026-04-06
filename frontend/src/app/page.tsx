"use client";
import React, { useEffect, useState, useMemo } from "react";
import "./globals.css";
import Navbar from "../components/navbar/navbar";
import axios from "axios";
import DataGate from "@/src/components/loading/data-gate";

const API = process.env.NEXT_PUBLIC_API_URL;

type Transaction = {
  _id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1943",
];

const getArcPath = (
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = {
    x: cx + radius * Math.cos(((startAngle - 90) * Math.PI) / 180),
    y: cy + radius * Math.sin(((startAngle - 90) * Math.PI) / 180),
  };
  const end = {
    x: cx + radius * Math.cos(((endAngle - 90) * Math.PI) / 180),
    y: cy + radius * Math.sin(((endAngle - 90) * Math.PI) / 180),
  };

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    cx,
    cy,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
    "Z",
  ].join(" ");

  return d;
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasConnectionError, setHasConnectionError] = useState(false);
  const [allowWithoutData, setAllowWithoutData] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchTransactions = async () => {
    setIsLoading(true);
    setHasConnectionError(false);
    try {
      const response = await axios.get(`${API}/api/transactions`);
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setHasConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const availableYears = useMemo(() => {
    if (transactions.length === 0) {
      return [new Date().getFullYear()];
    }
    const years = new Set(
      transactions.map((t) => new Date(t.date).getFullYear()),
    );
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

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
    const allMonthLabels = [
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

    const expensesByMonth = transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return t.amount < 0 && transactionDate.getFullYear() === selectedYear;
      })
      .reduce(
        (acc, t) => {
          const monthName = allMonthLabels[new Date(t.date).getMonth()];
          acc[monthName] = (acc[monthName] || 0) + Math.abs(t.amount);
          return acc;
        },
        {} as Record<string, number>,
      );

    const maxExpense = Math.max(...Object.values(expensesByMonth), 1);

    const values = allMonthLabels.map((label) => ({
      label,
      height: ((expensesByMonth[label] || 0) / maxExpense) * 100,
    }));

    return { labels: allMonthLabels, values };
  }, [transactions, selectedYear]);

  const expenseCategoryStats = useMemo(() => {
    const yearlyTransactions = transactions.filter(
      (t) => new Date(t.date).getFullYear() === selectedYear,
    );
    const expenses = yearlyTransactions.filter((t) => t.amount < 0);
    const totalExpenses = expenses.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      1,
    );

    const expensesByCategory = expenses.reduce(
      (acc, transaction) => {
        const { category, amount } = transaction;
        acc[category] = (acc[category] || 0) + Math.abs(amount);
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(expensesByCategory)
      .map(([name, amount], index) => ({
        name,
        value: (amount / totalExpenses) * 100,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, selectedYear]);

  const incomeCategoryStats = useMemo(() => {
    const yearlyTransactions = transactions.filter(
      (t) => new Date(t.date).getFullYear() === selectedYear,
    );
    const income = yearlyTransactions.filter((t) => t.amount > 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 1);

    const incomeByCategory = income.reduce(
      (acc, transaction) => {
        const { category, amount } = transaction;
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(incomeByCategory)
      .map(([name, amount], index) => ({
        name,
        value: (amount / totalIncome) * 100,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, selectedYear]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [transactions]);

  return (
    <DataGate
      appName="Fintrack"
      isLoading={isLoading && !allowWithoutData}
      hasError={hasConnectionError && !allowWithoutData}
      onRetry={() => {
        setAllowWithoutData(false);
        fetchTransactions();
      }}
      onContinueWithoutData={() => {
        setAllowWithoutData(true);
        setHasConnectionError(false);
      }}
    >
      <div className="min-h-screen font-sans text-[var(--foreground)] bg-[var(--background)] transition-colors duration-200">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-[var(--text-muted)] mt-1">
              Track your financial health at a glance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {overviewStats.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-xl shadow-sm bg-[#e5e6e7] text-slate-900"
              >
                <p className="text-sm text-slate-600">{item.title}</p>
                <p className="text-3xl font-semibold mt-1 text-slate-900">
                  ₹{item.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Monthly Expenses</h2>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                aria-label="Select year for monthly expenses"
                title="Select year"
                className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-[var(--surface)] border-[var(--border)]"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="p-6 rounded-xl shadow-sm overflow-x-auto bg-[var(--surface)]">
              <div className="min-w-[600px]">
                <div className="flex justify-between items-end h-40 border-b border-gray-200 pb-4">
                  {monthlyStats.values.map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 px-2 flex justify-center items-end h-full"
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
                    <div key={label} className="flex-1 px-2">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-xl font-bold mb-4">Expenditure Breakdown</h2>
              <div className="p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-center gap-8 h-full bg-[var(--surface)]">
                <div className="w-48 h-48 flex-shrink-0">
                  <svg viewBox="0 0 100 100">
                    {(() => {
                      let cumulativePercent = 0;
                      return expenseCategoryStats.map((category, index) => {
                        if (category.value === 0) return null;
                        const startAngle = (cumulativePercent / 100) * 360;
                        const endAngle =
                          ((cumulativePercent + category.value) / 100) * 360;
                        cumulativePercent += category.value;
                        return (
                          <path
                            key={index}
                            d={getArcPath(50, 50, 50, startAngle, endAngle)}
                            fill={category.color}
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>
                <div className="w-full space-y-3">
                  {expenseCategoryStats.map((category, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-gray-600 text-sm">
                        {category.name} ({category.value.toFixed(2)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 mt-4">Income Breakdown</h2>
              <div className="p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-center gap-8 h-full bg-[var(--surface)]">
                <div className="w-48 h-48 flex-shrink-0">
                  <svg viewBox="0 0 100 100">
                    {(() => {
                      let cumulativePercent = 0;
                      return incomeCategoryStats.map((category, index) => {
                        if (category.value === 0) return null;
                        const startAngle = (cumulativePercent / 100) * 360;
                        const endAngle =
                          ((cumulativePercent + category.value) / 100) * 360;
                        cumulativePercent += category.value;
                        return (
                          <path
                            key={index}
                            d={getArcPath(50, 50, 50, startAngle, endAngle)}
                            fill={category.color}
                          />
                        );
                      });
                    })()}
                  </svg>
                </div>
                <div className="w-full space-y-3">
                  {incomeCategoryStats.map((category, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-gray-600 text-sm">
                        {category.name} ({category.value.toFixed(2)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4 mt-[100px]">
              <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
              <a
                href="/transactions"
                className="text-blue-600 hover:text-blue-800 font-semibold rounded-md px-3 py-1.5 bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                View All
              </a>
            </div>
            <div className="rounded-xl shadow-sm overflow-hidden bg-[var(--surface)]">
              <div className="w-full shadow-lg rounded-2xl overflow-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-lg bg-[var(--surface-muted)] sticky top-0 z-10">
                      <th className="text-nowrap p-2 text-center font-light text-xl  w-2/12">
                        Date
                      </th>
                      <th className="text-nowrap p-2 text-center font-light text-xl max-w-[200px]">
                        Description
                      </th>
                      <th className="text-nowrap p-2 text-center font-light text-xl  w-2/12">
                        Category
                      </th>
                      <th className="text-nowrap p-2 text-center font-light text-xl  w-1/12">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-lg text-[#747474]">
                    {recentTransactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-4 text-2xl text-center text-gray-500"
                        >
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      recentTransactions.map((transaction) => (
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
                                +₹{transaction.amount.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-red-500">
                                -₹{Math.abs(transaction.amount).toFixed(2)}
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
    </DataGate>
  );
}
