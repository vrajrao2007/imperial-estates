"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function DrumCounter({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rollRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const totalDigits = target + 1;

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top 85%",
      end: "bottom 35%",
      scrub: 1.2,
      onUpdate: (self) => {
        const h = el.clientHeight / totalDigits;
        const currentProgress = self.progress;
        const targetY = -currentProgress * (totalDigits - 1) * h;
        const speed = Math.abs(self.getVelocity());
        const blurAmount = Math.min(speed / 500, 5);

        gsap.to(el, {
          y: targetY,
          filter: `blur(${blurAmount}px)`,
          duration: 0.15,
          ease: "power1.out",
          overwrite: "auto",
        });
      },
      onLeave: () => {
        const h = el.clientHeight / totalDigits;
        gsap.to(el, {
          y: -(totalDigits - 1) * h,
          filter: "blur(0px)",
          duration: 0.4,
          ease: "power2.out",
        });
      },
    });

    return () => st.kill();
  }, [target]);

  return (
    <div ref={containerRef} style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.2rem" }}>
        <div
          style={{
            height: "clamp(5rem, 11vw, 10rem)",
            overflow: "hidden",
            position: "relative",
            lineHeight: 1,
          }}
        >
          <div
            ref={rollRef}
            style={{
              display: "flex",
              flexDirection: "column",
              willChange: "transform, filter",
            }}
          >
            {Array.from({ length: target + 1 }, (_, i) => (
              <span
                key={i}
                style={{
                  height: "clamp(5rem, 11vw, 10rem)",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "'Inter Tight', system-ui, sans-serif",
                  fontSize: "clamp(5rem, 11vw, 10rem)",
                  fontWeight: 200,
                  letterSpacing: "-0.05em",
                  color: "var(--ivory)",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {i < 10 && target >= 10 ? String(i).padStart(2, "0") : i}
              </span>
            ))}
          </div>
        </div>
        {suffix && (
          <span
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 200,
              color: "var(--champagne)",
              opacity: 0.8,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      <p
        className="label"
        style={{
          marginTop: "0.75rem",
          color: "var(--ivory)",
          opacity: 0.7,
          letterSpacing: "0.22em",
        }}
      >
        {label}
      </p>
    </div>
  );
}

export default function InteriorStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImgRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax ride-up
      if (bgImgRef.current) {
        gsap.fromTo(
          bgImgRef.current,
          { yPercent: 20, scale: 1.08 },
          {
            yPercent: -15,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Frosted card entrance
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "120vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 4vw",
        background: "var(--forest)",
      }}
    >
      {/* Parallax interior image container */}
      <div
        ref={bgImgRef}
        style={{
          position: "absolute",
          inset: "-20% 0",
          width: "100%",
          height: "140%",
          backgroundImage: "url('/interior.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          willChange: "transform",
        }}
      />

      {/* Luxury Vignette Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,46,34,0.7) 0%, rgba(10,46,34,0.4) 40%, rgba(10,46,34,0.85) 100%)",
        }}
      />

      {/* Frosted Glass Stat Card */}
      <div
        ref={cardRef}
        style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          maxWidth: 1280,
          background: "rgba(10, 46, 34, 0.65)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border: "1px solid rgba(247, 244, 236, 0.12)",
          borderRadius: "4px",
          padding: "clamp(2.5rem, 5vw, 5rem)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        }}
      >
        {/* Top kicker */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(247, 244, 236, 0.1)",
            paddingBottom: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--champagne)",
                boxShadow: "0 0 10px var(--champagne)",
              }}
            />
            <p className="label" style={{ color: "var(--ivory)", opacity: 0.9 }}>
              Award Winning Architectural Masterpiece
            </p>
          </div>
          <p className="label" style={{ color: "var(--champagne)", opacity: 0.85 }}>
            Monograph 2026
          </p>
        </div>

        {/* Giant wordmark IMPERIAL */}
        <div style={{ overflow: "hidden", marginBottom: "4rem" }}>
          <h2
            style={{
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              fontSize: "clamp(4.5rem, 14vw, 16rem)",
              fontWeight: 200,
              letterSpacing: "-0.06em",
              lineHeight: 0.85,
              color: "var(--ivory)",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            IMPERIAL<span style={{ fontSize: "0.28em", verticalAlign: "top", color: "var(--champagne)", fontWeight: 400, marginLeft: "0.2em" }}>ESTATES</span>
          </h2>
        </div>

        {/* 2 large numeric counters with drum roll */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "3rem",
            borderTop: "1px solid rgba(247, 244, 236, 0.1)",
            paddingTop: "2.5rem",
          }}
        >
          <DrumCounter target={9} label="Ultra-Luxury Penthouses & Villas" />
          <DrumCounter target={45} suffix="+" label="Curated Hyderabad Residences" />
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <p
              style={{
                fontFamily: "'Inter Tight', system-ui, sans-serif",
                fontSize: "15px",
                fontWeight: 300,
                lineHeight: 1.6,
                color: "var(--ivory)",
                opacity: 0.8,
                maxWidth: 340,
              }}
            >
              Every home verified with 100% legal title clearance, panoramic balconies, and premium connectivity to Jubilee Hills & Financial District.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}