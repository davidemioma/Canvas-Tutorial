"use client";

import React from "react";
import { InfoSkeleton } from "./Info";
import { Loader } from "lucide-react";
import { ToolbarSkeleton } from "./Toolbar";
import { ParticipantsSkeleton } from "./Participants";

const CanvasLoading = () => {
  return (
    <div className="relative w-full h-screen bg-neutral-100 flex items-center justify-center touch-none">
      <Loader className="w-6 h-6 text-muted-foreground animate-spin" />

      <InfoSkeleton />

      <ParticipantsSkeleton />

      <ToolbarSkeleton />
    </div>
  );
};

export default CanvasLoading;
