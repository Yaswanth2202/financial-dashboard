# Finance Dashboard (Frontend-only)

A responsive personal finance dashboard designed to demonstrate clean UI design, structured state management, and intuitive user interactions in a frontend-only environment.

All visualizations and insights are derived from transaction data in real time. No backend services are used.

---

## Tech Stack

- React + Vite + TypeScript  
- Tailwind CSS  
- Recharts  
- Zustand (state management)  
- localStorage (persistence)  
- date-fns  
- lucide-react  
- clsx + tailwind-merge  

---

## Overview

This project focuses on building a clear and usable interface for understanding personal financial data.

It demonstrates:

- Structured information flow (overview → trends → transactions → insights)  
- Consistent and readable UI design  
- Centralized state management with derived data  
- Simple role-based UI behavior  

---

## Features

### Dashboard Overview

- Summary cards:
  - Total Balance  
  - Total Income  
  - Total Expenses  
  - Savings Rate  

- Charts:
  - Income vs Expenses (last 6 months)  
  - Spending breakdown by category  
  - Balance trend over time  

- Graceful handling of empty states  

---

### Transactions

- Tabular and mobile-friendly views  
- Search across multiple fields  
- Filtering by type and category  
- Sorting by date or amount  
- Pagination for scalability  
- Empty state handling  

---

### Role-Based UI (Frontend Simulation)

- **Viewer**
  - Read-only access  
  - Management actions disabled  

- **Admin**
  - Add, edit, delete transactions  
  - Export data (CSV / JSON)  
  - Reset dataset  

---

### Insights

Insight cards are computed from transaction data and update automatically:

- Highest spending category  
- Peak expense month  
- Expense-to-income ratio  
- Top expense merchant  
- Month-over-month expense trend  

---

### Persistence & Theme

- Transactions, role, and theme are persisted in localStorage  
- Light and dark mode supported  

---

## Project Structure

src/
  app/                  App composition + layout
  components/           Reusable UI + layout components
  data/                 Mock data + constants
  domain/               Type definitions
  features/             Feature modules (dashboard, transactions, insights)
  store/                Zustand store + persistence
  utils/                Helpers (formatting, calculations, export)

---

## Getting Started

### Prerequisites
- Node.js 18+

### Run locally

~~~bash
npm install
npm run dev
~~~

### Build

~~~bash
npm run build
npm run preview
~~~

---

## Quick Demo Guide

To explore the application:

- Switch between **Viewer** and **Admin** roles  
- In Admin mode, create or edit a transaction and observe updates across the UI  
- Use search and filters to refine the transaction list  
- Toggle dark mode to view theme support  

---

## Data Handling

- Transaction amounts are stored as positive values  
- Type (income/expense) determines how values are interpreted  
- All metrics and charts are derived from the transaction list  

---

## Notes

- This is a frontend-only implementation  
- Role behavior is simulated for demonstration purposes  
- No external APIs or backend services are used  

---

## Architecture

- Zustand manages global state (transactions, filters, role, theme)  
- Derived calculations are handled in utility functions  
- Filtering and sorting logic is separated from UI components  
- State persistence is handled via localStorage  
