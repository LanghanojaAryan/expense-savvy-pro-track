
import React, { useState, useEffect } from "react";
import { addBudget, updateBudget } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useExpenses } from "../../context/ExpenseContext";

const DEFAULT_CATEGORIES = [
  "Food", "Transport", "Entertainment", "Shopping", 
  "Bills", "Housing", "Health", "Education", "Other"
];

const BudgetForm = ({ onSuccess, budgetToEdit = null, onCancel }) => {
  const { currentUser } = useAuth();
  const { categories, setBudgets } = useExpenses();
  
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    period: "monthly"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Available categories for selection
  const availableCategories = categories.length > 0 
    ? categories.filter(cat => cat.type === "expense").map(cat => cat.name)
    : DEFAULT_CATEGORIES;
  
  // Populate form if editing a budget
  useEffect(() => {
    if (budgetToEdit) {
      setFormData({
        category: budgetToEdit.category || "",
        amount: budgetToEdit.amount?.toString() || "",
        period: budgetToEdit.period || "monthly"
      });
    }
  }, [budgetToEdit]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError("You must be logged in to add budgets");
      return;
    }
    
    if (!formData.category || !formData.amount || !formData.period) {
      setError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const budgetData = {
        category: formData.category,
        amount: parseFloat(formData.amount),
        period: formData.period
      };
      
      if (budgetToEdit) {
        // Update existing budget
        await updateBudget(budgetToEdit.id, budgetData);
      } else {
        // Add new budget
        await addBudget(currentUser.uid, budgetData);
      }
      
      // Refresh budgets list after add/update
      setBudgets(prev => {
        if (budgetToEdit) {
          return prev.map(budget => 
            budget.id === budgetToEdit.id ? { id: budget.id, ...budgetData } : budget
          );
        } else {
          // For new budgets, we'll get the updated list when the context refreshes
          return prev;
        }
      });
      
      // Reset form and notify parent component
      setFormData({
        category: "",
        amount: "",
        period: "monthly"
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving budget:", error);
      setError("Failed to save budget. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple focus:border-purple sm:text-sm"
          >
            <option value="">Select a category</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Budget Amount <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="focus:ring-purple focus:border-purple block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">USD</span>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700">
            Budget Period <span className="text-red-500">*</span>
          </label>
          <select
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple focus:border-purple sm:text-sm"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : budgetToEdit ? "Update Budget" : "Add Budget"}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;
