import {
  Workflow,
  Briefcase,
  Building2,
  FileText,
  LogOut,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const items = [
  {
    title: "Application",
    url: "/application",
    icon: FileText,
  },
  {
    title: "Company",
    url: "/company",
    icon: Building2,
  },
  {
    title: "Industry",
    url: "/industry",
    icon: Workflow,
  },
  {
    title: "Job Posting",
    url: "/job-posting",
    icon: Briefcase,
  },
  {
    title: "User",
    url: "/user",
    icon: Users,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                {/* <IconInnerShadowTop className="!size-5" /> */}
                <span className="text-base font-semibold">HireHub Portal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>HireHub Portal</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 h-8 w-8 text-primary flex items-center justify-center rounded-full text-sm font-semibold">
                  KS
                </div>
                <div className="grid leading-tight text-left">
                  <span>Kaung Satt Hein</span>
                  <span className="text-xs text-muted-foreground">
                    kaung@example.com
                  </span>
                </div>
              </div>
              <LogOut className="size-4 text-red-500" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
