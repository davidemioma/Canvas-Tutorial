"use client";

import React from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { api } from "@/convex/_generated/api";
import BtnSpinner from "@/components/BtnSpinner";
import useApiMutation from "@/hooks/use-api-mutation";

type Props = {
  orgId: string;
};

const NewBoard = ({ orgId }: Props) => {
  const { mutation, isPending } = useApiMutation(api.board.createBoard);

  const onClick = () => {
    mutation({
      orgId,
      title: "Untitled",
    })
      .then(() => {
        toast.success("Board Created!");
      })
      .catch((err) => {
        console.error("Create Board Err: ", err);

        toast.error("Failed to create board!");
      });
  };

  return (
    <button
      className="col-span-1 aspect-[100/127] flex flex-col items-center justify-center py-6 border rounded-lg overflow-hidden disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={isPending}
    >
      {isPending ? (
        <BtnSpinner className="w-7 h-7" />
      ) : (
        <>
          <Plus className="w-12 h-12 stroke-1" />

          <p className="text-sm font-light text-muted-foreground">
            Create Board
          </p>
        </>
      )}
    </button>
  );
};

export default NewBoard;
