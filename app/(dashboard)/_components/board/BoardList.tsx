"use client";

import React from "react";
import { toast } from "sonner";
import NewBoard from "./NewBoard";
import EmptyState from "./EmptyState";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import useApiMutation from "@/hooks/use-api-mutation";
import { Clipboard, SearchX, Star } from "lucide-react";
import BoardCard, { BoardCardSkeleton } from "./BoardCard";

type Props = {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
};

const BoardList = ({ orgId, query }: Props) => {
  const data = useQuery(api.boards.getBoards, {
    orgId,
  });

  const { isPending, mutation } = useApiMutation(api.board.createBoard);

  if (data === undefined) {
    return (
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">
          {query.favorites ? "Favorite" : "Team"} Boards
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 mt-8 pb-10">
          {new Array(6).fill("").map((_, i) => (
            <BoardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (data?.length === 0 && query.search) {
    return (
      <EmptyState
        message="No result found!"
        subText="Try searching for something else."
      >
        <SearchX className="w-32 h-32 text-red-500" />
      </EmptyState>
    );
  }

  if (data?.length === 0 && query.favorites) {
    return (
      <EmptyState
        message="No favorites boards!"
        subText="Try adding a board to favorites."
      >
        <Star className="w-32 h-32 text-red-500" />
      </EmptyState>
    );
  }

  if (data?.length === 0) {
    return (
      <EmptyState
        message="No Boards available!"
        subText="Create your first board."
        footer={
          <div className="mt-6">
            <Button
              onClick={() => {
                if (!orgId) return;

                mutation({
                  orgId,
                  title: "Untitled",
                })
                  .then(() => {
                    toast.success("Board Created!");
                  })
                  .catch((err) => {
                    console.error("Error creating board", err);

                    toast.error("Failed to create board");
                  });
              }}
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Board"}
            </Button>
          </div>
        }
      >
        <Clipboard className="w-32 h-32 text-red-500" />
      </EmptyState>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold">
        {query.favorites ? "Favorite" : "Team"} Boards
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 mt-8 pb-10">
        <NewBoard orgId={orgId} />

        {data.map((board) => (
          <BoardCard key={board._id} board={board} />
        ))}
      </div>
    </div>
  );
};

export default BoardList;
