import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
  className?: string;
};

const BtnSpinner = ({ className }: Props) => {
  return <Loader2 className={cn("w-4 h-4 animate-spin", className)} />;
};

export default BtnSpinner;
