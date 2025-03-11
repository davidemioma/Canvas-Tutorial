"use client";

import React, { memo } from "react";
import Hint from "@/components/Hint";
import { Camera, Color } from "@/types";
import ColorPicker from "./ColorPicker";
import { Button } from "@/components/ui/button";
import { useDeleteLayer } from "@/hooks/use-delete-layers";
import { useLayerPostion } from "@/hooks/use-layer-position";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";
import { useMutation, useSelf } from "@liveblocks/react/suspense";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";

type Props = {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
};

const SelectionTools = memo(({ camera, setLastUsedColor }: Props) => {
  const deleteLayers = useDeleteLayer();

  const { sendToBack, moveToFront } = useLayerPostion();

  // get current layers
  const selections = useSelf((self) => self.presence.selection);

  const selectionsBounds = useSelectionBounds();

  const setLayerColor = useMutation(
    ({ storage }, fill: Color) => {
      const liveLayers = storage.get("layers");

      setLastUsedColor(fill);

      selections.forEach((id) => {
        liveLayers.get(id)?.set("fill", fill);
      });
    },
    [selections, setLastUsedColor]
  );

  if (!selectionsBounds) return null;

  const x = selectionsBounds.width / 2 + selectionsBounds.x + camera.x;

  const y = selectionsBounds.y + camera.y;

  return (
    <div
      className="absolute bg-white flex p-3 border rounded-xl shadow-sm select-none"
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
      }}
    >
      <ColorPicker onChange={setLayerColor} />

      <div className="flex flex-col items-center justify-center gap-0.5">
        <Hint label="Bring To Front">
          <Button variant="board" size="icon" onClick={moveToFront}>
            <BringToFront className="w-5 h-5" />
          </Button>
        </Hint>

        <Hint label="Send To back" side="bottom">
          <Button variant="board" size="icon" onClick={sendToBack}>
            <SendToBack className="w-5 h-5" />
          </Button>
        </Hint>
      </div>

      <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
        <Hint label="Delete">
          <Button variant="board" size="icon" onClick={deleteLayers}>
            <Trash2 className="w-5 h-5" />
          </Button>
        </Hint>
      </div>
    </div>
  );
});

SelectionTools.displayName = "SelectionTools";

export default SelectionTools;
