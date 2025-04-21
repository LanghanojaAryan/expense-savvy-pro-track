
import React from "react";
import { Link } from "react-router-dom";
import { useExpenses } from "../../context/ExpenseContext";
import CurrencyDisplay from "../ui/CurrencyDisplay";
import CategoryBadge from "../ui/CategoryBadge";

const RecentTransactions = () => {
  const { expenses, loading } = useExpenses();
  
  // Get the 5 most recent transactions
  const recentTransactions = expenses
    .sort((a, b) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date?.seconds * 1000);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date?.seconds * 1000);
      return dateB - dateA;
    })
    .slice(0, 5);
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="p-5 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        <Link
          to="/transactions"
          className="text-sm font-medium text-purple hover:text-purple-dark"
        >
          View all
        </Link>
      </div>
      
      <div className="p-5">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-sm text-gray-500">No transactions yet.</p>
            <p className="mt-1 text-sm text-gray-500">
              Start by adding your first transaction.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const date = transaction.date instanceof Date
                ? transaction.date
                : new Date(transaction.date?.seconds * 1000);
                
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {transaction.title}
                    </p>
                    <div className="flex items-center mt-1">
                      <p className="text-xs text-gray-500 mr-2">
                        {date.toLocaleDateString()}
                      </p>
                      {transaction.category && (
                        <CategoryBadge category={transaction.category} />
                      )}
                    </div>
                  </div>
                  <div>
                    <CurrencyDisplay
                      amount={transaction.amount}
                      type={transaction.type}
                      className="text-sm font-medium"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
