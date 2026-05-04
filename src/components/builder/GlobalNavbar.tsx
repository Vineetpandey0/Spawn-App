"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { Edu_NSW_ACT_Foundation } from "next/font/google";
import { SparklesIcon } from "lucide-react";
import Logo from "../logo";

export const brandFont = Edu_NSW_ACT_Foundation({
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal"],
  variable: "--font-brand",
});


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className={`${brandFont.className} flex text-3xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition-opacity`}
        >
          <Logo />
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/vineetpandey0"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
            aria-label="GitHub"
          >
            <FaGithub size={20} />
          </a>

          <Link
            href="/sign-in"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            Start Building
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/sign-in"
            className="text-xs font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
          >
            <SparklesIcon className="w-3 h-3" />
            Sign up
          </Link>
        </div>
      </div>

    </header>
  );
}