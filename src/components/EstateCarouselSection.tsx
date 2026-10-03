import CircularCarousel from "./CircularCarousel";

const ESTATE_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&auto=format&fit=crop",
    alt: "Modern luxury villa with panoramic glass",
    title: "Villa Mirador",
    subtitle: "Lake Como, Italy"
  },
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80&auto=format&fit=crop",
    alt: "Contemporary limestone estate at dusk",
    title: "The Glasshouse Sanctuary",
    subtitle: "Aspen, Colorado"
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format&fit=crop",
    alt: "Minimalist concrete and water pavilion",
    title: "The Mayfair Penthouse",
    subtitle: "London, UK"
  },
  {
    src: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80&auto=format&fit=crop",
    alt: "Japanese cedar woodland retreat",
    title: "Kyoto Forest Residence",
    subtitle: "Kyoto, Japan"
  },
  {
    src: "/interior.jpg",
    alt: "Bryn Bella Manor grand hall",
    title: "Bryn Bella Manor",
    subtitle: "Denbighshire, Wales"
  },
  {
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80&auto=format&fit=crop",
    alt: "Mediterranean clifftop villa overlooking sea",
    title: "Azure Horizon Villa",
    subtitle: "Mallorca, Spain"
  },
  {
    src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80&auto=format&fit=crop",
    alt: "Sculptural alpine monolith architecture",
    title: "Monolith Alpine Lodge",
    subtitle: "Zermatt, Switzerland"
  },
  {
    src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80&auto=format&fit=crop",
    alt: "Grand private courtyard residence",
    title: "The Obsidian Pavilion",
    subtitle: "Beverly Hills, California"
  }
];

export default function EstateCarouselSection() {
  return (
    <section
      style={{
        background: "var(--forest)",
        color: "var(--ivory)",
        minHeight: "100vh",
        padding: "7rem 4vw 6rem",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Ambient background light */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vw",
          height: "450px",
          background: "radial-gradient(circle at 50% 50%, rgba(31,111,84,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header kicker */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem", zIndex: 2 }}>
        <p
          className="label"
          style={{
            color: "var(--champagne)",
            fontSize: "11px",
            letterSpacing: "0.28em",
            fontWeight: 600,
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          CURATED PRIVATE PORTFOLIO
        </p>

        <h2
          style={{
            fontFamily: "'Inter Tight', system-ui, sans-serif",
            fontSize: "clamp(2.75rem, 6.5vw, 6.5rem)",
            fontWeight: 200,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "var(--ivory)",
            margin: "0 0 1rem",
          }}
        >
          EXPLORE THE RESIDENCES
        </h2>

        <p
          style={{
            color: "rgba(247,244,236,0.6)",
            fontSize: "13px",
            letterSpacing: "0.12em",
            fontFamily: "var(--font-sans)",
            textTransform: "uppercase",
          }}
        >
          Drag or spin to navigate architectural sanctuaries
        </p>
      </div>

      {/* â”€â”€â”€ CircularCarousel 3D Cylinder Container â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          height: "clamp(560px, 68vh, 760px)",
          position: "relative",
          zIndex: 5,
        }}
      >
        <CircularCarousel
          items={ESTATE_ITEMS}
          preset="cylinder"
          intro="rise"
          cardWidth={260}
          aspectRatio={1}
          speed={12}
          fadeColor="#0A2E22"
          captions
          cornerRadius={14}
          draggable
          focusOnClick
          pauseOnHover
          parallax={0.35}
        />
      </div>

      {/* Direct CTA button to full catalog */}
      <div style={{ marginTop: "3.5rem", zIndex: 10, textAlign: "center" }}>
        <a
          href="http://localhost:5173/results"
          className="label"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.85rem 2.2rem",
            borderRadius: "9999px",
            background: "rgba(201,169,110,0.15)",
            border: "1px solid rgba(201,169,110,0.35)",
            color: "var(--champagne)",
            textDecoration: "none",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.2em",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--champagne)";
            e.currentTarget.style.color = "var(--forest)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(201,169,110,0.15)";
            e.currentTarget.style.color = "var(--champagne)";
          }}
        >
          VIEW FULL RESIDENCE REGISTRY â†’
        </a>
      </div>
    </section>
  );
}