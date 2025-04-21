
import React from "react";

const CurrencyDisplay = ({ 
  amount, 
  currency = "USD", 
  className = "",
  type = null 
}) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });

  // Determine text color based on amount or type
  let textColorClass = "";
  if (type === "income") {
    textColorClass = "text-success-dark";
  } else if (type === "expense") {
    textColorClass = "text-warning-dark";
  } else if (amount > 0) {
    textColorClass = "text-success-dark";
  } else if (amount < 0) {
    textColorClass = "text-warning-dark";
  }

  return (
    <span className={`font-medium ${textColorClass} ${className}`}>
      {formatter.format(Math.abs(amount))}
    </span>
  );
};

export default CurrencyDisplay;
