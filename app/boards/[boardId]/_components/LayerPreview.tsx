"use client";

import React, { memo } from "react";
import Path from "./layers/Path";
import Text from "./layers/Text";
import Note from "./layers/Note";
import { LayerType } from "@/types";
import Ellipse from "./layers/Ellipse";
import Rectangle from "./layers/Rectangle";
import { useStorage } from "@liveblocks/react/suspense";

type Props = {
  id: string;
  onLayerPointDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
};

const LayerPreview = memo(({ id, onLayerPointDown, selectionColor }: Props) => {
  const layer = useStorage((root) => root.layers.get(id));

  if (!layer) return null;

  switch (layer.type) {
    case LayerType.Rectangle:
      return (
        <Rectangle
          id={id}
          layer={layer}
          onPointerDown={onLayerPointDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Ellipse:
      return (
        <Ellipse
          id={id}
          layer={layer}
          onPointerDown={onLayerPointDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Text:
      return (
        <Text
          id={id}
          layer={layer}
          onPointerDown={onLayerPointDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Note:
      return (
        <Note
          id={id}
          layer={layer}
          onPointerDown={onLayerPointDown}
          selectionColor={selectionColor}
        />
      );
    case LayerType.Path:
      return (
        <Path
          id={id}
          layer={layer}
          onPointerDown={onLayerPointDown}
          stroke={selectionColor}
        />
      );
    default:
      console.warn("Invalid layer type");

      return null;
  }
});

LayerPreview.displayName = "LayerPreview";

export default LayerPreview;
