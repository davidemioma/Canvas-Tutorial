import React from "react";
import Hint from "@/components/Hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  src?: string;
  name?: string;
  fallback?: string;
  borderColor?: string;
};

const UserAvatar = ({ src, name, fallback, borderColor }: Props) => {
  return (
    <Hint label={name || "Teammate"} side="bottom" sideOffset={10}>
      <Avatar
        className="w-8 h-8 border-2 overflow-hidden"
        style={{
          borderColor,
        }}
      >
        <AvatarImage src={src} alt={name} />

        <AvatarFallback className="text-xs font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
    </Hint>
  );
};

export default UserAvatar;
