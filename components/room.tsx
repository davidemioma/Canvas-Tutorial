"use client";

import { ReactNode } from "react";
import { Layer } from "@/types";
import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

type Props = {
  children: ReactNode;
  roomId: string;
  fallback: NonNullable<React.ReactNode> | null;
};

export const Room = ({ children, roomId, fallback }: Props) => {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth" throttle={16}>
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selection: [],
        }}
        initialStorage={{
          layers: new LiveMap<string, LiveObject<Layer>>(),
          layersIds: new LiveList([]),
        }}
      >
        <ClientSideSuspense fallback={fallback}>{children}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
