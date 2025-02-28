"use client";

import React from "react";
import { toast } from "sonner";
import { Link2, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import useApiMutation from "@/hooks/use-api-mutation";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  id: string;
  title: string;
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
};

const Actions = ({ children, id, title, side, sideOffset }: Props) => {
  const { mutation, isPending } = useApiMutation(api.board.deleteBoard);

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/boards/${id}`)
      .then(() => {
        toast.success("Link Copied!");
      })
      .catch(() => {
        toast.error("Failed to copy link!");
      });
  };

  const onDelete = () => {
    mutation({
      id,
    })
      .then(() => {
        toast.success("Board Deleted!");
      })
      .catch((err) => {
        console.error("Delete Board Err: ", err);

        toast.error("Failed to delete board!");
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-60"
        side={side}
        sideOffset={sideOffset}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DropdownMenuItem className="p-3 cursor-pointer" onClick={onCopyLink}>
          <Link2 className="w-4 h-4 mr-1" />
          Copy Board Link
        </DropdownMenuItem>

        <DropdownMenuItem
          className="p-3 cursor-pointer"
          disabled={isPending}
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
