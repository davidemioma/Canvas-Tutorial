"use client";

import React from "react";
import OrgItem from "./OrgItem";
import { useOrganizationList } from "@clerk/nextjs";

const OrgList = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (userMemberships.data?.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-4">
      {userMemberships.data?.map((mem) => (
        <OrgItem
          key={mem.organization.id}
          id={mem.organization.id}
          name={mem.organization.name}
          imageUrl={mem.organization.imageUrl}
        />
      ))}
    </ul>
  );
};

export default OrgList;
