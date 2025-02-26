import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen p-4">
      <div className="w-20 h-20 rounded-full border-t border-l border-black animate-spin" />
    </div>
  );
};

export default Loading;
