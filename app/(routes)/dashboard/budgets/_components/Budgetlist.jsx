"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { getTableColumns, sql, eq, desc } from 'drizzle-orm'
import { Budget, Expense } from '../../../../../utils/schema.js'
import db from '../../../../../utils/dbConfig.js'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'

function Budgetlist() {
  const [budgetList, setBudgetList] = useState([])
  const { user } = useUser()

  const getBudgetList = async () => {
    const result = await db.select({
      ...getTableColumns(Budget),
      totalSpend: sql`sum(${Expense.amount})`.mapWith(Number),
      totalItems: sql`count(${Expense.id})`.mapWith(Number),
    })
    .from(Budget)
    .leftJoin(Expense, eq(Budget.id, Expense.budgetId))
    .where(eq(Budget.createdBy, user?.primaryEmailAddress?.emailAddress))
    .groupBy(Budget.id)
    .orderBy(desc(Budget.id))
    ;

    setBudgetList(result)
  }

  useEffect(() => {
    if (user) {
      getBudgetList()
    }
  }, [user])

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 
        md:grid-cols-2 lg:grid-cols-3 gap-5'> 
        <CreateBudget
        refershData={()=>getBudgetList()}/>
        {budgetList?.length>0? budgetList.map((budget, index) => (
          <BudgetItem key={budget.id} budget={budget}/>
        ))
      :[1,2,3,4,5,6].map((item, index) => (
        <div key={index} className='w-full bg-slate-200 rounded-lg h-[150px] animate-pulse'>

        </div>
      ))
      }
      </div>
    </div>
  )
}

export default Budgetlist