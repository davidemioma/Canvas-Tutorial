"use client";

import React from "react";
import useDeleteBoard from "@/hooks/use-delete-board";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ConfirmModel = () => {
  const { isOpen, onClose, title, description, disabled, onContinue } =
    useDeleteBoard();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || "Are you absolutely sure?"}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {description ||
              "This action cannot be undone. This will permanently delete your data from our servers."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={() => {
              onContinue();
            }}
            disabled={disabled}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModel;
