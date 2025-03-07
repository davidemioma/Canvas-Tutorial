"use client";

import React from "react";
import { Rectangelelayer } from "@/types";

type Props = {
  id: string;
  layer: Rectangelelayer;
  onPointerDown: ({ e, id }: { e: React.PointerEvent; id: string }) => void;
  selectionColor?: string;
};

const Rectangle = ({ id, layer, onPointerDown, selectionColor }: Props) => {
  const { x, y, width, height, fill } = layer;

  return (
    <rect
      className="shadow-md"
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onPointerDown={(e) => onPointerDown({ e, id })}
      x={0}
      y={0}
      width={width}
      height={height}
      strokeWidth={1}
      fill={`rgb(${fill.r},${fill.g},${fill.b})`}
      stroke="transparent"
    />
  );
};

export default Rectangle;
