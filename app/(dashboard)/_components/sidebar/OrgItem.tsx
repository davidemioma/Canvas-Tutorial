"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Hint from "@/components/Hint";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  id: string;
  name: string;
  imageUrl: string;
};

const OrgItem = ({ id, name, imageUrl }: Props) => {
  const { organization } = useOrganization();

  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const onClick = () => {
    if (!setActive) return;

    setActive({ organization: id });
  };

  return (
    <div className="w-full aspect-square">
      <Hint label={name} side="right" align="start" sideOffset={15}>
        <Avatar
          className={cn(
            "rounded-md opacity-75 hover:opacity-100 transition cursor-pointer overflow-hidden",
            isActive && "opacity-100"
          )}
          onClick={onClick}
        >
          <AvatarImage src={imageUrl} />

          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      </Hint>
    </div>
  );
};

export default OrgItem;
