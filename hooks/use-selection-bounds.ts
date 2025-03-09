import { Layer, XYWH } from "@/types";
import { shallow, useSelf, useStorage } from "@liveblocks/react/suspense";

const boundingBox = (layers: Layer[]): XYWH | null => {
  const firstLayer = layers[0];

  if (!firstLayer) return null;

  let left = firstLayer.x;

  let right = firstLayer.x + firstLayer.width;

  let top = firstLayer.y;

  let bottom = firstLayer.y + firstLayer.height;

  for (let i = 0; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];

    if (left > x) {
      left = x;
    }

    if (right < x + width) {
      right = x + width;
    }

    if (top > y) {
      top = y;
    }

    if (bottom < y + height) {
      bottom = y + height;
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
};

export const useSelectionBounds = () => {
  const selections = useSelf((me) => me.presence.selection);

  return useStorage((root) => {
    const selectedLayers = selections
      ?.map((layerId) => root.layers.get(layerId)!)
      .filter(Boolean);

    return boundingBox(selectedLayers);
  }, shallow);
};
