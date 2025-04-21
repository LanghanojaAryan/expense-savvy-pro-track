
import { createContext, useContext, useState, useEffect } from "react";
import { getUserExpenses, getUserCategories, getUserBudgets } from "../firebase/firestore";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext();

export const useExpenses = () => {
  return useContext(ExpenseContext);
};

export const ExpenseProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setExpenses([]);
        setCategories([]);
        setBudgets([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [expensesData, categoriesData, budgetsData] = await Promise.all([
          getUserExpenses(currentUser.uid),
          getUserCategories(currentUser.uid),
          getUserBudgets(currentUser.uid)
        ]);

        setExpenses(expensesData);
        setCategories(categoriesData);
        setBudgets(budgetsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Calculate summary data
  const totalIncome = expenses
    .filter(expense => expense.type === "income")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalExpenses = expenses
    .filter(expense => expense.type === "expense")
    .reduce((sum, expense) => sum + expense.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Group expenses by category
  const expensesByCategory = expenses
    .filter(expense => expense.type === "expense")
    .reduce((acc, expense) => {
      const category = expense.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += expense.amount;
      return acc;
    }, {});

  const value = {
    expenses,
    setExpenses,
    categories,
    setCategories,
    budgets,
    setBudgets,
    loading,
    error,
    summary: {
      totalIncome,
      totalExpenses,
      balance,
      expensesByCategory
    }
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
