"use client";

import EmptyOrg from "./_components/EmptyOrg";
import { useOrganization } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import BoardList from "./_components/board/BoardList";

export default function Home() {
  const { organization } = useOrganization();

  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  const favorites = searchParams.get("favorites");

  if (!organization) {
    return <EmptyOrg />;
  }

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto flex-1 p-6">
      <BoardList
        orgId={organization.id}
        query={{ search: search as string, favorites: favorites as string }}
      />
    </div>
  );
}
