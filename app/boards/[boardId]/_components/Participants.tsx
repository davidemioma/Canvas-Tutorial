import React from "react";

const Participants = () => {
  return (
    <div className="absolute top-2 right-2 bg-white flex items-center h-12 px-1.5 rounded-md shadow-md">
      List of Participants
    </div>
  );
};

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute top-2 right-2 bg-white flex items-center w-[300px] h-12 px-1.5 rounded-md shadow-md" />
  );
};

export default Participants;
