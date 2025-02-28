"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Actions from "./Actions";
import { cn } from "@/lib/utils";
import { BoardType } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Star } from "lucide-react";

type Props = {
  board: BoardType;
};

const BoardCard = ({ board }: Props) => {
  const { userId } = useAuth();

  const authorLabel = board.authorId === userId ? "You" : board.authorName;

  const createdAtLable = formatDistanceToNow(board._creationTime, {
    addSuffix: true,
  });

  const isFavourite = false;

  return (
    <Link href={`/boards/${board._id}`}>
      <div className="group aspect-[100/127] flex flex-col border rounded-lg overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image
            className="object-fit"
            src={board.imageUrl}
            fill
            alt={board.title}
          />

          <div className="absolute z-10 top-0 w-full h-full opacity-0 group-hover:opacity-50 transition-opacity duration-150 bg-black" />

          <Actions id={board._id} title={board.title} side="right">
            <button className="absolute z-20 top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </Actions>
        </div>

        <div className="relative bg-white p-3">
          <p className="max-w-[calc(100%-20px)] truncate text-[13px]">
            {board.title}
          </p>

          <p className="text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {authorLabel}, {createdAtLable}
          </p>

          <button
            className="absolute top-1 right-1 text-muted-foreground hover:text-[gold] opacity-0 group-hover:opacity-100 transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-75"
            disabled={true}
            onClick={() => {}}
          >
            <Star
              className={cn(
                "w-4 h-4",
                isFavourite && "fill-[gold] text-[gold]"
              )}
            />
          </button>
        </div>
      </div>
    </Link>
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
