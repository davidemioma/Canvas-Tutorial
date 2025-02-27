import React from "react";

type Props = {
  children: React.ReactNode;
  message: string;
  subText: string;
  footer?: React.ReactNode;
};

const EmptyState = ({ children, message, subText, footer }: Props) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col items-center">
        {children}

        <h2 className="mt-6 text-2xl font-semibold">{message}</h2>

        <p className="text-sm text-muted-foreground mt-2">{subText}</p>

        {footer && footer}
      </div>
    </div>
  );
};

export default EmptyState;
