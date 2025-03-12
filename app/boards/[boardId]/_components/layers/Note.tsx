"use client";

import React from "react";
import { Notelayer } from "@/types";
import { Kalam } from "next/font/google";
import { useMutation } from "@liveblocks/react/suspense";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import {
  calculateFontSize,
  cn,
  colorToCss,
  getConstractingTextColor,
} from "@/lib/utils";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

type Props = {
  id: string;
  layer: Notelayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

const Note = ({ id, layer, onPointerDown, selectionColor }: Props) => {
  const { x, y, width, height, fill, value } = layer;

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const layers = storage.get("layers");

    layers.get(id)?.set("value", newValue);
  }, []);

  const handleUpdateContent = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      className="shadow-md drop-shadow-xl"
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: fill ? colorToCss(fill) : "#000",
      }}
    >
      <ContentEditable
        className={cn(
          font.className,
          "w-full h-full flex items-center justify-center text-center outline-none"
        )}
        style={{
          color: getConstractingTextColor(fill),
          fontSize: calculateFontSize({ width, height, isNote: true }),
        }}
        html={value || "Text"}
        onChange={handleUpdateContent}
      />
    </foreignObject>
  );
};

export default Note;
