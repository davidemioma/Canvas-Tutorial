import { useMutation, useSelf } from "@liveblocks/react/suspense";

export const useDeleteLayer = () => {
  const selections = useSelf((self) => self.presence.selection);

  return useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayers = storage.get("layers");

      const layersIds = storage.get("layersIds");

      for (const id of selections) {
        liveLayers.delete(id);

        const index = layersIds.indexOf(id);

        if (index != -1) {
          layersIds.delete(index);
        }
      }

      setMyPresence({ selection: [] }, { addToHistory: true });
    },
    [selections]
  );
};
