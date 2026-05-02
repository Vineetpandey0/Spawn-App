"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Edu_NSW_ACT_Foundation } from "next/font/google";
import { SparklesIcon } from "lucide-react";

export const brandFont = Edu_NSW_ACT_Foundation({
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal"],
  variable: "--font-brand",
});

const footerLinks = {
  Product: ["Features", "How it Works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="w-full bg-gray-950 text-white mt-20">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">

          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className={`${brandFont.className} text-3xl font-bold tracking-tight`}>
              Spawn<span className="text-indigo-400">.dev</span>
            </Link>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-xs">
              Build full-stack applications instantly using AI. Dynamic UI, APIs,
              and database — all generated at runtime from a single prompt.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/vineetpandey0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="GitHub"
              >
                <FaGithub size={16} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={16} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Twitter"
              >
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter / CTA Strip */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-violet-900/60 border border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-indigo-400" />
              Stay in the loop
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Get product updates, launch announcements, and tips in your inbox.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 sm:w-56 text-sm px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-indigo-400 transition"
            />
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition flex-shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>
            © {new Date().getFullYear()}{" "}
            <Link href="/" className="hover:text-gray-400 transition-colors">
              Spawn.dev
            </Link>
            . All rights reserved.
          </span>
          <span>Built with ❤️ by Vineet Pandey</span>
        </div>
      </div>
    </footer>
  );
}