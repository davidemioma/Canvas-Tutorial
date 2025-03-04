import React from "react";

const Toolbar = () => {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-2 flex flex-col gap-4">
      <div className="bg-white flex flex-col items-center gap-1 p-1.5 rounded-md shadow-md">
        <div>Pencil</div>

        <div>Square</div>

        <div>Circle</div>

        <div>Ellipses</div>
      </div>

      <div className="bg-white flex flex-col items-center gap-1 p-1.5 rounded-md shadow-md">
        <div>Undo</div>

        <div>Redo</div>
      </div>
    </div>
  );
};

export const ToolbarSkeleton = () => {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 bg-white h-[360px] w-[52px] left-2 flex flex-col gap-4 shadow-md rounded-md" />
  );
};

export default Toolbar;
