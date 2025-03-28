'use client'
import React, { useState, useEffect } from 'react'
import { useUser } from "@clerk/nextjs";
import db from "../../../utils/dbConfig.js";
import { Budget, Expense } from "../../../utils/schema.js";
import { getTableColumns, eq, desc, sql } from "drizzle-orm";
import Cardinfo from "./_components/Cardinfo";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpensesListTable from './expenses/_components/ExpensesListTable.jsx';

// Client component for user greeting
const ClientGreeting = () => {
  const { user } = useUser();
  const [name, setName] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.firstName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'there');
    }
  }, [user]);

  return <span>{name || 'there'}</span>;
};

function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  
  useEffect(() => {
    if (user) {
      console.log("User object properties:", Object.keys(user));
      console.log("User email:", user.primaryEmailAddress?.emailAddress);
      getBudgetList();
      getAllExpenses();
    }
  }, [user]);

  const getBudgetList = async () => {
    try {
      const result = await db.select({
        ...getTableColumns(Budget),
        totalSpend: sql`COALESCE(sum(${Expense.amount}), 0)`.mapWith(Number),
        totalItems: sql`count(${Expense.id})`.mapWith(Number),
      })
      .from(Budget)
      .leftJoin(Expense, eq(Budget.id, Expense.budgetId))
      .where(eq(Budget.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budget.id)
      .orderBy(desc(Budget.id));

      setBudgetList(result);
    } catch (error) {
      console.error("Error fetching budget data:", error);
    }
  }

  const getAllExpenses = async () => {
    try {
      const result = await db.select({
        id: Expense.id,
        description: Expense.description,
        amount: Expense.amount,
        createdAt: Expense.createdAt,
        budgetId: Expense.budgetId
      })
      .from(Expense)
      .innerJoin(Budget, eq(Budget.id, Expense.budgetId))
      .where(eq(Budget.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Expense.id))
      .limit(10); // Limit to 10 recent expenses

      setExpensesList(result);
    } catch (error) {
      console.error("Error fetching expense data:", error);
    }
  }

  return (
    <div className='p-8'>
      <h2 className='font-bold text-3xl'> Hi, <ClientGreeting /></h2>
      <p className='text-gray-500'>Here's what happing with your money, Lets Manage your expense</p>

      <Cardinfo budgetList={budgetList}/>

      <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-6'>
        <div className='md:col-span-2'>
          <BarChartDashboard
            budgetList={budgetList}
          />

          <ExpensesListTable
            expensesList={expensesList}
            refreshData={getAllExpenses}
          />
        </div>
        <div className='grid gap-6'>
          <h2 className='text-2xl font-bold'>Recent Expenses</h2>
          {budgetList.map((budget,index)=>(
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard