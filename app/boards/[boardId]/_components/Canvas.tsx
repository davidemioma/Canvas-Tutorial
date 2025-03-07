"use client";

import React, { useCallback, useState } from "react";
import Info from "./Info";
import { nanoid } from "nanoid";
import Toolbar from "./Toolbar";
import LayerPreview from "./LayerPreview";
import Participants from "./Participants";
import { LiveObject } from "@liveblocks/client";
import CursorsPresence from "./CursorsPresence";
import { MAX_LAYERS, pointerEventToCursorPoint } from "@/lib/utils";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
} from "@/types";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStorage,
} from "@liveblocks/react/suspense";

type Props = {
  boardId: string;
};

const Canvas = ({ boardId }: Props) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  // We use layerIds to keep track of all displays on the canvas
  const layerIds = useStorage((root) => root.layersIds);

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

  // keep track of last used color.
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  const history = useHistory();

  const canUndo = useCanUndo();

  const canRedo = useCanRedo();

  // To make the canvas feel like an infinite scroll board
  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((prev) => ({
      x: prev.x - e.deltaX,
      y: prev.y - e.deltaY,
    }));
  }, []);

  // To track mouse movement for every user in the board
  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCursorPoint({ e, camera });

      setMyPresence({ cursor: current });
    },
    []
  );

  // To track the movement, if it's ouside the canvas
  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  // Inserting tools (Rectangle, Ellipse, Text, Note)
  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Rectangle
        | LayerType.Ellipse
        | LayerType.Text
        | LayerType.Note,
      position: Point
    ) => {
      // Get all layers
      const liveLayers = storage.get("layers");

      // Check if liveLayers is more than the max layer count
      if (liveLayers.size >= MAX_LAYERS) return;

      // Create a new layer.
      const liveLayersIds = storage.get("layersIds");

      const newLayer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        width: 100,
        height: 100,
        fill: lastUsedColor,
      });

      const layerId = nanoid();

      liveLayersIds.push(layerId);

      liveLayers.set(layerId, newLayer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });

      setCanvasState({
        mode: CanvasMode.None,
      });
    },
    [lastUsedColor]
  );

  // Handles Inserting
  const onPointerUp = useMutation(
    ({}, e: React.PointerEvent) => {
      const point = pointerEventToCursorPoint({ e, camera });

      console.log({ point, mode: canvasState.mode });

      if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }

      history.resume();
    },
    [camera, canvasState, insertLayer, history]
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

      <svg
        className="w-screen h-screen"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
      >
        <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}>
          {layerIds.map((id) => (
            <LayerPreview
              key={id}
              id={id}
              onLayerPointDown={() => {}}
              selectionColor="#000000"
            />
          ))}

          <CursorsPresence />
        </g>
      </svg>
    </div>
  );
};

export default Canvas;
