"use client";

import React from "react";
import { colorToCss } from "@/lib/utils";
import { Rectangelelayer } from "@/types";

type Props = {
  id: string;
  layer: Rectangelelayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

const Rectangle = ({ id, layer, onPointerDown, selectionColor }: Props) => {
  const { x, y, width, height, fill } = layer;

  return (
    <rect
      className="shadow-md"
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onPointerDown={(e) => onPointerDown(e, id)}
      x={0}
      y={0}
      width={width}
      height={height}
      strokeWidth={1}
      fill={colorToCss(fill) ?? "#000"}
      stroke={selectionColor ?? "transparent"}
    />
  );
};

export default Rectangle;
