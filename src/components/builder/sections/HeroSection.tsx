"use client";

import {
  Loader2Icon,
  SparklesIcon,
  UploadCloudIcon,
  ArrowRightIcon,
} from "lucide-react";
import Marquee from "react-fast-marquee";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
   WORD-SPLIT ANIMATION
   Staggered per-word fade + rise on mount
───────────────────────────────────── */
function AnimatedHeadline() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 120); return () => clearTimeout(t); }, []);

  const line1 = "Turn Your Idea Into".split(" ");
  const line2 = "Real App,".split(" ");
  const line3 = "Instantly.".split(" ");

  const Word = ({ word, delay, gradient = false, accent = false }: {
    word: string; delay: number; gradient?: boolean; accent?: boolean;
  }) => (
    <span
      className="inline-block"
      style={{
        marginRight: "0.22em",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
        ...(gradient ? {
          background: "linear-gradient(135deg,#6366f1,#a855f7,#ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        } : {}),
      }}
    >
      {word}
    </span>
  );

  return (
    <h1
      style={{
        fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
        lineHeight: 1.06,
        letterSpacing: "-0.04em",
        color: "#0a0a0a",
        textAlign: "center",
        maxWidth: 820,
        margin: "0 auto",
        fontWeight: 900,
      }}
    >
      {/* Line 1 */}
      <span style={{ display: "block" }}>
        {line1.map((w, i) => <Word key={i} word={w} delay={0.08 + i * 0.07} />)}
      </span>
      {/* Line 2 — gradient */}
      <span style={{ display: "block" }}>
        {line2.map((w, i) => <Word key={i} word={w} delay={0.5 + i * 0.09} gradient />)}
        {" "}
        {line3.map((w, i) => <Word key={i} word={w} delay={0.65 + i * 0.09} />)}
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
   PROMPT BOX (the dark card)
───────────────────────────────────── */
function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const placeholder = useTypewriter(!!prompt);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter(); 

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/sign-up?prompt=${encodeURIComponent(prompt)}`);
  };

  // auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [prompt]);

  return (
    <div
      style={{
        opacity: 0,
        transform: "translateY(30px)",
        animation: "fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.85s forwards",
        width: "100%",
        maxWidth: 680,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#ffffff",
          border: `1px solid ${focused ? "rgba(99,102,241,0.5)" : "rgba(0,0,0,0.1)"}`,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: focused
            ? "0 0 0 4px rgba(99,102,241,0.1), 0 24px 60px rgba(0,0,0,0.1)"
            : "0 20px 50px rgba(0,0,0,0.08)",
          transition: "border-color 0.25s, box-shadow 0.25s",
          position: "relative",
        }}
      >
        {/* Subtle grid inside card */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}>
          <defs>
            <pattern id="hgrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M28 0L0 0 0 28" fill="none" stroke="black" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hgrid)" />
        </svg>

        {/* Label */}
        <div style={{ padding: "14px 18px 0", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 10, color: "rgba(0,0,0,0.3)",
            letterSpacing: "0.16em", textTransform: "uppercase",
          }}>
            — describe your app
          </span>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(0,0,0,0.08)" }} />
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
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            padding: "14px 18px",
            fontFamily: "inherit",
            fontSize: 15,
            color: "#111",
            lineHeight: 1.7,
            minHeight: 90,
            maxHeight: 160,
          }}
        />

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px 14px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}>
          {/* Attach */}
          <label
            htmlFor="hero-file"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 11, color: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 8, padding: "6px 10px",
              cursor: "pointer", transition: "all 0.2s",
              letterSpacing: "0.08em",
            }}
            className="hero-attach"
          >
            <input type="file" id="hero-file" hidden />
            <UploadCloudIcon size={13} />
            <span>Attach</span>
          </label>

          {/* Generate button */}
          <button
            type="submit"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 22px", borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
              color: "#fff",
              fontFamily: "inherit",
              fontSize: 14, fontWeight: 700,
              border: "none", cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.2s",
              letterSpacing: "-0.01em",
            }}
            className="hero-gen-btn"
          >
            <SparklesIcon size={14} />
            Generate App
          </button>
        </div>
      </form>

      {/* Marquee quick prompts */}
      <div style={{ marginTop: 12 }}>
        <Marquee gradient gradientColor="#ffffff" gradientWidth={48} speed={26} pauseOnHover>
          {prompts.map((item) => {
            const on = selected === item.label;
            return (
              <button
                key={item.label}
                onClick={() => { setPrompt(item.prompt); setSelected(item.label); }}
                style={{
                  margin: "0 5px",
                  padding: "5px 13px",
                  borderRadius: 100,
                  border: `1px solid ${on ? "rgba(99,102,241,0.4)" : "#e2e2dc"}`,
                  background: on ? "rgba(99,102,241,0.07)" : "#f8f8f6",
                  color: on ? "#6366f1" : "#777",
                  fontFamily: "inherit",
                  fontSize: 12, fontWeight: on ? 600 : 500,
                  cursor: on ? "default" : "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                className={on ? "" : "prompt-chip"}
              >
                {item.label}
              </button>
            );
          })}
        </Marquee>
      </div>
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
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-18px) scale(1.04); }
        }
        @keyframes float2 {
          0%,100% { transform: translateY(0) scale(1) rotate(0deg); }
          50%      { transform: translateY(14px) scale(0.96) rotate(3deg); }
        }

        .hero-attach:hover {
          background: rgba(99,102,241,0.06) !important;
          color: rgba(99,102,241,0.8) !important;
          border-color: rgba(99,102,241,0.2) !important;
        }
        .hero-gen-btn:hover:not(:disabled) {
          transform: scale(1.03);
          box-shadow: 0 0 30px rgba(139,92,246,0.35);
        }
        .hero-gen-btn:active:not(:disabled) { transform: scale(0.98); }
        .prompt-chip:hover {
          background: #f0f0ec !important;
          color: #444 !important;
          border-color: #ccc !important;
        }
      `}</style>

      <section
        id="home"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          paddingTop: "clamp(5rem, 10vw, 8rem)",
          paddingBottom: "clamp(4rem, 8vw, 6rem)",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          background: "#fff",
        }}
      >
        {/* ── Background atmosphere ── */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          {/* Soft top radial */}
          <div style={{
            position: "absolute", top: "-15%", left: "50%", transform: "translateX(-50%)",
            width: "min(900px, 130vw)", height: 500,
            background: "radial-gradient(ellipse at 50% 0%, #e0e7ff 0%, transparent 70%)",
            opacity: 0.55,
          }} />
          {/* Floating orbs — matching Features CTA */}
          <div style={{
            position: "absolute", width: 340, height: 340, borderRadius: "50%",
            top: "5%", left: "5%",
            background: "radial-gradient(circle, #818cf855 0%, transparent 70%)",
            animation: "float 9s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", width: 280, height: 280, borderRadius: "50%",
            top: "10%", right: "6%",
            background: "radial-gradient(circle, #f472b633 0%, transparent 70%)",
            animation: "float2 11s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", width: 220, height: 220, borderRadius: "50%",
            bottom: "8%", left: "15%",
            background: "radial-gradient(circle, #34d39933 0%, transparent 70%)",
            animation: "float 13s ease-in-out infinite 2s",
          }} />
        </div>

        {/* ── All content stacked, centered ── */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: "100%", maxWidth: 860 }}>

          

          {/* Animated headline */}
          <div style={{ marginBottom: "1.5rem" }}>
            <AnimatedHeadline />
          </div>

          {/* Subheadline */}
          <p
            style={{
              textAlign: "center",
              fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
              color: "#666",
              lineHeight: 1.78,
              maxWidth: 540,
              margin: "0 0 2.25rem",
              opacity: 0,
              animation: "fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.7s forwards",
            }}
          >
            No code. No design skills. Describe your vision & Spawn builds a fully structured, production-ready app in seconds.
          </p>

          {/* Prompt box with marquee */}
          <PromptBox />
        </div>
      </section>

      {/* Extra hover styles that need class names */}
      <style>{`
        .cta-primary-btn:hover { transform: scale(1.03); box-shadow: 0 10px 32px rgba(99,102,241,0.45) !important; }
        .cta-primary-btn:active { transform: scale(0.98); }
        .cta-ghost-btn:hover { background: #f8f8f6 !important; border-color: #ccc !important; }
      `}</style>
    </>
  );
}