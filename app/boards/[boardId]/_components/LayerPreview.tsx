"use client";

import React, { memo } from "react";
import { LayerType } from "@/types";
import Rectangle from "./layers/Rectangle";
import { useStorage } from "@liveblocks/react/suspense";

type Props = {
  id: string;
  onLayerPointDown: ({ e, id }: { e: React.PointerEvent; id: string }) => void;
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
      return <div>Ellipse</div>;
    case LayerType.Text:
      return <div>Text</div>;
    case LayerType.Note:
      return <div>Note</div>;
    default:
      console.warn("Invalid layer type");

      return null;
  }
});

LayerPreview.displayName = "LayerPreview";

export default LayerPreview;
