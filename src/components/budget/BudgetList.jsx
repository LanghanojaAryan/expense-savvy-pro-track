
import React, { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import BudgetCard from "./BudgetCard";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

const BudgetList = () => {
  const { budgets, setBudgets, loading } = useExpenses();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (budgetId) => {
    if (!budgetId) return;
    
    try {
      setDeletingId(budgetId);
      await deleteDoc(doc(db, "budgets", budgetId));
      setBudgets(prevBudgets => prevBudgets.filter(budget => budget.id !== budgetId));
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Failed to delete budget. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-lg shadow p-5">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No budgets</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first budget.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => (
        <div key={budget.id} className={deletingId === budget.id ? "opacity-50" : ""}>
          <BudgetCard budget={budget} onDelete={handleDelete} />
        </div>
      ))}
    </div>
  );
};

export default BudgetList;
