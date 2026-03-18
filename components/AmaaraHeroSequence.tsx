"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/* ───────────────────────────── constants ───────────────────────────── */

const TOTAL_FRAMES = 29;
const FRAME_SOURCES = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `/sequence/frame_${i}.jpg`,
);

/** ms per frame — controls animation speed (~24fps feel with easing) */
const FRAME_DURATION = 120;

/** Total auto-play duration in ms */
const PLAY_DURATION = TOTAL_FRAMES * FRAME_DURATION;

/* ───────────────────── Beat timing (ms from start) ─────────────────── */

type BeatConfig = {
  id: string;
  enterAt: number;    // ms when beat fades in
  exitAt: number;     // ms when beat starts to fade out
  align: "left" | "right" | "center";
  interactive?: boolean;
};

const BEATS: BeatConfig[] = [
  { id: "A", enterAt: 0,    exitAt: 1200,  align: "center" },
  { id: "B", enterAt: 1400, exitAt: 2600,  align: "left" },
  { id: "C", enterAt: 2800, exitAt: 4200,  align: "right" },
  { id: "D", enterAt: 4400, exitAt: 999999, align: "center", interactive: true },
];

/* ──────────────────── easing & animation ────────────────────────────── */

const FADE_IN_MS = 600;

const beatTransition = {
  opacity: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as any },
  y: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
} as any;

const beatExit = {
  opacity: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as any },
  y: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
} as any;

/* ───────────────────── GoldPulseAccent ──────────────────────────────── */

