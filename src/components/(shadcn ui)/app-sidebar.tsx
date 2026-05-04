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
  useSidebar,
} from "../ui/sidebar";

import {
  Home,
  LayoutGrid,
  FileText,
  ChevronDown,
  SquarePen,
  Settings,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useAppStore } from "@/store/appStore";

import Logo from "../logo";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import SettingsDialog from "../builder/SettingsDialog";

const mainNavItems = [
  { label: "New App", href: "/dashboard", icon: SquarePen },
  { label: "All Apps", href: "/apps", icon: LayoutGrid },
];


export function AppSidebar() {
  const pathname = usePathname();
  const [recentsOpen, setRecentsOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user } = useUser();
  const { appData } = useAppStore();
  const { setOpenMobile, isMobile } = useSidebar();

  
  const recentItems = appData.map((app: any) => ({
    id: app.id,
    label: app.name,
    href: `/apps/${app.id}`,
    icon: FileText,
  }));

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white">

      {/* Header with Logo for mobile, empty offset for desktop */}
      <SidebarHeader className="h-14 shrink-0 flex items-start justify-center px-4">
        <div className="md:hidden flex items-center gap-2 mt-2">
          <Logo />
          <span className="font-bold text-xl tracking-tight text-gray-900 ml-1">spawn.dev</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden flex flex-col no-scrollbar">

        {/* Main Navigation */}
        <SidebarGroup className="px-2 pt-2 no-scrollbar">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleLinkClick}
                className={`
                  group no-scrollbar flex items-center justify-between gap-2.5 px-3 py-2 mb-0.5 text-sm rounded-lg transition-colors
                  ${isActive
                    ? "bg-violet-500 text-white font-medium"
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


        {/* Recents — label is static, only the list scrolls */}
        <SidebarGroup className="px-2 mt-2 flex flex-col">
          {/* Static label */}
          <SidebarGroupLabel
            className="flex items-center justify-between cursor-pointer select-none px-3 py-1 text-sm font-medium text-black tracking-wide transition-colors shrink-0"
            onClick={() => setRecentsOpen((v) => !v)}
          >
            <span className="flex items-center gap-1.5">
              Recents
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${recentsOpen ? "" : "-rotate-90"}`}
            />
          </SidebarGroupLabel>

          {/* Scrollable list only */}
          {recentsOpen && (
            <div
              className="mt-0.5 flex flex-col overflow-y-auto max-h-[calc(100svh-260px)] pb-2 no-scrollbar"
              data-lenis-prevent
            >
              {[...recentItems].reverse().map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`
                      flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors
                      ${isActive
                        ? "bg-gray-200 text-black font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-black"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-gray-100 overflow-visible">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-gray-100 transition-all group">
              <div className="relative">
                <img
                  src={user?.imageUrl}
                  className="w-9 h-9 rounded-full border border-gray-200 group-hover:border-violet-200 transition-colors"
                  alt="avatar"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span className="text-sm font-bold text-gray-900 truncate">
                  {user?.fullName || "User"}
                </span>
                <span className="text-[11px] text-gray-500 truncate">
                  {user?.emailAddresses[0].emailAddress}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-1.5 bg-white rounded-xl shadow-2xl border border-gray-200 mb-2 ml-4 animate-in slide-in-from-bottom-2 duration-200">
            <div className="space-y-1">
              <button 
                onClick={() => setSettingsOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Settings
              </button>
              
              <div className="h-px bg-gray-100 my-1" />

              <SignOutButton>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 font-semibold rounded-lg hover:bg-red-50 transition">
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </SignOutButton>
            </div>
          </PopoverContent>
        </Popover>

        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </SidebarFooter>
    </Sidebar>
  );
}