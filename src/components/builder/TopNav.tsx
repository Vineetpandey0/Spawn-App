"use client";

import {
  Bell,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";

export default function TopNav() {
  const { toggleSidebar, open } = useSidebar();
  const { user } = useUser();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50 flex items-center px-3 gap-3">
      
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
      >
        {open ? (
          <PanelLeftClose className="w-5 h-5" />
        ) : (
          <PanelLeftOpen className="w-5 h-5" />
        )}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
          AB
        </div>
      </div>

      {/* Workspace */}
      <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition max-w-[180px]">
        <span className="text-sm font-medium text-gray-800 truncate">
          {user?.firstName || "Workspace"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
      </button>

      <div className="flex-1" />

      {/* Notifications */}
      <button className="relative p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-400 ring-2 ring-white" />
      </button>

      {/* Avatar + Dropdown */}
      <div className="relative" ref={menuRef}>
        
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-sm font-medium"
        >
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            user?.firstName?.[0] || "U"
          )}
        </button>

        {/* Dropdown */}
        {openMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-sm z-50">
            
            {/* User info */}
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-sm font-medium">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            {/* Logout */}
            <SignOutButton>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-100 transition">
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </SignOutButton>

          </div>
        )}
      </div>
    </header>
  );
}