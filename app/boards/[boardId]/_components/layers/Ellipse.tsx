"use client";

import React from "react";
import { colorToCss } from "@/lib/utils";
import { Ellipselayer } from "@/types";

type Props = {
  id: string;
  layer: Ellipselayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

const Ellipse = ({ id, layer, onPointerDown, selectionColor }: Props) => {
  const { x, y, width, height, fill } = layer;

  return (
    <ellipse
      className="drop-shadow-md"
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onPointerDown={(e) => onPointerDown(e, id)}
      cx={width / 2}
      cy={height / 2}
      rx={width / 2}
      ry={height / 2}
      strokeWidth={1}
      fill={colorToCss(fill) ?? "#000"}
      stroke={selectionColor ?? "transparent"}
    />
  );
};

export default Ellipse;
