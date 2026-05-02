"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { Edu_NSW_ACT_Foundation } from "next/font/google";
import { SparklesIcon, MenuIcon, XIcon } from "lucide-react";

export const brandFont = Edu_NSW_ACT_Foundation({
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal"],
  variable: "--font-brand",
});


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className={`${brandFont.className} text-3xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition-opacity`}
        >
          Spawn<span className="text-indigo-600">.dev</span>
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-t border-gray-100 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/sign-in"
              className="text-center text-sm font-medium text-gray-700 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-center inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              Start Building
            </Link>
          </div>
        </div>
    </header>
  );
}