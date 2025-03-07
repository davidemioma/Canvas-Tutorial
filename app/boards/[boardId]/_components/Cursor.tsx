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
      width={name.length * 10 + 24}
    >
      <MousePointer2
        className="w-5 h-5"
        style={{
          fill: getBorderColor(connectionId),
          color: getBorderColor(connectionId),
        }}
      />

      <div
        className="absolute left-5 px-1.5 py-0.5 text-white text-xs font-semibold rounded-md"
        style={{ backgroundColor: getBorderColor(connectionId) }}
      >
        {name}
      </div>
    </foreignObject>
  );
});

Cursor.displayName = "Cursor";

export default Cursor;
