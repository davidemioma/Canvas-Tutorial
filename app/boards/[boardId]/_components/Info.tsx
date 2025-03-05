"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Hint from "@/components/Hint";
import { useQuery } from "convex/react";
import TabSeparator from "./TabSeparator";
import { Poppins } from "next/font/google";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useRenameBoard from "@/hooks/use-rename-board";
import { Button, buttonVariants } from "@/components/ui/button";
import Actions from "@/app/(dashboard)/_components/board/Actions";

type Props = {
  boardId: string;
};

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const Info = ({ boardId }: Props) => {
  const { onOpen } = useRenameBoard();

  const board = useQuery(api.board.getBoardInfo, {
    id: boardId as Id<"boards">,
  });

  if (!board) {
    return <InfoSkeleton />;
  }

  return (
    <div className="absolute top-2 left-2 bg-white flex items-center h-12 px-1.5 rounded-md shadow-md">
      <Hint label="Go to Boards" side="bottom" sideOffset={10}>
        <Link
          href="/"
          className={cn("px-2", buttonVariants({ variant: "board" }))}
        >
          <span className="text-3xl">📋</span>

          <span
            className={cn(font.className, "text-xl font-semibold text-black")}
          >
            Board
          </span>
        </Link>
      </Hint>

      <TabSeparator />

      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          className="px-2 font-normal text-base"
          variant="board"
          onClick={() => {
            onOpen({ id: board._id, title: board.title });
          }}
        >
          {board.title}
        </Button>
      </Hint>

      <TabSeparator />

      <Actions id={board._id} title={board.title} side="bottom" sideOffset={10}>
        <div>
          <Hint label="Main Menu" side="bottom" sideOffset={10}>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  );
};

export const InfoSkeleton = () => {
  return (
    <div className="absolute bg-white  top-2 left-2 flex items-center w-[300px] h-12 px-1.5 rounded-md shadow-md" />
  );
};

export default Info;
