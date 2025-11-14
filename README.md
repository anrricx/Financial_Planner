# Portfolio Allocation and Investment Planning Tool

A full-stack application for portfolio allocation and investment planning with React, Vite, TailwindCSS frontend and Node.js, Express backend.

## Project Structure

```
.
├── backend/          # Node.js + Express backend
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   └── server.ts # Express server
│   └── package.json
├── frontend/         # React + Vite + TailwindCSS frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── shared/           # Shared TypeScript types
    └── types/
        └── index.ts
```

## Features

- **Portfolio Allocation Engine**: Automatically allocates investments based on risk level
  - Low Risk: Bonds (60%) + Index Funds (40%)
  - Moderate Risk: Index Funds (40%) + Tech Stocks (35%) + Value Stocks (25%)
  - High Risk: Tech Stocks (45%) + Growth Stocks (35%) + Emerging Markets (20%)

- **Expected Return Calculator**: Uses compound growth formulas to project future values

- **Interactive Dashboard**: 
  - Form for investment inputs
  - Allocation table
  - Pie charts for initial and projected allocations (Years 1, 2, 5, 10)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will run on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### POST `/api/portfolio/calculate`

Calculate portfolio allocation and projections.

**Request Body:**
```json
{
  "investmentAmount": 10000,
  "riskLevel": "Moderate",
  "expectedReturn": 7,
  "timeline": 5,
  "preferredSectors": []
}
```

**Response:**
```json
{
  "initialAllocations": [
    {
      "category": "Index Funds",
      "percentage": 0.4,
      "dollarAmount": 4000
    }
  ],
  "yearlyProjections": [
    {
      "year": 1,
      "totalValue": 10700,
      "allocations": [...]
    }
  ]
}
```

## Technologies

- **Frontend**: React 18, Vite, TailwindCSS, Recharts
- **Backend**: Node.js, Express, TypeScript
- **Shared**: TypeScript interfaces

