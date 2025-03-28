import { Trash } from 'lucide-react'
import React from 'react'
import db from '../../../../../utils/dbConfig.js'
import { Expense } from '../../../../../utils/schema.js'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function ExpensesListTable({expensesList, refreshData}) {

    const deleteExpense = async (expense) => {
      try {
        const result = await db
          .delete(Expense)
          .where(eq(Expense.id, expense.id))
          .returning({deleted: Expense.id});

        if (result && result.length > 0) {
          toast("Expense Deleted");
          if (typeof refreshData === 'function') {
            refreshData();
          }
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
        toast.error("Failed to delete expense");
      }
    }
  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  }

  return (
    <div className='mt-3'>
      <h2 className='text-lg font-bold'>Latest Expenses</h2>
      <div className='grid grid-cols-4 bg-slate-200 p-2 mt-3'>
        <h2 className='font-bold'>Name</h2>
        <h2 className='font-bold'>Amount</h2>
        <h2 className='font-bold'>Date</h2>
        <h2 className='font-bold text-center'>Action</h2>
      </div>
      {expensesList && expensesList.length > 0 ? (
        expensesList.map((expense,index)=>(
          <div key={index} className='grid grid-cols-4 bg-slate-50 p-2'>
            <h2>{expense.description}</h2>
            <h2>₹{expense.amount}</h2>
            <h2>{formatDate(expense.createdAt)}</h2>
            <h2 className="text-center">
              <button 
                className="text-red-600 hover:text-red-800"
                onClick={()=>deleteExpense(expense)}
              >
                <Trash className="h-5 w-5 cursor-pointer inline-block" />
              </button>
            </h2>
          </div>
        ))
      ) : (
        <div className='p-4 text-center text-gray-500'>
          No expenses found
        </div>
      )}
    </div>
  )
}

export default ExpensesListTable