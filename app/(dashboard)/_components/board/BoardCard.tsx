"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import Actions from "./Actions";
import { cn } from "@/lib/utils";
import { BoardType } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Star } from "lucide-react";
import useApiMutation from "@/hooks/use-api-mutation";

type Props = {
  board: BoardType;
};

const BoardCard = ({ board }: Props) => {
  const { userId } = useAuth();

  const authorLabel = board.authorId === userId ? "You" : board.authorName;

  const createdAtLable = formatDistanceToNow(board._creationTime, {
    addSuffix: true,
  });

  const isFavourite = board.isFavourite;

  const { mutation, isPending } = useApiMutation(api.board.favoriteAction);

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    mutation({
      id: board._id,
      orgId: board.orgId,
    }).catch((err) => {
      console.error("Favourites Actions Error: ", err);

      toast.error("Failed favourites action.");
    });
  };

  return (
    <div className="group aspect-[100/127] flex flex-col border rounded-lg overflow-hidden">
      <Link href={`/boards/${board._id}`} className="flex-1">
        <div className="relative w-full h-full bg-amber-50">
          <Image
            className="object-fit"
            src={board.imageUrl}
            fill
            alt={board.title}
          />

          <div className="absolute z-10 top-0 w-full h-full opacity-0 group-hover:opacity-50 transition-opacity duration-150 bg-black" />

          <Actions id={board._id} title={board.title} side="right">
            <button
              className="absolute z-20 top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isPending}
            >
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </Actions>
        </div>
      </Link>

      <div className="relative bg-white p-3">
        <p className="max-w-[calc(100%-20px)] truncate text-[13px]">
          {board.title}
        </p>

        <p className="text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {authorLabel}, {createdAtLable}
        </p>

        <button
          className="absolute top-3 right-3 z-10 text-muted-foreground hover:text-[gold] opacity-0 group-hover:opacity-100 transition-opacity duration-150 disabled:opacity-75"
          disabled={isPending}
          onClick={onClick}
        >
          <Star
            className={cn("w-5 h-5", isFavourite && "fill-[gold] text-[gold]")}
          />
        </button>
      </div>
    </div>
  );
};

export const BoardCardSkeleton = () => {
  return (
    <div className="aspect-[100/127] rounded-lg overflow-hidden">
      <Skeleton className="w-full h-full" />
    </div>
  );
};

export default BoardCard;
