"use client";

import Navbar from "@/src/components/navbar/navbar";

export default function BudgetsPage() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Budgets</h1>
        <p className="text-gray-700 mb-4">Manage your budgets here.</p>
        {/* Add your budget management components here */}
      </main>
    </div>
  );
}
