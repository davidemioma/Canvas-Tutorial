"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Info from "./Info";
import { nanoid } from "nanoid";
import Toolbar from "./Toolbar";
import Path from "./layers/Path";
import LayerPreview from "./LayerPreview";
import Participants from "./Participants";
import SelectionBox from "./SelectionBox";
import SelectionTools from "./SelectionTools";
import { LiveObject } from "@liveblocks/client";
import CursorsPresence from "./CursorsPresence";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import {
  findIntersectingLayersWithRectangle,
  getBorderColor,
  MAX_LAYERS,
  penPointsToPathLayer,
  pointerEventToCursorPoint,
  resizeBounds,
  SELECTION_NET_THRESHOLD,
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
  useSelf,
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

  const pencilDraft = useSelf((self) => self.presence.pencilDraft);

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

  // Triggers multi-selection
  const startMultiSelection = useCallback(
    ({ current, origin }: { current: Point; origin: Point }) => {
      // This is just a treshhold to know when to activate selection net.
      if (
        Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) >
        SELECTION_NET_THRESHOLD
      ) {
        setCanvasState({
          mode: CanvasMode.SelectionNet,
          current,
          origin,
        });
      }
    },
    []
  );

  // Handles multi-selection
  const handleMultiSelection = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();

      setCanvasState({
        mode: CanvasMode.SelectionNet,
        current,
        origin,
      });

      const ids = findIntersectingLayersWithRectangle(
        layers,
        layerIds,
        origin,
        current
      );

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  // Handle start drawing with pencil
  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );

  // Handle continue drewing with pencil
  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState]
  );

  // Handles drawing with pencil
  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");

      const { pencilDraft } = self.presence;

      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });

        return;
      }

      // Create Pencil layer.
      const id = nanoid();

      liveLayers.set(
        id,
        new LiveObject(
          penPointsToPathLayer({ points: pencilDraft, color: lastUsedColor })
        )
      );

      const liveLayersIds = storage.get("layersIds");

      liveLayersIds.push(id);

      setMyPresence({ pencilDraft: null });

      setCanvasState({ mode: CanvasMode.Pencil });
    },
    [lastUsedColor]
  );

  // To track mouse movement for every user in the board
  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCursorPoint({ e, camera });

      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection({ current, origin: canvasState.origin });
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        handleMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.Translating) {
        translatingSelectedLayers(current);
      } else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      } else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }

      setMyPresence({ cursor: current });
    },
    [
      canvasState,
      camera,
      startMultiSelection,
      handleMultiSelection,
      resizeSelectedLayer,
      translatingSelectedLayers,
      continueDrawing,
    ]
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
      } else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }

      history.resume();
    },
    [camera, canvasState, setCanvasState, insertLayer, history, unSelectLayer]
  );

  // When user clicks outside the layer
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCursorPoint({ e, camera });

      if (canvasState.mode === CanvasMode.Inserting) return;

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);

        return;
      }

      setCanvasState({
        mode: CanvasMode.Pressing,
        origin: point,
      });
    },
    [camera, canvasState, startDrawing, setCanvasState]
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

  // To prevent un-neccessary scrolling when colaborating.
  useDisableScrollBounce();

  // Shortcut to delete layers
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
          }

          break;
        }
        default:
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [history]);

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

      <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />

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

          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current && (
              <rect
                className="fill-blue-500/50 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}

          <CursorsPresence />

          {pencilDraft && pencilDraft.length > 0 && (
            <Path
              id=""
              layer={{
                points: pencilDraft,
                fill: lastUsedColor,
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                type: LayerType.Path,
              }}
            />
          )}
        </g>
      </svg>
    </div>
  );
};

export default Canvas;
