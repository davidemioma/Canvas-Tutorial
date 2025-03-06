"use client";

import React from "react";
import Hint from "@/components/Hint";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  Icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
};

const ToolBtn = ({ label, Icon, onClick, isActive, isDisabled }: Props) => {
  return (
    <Hint label={label} side="right" sideOffset={14}>
      <Button
        variant={isActive ? "boardActive" : "board"}
        size="icon"
        disabled={isDisabled}
        onClick={onClick}
      >
        <Icon />
      </Button>
    </Hint>
  );
};

export default ToolBtn;
