"use client";

import React from "react";
import { Pathlayer } from "@/types";
import getStroke from "perfect-freehand";
import { colorToCss, getSvgPathFromStroke } from "@/lib/utils";

type Props = {
  id: string;
  layer: Pathlayer;
  onPointerDown?: (e: React.PointerEvent, layerId: string) => void;
  stroke?: string;
};

const Path = ({ id, layer, onPointerDown, stroke }: Props) => {
  const { x, y, points, fill } = layer;

  return (
    <path
      className="drop-shadow-md"
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onPointerDown={(e) => {
        if (!onPointerDown) return;

        onPointerDown(e, id);
      }}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 16,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )}
      x={0}
      y={0}
      fill={fill ? colorToCss(fill) : "#000"}
      stroke={stroke}
      strokeWidth={1}
    />
  );
};

export default Path;
