"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BoardType } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { Star } from "lucide-react";

type Props = {
  board: BoardType;
};

const BoardCard = ({ board }: Props) => {
  const { userId } = useAuth();

  const authorLabel = board.authorId === userId ? "You" : board.authorName;

  const createdAtLable = formatDistanceToNow(board._creationTime, {
    addSuffix: true,
  });

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
        </div>

        <div className="relative bg-white p-3">
          <p className="max-w-[calc(100%-20px)] truncate text-[13px]">
            {board.title}
          </p>

          <p className="text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {authorLabel}, {createdAtLable}
          </p>

          <button>
            <Star />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default BoardCard;
