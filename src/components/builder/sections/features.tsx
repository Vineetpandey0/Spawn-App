"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Zap, Code2, Layers, Sparkles,
  Globe2, ShieldCheck, Palette, Database, Gauge, GitBranch,
} from "lucide-react";

/* ─── Scroll reveal hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Tilt on mouse move ─── */
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return { ref, onMove, onLeave };
}

/* ─────────────────────────────────────
   DATA
───────────────────────────────────── */
const PRIMARY = [
  {
    icon: Zap,
    label: "01",
    title: "Instant Generation",
    sub: "From thought to production in seconds",
    body: "Describe your idea in plain language and get a fully structured, deployment-ready app in under 5 seconds. No waiting, no bottlenecks.",
    accent: "#f59e0b",
    tag: "Core",
  },
  {
    icon: Code2,
    label: "02",
    title: "Clean Code Output",
    sub: "Every line has a reason",
    body: "Readable, modular, conventionally sound. Generated code follows the same standards a senior engineer would enforce in code review.",
    accent: "#38bdf8",
    tag: "Dev-first",
  },
  {
    icon: Layers,
    label: "03",
    title: "Modular Architecture",
    sub: "Built to scale from day one",
    body: "Reusable, composable components from the ground up — extend, update, or rearchitect any part without touching the rest.",
    accent: "#a78bfa",
    tag: "Scalable",
  },
  {
    icon: Sparkles,
    label: "04",
    title: "AI-Powered Brain",
    sub: "Senior engineer + product thinking",
    body: "Trained to understand product intent, not just syntax. It reasons about architecture, edge cases, and UX before writing line one.",
    accent: "#f472b6",
    tag: "Intelligence",
  },
];

const SECONDARY = [
  { icon: Globe2,      title: "Deploy Anywhere",    body: "Vercel, Netlify, bare server — configs auto-generated.",    accent: "#2dd4bf" },
  { icon: ShieldCheck, title: "Built-in Security",  body: "Auth, sanitization, headers — baked in from day one.",      accent: "#4ade80" },
  { icon: Palette,     title: "Theme System",       body: "Tokens, typography, scale, palette — complete out of box.", accent: "#e879f9" },
  { icon: Database,    title: "Database Schema",    body: "Prisma schema + migrations wired to your data model.",      accent: "#818cf8" },
  { icon: Gauge,       title: "Performance First",  body: "Lazy load, code-split, image-optimize — automatic.",        accent: "#fb923c" },
  { icon: GitBranch,   title: "Version Control",    body: "Every generation versioned, diffable, rollbackable.",       accent: "#67e8f9" },
];

const STATS = [
  { n: "< 5s",   label: "generation time" },
  { n: "4,200+", label: "builders this month" },
  { n: "98%",    label: "deploy success rate" },
  { n: "∞",      label: "iterations, no extra cost" },
];

