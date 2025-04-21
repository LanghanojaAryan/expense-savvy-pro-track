
import React from "react";
import { useExpenses } from "../../context/ExpenseContext";
import CurrencyDisplay from "../ui/CurrencyDisplay";

const SummaryCards = () => {
  const { summary, loading } = useExpenses();
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-lg shadow p-5">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {/* Balance Card */}
      <div className="stat-card balance hover-scale transform transition-all duration-300">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium text-gray-900">Current Balance</h3>
          <div className="h-8 w-8 bg-info/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <p className={`mt-2 text-3xl font-bold ${summary.balance >= 0 ? 'text-info-dark' : 'text-warning-dark'}`}>
          <CurrencyDisplay amount={summary.balance} />
        </p>
        <p className="mt-4 text-sm text-gray-500">
          {summary.balance >= 0 
            ? "You're doing well! Keep it up." 
            : "You're in the red. Let's reduce some expenses."}
        </p>
      </div>
      
      {/* Income Card */}
      <div className="stat-card income hover-scale transform transition-all duration-300">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium text-gray-900">Total Income</h3>
          <div className="h-8 w-8 bg-success/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold text-success-dark">
          <CurrencyDisplay amount={summary.totalIncome} />
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Total income recorded in your account
        </p>
      </div>
      
      {/* Expense Card */}
      <div className="stat-card expense hover-scale transform transition-all duration-300">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium text-gray-900">Total Expenses</h3>
          <div className="h-8 w-8 bg-warning/10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-3xl font-bold text-warning-dark">
          <CurrencyDisplay amount={summary.totalExpenses} />
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Total expenses recorded in your account
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
