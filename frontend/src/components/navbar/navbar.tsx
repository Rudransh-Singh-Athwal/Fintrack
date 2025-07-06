/* eslint-disable @next/next/no-html-link-for-pages */
export default function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-white shadow-md text-black h-16">
      <div className="text-xl font-semibold ml-10">Track my cash</div>
      <div className="flex space-x-6 text-lg items-center mr-10">
        <a href="/" className="hover:text-blue-600">Dashboard</a>
        <a href="/transactions" className="hover:text-blue-600">Transactions</a>
        <a href="/budgets" className="hover:text-blue-600">Budgets</a>
        <a href="/reports" className="hover:text-blue-600">Reports</a>
      </div>
    </nav>
  );
}