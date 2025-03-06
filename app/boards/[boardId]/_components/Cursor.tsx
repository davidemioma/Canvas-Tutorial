"use client";

import React, { memo } from "react";
import { MousePointer2 } from "lucide-react";
import { getBorderColor } from "@/lib/utils";
import { useOther } from "@liveblocks/react/suspense";

type Props = {
  connectionId: number;
};

const Cursor = memo(({ connectionId }: Props) => {
  const info = useOther(connectionId, (user) => user.info);

  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  const name = info.name || "Teammate";

  if (!cursor) {
    return null;
  }

  return (
    <foreignObject
      className="relative drop-shadow-md"
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}
      height={50}
      width={50}
    >
      <MousePointer2
        className="w-5 h-5"
        style={{
          fill: getBorderColor(connectionId),
          color: getBorderColor(connectionId),
        }}
      />
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";

export default Cursor;
