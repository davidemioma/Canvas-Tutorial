"use client";

import ConfirmModel from "@/components/models/ConfirmModel";
import RenameModels from "@/components/models/RenameModels";

export const ModalProvider = () => {
  return (
    <>
      <RenameModels />

      <ConfirmModel />
    </>
  );
};
