"use client";
import React, { useState } from 'react'
import { Button } from "../../../../../components/ui/button"
import { PenBox } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "../../../../../components/ui/dialog"
import { Input } from "../../../../../components/ui/input"
import EmojiPicker from "emoji-picker-react"
import { toast } from "sonner"
import db from "../../../../../utils/dbConfig"
import { Budget } from "../../../../../utils/schema"
import { eq } from "drizzle-orm"

function EditBudget({ budgetId, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [emojiicon, setEmojiicon] = useState("😃");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const getBudgetDetails = async () => {
    try {
      const result = await db
        .select()
        .from(Budget)
        .where(eq(Budget.id, budgetId));
      
      if (result && result.length > 0) {
        setName(result[0].name);
        setAmount(result[0].amount);
        setEmojiicon(result[0].icon || "😃");
      }
    } catch (error) {
      console.error("Error fetching budget details:", error);
      toast.error("Failed to load budget details");
    }
  };

  const updateBudget = async () => {
    try {
      setLoading(true);
      const result = await db
        .update(Budget)
        .set({
          name: name,
          amount: amount,
          icon: emojiicon
        })
        .where(eq(Budget.id, budgetId))
        .returning({ updated: Budget.id });
      
      if (result) {
        toast.success("Budget updated successfully");
        refreshData && refreshData();
        setOpen(false); // Close the dialog after successful update
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) {
        getBudgetDetails();
      }
    }}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 bg-[#00246B] text-white hover:bg-[#00246B]/90 rounded-md" variant="default">
          <PenBox />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>

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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-2">
              <h2 className="text-black font-medium my-2">Budget Amount</h2>
              <Input
                type="number"
                placeholder="e.g RS 5000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              disabled={!(name && amount) || loading}
              onClick={() => updateBudget()}
              className="mt-5 w-full"
            >
              {loading ? "Updating..." : "Update Budget"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditBudget