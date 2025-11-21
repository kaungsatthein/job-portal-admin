"use client";

import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Container;
