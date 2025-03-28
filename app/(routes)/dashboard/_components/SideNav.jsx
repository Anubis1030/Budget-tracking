"use client"
import React from "react";
import Image from "next/image";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path:"/dashboard"
    },
    {
      id: 2,
      name: "Budgets",
      icon: PiggyBank,
      path:"/dashboard/budgets"
    },
    {
      id: 3,
      name: "Expenses",
      icon: ReceiptText,
      path:"/dashboard/expenses"
    },
    {
      id: 4,
      name: "Upgrade",
      icon: ShieldCheck,
      path:"/dashboard/upgrade"
    },
  ]
    const path=usePathname();
    console.log(path);

    useEffect(()=>{
        console.log(path);
    },[path]);
  return (
    <div className="h-screen p-5 border shadow-sm">
      <Image src={"/logo.svg"} alt="logo" width={100} height={100} />
      
      <div className="mt-5">
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={menu.id} >
          <h2
            className={`flex items-center gap-2
                text-gray-500 font-medium
                mb-2
                p-5 cursor-pointer rounded-md
                hover:text-primary hover:bg-primary/10
                ${path==menu.path&&"text-primary bg-primary/10"}`}>
            <menu.icon />
            {menu.name}
          </h2>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-10 p-5 flex gap-2
      items-center 
      "> 
        <UserButton/>
        Profile
      </div>
    </div>
  );
}

export default SideNav;
