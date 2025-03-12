"use client";

import React from "react";
import { Textlayer } from "@/types";
import { Kalam } from "next/font/google";
import { useMutation } from "@liveblocks/react/suspense";
import { calculateFontSize, cn, colorToCss } from "@/lib/utils";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

type Props = {
  id: string;
  layer: Textlayer;
  onPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

const Text = ({ id, layer, onPointerDown, selectionColor }: Props) => {
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
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
      }}
    >
      <ContentEditable
        className={cn(
          font.className,
          "w-full h-full flex items-center justify-center text-center drop-shadow-md outline-none"
        )}
        style={{
          color: fill ? colorToCss(fill) : "#000",
          fontSize: calculateFontSize({ width, height }),
        }}
        html={value || "Text"}
        onChange={handleUpdateContent}
      />
    </foreignObject>
  );
};

export default Text;
