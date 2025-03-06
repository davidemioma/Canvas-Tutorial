"use client";

import React from "react";
import UserAvatar from "./UserAvatar";
import { getBorderColor } from "@/lib/utils";
import { useOthers, useSelf } from "@liveblocks/react/suspense";

const MAX_SHOWN_USERS = 1;

const Participants = () => {
  const currentUser = useSelf();

  const otherUsers = useOthers();

  const hasMoreUsers = otherUsers.length > MAX_SHOWN_USERS;

  return (
    <div className="absolute top-2 right-2 bg-white flex items-center h-12 px-1.5 rounded-md shadow-md">
      <div className="flex gap-2">
        {otherUsers.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => (
          <UserAvatar
            key={connectionId}
            src={info.picture}
            name={info.name}
            fallback={info.name[0] || "T"}
            borderColor={getBorderColor(connectionId)}
          />
        ))}

        {currentUser && (
          <UserAvatar
            src={currentUser.info.picture}
            name={`${currentUser.info.name} (You)`}
            fallback={currentUser.info.name[0]}
            borderColor={getBorderColor(currentUser.connectionId)}
          />
        )}

        {hasMoreUsers && (
          <UserAvatar
            src={`${otherUsers.length - MAX_SHOWN_USERS} more`}
            fallback={`+${otherUsers.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  );
};

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute top-2 right-2 bg-white flex items-center w-[300px] h-12 px-1.5 rounded-md shadow-md" />
  );
};

export default Participants;
