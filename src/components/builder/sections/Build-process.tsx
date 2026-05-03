"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  PenLineIcon,
  CpuIcon,
  FileCodeIcon,
  RocketIcon,
} from "lucide-react";

/* ─── Hooks ─── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) scale(1.025)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return { ref, onMove, onLeave };
}

/* ─── Data ─── */
const STEPS = [
  {
    icon: PenLineIcon,
    step: "01",
    title: "Describe Your Idea",
    sub: "Plain language, zero friction",
    body: "Write what you want to build — a landing page, a SaaS dashboard, a blog. Be as vague or detailed as you like. Spawn reads your intent, not just your words.",
    accent: "#6366f1",
    tag: "Input",
  },
  {
    icon: CpuIcon,
    step: "02",
    title: "Spawn Reasons & Plans",
    sub: "Architecture before code",
    body: "Before writing a single line, Spawn maps out the component tree, data model, and page structure. It thinks like an engineer, then acts like one.",
    accent: "#f472b6",
    tag: "Processing",
  },
  {
    icon: FileCodeIcon,
    step: "03",
    title: "Code Is Generated",
    sub: "Clean, modular, yours",
    body: "Components, routes, schemas, styles — everything is generated in one pass. Readable code that follows conventions you'd actually use in production.",
    accent: "#38bdf8",
    tag: "Output",
  },
  {
    icon: RocketIcon,
    step: "04",
    title: "Export & Deploy",
    sub: "Ship in minutes, not days",
    body: "Download the full codebase or push straight to Vercel. Deployment configs, environment files, and README — all included, nothing to configure.",
    accent: "#4ade80",
    tag: "Deploy",
  },
];

