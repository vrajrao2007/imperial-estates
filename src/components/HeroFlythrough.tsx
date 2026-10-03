import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroFlythroughProps {
  children?: React.ReactNode;
}

export default function HeroFlythrough({ children }: HeroFlythroughProps) {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wordsSet1Ref = useRef<HTMLDivElement>(null);
  const wordsSet2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const set1 = wordsSet1Ref.current;
    const set2 = wordsSet2Ref.current;
    if (!section || !video) return;

    // ── 1. Video Playback ───────────────────────────────────────────
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.playbackRate = 1.0;

    const playVideo = () => {
      if (video.paused) {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch(() => {
            const resumeOnInteraction = () => {
              video.play().catch(() => {});
              window.removeEventListener("pointerdown", resumeOnInteraction);
              window.removeEventListener("keydown", resumeOnInteraction);
              window.removeEventListener("scroll", resumeOnInteraction);
            };
            window.addEventListener("pointerdown", resumeOnInteraction, { once: true });
            window.addEventListener("keydown", resumeOnInteraction, { once: true });
            window.addEventListener("scroll", resumeOnInteraction, { once: true });
          });
        }
      }
    };

    playVideo();
    video.addEventListener("canplay", playVideo);
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("ended", () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });

    const handleVisibility = () => {
      if (!document.hidden) playVideo();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const stallInterval = setInterval(() => {
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    }, 2000);

    // ── 2. Scroll Animation Timeline ────────────────────────────────
    const ctx = gsap.context(() => {
      // Entrance reveal for Set 1
      gsap.fromTo(
        ".word-set-1",
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          delay: 0.25,
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      tl.to(video, {
        scale: 1.15,
        yPercent: 10,
        ease: "none",
      }, 0);

      if (set1 && set2) {
        tl.to(set1, {
          opacity: 0,
          y: -40,
          ease: "power2.inOut",
          duration: 0.35,
        }, 0.1);

        tl.fromTo(set2, 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.35 },
          0.35
        );

        tl.to(set2, {
          opacity: 0.2,
          y: -20,
          ease: "power1.in",
          duration: 0.3,
        }, 0.7);
      }
    }, section);

    return () => {
      ctx.revert();
      clearInterval(stallInterval);
      document.removeEventListener("visibilitychange", handleVisibility);
      video.removeEventListener("canplay", playVideo);
      video.removeEventListener("loadeddata", playVideo);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "135vh",
        position: "relative",
        background: "var(--forest)",
      }}
    >
      {/* Sticky Viewport Container */}
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Luxury Architectural Estate Hero Background Image (Always visible immediately) */}
        <div
          style={{
            position: "absolute",
            inset: "-5%",
            width: "110%",
            height: "110%",
            backgroundImage: "url('/hero-estate.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center 45%",
            filter: "brightness(0.82) contrast(1.08)",
            willChange: "transform",
          }}
        />

        {/* Live Drone Video Background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-estate.jpg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            filter: "brightness(0.72) contrast(1.08) saturate(1.05)",
            transformOrigin: "center center",
            willChange: "transform",
            transform: "translate3d(0,0,0)",
          }}
        >
          <source src="/flythrough.webm" type="video/webm" />
          <source src="/flythrough.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: [
              "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(10,46,34,0.18) 0%, rgba(10,46,34,0.75) 100%)",
              "linear-gradient(to bottom, rgba(10,46,34,0.45) 0%, transparent 25%, transparent 70%, rgba(10,46,34,0.85) 100%)",
            ].join(", "),
            pointerEvents: "none",
          }}
        />

        {/* Statement Word Set 1 */}
        <div
          ref={wordsSet1Ref}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 4,
          }}
        >
          <div style={{ position: "absolute", top: "12vh", left: "4vw", overflow: "hidden" }}>
            <div className="word-set-1 statement">IMPERIAL</div>
          </div>

          <div style={{ position: "absolute", top: "34vh", right: "5vw", overflow: "hidden" }}>
            <div
              className="word-set-1 statement"
              style={{ fontSize: "clamp(3.5rem, 8vw, 10vw)", color: "var(--gold)" }}
            >
              ESTATES
            </div>
          </div>

          <div style={{ position: "absolute", bottom: "14vh", left: "4vw", overflow: "hidden" }}>
            <div className="word-set-1 statement" style={{ fontSize: "clamp(2.5rem, 6vw, 7vw)", opacity: 0.6 }}>
              HYDERABAD
            </div>
          </div>
        </div>

        {/* Statement Word Set 2 */}
        <div
          ref={wordsSet2Ref}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 4,
            opacity: 0,
          }}
        >
          <div style={{ position: "absolute", top: "12vh", left: "4vw", overflow: "hidden" }}>
            <div className="statement">HARMONY</div>
          </div>

          <div style={{ position: "absolute", top: "34vh", right: "5vw", overflow: "hidden" }}>
            <div
              className="statement"
              style={{ fontSize: "clamp(3.5rem, 8vw, 10vw)" }}
            >
              IN
            </div>
          </div>

          <div style={{ position: "absolute", bottom: "14vh", right: "5vw", overflow: "hidden" }}>
            <div className="statement" style={{ color: "var(--gold)" }}>
              NATURE
            </div>
          </div>
        </div>

        {/* Top-Right: Get a Quote / Viewing */}
        <button
          onClick={() => navigate("/results")}
          className="label"
          style={{
            position: "absolute",
            top: "2rem",
            right: "2.5rem",
            zIndex: 20,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "0.65rem 1.4rem",
            borderRadius: "9999px",
            background: "rgba(247,244,236,0.1)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(201, 169, 110, 0.4)",
            color: "var(--gold)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gold)";
            e.currentTarget.style.background = "rgba(201,169,110,0.25)";
            e.currentTarget.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.4)";
            e.currentTarget.style.background = "rgba(247,244,236,0.1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          EXPLORE CATALOG ↗
        </button>

        {/* Bottom-Right 2-Line Caption */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            right: "2.5rem",
            textAlign: "right",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <p className="label" style={{ fontSize: "10px", letterSpacing: "0.22em", color: "var(--on-forest)", opacity: 0.85 }}>
            AWARD WINNING RESIDENCES
          </p>
          <p className="label" style={{ fontSize: "10px", letterSpacing: "0.22em", color: "var(--gold)", opacity: 0.95, marginTop: "0.3rem" }}>
            SCROLL TO EXPLORE ↓
          </p>
        </div>

        {/* Interactive Center Content (AI Search & Selectors) */}
        {children && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 15,
              width: "92%",
              maxWidth: 920,
            }}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}