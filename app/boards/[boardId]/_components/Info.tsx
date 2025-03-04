import React from "react";

const Info = () => {
  return (
    <div className="absolute top-2 left-2 bg-white flex items-center h-12 px-1.5 rounded-md shadow-md">
      Info about the board.
    </div>
  );
};

export const InfoSkeleton = () => {
  return (
    <div className="absolute bg-white  top-2 left-2 flex items-center w-[300px] h-12 px-1.5 rounded-md shadow-md" />
  );
};

export default Info;
