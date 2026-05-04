"use client";

import { SparklesIcon, UploadCloudIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────
   TYPES & DATA
───────────────────────────────────── */
interface Prompt {
  label: string;
  prompt: string;
}

const placeholders = [
  "portfolio website...",
  "e-commerce store...",
  "business landing page...",
  "personal blog...",
  "startup website...",
];

const prompts: Prompt[] = [
  { label: "Portfolio Website",   prompt: "Create a modern portfolio website to showcase my skills, projects, experience, and personal brand professionally" },
  { label: "E-commerce Website",  prompt: "Build a fast, secure e-commerce website with product listings, cart system, payments, and admin dashboard" },
  { label: "Blog",                prompt: "Create a clean, SEO-optimized blog website for writing articles, managing content, and growing audience online" },
  { label: "Landing Page",        prompt: "Design a high-conversion landing page with strong hero section, CTA buttons, and lead capture form" },
  { label: "Resume Website",      prompt: "Generate a professional resume website with skills, experience, education, projects, and downloadable CV section" },
  { label: "Personal Website",    prompt: "Create a personal branding website with about section, social links, blogs, and contact form" },
  { label: "Business Website",    prompt: "Build a professional business website with services, testimonials, pricing section, and customer inquiry form" },
  { label: "Marketing Website",   prompt: "Create a marketing-focused website optimized for conversions, analytics tracking, funnels, and campaign integrations" },
  { label: "Educational Website", prompt: "Build an educational website with courses, student dashboard, lesson pages, progress tracking, and quizzes" },
];

/* ─────────────────────────────────────
   ANIMATED HEADLINE
───────────────────────────────────── */
function AnimatedHeadline() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  const words = [
    { text: "Turn", delay: 0.08 },
    { text: "Your", delay: 0.15 },
    { text: "Idea", delay: 0.22 },
    { text: "Into", delay: 0.29 },
  ];
  const words2 = [
    { text: "Real", delay: 0.50, gradient: true },
    { text: "App,", delay: 0.59, gradient: true },
  ];
  const words3 = [
    { text: "Instantly.", delay: 0.68 },
  ];

  const wordStyle = (delay: number, gradient = false): React.CSSProperties => ({
    display: "inline-block",
    marginRight: "0.22em",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
    ...(gradient ? {
      background: "linear-gradient(135deg,#6366f1,#a855f7,#ec4899)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    } : {}),
  });

  return (
    <h1 className="text-center mt-10 font-black tracking-tight leading-[1.06] text-gray-950"
      style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)", letterSpacing: "-0.04em", maxWidth: 820 }}>
      <span className="block">
        {words.map((w, i) => (
          <span key={i} style={wordStyle(w.delay)}>{w.text}</span>
        ))}
      </span>
      <span className="block">
        {words2.map((w, i) => (
          <span key={i} style={wordStyle(w.delay, w.gradient)}>{w.text}</span>
        ))}
        {" "}
        {words3.map((w, i) => (
          <span key={i} style={wordStyle(w.delay)}>{w.text}</span>
        ))}
      </span>
    </h1>
  );
}

/* ─────────────────────────────────────
   TYPEWRITER PLACEHOLDER
───────────────────────────────────── */
function useTypewriter(paused: boolean) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (paused) return;
    const word = placeholders[textIndex];

    if (!deleting && charIndex === word.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((p) => (p + 1) % placeholders.length);
      return;
    }

    const t = setTimeout(() => {
      setCharIndex((p) => p + (deleting ? -1 : 1));
    }, deleting ? 35 : 55);
    return () => clearTimeout(t);
  }, [charIndex, deleting, textIndex, paused]);

  return `Create a ${placeholders[textIndex].substring(0, charIndex)}`;
}

