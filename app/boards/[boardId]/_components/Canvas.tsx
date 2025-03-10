"use client";

import React, { useCallback, useMemo, useState } from "react";
import Info from "./Info";
import { nanoid } from "nanoid";
import Toolbar from "./Toolbar";
import LayerPreview from "./LayerPreview";
import Participants from "./Participants";
import SelectionBox from "./SelectionBox";
import { LiveObject } from "@liveblocks/client";
import CursorsPresence from "./CursorsPresence";
import {
  getBorderColor,
  MAX_LAYERS,
  pointerEventToCursorPoint,
  resizeBounds,
} from "@/lib/utils";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStorage,
  useOthersMapped,
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
    r: 255,
    g: 255,
    b: 255,
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

  // Handle Translating or moving of layers
  const translatingSelectedLayers = useMutation(
    ({ self, storage }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) return;

      // Update layers
      const liveLayers = storage.get("layers");

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);

        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }

      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
      });
    },
    [canvasState]
  );

  // Handle Re-sizing
  const resizeSelectedLayer = useMutation(
    ({ self, storage }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) return;

      // Update Layer
      const bounds = resizeBounds({
        bounds: canvasState.intialBound,
        corner: canvasState.corner,
        point,
      });

      const liveLayers = storage.get("layers");

      const layer = liveLayers.get(self.presence.selection[0]);

      if (!layer) return;

      layer.update(bounds);
    },
    [canvasState]
  );

  // Handles when user clicks outside the layer
  const unSelectLayer = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  // To track mouse movement for every user in the board
  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCursorPoint({ e, camera });

      if (canvasState.mode === CanvasMode.Translating) {
        translatingSelectedLayers(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      }

      setMyPresence({ cursor: current });
    },
    [canvasState, camera, resizeSelectedLayer, translatingSelectedLayers]
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

      if (
        canvasState.mode === CanvasMode.Pressing ||
        canvasState.mode === CanvasMode.None
      ) {
        unSelectLayer();

        setCanvasState({
          mode: CanvasMode.None,
        });
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }

      history.resume();
    },
    [camera, canvasState, insertLayer, history, unSelectLayer]
  );

  // When user clicks outside the layer
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCursorPoint({ e, camera });

      if (canvasState.mode === CanvasMode.Inserting) return;

      setCanvasState({
        mode: CanvasMode.Pressing,
        origin: point,
      });
    },
    [camera, canvasState, setCanvasState]
  );

  const onLayerPointDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      e.stopPropagation();

      // Return if canvas mode is pencil/inserting or current selection includes layer id
      if (
        canvasState.mode === CanvasMode.Inserting ||
        canvasState.mode === CanvasMode.Pencil ||
        self.presence.selection.includes(layerId)
      ) {
        return;
      }

      history.pause();

      // get user mouse location on the canvas
      const point = pointerEventToCursorPoint({ e, camera });

      setMyPresence({ selection: [layerId] }, { addToHistory: true });

      setCanvasState({
        mode: CanvasMode.Translating,
        current: point,
      });
    },
    [camera, history, setCanvasState, canvasState]
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  const getLayerIdColors = useMemo(() => {
    const otherUsersIdsToColor: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        otherUsersIdsToColor[layerId] = getBorderColor(connectionId);
      }
    }

    return otherUsersIdsToColor;
  }, [selections]);

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, intialBound: XYWH) => {
      history.pause();

      setCanvasState({
        mode: CanvasMode.Resizing,
        intialBound,
        corner,
      });
    },
    [history]
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
        onPointerDown={onPointerDown}
      >
        <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}>
          {layerIds.map((id) => (
            <LayerPreview
              key={id}
              id={id}
              onLayerPointDown={onLayerPointDown}
              selectionColor={getLayerIdColors[id]}
            />
          ))}

          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />

          <CursorsPresence />
        </g>
      </svg>
    </div>
  );
};

export default Canvas;
