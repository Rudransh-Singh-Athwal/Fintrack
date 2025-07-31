"use client";

import Navbar from "@/src/components/navbar/navbar";
import axios from "axios";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function BudgetsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchBudgets = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API}/api/budgets`);
      console.log("Budgets fetched successfully:", response.data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Monthly Budgets
        </h1>
        <p className="text-[#848181] mb-4">
          Set and track your monthly spending limits for each category.
        </p>
        <h2 className="text-xl font-semibold tracking-tight mb-2">
          Budget Overview
        </h2>
        {isLoading ? (
          <>
            <div className="border rounded-lg p-4 bg-white shadow-sm mb-6">
              <p>Budget vs actual spending</p>
              <h2 className="text-3xl font-semibold ">₹ 1000000</h2>
            </div>
          </>
        ) : (
          <>
            <div className="border rounded-lg p-4 bg-white shadow-sm mb-6">
              <p>Budget vs actual spending</p>
              <h2 className="text-3xl font-semibold ">₹ 1000000</h2>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
