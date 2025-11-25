"use client";

import { Toaster as SonnerToaster } from "sonner";

export const Toaster = () => {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      duration={4000}
      toastOptions={{
        closeButton: true,
        classNames: {
          toast: "text-sm",
        },
      }}
    />
  );
};
