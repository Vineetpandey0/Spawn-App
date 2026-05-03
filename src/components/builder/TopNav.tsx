"use client";

import {
  Bell,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Download,
} from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Logo from "../logo";
import { toast } from "sonner";

export default function TopNav() {
  const { toggleSidebar, open } = useSidebar();
  const { user } = useUser();
  const params = useParams();
  const appId = params?.appId as string;

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [geminiKey, setGeminiKey] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!appId) return;
    
    setIsDownloading(true);
    const tId = toast.loading("Preparing your project ZIP...");
    
    try {
      const res = await fetch(`/api/apps/${appId}/export`);
      if (!res.ok) throw new Error("Failed to export project");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `app-project-${appId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Project downloaded successfully!", { id: tId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to download project. Please try again.", { id: tId });
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    // Read from cookie on mount
    const match = document.cookie.match(/(^| )gemini_api_key=([^;]+)/);
    if (match) setGeminiKey(match[2]);
  }, []);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGeminiKey(val);
    document.cookie = `gemini_api_key=${val}; path=/; max-age=31536000`;
  };

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
        <Logo />
      </div>

      {/* Workspace */}
      <button className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition ">
        <span className="text-sm font-medium text-gray-800 ">
          {user?.firstName + " 's Workspace"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
      </button>

      <div className="flex-1" />

      {/* Export Button */}
      {appId && (
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center cursor-pointer gap-2 px-3 py-1.5 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition shadow-sm shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Download Project</span>
        </button>
      )}

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
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-sm z-50 overflow-hidden">
            
            {/* User info */}
            <div className="px-3 py-2.5 border-b border-gray-100 bg-gray-50/50">
              <p className="text-sm font-medium text-gray-900">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            {/* API Key Input */}
            <div className="px-3 py-3 border-b border-gray-100">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Gemini API Key
              </label>
              <input 
                type="password" 
                placeholder="Enter your API key..."
                value={geminiKey}
                onChange={handleKeyChange}
                className="w-full text-sm px-2.5 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
              />
              <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">
                Keys are stored locally in your browser to power AI generations.
              </p>
            </div>

            {/* Logout */}
            <div className="p-1">
              <SignOutButton>
                <button className="w-full flex items-center gap-2 px-2.5 py-2 text-sm text-red-600 font-medium rounded-md hover:bg-red-50 transition">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </SignOutButton>
            </div>

          </div>
        )}
      </div>
    </header>
  );
}