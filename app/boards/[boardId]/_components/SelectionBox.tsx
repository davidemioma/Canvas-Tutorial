"use client";

import React from "react";
import { LayerType, Side, XYWH } from "@/types";
import { useStorage, useSelf } from "@liveblocks/react/suspense";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";

type Props = {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
};

const HANDLE_WIDTH = 8;

const SelectionBox = ({ onResizeHandlePointerDown }: Props) => {
  const soleLayerId = useSelf((me) =>
    me.presence.selection.length === 1 ? me.presence.selection[0] : null
  );

  // Show the resize handles bar
  const showHandles = useStorage(
    (root) =>
      soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
  );

  const bounds = useSelectionBounds();

  if (!bounds) return null;

  return (
    <>
      <rect
        className="fill-transparent stroke-1 stroke-blue-500 pointer-events-none"
        style={{ transform: `translate(${bounds.x}px, ${bounds.y}px)` }}
        x={0}
        y={0}
        width={bounds.width}
        height={bounds.height}
      />

      {showHandles && (
        <>
          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nwse-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();

              // Add resize handler
            }}
          />

          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ns-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();

              // Add resize handler
            }}
          />

          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nesw-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();

              // Add resize handler
            }}
          />

          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ew-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();

              // Add resize handler
            }}
          />

          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nwse-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();

              // Add resize handler
            }}
          />

          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ns-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();

              // Add resize handler
            }}
          />

          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "nesw-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();

              // Add resize handler
            }}
          />

          <rect
            className="fill-white stroke-1 stroke-blue-500"
            x={0}
            y={0}
            style={{
              cursor: "ew-resize",
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH}px)`,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();

              // Add resize handler
            }}
          />
        </>
      )}
    </>
  );
};

export default SelectionBox;
