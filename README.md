# Personal Finance Visualizer

A simple, responsive web application to track personal finances and visualize spending trends over time.

---

## ✨ Features

### Basic Transaction Tracking
- Add, edit, and delete transactions (amount, date, description)
- Transaction list view
- Monthly expenses bar chart
- Basic form validation

### Categories
- Predefined categories for transactions
- Category-wise pie chart
- Dashboard with:
  - Total expenses
  - Category breakdown
  - Most recent transactions

### Budgeting
- Set monthly budgets per category
- Budget vs. actual comparison chart
- Simple spending insights

> **Note:** Authentication and user accounts are intentionally **not implemented**.

---

## 🛠️ Tech Stack

- **Next.js** – React framework for SSR and API routes
- **React** – UI library
- **shadcn/ui** – Accessible, unstyled component primitives (built on Radix UI + Tailwind CSS)
- **Recharts** – Data visualization library (bar and pie charts)
- **MongoDB** – Transaction data storage
- **Zod + React Hook Form** – Form validation and handling
- **Tailwind CSS** – Utility-first styling
---
## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/finance-visualizer.git
cd finance-visualizer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
Open http://localhost:3000 to see the app.
```