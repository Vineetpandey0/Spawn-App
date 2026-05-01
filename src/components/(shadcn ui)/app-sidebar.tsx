"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
} from "../ui/sidebar";

import {
  Home,
  LayoutGrid,
  FileText,
  Plug,
  Users,
  ChevronDown,
  Star,
  Clock,
  Zap,
  Box,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

const mainNavItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "All Apps", href: "/apps", icon: LayoutGrid },
];

const recentItems = [
  { label: "UniPath", href: "/apps/unipath", icon: Box },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [recentsOpen, setRecentsOpen] = useState(true);
  const { user } = useUser();
  return (
    <Sidebar className="border-r border-gray-200 bg-white">

      {/* Empty header to offset fixed TopNav height */}
      <SidebarHeader className="h-14 shrink-0" />

      <SidebarContent className="overflow-y-auto">

        {/* Main Navigation */}
        <SidebarGroup className="px-2 pt-2">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  group flex items-center justify-between gap-2.5 px-3 py-2 mb-0.5 text-sm rounded-lg transition-colors
                  ${isActive
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <span className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </span>
                
              </Link>
            );
          })}
        </SidebarGroup>


        {/* Recents */}
        <SidebarGroup className="px-2 mt-2">
          <SidebarGroupLabel
            className="flex items-center justify-between cursor-pointer select-none px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide hover:text-gray-700 transition-colors"
            onClick={() => setRecentsOpen((v) => !v)}
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Recents
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${recentsOpen ? "" : "-rotate-90"}`}
            />
          </SidebarGroupLabel>

          {recentsOpen && (
            <div className="mt-0.5">
              {recentItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center shrink-0">
                    <item.icon className="w-3 h-3 text-white" />
                  </div>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <img
            src={user?.imageUrl}
            className="w-8 h-8 rounded-full"
            alt="avatar"
          />

          
          <div className="flex flex-col text-sm">
            <span className="font-medium">
              {user?.fullName || "User"}
            </span>
            <span className="text-gray-500 text-xs">
              {user?.emailAddresses[0].emailAddress}
            </span>
          </div>
          
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}