/* ─────────────────────────────────────
   PRIMARY CARD
───────────────────────────────────── */
function PrimaryCard({ f, i }: { f: typeof PRIMARY[0]; i: number }) {
  const { ref, visible } = useScrollReveal();
  const tilt = useTilt();
  const Icon = f.icon;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(60px) scale(0.97)",
        transition: `opacity 0.75s cubic-bezier(.22,1,.36,1) ${i * 0.13}s,
                     transform 0.75s cubic-bezier(.22,1,.36,1) ${i * 0.13}s`,
      }}
    >
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMove}
        onMouseLeave={tilt.onLeave}
        className="pcard"
        style={{
          position: "relative",
          background: "#0d0d0f",
          borderRadius: 20,
          padding: "2.5rem",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
          transition: "transform 0.2s ease, box-shadow 0.3s ease",
          cursor: "default",
        }}
      >
        {/* Accent glow */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 220, height: 220, borderRadius: "50%",
          background: f.accent, opacity: 0.07, filter: "blur(45px)",
          pointerEvents: "none", transition: "opacity 0.3s",
        }} className="card-glow" />

        {/* Subtle grid */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.035 }} aria-hidden>
          <defs>
            <pattern id={`g${i}`} width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0L0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#g${i})`} />
        </svg>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", letterSpacing: "0.15em" }}>
            {f.label} /
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
            color: f.accent, border: `1px solid ${f.accent}44`, borderRadius: 100, padding: "3px 10px",
          }}>
            {f.tag}
          </span>
        </div>

        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: `${f.accent}18`, border: `1px solid ${f.accent}28`,
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem",
        }}>
          <Icon size={24} color={f.accent} strokeWidth={1.5} />
        </div>

        {/* Text */}
        <h3 style={{
          fontWeight: 700,
          fontSize: "clamp(1.35rem, 2.2vw, 1.65rem)", color: "#fff",
          lineHeight: 1.2, margin: "0 0 0.4rem",
        }}>{f.title}</h3>
        <p style={{ fontSize: 11, color: f.accent, opacity: 0.75, margin: "0 0 1.1rem", letterSpacing: "0.04em" }}>
          {f.sub}
        </p>
        <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.48)", lineHeight: 1.78, margin: 0 }}>
          {f.body}
        </p>

        {/* Bottom line on hover */}
        <div className="card-line" style={{
          position: "absolute", bottom: 0, left: 0, height: 2, width: "100%",
          background: `linear-gradient(90deg, ${f.accent}00, ${f.accent}, ${f.accent}00)`,
          opacity: 0, transition: "opacity 0.35s",
        }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   SECONDARY TICKER
───────────────────────────────────── */
function SecondaryTicker() {
  const { ref, visible } = useScrollReveal();
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const posRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf: number;
    const run = () => {
      if (hovIdx === null) {
        posRef.current += 0.45;
        const half = track.scrollWidth / 2;
        if (posRef.current >= half) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [hovIdx]);

  const items = [...SECONDARY, ...SECONDARY];

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.65s ease 0.15s, transform 0.65s ease 0.15s",
        overflow: "hidden", position: "relative",
      }}
    >
      {/* Fade edges */}
      {(["left","right"] as const).map(side => (
        <div key={side} style={{
          position: "absolute", top: 0, bottom: 0,
          [side]: 0, width: 90, zIndex: 2, pointerEvents: "none",
          background: `linear-gradient(to ${side === "left" ? "right" : "left"}, #f8f8f6, transparent)`,
        }} />
      ))}

      <div
        ref={trackRef}
        style={{ display: "flex", gap: 14, width: "max-content", willChange: "transform", padding: "4px 0 8px" }}
      >
        {items.map((f, i) => {
          const Icon = f.icon;
          const on = hovIdx === i;
          return (
            <div
              key={i}
              onMouseEnter={() => setHovIdx(i)}
              onMouseLeave={() => setHovIdx(null)}
              style={{
                flexShrink: 0, width: 230,
                background: on ? "#0d0d0f" : "#fff",
                border: `1px solid ${on ? f.accent + "44" : "#e8e8e3"}`,
                borderRadius: 16, padding: "1.25rem 1.2rem",
                cursor: "default",
                transition: "background 0.28s ease, border-color 0.28s ease, transform 0.22s ease, box-shadow 0.28s ease",
                transform: on ? "translateY(-5px) scale(1.01)" : "translateY(0) scale(1)",
                boxShadow: on ? `0 16px 40px ${f.accent}22` : "none",
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: on ? `${f.accent}22` : "#f2f2ef",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "0.85rem", transition: "background 0.28s",
              }}>
                <Icon size={18} color={on ? f.accent : "#999"} strokeWidth={1.6} style={{ transition: "color 0.28s" }} />
              </div>
              <p style={{ margin: "0 0 0.35rem", fontWeight: 600, fontSize: 13.5, color: on ? "#fff" : "#111", transition: "color 0.28s" }}>
                {f.title}
              </p>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.65, color: on ? "rgba(255,255,255,0.42)" : "#8a8a8a", transition: "color 0.28s" }}>
                {f.body}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   STAT ROW
───────────────────────────────────── */
function StatRow() {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 1, background: "#e2e2dc", border: "1px solid #e2e2dc",
        borderRadius: 16, overflow: "hidden",
      }}
    >
      {STATS.map((s, i) => (
        <div key={i} style={{
          background: "#fff", padding: "1.5rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transition: `opacity 0.5s ease ${0.12 + i * 0.08}s, transform 0.5s ease ${0.12 + i * 0.08}s`,
        }}>
          <p style={{ margin: "0 0 0.25rem", lineHeight: 1,
            fontSize: "clamp(1.7rem, 3vw, 2.3rem)", fontWeight: 800,
            color: "#0a0a0a",
          }}>{s.n}</p>
          <p style={{ fontSize: 13, color: "#888", margin: 0, fontWeight: 500 }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────
   ANIMATED HEADLINE
───────────────────────────────────── */
function SplitWords({ text, delay = 0, style = {} }: { text: string; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useScrollReveal();
  return (
    <span ref={ref} style={{ display: "inline" }}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{
          display: "inline-block", marginRight: "0.28em",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(22px)",
          transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay + i * 0.07}s, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay + i * 0.07}s`,
          ...style,
        }}>{w}</span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────
   CTA BLOCK
───────────────────────────────────── */
function CTABlock() {
  const { ref, visible } = useScrollReveal();
  const tilt = useTilt();

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(50px)",
      transition: "opacity 0.8s ease, transform 0.8s ease",
    }}>
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMove}
        onMouseLeave={tilt.onLeave}
        style={{ position: "relative", background: "#09090b", borderRadius: 24, overflow: "hidden", transition: "transform 0.2s ease" }}
      >
        {/* Animated orbs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", top: "-20%", left: "-8%", background: "radial-gradient(circle, #6366f190 0%, transparent 70%)", animation: "orb1 8s ease-in-out infinite alternate" }} />
          <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", bottom: "-20%", right: "-5%", background: "radial-gradient(circle, #f472b655 0%, transparent 70%)", animation: "orb2 10s ease-in-out infinite alternate" }} />
          <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", top: "30%", right: "28%", background: "radial-gradient(circle, #38bdf844 0%, transparent 70%)", animation: "orb3 7s ease-in-out infinite alternate" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, padding: "clamp(2.5rem,6vw,5rem)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.5rem" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            — Ready when you are
          </span>
          <h2 style={{
            fontWeight: 800,
            fontSize: "clamp(2rem, 5.5vw, 3.75rem)", color: "#fff",
            margin: 0, lineHeight: 1.08, maxWidth: 700, letterSpacing: "-0.02em",
          }}>
            Ship your next app<br />before lunch.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 16, maxWidth: 460, lineHeight: 1.75, margin: 0 }}>
            Thousands of developers and founders are using Spawn to turn ideas into production apps — faster than ever.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
            <a href="/sign-up" className="cta-primary" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 12,
              background: "#fff", color: "#09090b", fontSize: 15, fontWeight: 700,
              textDecoration: "none", letterSpacing: "-0.01em",
              transition: "transform 0.15s ease, box-shadow 0.2s ease",
            }}>
              <Sparkles size={15} /> Get started free
            </a>
            <a href="#demo" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 12,
              background: "transparent", border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.65)", fontSize: 15, fontWeight: 500,
              textDecoration: "none", transition: "border-color 0.2s, color 0.2s",
            }}>
              See it in action →
            </a>
          </div>
          {/* Social proof avatars */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "0.25rem" }}>
            {["#6366f1","#f472b6","#38bdf8","#4ade80"].map((bg, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: "50%",
                background: bg, border: "2px solid #09090b",
                marginLeft: i > 0 ? -10 : 0, zIndex: 4 - i,
              }} />
            ))}
            <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.38)", marginLeft: 8 }}>
              +4,200 builders joined this month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────── */
export default function Features() {
  return (
    <>
      <style>{`
        #spawn-features { color: #111; background: #fff; }
        #spawn-features * { box-sizing: border-box; }

        .pcard:hover .card-glow { opacity: 0.13 !important; }
        .pcard:hover .card-line { opacity: 1 !important; }
        .pcard:hover { box-shadow: 0 28px 70px rgba(0,0,0,0.28) !important; }
        .cta-primary:hover { transform: scale(1.03); box-shadow: 0 0 35px rgba(255,255,255,0.18); }

        @keyframes orb1 { from { transform: translate(0,0) scale(1); } to { transform: translate(55px,40px) scale(1.2); } }
        @keyframes orb2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-45px,-28px) scale(1.15); } }
        @keyframes orb3 { from { transform: translate(0,0) scale(1); } to { transform: translate(28px,-38px) scale(0.88); } }
      `}</style>

      <section id="spawn-features" style={{ width: "100%", overflow: "hidden" }}>

        {/* ── INTRO ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 2rem 0" }}>

          {/* Pill badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#f3f2ef", border: "1px solid #e5e4e0",
            borderRadius: 100, padding: "5px 14px 5px 6px", marginBottom: "2.25rem",
          }}>
            <span style={{ background: "#111", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", padding: "3px 8px", borderRadius: 100, textTransform: "uppercase" }}>
              New
            </span>
            <span style={{ fontSize: 13, color: "#555" }}>Spawn 2.0 — now with multi-agent generation</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontWeight: 900,
            fontSize: "clamp(2.8rem, 6.5vw, 6rem)", lineHeight: 1.03,
            letterSpacing: "-0.04em", color: "#0a0a0a", margin: "0 0 1.5rem", maxWidth: 860,
          }}>
            <SplitWords text="The fastest way to" />
            <br />
            <span style={{ display: "inline-block", background: "linear-gradient(135deg,#6366f1,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              <SplitWords text="ship production apps."  />
            </span>
          </h1>

          <p style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)", color: "#666", lineHeight: 1.78, maxWidth: 560, margin: "0 0 3.5rem" }}>
            A complete toolkit engineered for speed, quality, and scalability —
            without requiring a single line of code.
          </p>
        </div>

        {/* ── PRIMARY CARDS ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem 7rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {PRIMARY.map((f, i) => <PrimaryCard key={i} f={f} i={i} />)}
          </div>
        </div>

        {/* ── SECONDARY: "Everything else" ── */}
        <div style={{ background: "#f8f8f6", borderTop: "1px solid #ebebea", borderBottom: "1px solid #ebebea", padding: "5rem 0 4.5rem" }}>

          {/* Editorial header */}
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem 2.75rem" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
              <div>
                <p style={{ fontSize: 11, color: "#999", letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 0.65rem" }}>
                  — 06 capabilities
                </p>
                <h2 style={{
                  fontWeight: 800,
                  fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "#0a0a0a",
                  margin: 0, lineHeight: 1.12, letterSpacing: "-0.03em",
                }}>
                  Everything else<br />you need to ship.
                </h2>
              </div>
              <p style={{ fontSize: 14.5, color: "#777", maxWidth: 360, lineHeight: 1.78, margin: 0 }}>
                Security, theming, deployment, databases — the scaffolding your app needs, built and wired automatically.
              </p>
            </div>
          </div>

          {/* Auto-scrolling ticker */}
          <SecondaryTicker />

          {/* Stats */}
          <div style={{ maxWidth: 1200, margin: "2.75rem auto 0", padding: "0 2rem" }}>
            <StatRow />
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "5rem 2rem 6rem" }}>
          <CTABlock />
        </div>

      </section>
    </>
  );
}