"use client";

import React, { memo } from "react";
import Cursor from "./Cursor";
import Path from "./layers/Path";
import { LayerType } from "@/types";
import {
  shallow,
  useOthersConnectionIds,
  useOthersMapped,
} from "@liveblocks/react/suspense";

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((id) => (
        <Cursor key={id} connectionId={id} />
      ))}
    </>
  );
};

const Drafts = () => {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      pencilColor: other.presence.penColor,
    }),
    shallow
  );

  return (
    <>
      {others.map(([key, other]) => {
        if (!other.pencilDraft) return null;

        return (
          <Path
            key={key}
            id=""
            layer={{
              points: other.pencilDraft,
              fill: other.pencilColor
                ? other.pencilColor
                : { r: 0, g: 0, b: 0 },
              x: 0,
              y: 0,
              width: 0,
              height: 0,
              type: LayerType.Path,
            }}
          />
        );
      })}
    </>
  );
};

const CursorsPresence = memo(() => {
  return (
    <>
      <Drafts />

      <Cursors />
    </>
  );
});

CursorsPresence.displayName = "CursorsPresence";

export default CursorsPresence;
