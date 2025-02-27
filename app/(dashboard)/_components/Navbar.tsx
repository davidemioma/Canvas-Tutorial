"use client";

import React from "react";
import InviteBtn from "./InviteBtn";
import SearchInput from "./SearchInput";
import {
  OrganizationSwitcher,
  useOrganization,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  const { organization } = useOrganization();

  return (
    <div className="flex items-center gap-4 p-5">
      <div className="hidden lg:flex lg:flex-1">
        <SearchInput />
      </div>

      <div className="block flex-1 lg:hidden">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "367px",
              },
              organizationSwitcherTrigger: {
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                backgroundColor: "white",
                justifyContent: "space-between",
                maxWidth: "367px",
              },
            },
          }}
        />
      </div>

      {organization && <InviteBtn />}

      <UserButton />
    </div>
  );
};

export default Navbar;
