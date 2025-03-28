"use client";
import React, { useEffect } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import db from "../../../utils/dbConfig.js";
import { Budget } from "../../../utils/schema.js";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

function Dashboardlayout({ children }) {
  const { user } = useUser();
  const router = useRouter();

  const checkUserBudgets = async () => {
    const result = await db
      .select()
      .from(Budget)
      .where(eq(Budget.createdBy, user?.primaryEmailAddress?.emailAddress));

    console.log(result);
    if (result?.length === 0) {
      router.replace("/dashboard/budgets");
    }
  };

  useEffect(() => {
    user && checkUserBudgets();
  }, [user]);

  return (
    <div>
      <div className="fixed md:w-64 hidden md:block">
        <SideNav />
      </div>
      <div className="md:ml-64">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}

export default Dashboardlayout;
