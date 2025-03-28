import Link from "next/link";
import React from "react";

function BudgetItem({ budget }) {
  return (
    <div className="p-5 border rounded-lg"> 
    <div className="flex gap-2 items-center justify-between">
      <div className="flex gap-2 items-center">
        <h2
          className="text-2xl p-3 px-4
    bg-slate-100 rounded-full"
        >
          {budget?.icon}
        </h2>
        <div>
          <h2 className="font-bold">{budget.name}</h2>
          <h2 className="text-sm text-gray-500">{budget.totalItems ? budget.totalItems : 0} Item</h2>
        </div>
       
      </div>
      <h2 className="font-bold text-primary text-lg">Rs{budget.amount}</h2>
      </div>

      <div className="mt-5">
        <div className="flex items-centre justify-between mb-3">
          <h2 className="text-xs text-slate-400">Rs{budget.totalSpend?budget.totalSpend:0} Spend</h2>
          <h2 className="text-xs text-slate-400">Rs{budget.amount-budget.totalSpend} Remaining</h2>
        </div>
        <div className="w-full 
        bg-slate-300 h-2 rounded-full"> 
          <div className=" 
        bg-primary h-2 rounded-full"
        style={{ width: `${Math.min((budget.totalSpend/budget.amount)*100, 100)}%` }}>

          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetItem;