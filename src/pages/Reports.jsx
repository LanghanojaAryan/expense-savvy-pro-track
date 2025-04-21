
import React from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { ExpenseProvider } from "../context/ExpenseContext";
import ExpenseByCategoryChart from "../components/dashboard/ExpenseByCategoryChart";

const Reports = () => {
  const { currentUser } = useAuth();

  return (
    <Layout>
      <ExpenseProvider>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

          {currentUser ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="col-span-2">
                <ExpenseByCategoryChart />
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Summary</h2>
                <p className="text-gray-500">Monthly reports feature coming soon!</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Yearly Summary</h2>
                <p className="text-gray-500">Yearly reports feature coming soon!</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Authentication required
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Please sign in to view your financial reports.
              </p>
              <div className="mt-6">
                <a
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple"
                >
                  Sign in
                </a>
              </div>
            </div>
          )}
        </div>
      </ExpenseProvider>
    </Layout>
  );
};

export default Reports;
