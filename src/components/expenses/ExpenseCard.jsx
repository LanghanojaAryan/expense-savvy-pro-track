
import React, { useState } from "react";
import { deleteExpense } from "../../firebase/firestore";
import { useExpenses } from "../../context/ExpenseContext";
import CategoryBadge from "../ui/CategoryBadge";
import CurrencyDisplay from "../ui/CurrencyDisplay";
import ExpenseForm from "./ExpenseForm";

const ExpenseCard = ({ expense }) => {
  const { setExpenses } = useExpenses();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const formattedDate = expense.date instanceof Date
    ? expense.date.toLocaleDateString()
    : new Date(expense.date?.seconds * 1000).toLocaleDateString();

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteExpense(expense.id);
      setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== expense.id));
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-4 animate-fade-in">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Transaction</h3>
        <ExpenseForm 
          expenseToEdit={expense} 
          onSuccess={handleEditSuccess} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className={`expense-card hover-scale ${
      expense.type === "income" ? "border-l-4 border-success" : "border-l-4 border-warning"
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{expense.title}</h3>
          <div className="mt-1 flex items-center">
            <span className="text-sm text-gray-500 mr-2">{formattedDate}</span>
            {expense.category && (
              <CategoryBadge category={expense.category} />
            )}
          </div>
        </div>
        <div className="flex items-start">
          <CurrencyDisplay 
            amount={expense.amount} 
            type={expense.type}
            className="text-lg font-bold" 
          />
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
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 w-full text-left"
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin mr-3 h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {expense.notes && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">{expense.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
