"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface LoaderProps {
  onComplete: () => void;
}

const COLS = 8;
const ROWS = 5;

export default function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // Digital drum counter 000 to 100
      const counter = { val: 0 };
      tl.to(counter, {
        val: 100,
        duration: 1.4,
        ease: "power2.inOut",
        onUpdate() {
          if (counterRef.current) {
            const v = Math.round(counter.val);
            counterRef.current.textContent = String(v).padStart(3, "0");
          }
        },
      });

      // Staggered grid curtain wipe-out
      const tiles = gsap.utils.toArray<HTMLElement>(".loader-tile");
      tl.to(
        tiles,
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.65,
          ease: "expo.inOut",
          stagger: {
            grid: [ROWS, COLS],
            from: "random",
            amount: 0.45,
          },
        },
        "-=0.1"
      );

      tl.to(
        containerRef.current,
        {
          autoAlpha: 0,
          duration: 0.25,
          ease: "power2.out",
        },
        "+=0.05"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [mounted, onComplete]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--forest)",
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        overflow: "hidden",
      }}
    >
      {Array.from({ length: COLS * ROWS }).map((_, i) => (
        <div
          key={i}
          className="loader-tile"
          style={{
            background:
              i % 4 === 0
                ? "#0A2E22"
                : i % 4 === 1
                ? "#0E3A28"
                : i % 4 === 2
                ? "#124230"
                : "#0D3324",
            clipPath: "inset(0 0 0% 0)",
            willChange: "clip-path",
          }}
        />
      ))}

      {/* Brand Watermark & Rolling Counter */}
      <div
        style={{
          position: "absolute",
          top: "3rem",
          left: "3.5rem",
          zIndex: 10,
        }}
      >
        <span className="label" style={{ color: "var(--gold)", opacity: 0.9 }}>
          IMPERIAL ESTATES / ARCHITECTURAL INAUGURATION
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "3rem",
          right: "3.5rem",
          display: "flex",
          alignItems: "baseline",
          gap: "0.4rem",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <span
          ref={counterRef}
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(3.5rem, 8vw, 8rem)",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            color: "var(--on-forest)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          000
        </span>
        <span
          style={{
            fontFamily: "var(--font-heading), 'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.2rem, 2.5vw, 2.2rem)",
            fontWeight: 300,
            color: "var(--gold)",
            opacity: 0.85,
          }}
        >
          %
        </span>
      </div>
    </div>
  );
}