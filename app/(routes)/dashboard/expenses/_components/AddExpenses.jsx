import React from "react";
import { useState } from "react";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { toast } from "sonner";
import db from "../../../../../utils/dbConfig";
import { Expense, Budget } from "../../../../../utils/schema";
import moment from "moment";
import { Loader } from "lucide-react";



function AddExpenses({budgetId,user,refreshData}) {

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const addNewExpenses=async()=>{
    try {
      setLoading(true);
      const result = await db.insert(Expense).values({
        description: name,
        amount: amount,
        budgetId: budgetId,
        createdAt: new Date(),
        createdBy: user?.primaryEmailAddress?.emailAddress
      }).returning({inserted: Expense.id});
      
      setName("");
      setAmount("");
      if(result) {
        setLoading(false);
        refreshData();
        toast("Expenses Added Successfully");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
      setLoading(false);
    }
  }
  return (
    <div className="border p-3 rounded-lg ml-4">
      <h2 className="font-bold text-lg">Add Expense</h2>

      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expenses Name</h2>
        <Input
          type="text"
          placeholder="e.g Bedroom Decoration"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        </div>
        <div className="mt-2">
          <h2 className="text-black font-medium my-2">Expenses Amount</h2>
          <Input
            type="number"
            placeholder="e.g RS 500"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <Button 
          disabled={!(name && amount) || loading}
          onClick={() => addNewExpenses()} 
          className="mt-3 w-full">
           {loading ? 
            <Loader className="animate-spin"/> : "Add New Expenses"
           }
        </Button>
      
    </div>
  );
}

export default AddExpenses;