/* ─── Step Card ─── */
function StepCard({ s, i }: { s: typeof STEPS[0]; i: number }) {
  const { ref, visible } = useScrollReveal();
  const tilt = useTilt();
  const Icon = s.icon;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(56px) scale(0.97)",
        transition: `opacity 0.75s cubic-bezier(.22,1,.36,1) ${i * 0.14}s,
                     transform 0.75s cubic-bezier(.22,1,.36,1) ${i * 0.14}s`,
      }}
    >
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMove}
        onMouseLeave={tilt.onLeave}
        className="wf-card"
        style={{
          position: "relative",
          background: "#0d0d0f",
          borderRadius: 20,
          padding: "2.25rem",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
          transition: "transform 0.2s ease, box-shadow 0.3s ease",
          cursor: "default",
          height: "100%",
        }}
      >
        {/* Accent glow blob */}
        <div
          className="wf-glow"
          style={{
            position: "absolute", top: -50, right: -50,
            width: 200, height: 200, borderRadius: "50%",
            background: s.accent, opacity: 0.07, filter: "blur(40px)",
            pointerEvents: "none", transition: "opacity 0.3s",
          }}
        />

        {/* Subtle grid */}
        <svg
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.03, pointerEvents: "none" }}
        >
          <defs>
            <pattern id={`wgrid${i}`} width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0L0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#wgrid${i})`} />
        </svg>

        {/* Step index + tag row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", position: "relative", zIndex: 1 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", letterSpacing: "0.15em" }}>
            {s.step} /
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
            color: s.accent, border: `1px solid ${s.accent}44`,
            borderRadius: 100, padding: "3px 10px",
          }}>
            {s.tag}
          </span>
        </div>

        {/* Icon */}
        <div
          className="wf-icon-wrap"
          style={{
            width: 52, height: 52, borderRadius: 14,
            background: `${s.accent}18`, border: `1px solid ${s.accent}28`,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "1.5rem", position: "relative", zIndex: 1,
            transition: "background 0.3s, transform 0.3s",
          }}
        >
          <Icon size={24} color={s.accent} strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3 style={{
          fontWeight: 700,
          fontSize: "clamp(1.3rem, 2.2vw, 1.6rem)", color: "#fff",
          lineHeight: 1.2, margin: "0 0 0.4rem", position: "relative", zIndex: 1,
        }}>
          {s.title}
        </h3>

        {/* Sub label */}
        <p style={{
          fontSize: 11,
          color: s.accent, opacity: 0.75, margin: "0 0 1.1rem",
          letterSpacing: "0.04em", position: "relative", zIndex: 1,
        }}>
          {s.sub}
        </p>

        {/* Body */}
        <p style={{
          fontSize: 14.5, color: "rgba(255,255,255,0.46)", lineHeight: 1.78,
          margin: 0, position: "relative", zIndex: 1,
        }}>
          {s.body}
        </p>

        {/* Bottom accent line */}
        <div
          className="wf-line"
          style={{
            position: "absolute", bottom: 0, left: 0, height: 2, width: "100%",
            background: `linear-gradient(90deg, ${s.accent}00, ${s.accent}, ${s.accent}00)`,
            opacity: 0, transition: "opacity 0.35s",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Scroll-driven connectors (desktop) ─── */
function Connectors({ progress }: { progress: number[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, margin: "2rem 0", position: "relative" }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: progress[i] > 0.9 ? s.accent : "#1e1e22",
            border: `2px solid ${progress[i] > 0.1 ? s.accent : "rgba(255,255,255,0.08)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.5s ease, border-color 0.5s ease",
            zIndex: 1,
            boxShadow: progress[i] > 0.9 ? `0 0 16px ${s.accent}66` : "none",
          }}>
            <span style={{
              fontSize: 9,
              color: progress[i] > 0.9 ? "#000" : "rgba(255,255,255,0.25)",
              fontWeight: 700, transition: "color 0.4s",
            }}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: 2, position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.06)" }}>
              <div style={{
                position: "absolute", top: 0, left: 0, height: "100%",
                width: `${Math.max(0, Math.min(1, (progress[i] - 0.5) * 2)) * 100}%`,
                background: `linear-gradient(90deg, ${s.accent}, ${STEPS[i + 1].accent})`,
                transition: "width 0.1s linear",
              }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Section ─── */
export default function BuildProcess() {
  const segRefs = useRef<HTMLDivElement[]>([]);
  const [progress, setProgress] = useState([0, 0, 0, 0]);
  const header = useScrollReveal();

  useEffect(() => {
    const onScroll = () => {
      const updated = segRefs.current.map((el) => {
        if (!el) return 0;
        const { top } = el.getBoundingClientRect();
        const wh = window.innerHeight;
        return Math.min(1, Math.max(0, (wh * 0.7 - top) / (wh * 0.45)));
      });
      setProgress(updated);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        #spawn-process * { box-sizing: border-box; }
        .wf-card:hover .wf-glow  { opacity: 0.14 !important; }
        .wf-card:hover .wf-line  { opacity: 1 !important; }
        .wf-card:hover            { box-shadow: 0 28px 70px rgba(0,0,0,0.32) !important; }
        .wf-card:hover .wf-icon-wrap { background: rgba(255,255,255,0.06) !important; transform: scale(1.1) rotate(-6deg); }
      `}</style>

      <section
        id="spawn-process"
        style={{ width: "100%", background: "#f8f8f6", borderTop: "1px solid #ebebea", overflow: "hidden" }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "5.5rem 2rem 6rem" }}>

          {/* ── Section Header ── */}
          <div
            ref={header.ref}
            style={{
              opacity: header.visible ? 1 : 0,
              transform: header.visible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
              marginBottom: "3.5rem",
            }}
          >
            {/* Pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#edede9", border: "1px solid #deded8",
              borderRadius: 100, padding: "5px 14px 5px 6px", marginBottom: "1.75rem",
            }}>
              <span style={{
                background: "#111", color: "#fff", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.14em", padding: "3px 8px", borderRadius: 100, textTransform: "uppercase",
              }}>
                How it works
              </span>
              <span style={{ fontSize: 13, color: "#666" }}>Four steps. One prompt.</span>
            </div>

            {/* Heading */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
              <h2 style={{
                fontWeight: 900,
                fontSize: "clamp(2.2rem, 5vw, 4.25rem)", lineHeight: 1.06,
                letterSpacing: "-0.035em", color: "#0a0a0a",
                margin: 0, maxWidth: 640,
              }}>
                From idea to working app —<br />
                <span style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  in under a minute.
                </span>
              </h2>
              <p style={{ fontSize: 15, color: "#777", maxWidth: 340, lineHeight: 1.8, margin: 0, flexShrink: 0 }}>
                No scaffolding. No config files. No second guessing.
                Spawn handles the full stack so you can stay focused on the product.
              </p>
            </div>
          </div>

          {/* ── Connectors (desktop only) ── */}
          <div style={{ display: "none" }} className="wf-connector-wrap">
            <Connectors progress={progress} />
          </div>
          <style>{`@media(min-width:768px){ .wf-connector-wrap { display: block !important; } }`}</style>

          {/* ── Step Cards Grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {STEPS.map((s, i) => (
              <div key={i} ref={(el) => { if (el) segRefs.current[i] = el as HTMLDivElement; }}>
                <StepCard s={s} i={i} />
              </div>
            ))}
          </div>

          {/* ── Bottom metrics strip ── */}
          <div style={{
            marginTop: 56, borderRadius: 16, overflow: "hidden",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            border: "1px solid #e2e2dc", background: "#fff",
          }}>
            {[
              { label: "Average time to first build", value: "< 60s" },
              { label: "Lines of boilerplate avoided", value: "∞" },
              { label: "Frameworks supported", value: "Next.js, React, Vite" },
              { label: "Export format", value: "Full codebase, yours" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "1.6rem 1.75rem",
                borderRight: i < 3 ? "1px solid #e2e2dc" : "none",
              }}>
                <p style={{
                  margin: "0 0 0.35rem",
                  fontWeight: 700,
                  fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)", color: "#0a0a0a", lineHeight: 1.1,
                }}>
                  {item.value}
                </p>
                <p style={{ margin: 0, fontSize: 12.5, color: "#888", fontWeight: 500 }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}