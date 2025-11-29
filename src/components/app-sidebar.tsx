"use client";

import { useEffect, useMemo, useState } from "react";
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
import { USER_PROFILE_STORAGE_KEY } from "@/lib/constants";
import { useLogout } from "@/api-config/queries/auth";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface StoredProfile {
  name?: string;
  email?: string;
}

const DEFAULT_PROFILE: Required<StoredProfile> = {
  name: "Administrator",
  email: "admin@example.com",
};

const getNameFromEmail = (email?: string) => {
  if (!email) return undefined;
  return email.split("@")[0] || email;
};

const getInitials = (name?: string, email?: string) => {
  const source = name || getNameFromEmail(email) || DEFAULT_PROFILE.name;
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("");
};

const items = [
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
    title: "Job",
    url: "/job",
    icon: Briefcase,
  },
  {
    title: "User",
    url: "/user",
    icon: Users,
  },
];

export function AppSidebar() {
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();
  const router = useRouter();

  useEffect(() => {
    const loadProfile = () => {
      try {
        const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Failed to load stored profile:", error);
        setProfile(null);
      }
    };

    loadProfile();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === USER_PROFILE_STORAGE_KEY) {
        loadProfile();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const displayName =
    profile?.name || getNameFromEmail(profile?.email) || DEFAULT_PROFILE.name;
  const displayEmail = profile?.email || DEFAULT_PROFILE.email;
  const initials = useMemo(
    () => getInitials(profile?.name, profile?.email),
    [profile?.name, profile?.email]
  );

  const handleLogout = async () => {
    try {
      await logout();
      setIsLogoutDialogOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
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
            <SidebarMenuButton asChild className="justify-between">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 h-8 w-8 text-primary flex items-center justify-center rounded-full text-sm font-semibold uppercase">
                    {initials}
                  </div>
                  <div className="grid leading-tight text-left">
                    <span>{displayName}</span>
                    <span className="text-xs text-muted-foreground">
                      {displayEmail}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => setIsLogoutDialogOpen(true)}
                >
                  <LogOut className="size-4" />
                </Button>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to
              access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoggingOut}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
