"use client";

import React from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { api } from "@/convex/_generated/api";
import useRenameBoard from "@/hooks/use-rename-board";
import useApiMutation from "@/hooks/use-api-mutation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RenameModels = () => {
  const { isOpen, onClose, title, setTitle, id } = useRenameBoard();

  const { mutation, isPending } = useApiMutation(api.board.updateBoard);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutation({
      id,
      title,
    })
      .then(() => {
        toast.success("Board Updated!");

        onClose();
      })
      .catch((err) => {
        console.error("Renaming Board err: ", err);

        toast.error("Unable to rename board!");
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Board title</DialogTitle>

          <DialogDescription>Change the title of your board.</DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={onSubmit}>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            disabled={isPending}
            placeholder="Board title"
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameModels;
