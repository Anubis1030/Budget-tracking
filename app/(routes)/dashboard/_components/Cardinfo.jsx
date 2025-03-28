import { PiggyBank, ReceiptText, Wallet } from "lucide-react";
import React, { useState, useEffect } from "react";

function Cardinfo({ budgetList = [] }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  
  useEffect(() => {
    calculateCardInfo();
  }, [budgetList]);
  
  const calculateCardInfo = () => {
    if (!budgetList || budgetList.length === 0) {
      setTotalBudget(0);
      setTotalSpend(0);
      return;
    }
    
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    
    budgetList.forEach(element => {
      // Make sure to handle null/undefined values
      totalBudget_ += Number(element.amount || 0);
      
      // totalSpend from SQL might be null if there are no expenses
      const spend = element.totalSpend !== null ? element.totalSpend : 0;
      totalSpend_ += Number(spend);
    });
    
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  }
  
  // Format currency to show with commas
  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US');
  };
  
  return (
    <div>{budgetList?.length > 0 ?
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-7 border rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-sm">Total Budget</h2>
            <h2 className="text-2xl font-bold">₹{formatCurrency(totalBudget)}</h2>
          </div>
          <PiggyBank className="bg-primary text-white rounded-full p-3 h-12 w-12" />
        </div>
        <div className="p-7 border rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-sm">Total Spend</h2>
            <h2 className="text-2xl font-bold">₹{formatCurrency(totalSpend)}</h2>
          </div>
          <ReceiptText className="bg-primary text-white rounded-full p-3 h-12 w-12" />
        </div>
        <div className="p-7 border rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-sm">No. of Budget</h2>
            <h2 className="text-2xl font-bold">{budgetList?.length}</h2>
          </div>
          <Wallet className="bg-primary text-white rounded-full p-3 h-12 w-12" />
        </div>
      </div> :
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item, index) => (
          <div key={index} className="h-[110px] w-full bg-gray-200 animate-pulse rounded-lg">
          </div>
        ))}
      </div>
    }
    </div>
  );
}

export default Cardinfo;
