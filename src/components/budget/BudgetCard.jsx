
import React, { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import ProgressBar from "../ui/ProgressBar";
import CurrencyDisplay from "../ui/CurrencyDisplay";
import BudgetForm from "./BudgetForm";

const BudgetCard = ({ budget, onDelete }) => {
  const { expenses } = useExpenses();
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Calculate spent amount within the current period
  const calculateSpentAmount = () => {
    // Get current date
    const now = new Date();
    let startDate = new Date();
    
    // Determine start date based on budget period
    if (budget.period === "weekly") {
      // Start from beginning of week (Sunday)
      const day = startDate.getDay();
      startDate.setDate(startDate.getDate() - day);
      startDate.setHours(0, 0, 0, 0);
    } else if (budget.period === "monthly") {
      // Start from beginning of month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (budget.period === "yearly") {
      // Start from beginning of year
      startDate = new Date(now.getFullYear(), 0, 1);
    }
    
    // Calculate total spending for this category within the period
    return expenses
      .filter(expense => {
        const expenseDate = expense.date instanceof Date 
          ? expense.date 
          : new Date(expense.date?.seconds * 1000);
        
        return (
          expense.type === "expense" &&
          expense.category === budget.category &&
          expenseDate >= startDate &&
          expenseDate <= now
        );
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };
  
  const spentAmount = calculateSpentAmount();
  const percentageUsed = (spentAmount / budget.amount) * 100;
  const isOverBudget = percentageUsed > 100;
  
  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };
  
  const handleEditSuccess = () => {
    setIsEditing(false);
  };
  
  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(budget.id);
    }
    setShowOptions(false);
  };
  
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-4 animate-fade-in">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Budget</h3>
        <BudgetForm 
          budgetToEdit={budget} 
          onSuccess={handleEditSuccess} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-5 hover-scale">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{budget.category}</h3>
          <p className="text-sm text-gray-500 capitalize mt-1">{budget.period} Budget</p>
        </div>
        <div className="flex items-start">
          <div className="text-right">
            <p className="text-lg font-bold">
              <CurrencyDisplay amount={budget.amount} />
            </p>
            <p className="text-sm text-gray-500 mt-1">
              <span className={isOverBudget ? "text-warning-dark" : "text-success-dark"}>
                <CurrencyDisplay amount={spentAmount} /> spent
              </span>
            </p>
          </div>
          <div className="relative ml-2">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {showOptions && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleDeleteClick}
                    className="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 w-full text-left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <ProgressBar 
          value={spentAmount} 
          max={budget.amount} 
          label={`${isOverBudget ? 'Over budget!' : 'Budget usage'}`} 
        />
      </div>
      
      <div className="mt-4 text-sm">
        {isOverBudget ? (
          <p className="text-warning-dark">
            You've exceeded your budget by <CurrencyDisplay amount={spentAmount - budget.amount} />
          </p>
        ) : (
          <p className="text-success-dark">
            <CurrencyDisplay amount={budget.amount - spentAmount} /> remaining
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;
