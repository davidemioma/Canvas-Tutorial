"use client";

import React from "react";
import { cn } from "@/lib/utils";
import EmptyState from "./EmptyState";
import { Clipboard, SearchX, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
};

const BoardList = ({ orgId, query }: Props) => {
  const data = [];

  if (data.length === 0 && query.search) {
    return (
      <EmptyState
        message="No result found!"
        subText="Try searching for something else."
      >
        <SearchX className="w-32 h-32 text-red-500" />
      </EmptyState>
    );
  }

  if (data.length === 0 && query.favorites) {
    return (
      <EmptyState
        message="No favorites boards!"
        subText="Try adding a board to favorites."
      >
        <Star className="w-32 h-32 text-red-500" />
      </EmptyState>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        message="No Boards available!"
        subText="Create your first board."
        footer={
          <div className="mt-6">
            <Dialog>
              <DialogTrigger className={cn(buttonVariants({ size: "lg" }))}>
                Create Board
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>

                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        }
      >
        <Clipboard className="w-32 h-32 text-red-500" />
      </EmptyState>
    );
  }

  return (
    <div>
      BoardList {orgId} {JSON.stringify(query)}
    </div>
  );
};

export default BoardList;
