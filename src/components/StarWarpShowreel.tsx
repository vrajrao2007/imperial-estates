"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "A place where precision and creativity connect";

export default function StarWarpShowreel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const warpPinRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<SVGSVGElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const warpPin = warpPinRef.current;
    const star = starRef.current;
    const headline = headlineRef.current;
    if (!container || !warpPin || !star) return;

    const ctx = gsap.context(() => {
      // 1. Star Warp Zoom Transition (pinned scroll)
      gsap.set(star, { scale: 1, transformOrigin: "50% 50%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: warpPin,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.8,
        },
      });

      tl.to(star, {
        scale: 75,
        ease: "power2.in",
        duration: 1.5,
      });

      // 2. Letter-by-letter headline reveal
      if (headline) {
        const letters = headline.querySelectorAll<HTMLSpanElement>(".starwarp-letter");
        gsap.fromTo(
          letters,
          { y: "110%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            stagger: 0.02,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: {
              trigger: headline,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* 1. STAR WARP IRIS PINNED SECTION */}
      <div
        ref={warpPinRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          background: "var(--forest)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            textAlign: "center",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <p className="label" style={{ color: "var(--ivory)", opacity: 0.6 }}>
            TRANSITION INTO SANCTUARY
          </p>
        </div>

        {/* 4-point luxury star SVG */}
        <svg
          ref={starRef}
          viewBox="0 0 100 100"
          style={{
            width: 50,
            height: 50,
            zIndex: 10,
            willChange: "transform",
            overflow: "visible",
          }}
        >
          {/* Authentic 4-point star path */}
          <path
            d="M50 0 C50 30 70 50 100 50 C70 50 50 70 50 100 C50 70 30 50 0 50 C30 50 50 30 50 0 Z"
            fill="var(--sage)"
          />
        </svg>
      </div>

      {/* 2. SHOWROOM SECTION (Sage Background #5F6B57) */}
      <section
        style={{
          background: "var(--sage)",
          color: "var(--ivory)",
          minHeight: "100vh",
          padding: "6rem 5vw 8rem",
          position: "relative",
          zIndex: 15,
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Kicker + Hairline Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              marginBottom: "3.5rem",
            }}
          >
            {/* Small 4-point star accent */}
            <svg width={14} height={14} viewBox="0 0 100 100">
              <path
                d="M50 0 C50 30 70 50 100 50 C70 50 50 70 50 100 C50 70 30 50 0 50 C30 50 50 30 50 0 Z"
                fill="var(--champagne)"
              />
            </svg>
            <span
              className="label"
              style={{
                color: "var(--ivory)",
                letterSpacing: "0.22em",
                fontWeight: 600,
                fontSize: "11px",
              }}
            >
              SHOWROOM
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(247, 244, 236, 0.25)",
              }}
            />
          </div>

          {/* 16:9 Video Card */}
          <div
            style={{
              width: "100%",
              maxWidth: 960,
              margin: "0 auto 4rem",
              aspectRatio: "16 / 9",
              position: "relative",
              borderRadius: "4px",
              overflow: "hidden",
              background: "var(--forest)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
              border: "1px solid rgba(247, 244, 236, 0.15)",
            }}
          >
            {isPlaying ? (
              <video
                src="/showreel.mp4"
                controls
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  backgroundImage: "url('/interior.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Dark overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(10, 46, 34, 0.45)",
                  }}
                />

                {/* Play Button */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  aria-label="Play Showreel"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "rgba(247, 244, 236, 0.15)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(247, 244, 236, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "transform 0.3s ease, background 0.3s ease",
                    }}
                  >
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="var(--ivory)"
                      style={{ marginLeft: 3 }}
                    >
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                  </div>
                </button>

                {/* Video tag overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "1.5rem",
                    left: "2rem",
                  }}
                >
                  <span className="label" style={{ color: "var(--ivory)", opacity: 0.85 }}>
                    Imperial Estates Experience / 4K Architecture
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Letter-by-letter Statement Headline */}
          <h3
            ref={headlineRef}
            style={{
              fontFamily: "'Inter Tight', system-ui, sans-serif",
              fontSize: "clamp(2rem, 4.5vw, 4.2rem)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "var(--ivory)",
              maxWidth: 960,
              margin: "0 auto 3.5rem",
              textAlign: "center",
            }}
          >
            {HEADLINE.split("").map((char, index) => (
              <span
                key={index}
                style={{
                  overflow: "hidden",
                  display: "inline-block",
                  verticalAlign: "top",
                }}
              >
                <span
                  className="starwarp-letter"
                  style={{
                    display: "inline-block",
                    whiteSpace: char === " " ? "pre" : "normal",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
          </h3>

          {/* Right-aligned Address Block */}
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <p
                className="label"
                style={{
                  color: "var(--ivory)",
                  opacity: 0.9,
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                }}
              >
                Road No. 36, Jubilee Hills
              </p>
              <p
                className="label"
                style={{
                  color: "var(--champagne)",
                  opacity: 0.95,
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  marginTop: "0.35rem",
                }}
              >
                Hyderabad, Telangana 500033
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}