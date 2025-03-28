"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "../../components/ui/button";

function Hero() {
  const { isSignedIn } = useUser();

  return (
    <section className="bg-gray-50 flex items-center flex-col"> 
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Manage your Expense
            <strong className="font-extrabold text-primary sm:block">
              {" "}
              Control your Budget
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Start Creating your Budget and Control your Expenses.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {isSignedIn ? (
              <Link
                className="block w-full rounded-sm bg-primary px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-300 focus:ring-3 focus:outline-hidden sm:w-auto"
                href="/dashboard"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  className="block w-full rounded-sm bg-primary px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-300 focus:ring-3 focus:outline-hidden sm:w-auto"
                  href="/sign-up"
                >
                  Sign Up
                </Link>
                <Link
                  className="block w-full rounded-sm bg-white px-12 py-3 text-sm font-medium text-primary border border-primary shadow-sm hover:bg-gray-100 focus:ring-3 focus:outline-hidden sm:w-auto"
                  href="/sign-in"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <Image 
        src={"/dashboard.png"} 
        alt="dashboard" 
        width={1000} 
        height={700} 
        className="-mt-9  mb-10 rounded-xl border-2"
      />
    </section>
  );
}

export default Hero;
