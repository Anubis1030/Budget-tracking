"use client";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import React from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <Link href="/">
        <Image src={"./logo.svg"} alt="logo" width={100} height={100} />
      </Link>
      
      {isSignedIn ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Sign Up</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
