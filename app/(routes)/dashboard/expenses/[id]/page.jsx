"use client";
import React, { useEffect, useState, use } from "react";
import db from "../../../../../utils/dbConfig.js";
import { Budget } from "../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import { getTableColumns } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { eq, desc } from "drizzle-orm";
import { Expense } from "../../../../../utils/schema";
import BudgetItem from "./BudgetItem.jsx";
import AddExpenses from "../_components/AddExpenses.jsx";
import ExpensesListTable from "../_components/ExpensesListTable.jsx";
import EditBudget from "../_components/EditBudget.jsx";
import { Button } from "../../../../../components/ui/button.jsx";
import { PenBox, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../../@/components/ui/alert-dialog.jsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


function ExpensesScreen({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const { user } = useUser();
  const [budgetInfo, setBudgetsInfo] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const route = useRouter();
  useEffect(() => {
    user && getBudgetInfo();
  }, [user]);

  const getBudgetInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budget),
        totalSpend: sql`sum(${Expense.amount})`.mapWith(Number),
        totalItems: sql`count(${Expense.id})`.mapWith(Number),
      })
      .from(Budget)
      .leftJoin(Expense, eq(Budget.id, Expense.budgetId))
      .where(eq(Budget.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Budget.id, unwrappedParams.id))
      .groupBy(Budget.id);

    setBudgetsInfo(result[0]);
    getExpensesList();
  };

  const getExpensesList = async () => {
    try {
      const result = await db
        .select({
          id: Expense.id,
          amount: Expense.amount,
          description: Expense.description,
          budgetId: Expense.budgetId,
          createdAt: Expense.createdAt
        })
        .from(Expense)
        .where(eq(Expense.budgetId, unwrappedParams.id))
        .orderBy(desc(Expense.createdAt));
      
      setExpensesList(result);
    } catch (error) {
      console.error("Error fetching expenses list:", error);
      toast.error("Failed to load expenses");
    }
  };

  const deleteBudget = async () => {

    const deleteExpenses = await db
    .delete(Expense)
    .where(eq(Expense.budgetId, unwrappedParams.id))
    .returning();
    if (deleteExpenses) {
        const result = await db
        .delete(Budget)
        .where(eq(Budget.id, unwrappedParams.id))
        .returning();
       
    }
    toast("Budget deleted successfully");
    route.replace("/dashboard/budgets");

 
  };
  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold flex justify-between">
        My Expenses
       <div  className="flex gap-2">
       <EditBudget budgetId={unwrappedParams.id} refreshData={() => getBudgetInfo()}/>
       </div>
       
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex gap-2" variant="destructive">
              <Trash />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                delete your current budget along with expenses and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={()=>deleteBudget()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
       
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 ,mt-6">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div
            className="h-[150px] w-full bg-slate-200
                rounded-lg animate-pulse"
          ></div>
        )}

        <AddExpenses
          budgetId={unwrappedParams.id}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>
      <div className="mt-6">
       
        <ExpensesListTable
          expensesList={expensesList}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
}
export default ExpensesScreen;
