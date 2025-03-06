"use client";

import React, { useState } from "react";
import Info from "./Info";
import Toolbar from "./Toolbar";
import Participants from "./Participants";
import CursorsPresence from "./CursorsPresence";
import { Camera, CanvasMode, CanvasState } from "@/types";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
} from "@liveblocks/react/suspense";

type Props = {
  boardId: string;
};

const Canvas = ({ boardId }: Props) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

  const history = useHistory();

  const canUndo = useCanUndo();

  const canRedo = useCanRedo();

  const onWheel;

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = { x: 0, y: 0 };

      setMyPresence({ cursor: current });
    },
    []
  );

  return (
    <div className="relative bg-neutral-100 w-full h-full touch-none">
      <Info boardId={boardId} />

      <Participants />

      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        redo={history.redo}
        undo={history.undo}
      />

      <svg className="w-screen h-screen">
        <CursorsPresence />
      </svg>
    </div>
  );
};

export default Canvas;