function GoldPulseAccent({ className = "" }: { className?: string }) {
  return (
    <motion.span
      className={`h-px bg-[#c9a84c]/70 ${className}`}
      animate={{
        opacity: [0.4, 0.95, 0.4],
        scaleX: [0.95, 1.06, 0.95],
      }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ───────────────────── AmaaraHeroSequence ──────────────────────────── */

export default function AmaaraHeroSequence() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const viewportRef = useRef({ width: 0, height: 0, dpr: 1 });
  const animTimerRef = useRef<number | null>(null);

  const [completedFrames, setCompletedFrames] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activeBeat, setActiveBeat] = useState<string | null>(null);
  const [animDone, setAnimDone] = useState(false);

  /* ── canvas draw (contain fit) ── */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const frame = imagesRef.current[index];
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height, dpr } = viewportRef.current;
    if (width === 0 || height === 0) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);

    if (!frame) return;

    const sw = frame.naturalWidth || frame.width;
    const sh = frame.naturalHeight || frame.height;
    if (sw === 0 || sh === 0) return;

    const scale = Math.min(width / sw, height / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    const dx = (width - dw) / 2;
    const dy = (height - dh) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(frame, dx, dy, dw, dh);
  }, []);

  /* ── canvas resize ── */
  const resizeCanvas = useCallback(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    viewportRef.current = { width: w, height: h, dpr };
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    drawFrame(frameRef.current);
  }, [drawFrame]);

  /* ── preload all frames ── */
  useEffect(() => {
    let cancelled = false;
    const staged: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let done = 0;

    FRAME_SOURCES.forEach((src, i) => {
      const img = new Image();
      img.decoding = "async";

      img.onload = () => {
        if (cancelled) return;
        staged[i] = img;
        done += 1;
        setCompletedFrames(done);

        if (done === TOTAL_FRAMES) {
          imagesRef.current = staged;
          setIsReady(true);
        }
      };

      img.onerror = () => {
        if (cancelled) return;
        done += 1;
        setCompletedFrames(done);

        if (done === TOTAL_FRAMES) {
          imagesRef.current = staged;
          setIsReady(true);
        }
      };

      img.src = src;
    });

    return () => {
      cancelled = true;
      imagesRef.current = [];
    };
  }, []);

  /* ── auto-play animation + timed beats ── */
  useEffect(() => {
    if (!isReady) return;

    resizeCanvas();

    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize, { passive: true });

    // Small delay before starting the cinematic sequence
    const startDelay = setTimeout(() => {
      const startTime = performance.now();

      // Show first beat immediately
      setActiveBeat("A");

      const tick = () => {
        const elapsed = performance.now() - startTime;

        // Frame progression
        const progress = Math.min(1, elapsed / PLAY_DURATION);
        const nextFrame = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(progress * TOTAL_FRAMES),
        );

        if (nextFrame !== frameRef.current) {
          frameRef.current = nextFrame;
          drawFrame(nextFrame);
        }

        // Beat progression
        for (let i = BEATS.length - 1; i >= 0; i--) {
          if (elapsed >= BEATS[i].enterAt) {
            setActiveBeat((prev) => {
              // Don't go backwards
              const prevIdx = BEATS.findIndex((b) => b.id === prev);
              return i >= prevIdx ? BEATS[i].id : prev;
            });
            break;
          }
        }

        // Check if current beat should exit (and no next beat has entered yet)
        const currentBeatIdx = BEATS.findIndex(
          (b) => elapsed >= b.enterAt && elapsed < (BEATS[b.id === BEATS[BEATS.length - 1].id ? BEATS.length - 1 : BEATS.findIndex((bb) => bb.id === b.id) + 1]?.enterAt ?? Infinity),
        );
        if (currentBeatIdx >= 0 && currentBeatIdx < BEATS.length - 1) {
          const beat = BEATS[currentBeatIdx];
          if (elapsed >= beat.exitAt) {
            // In the gap between beats — hide current
            const nextBeat = BEATS[currentBeatIdx + 1];
            if (elapsed < nextBeat.enterAt) {
              setActiveBeat(null);
            }
          }
        }

        if (progress < 1) {
          animTimerRef.current = requestAnimationFrame(tick);
        } else {
          // Animation complete — show final beat permanently
          setActiveBeat("D");
          setAnimDone(true);
        }
      };

      animTimerRef.current = requestAnimationFrame(tick);
    }, FADE_IN_MS);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(startDelay);
      if (animTimerRef.current) cancelAnimationFrame(animTimerRef.current);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [drawFrame, isReady, resizeCanvas]);

  /* ── loading percentage ── */
  const pct = Math.round((completedFrames / TOTAL_FRAMES) * 100);

  /* ─────────────────────────── render ──────────────────────────────── */

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050505]">
      {/* canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full bg-[#050505]"
        aria-hidden
      />

      {/* ambient gold glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgba(201,168,76,0.17)_0%,rgba(5,5,5,0.88)_54%,rgba(5,5,5,1)_86%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 0.25 : 0 }}
        transition={{ duration: 1.5 }}
        aria-hidden
      />

      {/* ──────── Text Beats ──────── */}
      <AnimatePresence mode="wait">
        {/* Beat A — AMAARA Title */}
        {activeBeat === "A" && (
          <motion.div
            key="beat-a"
            className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center pointer-events-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={beatTransition}
          >
            <div className="flex flex-col items-center gap-5">
              <h1
                className="font-cormorant text-[clamp(3.2rem,13vw,9rem)] font-semibold uppercase text-white/90"
                style={{ letterSpacing: "0.3em", lineHeight: 0.95 }}
              >
                AMAARA
              </h1>
              <p className="font-jost text-xl uppercase tracking-[0.28em] text-[#c9a84c] md:text-2xl">
                Cafe &amp; Restaurant
              </p>
              <p className="font-jost text-base tracking-[0.12em] text-white/60 md:text-lg">
                Where Every Bite Tells a Story
              </p>
              <GoldPulseAccent className="w-32" />
            </div>
          </motion.div>
        )}

        {/* Beat B — CRAFTED WITH INTENTION */}
        {activeBeat === "B" && (
          <motion.div
            key="beat-b"
            className="absolute inset-0 z-20 flex items-center justify-start px-6 md:px-12 lg:px-20 text-left pointer-events-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={beatTransition}
          >
            <div className="flex flex-col items-start gap-5 max-w-6xl">
              <h2 className="max-w-4xl font-cormorant text-[clamp(2.2rem,8.5vw,7rem)] font-semibold leading-[0.95] text-white/90">
                CRAFTED WITH INTENTION
              </h2>
              <p className="max-w-2xl font-jost text-base leading-relaxed tracking-[0.04em] text-white/60 md:text-xl">
                Each dish is a canvas. Each ingredient a deliberate choice. Our
                kitchen speaks the language of passion.
              </p>
              <GoldPulseAccent className="w-24" />
            </div>
          </motion.div>
        )}

        {/* Beat C — AN EXPERIENCE */}
        {activeBeat === "C" && (
          <motion.div
            key="beat-c"
            className="absolute inset-0 z-20 flex items-center justify-end px-6 md:px-12 lg:px-20 text-right pointer-events-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={beatTransition}
          >
            <div className="flex flex-col items-end gap-5 max-w-6xl">
              <h2 className="max-w-4xl font-cormorant text-[clamp(2.2rem,8.4vw,7rem)] font-semibold leading-[0.95] text-white/90">
                AN EXPERIENCE, NOT JUST A MEAL
              </h2>
              <p className="max-w-2xl font-jost text-base leading-relaxed tracking-[0.04em] text-white/60 md:text-xl">
                From the first glance to the final bite — Amaara is designed to
                be remembered.
              </p>
              <GoldPulseAccent className="w-28" />
            </div>
          </motion.div>
        )}

        {/* Beat D — YOUR TABLE AWAITS */}
        {activeBeat === "D" && (
          <motion.div
            key="beat-d"
            className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center pointer-events-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={beatTransition}
          >
            <div className="flex flex-col items-center gap-5">
              <h2 className="font-cormorant text-[clamp(2.8rem,10.5vw,8rem)] font-semibold leading-[0.92] text-white/90">
                YOUR TABLE AWAITS
              </h2>
              <p className="font-jost text-lg tracking-[0.14em] text-white/60 md:text-2xl">
                Reserve your evening at Amaara
              </p>
              <div className="mt-2 flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
                <Link
                  href="#reservations"
                  className="inline-flex min-w-52 items-center justify-center border border-[#c9a84c] px-10 py-3.5 font-jost text-sm font-medium uppercase tracking-[0.2em] text-[#c9a84c] transition-all duration-500 hover:bg-[#c9a84c] hover:text-[#050505]"
                >
                  RESERVE NOW
                </Link>
                <Link
                  href="#menu"
                  className="font-jost text-sm uppercase tracking-[0.16em] text-[#c9a84c] transition-opacity hover:opacity-80"
                >
                  Explore Our Menu →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll hint — visible once animation finishes ── */}
      <AnimatePresence>
        {animDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-center"
          >
            <p className="font-jost text-xs uppercase tracking-[0.3em] text-[#c9a84c]">
              Scroll to Explore
            </p>
            <motion.div
              className="mt-3 flex justify-center"
              animate={{ y: [0, 8, 0], opacity: [0.45, 1, 0.45] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="h-3 w-3 rotate-45 border-b border-r border-[#c9a84c]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading overlay ── */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="loader"
            className="absolute inset-0 z-40 flex items-center justify-center bg-[#050505]"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
            }}
          >
            <div className="w-[min(76vw,460px)] text-center">
              <p className="font-cormorant text-3xl font-medium tracking-[0.06em] text-white/90 md:text-4xl">
                Preparing your experience...
              </p>
              <div className="mt-8 h-[1px] w-full bg-white/15">
                <motion.div
                  className="h-full origin-left bg-[#c9a84c]"
                  animate={{ scaleX: completedFrames / TOTAL_FRAMES }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              </div>
              <p className="mt-4 font-jost text-xs uppercase tracking-[0.28em] text-[#c9a84c]">
                {pct}%
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
