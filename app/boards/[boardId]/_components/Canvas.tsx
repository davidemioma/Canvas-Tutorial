"use client";

import React from "react";
import Info from "./Info";
import Toolbar from "./Toolbar";
import Participants from "./Participants";

type Props = {
  boardId: string;
};

const Canvas = ({ boardId }: Props) => {
  return (
    <div className="relative bg-neutral-100 w-full h-full touch-none">
      <Info />

      <Participants />

      <Toolbar />

      {boardId}
    </div>
  );
};

export default Canvas;
