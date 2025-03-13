import { useMutation, useSelf } from "@liveblocks/react/suspense";

export const useLayerPostion = () => {
  const selections = useSelf((self) => self.presence.selection);

  const moveToFront = useMutation(
    ({ storage }) => {
      const layersIds = storage.get("layersIds");

      const arr = layersIds.toImmutable();

      const indicies: number[] = [];

      for (let i = 0; i < arr.length; i++) {
        if (selections.includes(arr[i])) {
          indicies.push(i);
        }
      }

      for (let i = indicies.length - 1; i >= 0; i--) {
        layersIds.move(indicies[i], arr.length - 1 - (indicies.length - 1 - i));
      }
    },
    [selections]
  );

  const sendToBack = useMutation(
    ({ storage }) => {
      const layersIds = storage.get("layersIds");

      const arr = layersIds.toImmutable();

      const indicies: number[] = [];

      for (let i = 0; i < arr.length; i++) {
        if (selections.includes(arr[i])) {
          indicies.push(i);
        }
      }

      for (let i = 0; i < indicies.length; i++) {
        layersIds.move(indicies[i], i);
      }
    },
    [selections]
  );

  return { moveToFront, sendToBack };
};
