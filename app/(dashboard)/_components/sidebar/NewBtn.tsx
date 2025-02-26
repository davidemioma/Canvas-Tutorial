"use client";

import React from "react";
import Hint from "@/components/Hint";
import { PlusIcon } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const NewBtn = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="w-full aspect-square bg-white/20 flex items-center justify-center rounded-md opacity-75 hover:opacity-100 transition-opacity duration-150">
          <Hint
            label="Create Organization"
            side="right"
            align="start"
            sideOffset={15}
          >
            <PlusIcon />
          </Hint>
        </div>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent w-fit border-none">
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};

export default NewBtn;
