
import React, { useState, useEffect } from "react";
import { addExpense, updateExpense, formatDateForFirestore } from "../../firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useExpenses } from "../../context/ExpenseContext";

const DEFAULT_CATEGORIES = [
  "Food", "Transport", "Entertainment", "Shopping", 
  "Bills", "Housing", "Health", "Education", 
  "Salary", "Investment", "Gift", "Other"
];

const ExpenseForm = ({ onSuccess, expenseToEdit = null, onCancel }) => {
  const { currentUser } = useAuth();
  const { categories, setExpenses } = useExpenses();
  
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    type: "expense",
    notes: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Available categories for selection
  const availableCategories = categories.length > 0 
    ? categories.map(cat => cat.name)
    : DEFAULT_CATEGORIES;
  
  // Populate form if editing an expense
  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title || "",
        amount: expenseToEdit.amount.toString() || "",
        date: expenseToEdit.date instanceof Date
          ? expenseToEdit.date.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        category: expenseToEdit.category || "",
        type: expenseToEdit.type || "expense",
        notes: expenseToEdit.notes || ""
      });
    }
  }, [expenseToEdit]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError("You must be logged in to add expenses");
      return;
    }
    
    if (!formData.title.trim() || !formData.amount || !formData.date) {
      setError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const expenseData = {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        date: formatDateForFirestore(formData.date),
        category: formData.category || "Other",
        type: formData.type,
        notes: formData.notes.trim()
      };
      
      if (expenseToEdit) {
        // Update existing expense
        await updateExpense(expenseToEdit.id, expenseData);
      } else {
        // Add new expense
        await addExpense(currentUser.uid, expenseData);
      }
      
      // Refresh expenses list after add/update
      setExpenses(prev => {
        if (expenseToEdit) {
          return prev.map(exp => 
            exp.id === expenseToEdit.id ? { id: exp.id, ...expenseData } : exp
          );
        } else {
          // For new expenses, we'll get the updated list when the context refreshes
          return prev;
        }
      });
      
      // Reset form and notify parent component
      setFormData({
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        type: "expense",
        notes: ""
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving expense:", error);
      setError("Failed to save expense. Please try again.");
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 focus:ring-purple focus:border-purple block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount <span className="text-red-500">*</span>
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
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 focus:ring-purple focus:border-purple block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
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
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple focus:border-purple sm:text-sm"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="mt-1 focus:ring-purple focus:border-purple block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          ></textarea>
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
          ) : expenseToEdit ? "Update" : "Add Expense"}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