/* ─────────────────────────────────────
   MARQUEE (no external dep)
───────────────────────────────────── */
function ChipMarquee({ selected, onSelect }: { selected: string | null; onSelect: (item: Prompt) => void }) {
  return (
    <div className="relative w-full overflow-hidden mt-3">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10"
        style={{ background: "linear-gradient(to right, #fff, transparent)" }} />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10"
        style={{ background: "linear-gradient(to left, #fff, transparent)" }} />

      <div
        className="flex gap-2 w-max"
        style={{ animation: "marquee 28s linear infinite" }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
      >
        {[...prompts, ...prompts].map((item, i) => {
          const on = selected === item.label && i < prompts.length;
          return (
            <button
              key={`${item.label}-${i}`}
              onClick={() => onSelect(item)}
              className={`whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer
                ${on
                  ? "border-indigo-300 bg-indigo-50 text-indigo-600 font-semibold"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   PROMPT BOX
───────────────────────────────────── */
function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const placeholder = useTypewriter(!!prompt);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    window.location.href = `/sign-up?prompt=${encodeURIComponent(prompt)}`;
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [prompt]);

  return (
    <div className="w-full max-w-2xl" style={{ opacity: 0, animation: "fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.85s forwards" }}>
      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: "#ffffff",
          border: `1.5px solid ${focused ? "rgba(99,102,241,0.45)" : "rgba(0,0,0,0.09)"}`,
          boxShadow: focused
            ? "0 0 0 4px rgba(99,102,241,0.1), 0 20px 50px rgba(0,0,0,0.09)"
            : "0 16px 48px rgba(0,0,0,0.07)",
        }}
      >
        {/* Grid texture */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" aria-hidden>
          <defs>
            <pattern id="hgrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M28 0L0 0 0 28" fill="none" stroke="black" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)" />
        </svg>

        {/* Label */}
        <div className="flex items-center gap-2 px-4 pt-3.5">
          <span className="text-[10px] text-gray-300 tracking-[0.16em] uppercase">— describe your app</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={3}
          minLength={3}
          required
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); setSelected(null); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`${placeholder}|`}
          className="w-full bg-transparent border-none outline-none resize-none px-4 py-3.5 text-sm text-gray-900 leading-relaxed placeholder:text-gray-400"
          style={{ minHeight: 90, maxHeight: 160 }}
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-end px-3.5 pb-3.5 pt-2.5 border-t border-gray-100">

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold
              transition-all duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
              boxShadow: "0 4px 20px rgba(139,92,246,0.25)",
              letterSpacing: "-0.01em",
            }}
          >
            <SparklesIcon size={14} />
            Generate App
          </button>
        </div>
      </form>

      {/* Marquee chips */}
      <ChipMarquee
        selected={selected}
        onSelect={(item) => {
          setPrompt(item.prompt);
          setSelected(item.label);
        }}
      />
    </div>
  );
}



/* ─────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────── */
export default function HeroSection() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-18px) scale(1.04); }
        }
        @keyframes float2 {
          0%,100% { transform: translateY(0) scale(1) rotate(0deg); }
          50%      { transform: translateY(14px) scale(0.96) rotate(3deg); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <section
        id="home"
        className="relative flex flex-col items-center justify-center overflow-hidden bg-white
          px-5 sm:px-8"
        style={{
          paddingTop: "clamp(5rem, 10vw, 8rem)",
          paddingBottom: "clamp(2rem, 5vw, 6rem)",
        }}
      >
        {/* ── Background atmosphere ── */}
        <div aria-hidden className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Top radial glow */}
          <div
            className="absolute top-[-15%] left-1/2 -translate-x-1/2"
            style={{
              width: "min(900px, 130vw)",
              height: 500,
              background: "radial-gradient(ellipse at 50% 0%, #e0e7ff 0%, transparent 70%)",
              opacity: 0.55,
            }}
          />
          {/* Floating orbs */}
          <div
            className="absolute rounded-full hidden sm:block"
            style={{
              width: 340, height: 340, top: "5%", left: "5%",
              background: "radial-gradient(circle, #818cf855 0%, transparent 70%)",
              animation: "float 9s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full hidden sm:block"
            style={{
              width: 280, height: 280, top: "10%", right: "6%",
              background: "radial-gradient(circle, #f472b633 0%, transparent 70%)",
              animation: "float2 11s ease-in-out infinite",
            }}
          />
          <div
            className="absolute rounded-full hidden md:block"
            style={{
              width: 220, height: 220, bottom: "8%", left: "15%",
              background: "radial-gradient(circle, #34d39933 0%, transparent 70%)",
              animation: "float 13s ease-in-out infinite 2s",
            }}
          />
        </div>

        {/* ── Main content ── */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-4xl gap-0">


          {/* Headline */}
          <div className="mb-5 w-full flex justify-center">
            <AnimatedHeadline />
          </div>

          {/* Subheadline */}
          <p
            className="text-center text-gray-500 leading-relaxed mb-8 max-w-lg"
            style={{
              fontSize: "clamp(0.93rem, 2vw, 1.1rem)",
              opacity: 0,
              animation: "fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.7s forwards",
            }}
          >
            No code. No design skills. Describe your vision &amp; Spawn builds a fully structured,
            production-ready app in seconds.
          </p>

          {/* Prompt box */}
          <PromptBox />

        </div>
      </section>
    </>
  );
}