
import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import SummaryCards from "../components/dashboard/SummaryCards";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import ExpenseByCategoryChart from "../components/dashboard/ExpenseByCategoryChart";
import { useAuth } from "../context/AuthContext";
import { ExpenseProvider } from "../context/ExpenseContext";

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <Layout>
      <ExpenseProvider>
        <div className="space-y-8">
          {currentUser ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <Link
                  to="/transactions/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple hover:bg-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Transaction
                </Link>
              </div>

              <SummaryCards />

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <ExpenseByCategoryChart />
                <RecentTransactions />
              </div>
            </>
          ) : (
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Manage your finances with{" "}
                <span className="text-purple">ExpenseSavvy</span>
              </h1>
              <p className="mt-5 text-xl text-gray-500">
                Track your income and expenses, set budgets, and gain insights into
                your spending habits.
              </p>
              <div className="mt-10 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple hover:bg-purple-dark"
                  >
                    Get started
                  </Link>
                </div>
                <div className="ml-3 inline-flex">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple bg-white hover:bg-gray-50"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </ExpenseProvider>
    </Layout>
  );
};

export default Dashboard;
