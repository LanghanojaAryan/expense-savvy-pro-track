
import React from "react";

const ProgressBar = ({ value, max, label, className = "", showLabel = true }) => {
  // Calculate percentage
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  
  // Determine color based on percentage
  let colorClass = "bg-purple";
  if (percentage > 85) {
    colorClass = "bg-warning";
  } else if (percentage > 100) {
    colorClass = "bg-destructive";
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
