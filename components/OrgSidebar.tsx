"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutDashboard, StarIcon } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { useSearchParams } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const OrgSidebar = () => {
  const searchParams = useSearchParams();

  const favorite = searchParams.get("favorite");

  return (
    <div className="hidden lg:flex flex-col gap-6 w-[205px] h-screen pt-5 pl-5">
      <Link href="/" className={cn("flex items-center gap-2", font.className)}>
        <span className="text-3xl">📋</span>

        <span className="text-xl font-semibold">Board</span>
      </Link>

      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            },
            organizationSwitcherTrigger: {
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              backgroundColor: "white",
              justifyContent: "space-between",
            },
          },
        }}
      />

      <div className="w-full space-y-1.5">
        <Link
          href="/"
          className={cn(
            buttonVariants({
              size: "lg",
              variant: favorite ? "ghost" : "secondary",
              className: "font-normal justify-start px-2 w-full",
            })
          )}
        >
          <LayoutDashboard />
          Team boards
        </Link>

        <Link
          href={{
            pathname: "/",
            query: {
              favorite: true,
            },
          }}
          className={cn(
            buttonVariants({
              size: "lg",
              variant: favorite ? "secondary" : "ghost",
              className: "font-normal justify-start px-2 w-full",
            })
          )}
        >
          <StarIcon />
          Favorite boards
        </Link>
      </div>
    </div>
  );
};

export default OrgSidebar;
