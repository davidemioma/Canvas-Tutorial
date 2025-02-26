import React from "react";
import NewBtn from "./NewBtn";
import OrgList from "./OrgList";

const Sidebar = () => {
  return (
    <div className="fixed z-50 left-0 h-screen w-[60px] bg-blue-950 flex flex-col gap-4 text-white p-3">
      <OrgList />

      <NewBtn />
    </div>
  );
};

export default Sidebar;
