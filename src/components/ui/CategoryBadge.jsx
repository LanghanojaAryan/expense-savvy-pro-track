
import React from "react";

const categoryColors = {
  Food: "bg-yellow-100 text-yellow-800",
  Transport: "bg-blue-100 text-blue-800",
  Entertainment: "bg-purple-100 text-purple-800",
  Shopping: "bg-pink-100 text-pink-800",
  Bills: "bg-red-100 text-red-800",
  Housing: "bg-green-100 text-green-800",
  Health: "bg-emerald-100 text-emerald-800",
  Education: "bg-indigo-100 text-indigo-800",
  Salary: "bg-green-100 text-green-800",
  Investment: "bg-blue-100 text-blue-800",
  Gift: "bg-purple-100 text-purple-800",
  Other: "bg-gray-100 text-gray-800"
};

const CategoryBadge = ({ category = "Other", className = "" }) => {
  const colorClass = categoryColors[category] || "bg-gray-100 text-gray-800";
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {category}
    </span>
  );
};

export default CategoryBadge;
