"use client";

import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex min-h-svh w-full flex-1 flex-col md:w-[calc(100vw-var(--sidebar-width))]">
        <div className="flex items-center border-b p-4">
          <SidebarTrigger />
        </div>
        <section className="flex-1">{children}</section>
      </main>
    </SidebarProvider>
  );
};

export default Container;
