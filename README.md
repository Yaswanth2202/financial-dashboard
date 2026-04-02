# Finance Dashboard (Frontend-only)

Polished, responsive personal finance dashboard UI built for frontend assessments: clean component boundaries, lightweight state management, role-based behavior, and UX details that make it feel like a real product — **no backend required**.

## Tech stack
- **React + Vite + TypeScript**
- **Tailwind CSS** (styling + responsive layout)
- **Recharts** (charts)
- **Zustand** (lightweight global state)
- **localStorage persistence** (via Zustand persist middleware)
- **date-fns** (date formatting)
- **lucide-react** (icon set)
- **clsx + tailwind-merge** (className ergonomics)

## Product goals (what this demonstrates)
- **Information architecture**: overview → trends → transactions → insights
- **Strong UI clarity**: clear hierarchy, fast scanning, responsive layouts
- **State hygiene**: centralized store, derived selectors, persistence
- **Role-aware UI**: Viewer vs Admin behaviors are obvious and testable

## Features
### Dashboard overview
- **Metric cards**: Total Balance, Total Income, Total Expenses, Savings Rate (derived from data)
- **Charts**
  - Income vs Expenses (last 6 months)
  - Spending breakdown by category (expenses, top categories)
  - Balance trend (net accumulation over months)
- **Empty states** for charts when data is missing

### Transactions
- **Fast scanning** list/table with clear positive/negative styling
- **Search** by keyword (merchant/description, type, category, date)
- **Filters**: type + category
- **Sorting**: date or amount + direction toggle
- **Pagination**: keeps the page compact as data grows
- **Empty state** when filters match nothing

### Role-based UI (frontend-only simulation)
- **Viewer**
  - Read-only (cannot add/edit/delete)
  - Admin buttons are disabled with clear affordances
- **Admin**
  - Add, edit, delete transactions
  - Export transactions to **CSV** or **JSON**
  - Reset data back to the seed dataset

### Insights
3–5 insight cards derived from the dataset (not hardcoded), including:
- Highest spending category
- Peak expense month
- Expense-to-income ratio
- Top expense merchant
- Month-over-month expense trend (when enough data exists)

### Persistence & theme
- **Transactions**, **role**, and **theme** are persisted in `localStorage`
- **Dark mode toggle** with a calm, premium palette

## Folder structure
```txt
src/
  app/                  App composition + layout
  components/           Reusable UI + layout components
  data/                 Mock seed data + constants
  domain/               Types (Transaction, Category, Role, etc.)
  features/             Feature modules (dashboard / transactions / insights)
  store/                Zustand store (+ localStorage persistence)
  utils/                Formatting, export helpers, finance calculations
```

## Getting started
### Prerequisites
- Node.js 18+ (recommended)

### Install & run
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

## How to evaluate quickly (assessment checklist)
- Switch **Role** between **Viewer** and **Admin**
- In **Admin**, add/edit/delete a transaction and verify:
  - metrics and charts update immediately
  - insights update (highest category, peak month, etc.)
- Try searching for:
  - a merchant name (e.g. `FreshMart`)
  - a formatted date (e.g. `Mar`)
  - an amount (e.g. `45`)
- Toggle **dark mode** and confirm contrast stays readable

## Data handling notes
- Transactions are stored as:
  - `amount` **positive**
  - `type` determines sign (income vs expense) in UI calculations
- Overview metrics, charts, and insights are computed from the transaction list at render-time with memoization.

## Role behavior notes
- The role selector simulates access control **on the frontend**:
  - Admin actions are hidden/disabled when the role is Viewer.
  - No backend calls are made.

## Architectural notes
- **Global state**: `src/store/useAppStore.ts` (Zustand) holds transactions, role, theme, and transaction filters.
- **Derived data**: finance calculations live in `src/utils/finance.ts`; transaction filtering/sorting lives in `src/features/transactions/transactionsSelectors.ts`.
- **Persistence**: stored under `finance-dashboard:v1` in `localStorage` (role/theme/transactions).

