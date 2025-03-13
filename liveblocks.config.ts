// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data

import { Color, Layer } from "./types";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";

declare global {
  interface Liveblocks {
    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        name: string;
        picture: string;
      };
    };
    Presence: {
      cursor: { x: number; y: number } | null;
      selection: string[];
      pencilDraft: [x: number, y: number, pressure: number][] | null;
      penColor: Color | null;
    };
    Storage: {
      layers: LiveMap<string, LiveObject<Layer>>;
      layersIds: LiveList<string>;
    };
  }
}

export {};
