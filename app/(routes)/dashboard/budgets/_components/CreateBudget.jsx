"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { toast } from "sonner";
import db from "../../../../../utils/dbConfig";
import { Budget } from "../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import { DialogClose, DialogFooter } from "../../../../../components/ui/dialog";
function CreateBudget({ refershData}) {
  const { user } = useUser();
  const [emojiicon, setEmojiicon] = useState("😃");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const onCreateBudget = async () => {
    const result = await db
      .insert(Budget)
      .values({
        name: name,
        amount: amount,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        icon: emojiicon,
      })
      .returning({ insertId: Budget.id });
    if (result) {
      refershData()
      toast.success("Budget Created Successfully");
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className="bg-slate-100 p-10 rounded-md 
            items-center flex flex-col border-2 border-dashed 
            cursor-pointer hover:shadow-md"
          >
            <h2 className="text-3xl font-bold">+</h2>
            <h2 className="text-2xl font-bold">Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>

            <div className="mt-4">
              <Button
                variant="outline"
                className="text-3xl"
                onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              >
                {emojiicon}
              </Button>
              <div className="absolute z-20">
                {openEmojiPicker && (
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      setEmojiicon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                )}
              </div>
              <div className="mt-2">
                <h2 className="text-black font-medium my-2">Budget Name</h2>
                <Input
                  placeholder="Budget Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <h2 className="text-black font-medium my-2">Budget Amount</h2>
                <Input
                  type="number"
                  placeholder="e.g RS 5000"
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={() => onCreateBudget()}
                className="mt-5 w-full"
              >
                Create Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateBudget;
