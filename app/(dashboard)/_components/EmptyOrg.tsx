"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const EmptyOrg = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col items-center">
        <TriangleAlert className="w-32 h-32 text-red-500" />

        <h2 className="mt-4 text-2xl font-semibold">Welcome to Board</h2>

        <p className="text-sm mt-2 text-muted-foreground">
          Create an organization to get started.
        </p>

        <div className="mt-6">
          <Dialog>
            <DialogTrigger className={cn(buttonVariants({ size: "lg" }))}>
              Create Organization
            </DialogTrigger>

            <DialogContent className="p-0 bg-transparent w-fit border-none">
              <CreateOrganization />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default EmptyOrg;
