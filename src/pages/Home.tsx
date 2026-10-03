/**
 * Home page – hero in deep forest (#0A2E22), ivory-dominant featured & how-it-works sections.
 * Strictly adheres to design tokens: --forest, --bg, --surface, --surface-warm, --border,
 * --ink, --muted, --on-forest, --muted-on-forest, --emerald, --gold.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Building2, BarChart3, Heart, MapPin, Sparkles, Tag } from "lucide-react";
import { properties, getAreas, PROPERTY_TYPES } from "../data/properties";
import PropertyCard from "../components/PropertyCard";
import PropertyMap from "../components/PropertyMap";
import AiSearchBar from "../components/AiSearchBar";
import Loader from "../components/Loader";
import HeroFlythrough from "../components/HeroFlythrough";
import EstateCarouselSection from "../components/EstateCarouselSection";
import InteriorStats from "../components/InteriorStats";
import StarWarpShowreel from "../components/StarWarpShowreel";
import { useLenis } from "../hooks/useLenis";
import type { ParsedSearchFilters } from "../services/aiService";

export default function Home() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  useLenis();

  const [searchArea, setSearchArea] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchBudget, setSearchBudget] = useState("");

  const areas = getAreas();
  const featured = properties.filter((p) => p.isFeatured).slice(0, 4);
  const affordable = properties.filter((p) => p.price < 10_000_000).slice(0, 4);
  const affordableTotal = properties.filter((p) => p.price < 10_000_000).length;

  const [heroSearchMode, setHeroSearchMode] = useState<"ai" | "selectors">("ai");

  /** Build query string and navigate to results */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchArea) params.set("area", searchArea);
    if (searchType) params.set("type", searchType);
    if (searchBudget) params.set("budget", searchBudget);
    navigate(`/results?${params.toString()}`);
  };

  const handleAiSearch = (parsed: ParsedSearchFilters) => {
    const params = new URLSearchParams();
    if (parsed.locality) params.set("area", parsed.locality);
    if (parsed.types && parsed.types.length > 0) params.set("type", parsed.types[0]);
    if (parsed.minPrice !== undefined || parsed.maxPrice !== undefined) {
      params.set("budget", `${parsed.minPrice || 0}-${parsed.maxPrice || ""}`);
    }
    if (parsed.bhk && parsed.bhk.length > 0) {
      params.set("bhk", String(parsed.bhk[0]));
    }
    if (parsed.sortBy) {
      params.set("sort", parsed.sortBy);
    }
    if (parsed.amenities && parsed.amenities.length > 0) {
      params.set("amenities", parsed.amenities.join(","));
    }
    if (parsed.response) {
      params.set("aiResponse", parsed.response);
    }
    navigate(`/results?${params.toString()}`);
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 160,
    padding: "14px 18px",
    borderRadius: "var(--radius-input)",
    border: "1px solid var(--border)",
    backgroundColor: "var(--surface)",
    color: "var(--ink)",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    outline: "none",
    transition: "border-color 200ms ease",
  };

  return (
    <>
      {/* ─── Cinematic Loader Screen ─────────────────────────────── */}
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      <main
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
          background: "var(--bg)",
          minHeight: "100vh",
        }}
      >
        {/* ─── Hero: Cinematic Drone Flythrough & Statement Motion ───── */}
        <HeroFlythrough>
          <div
            style={{
              textAlign: "center",
              background: "rgba(10, 46, 34, 0.72)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              padding: "clamp(24px, 4vw, 40px)",
              borderRadius: "24px",
              border: "1px solid rgba(201, 169, 110, 0.35)",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Top Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: "var(--radius-chip)",
                backgroundColor: "rgba(201, 169, 110, 0.15)",
                border: "1px solid rgba(201, 169, 110, 0.35)",
                color: "var(--gold)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              <Sparkles size={14} />
              Imperial Estates • Hyderabad • 145+ Verified Properties
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(32px, 5vw, 54px)",
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--on-forest)",
                margin: "0 0 12px",
              }}
            >
              Discover Your <span style={{ color: "var(--gold)" }}>Perfect Home in Hyderabad</span>
            </h1>

            <p
              style={{
                fontSize: 15,
                color: "var(--muted-on-forest)",
                lineHeight: 1.6,
                maxWidth: 600,
                margin: "0 auto 24px",
              }}
            >
              From budget-friendly homes starting at ₹22 Lakhs to luxury estates in Jubilee Hills.
              Explore properties mapped across 50+ prime Hyderabad localities.
            </p>

            {/* Search Mode Toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <button
                type="button"
                onClick={() => setHeroSearchMode("selectors")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 16px",
                  borderRadius: "var(--radius-chip)",
                  backgroundColor:
                    heroSearchMode === "selectors" ? "rgba(255,255,255,0.18)" : "transparent",
                  border:
                    heroSearchMode === "selectors"
                      ? "1px solid var(--gold)"
                      : "1px solid rgba(255,255,255,0.18)",
                  color: heroSearchMode === "selectors" ? "var(--gold)" : "var(--muted-on-forest)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
              >
                <Search size={13} />
                Standard Search
              </button>

              <button
                type="button"
                onClick={() => setHeroSearchMode("ai")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 16px",
                  borderRadius: "var(--radius-chip)",
                  backgroundColor:
                    heroSearchMode === "ai" ? "rgba(255,255,255,0.18)" : "transparent",
                  border:
                    heroSearchMode === "ai"
                      ? "1px solid var(--gold)"
                      : "1px solid rgba(255,255,255,0.18)",
                  color: heroSearchMode === "ai" ? "var(--gold)" : "var(--muted-on-forest)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
              >
                <Sparkles size={13} style={{ color: "var(--gold)" }} />
                Natural AI Search (Offline)
              </button>
            </div>

            {/* Search Input Container */}
            {heroSearchMode === "ai" ? (
              <div style={{ maxWidth: 840, margin: "0 auto" }}>
                <AiSearchBar onFiltersParsed={handleAiSearch} />
              </div>
            ) : (
              <form
                onSubmit={handleSearch}
                style={{
                  maxWidth: 840,
                  margin: "0 auto",
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-elevated)",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <select
                  value={searchArea}
                  onChange={(e) => setSearchArea(e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                  aria-label="Select Hyderabad area"
                >
                  <option value="">All Hyderabad Areas (50+)</option>
                  {areas.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name} ({a.count})
                    </option>
                  ))}
                </select>

                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                  aria-label="Property type"
                >
                  <option value="">Any Type</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                  aria-label="Budget range"
                >
                  <option value="">Any Budget</option>
                  <option value="0-2500000">Under ₹25 L</option>
                  <option value="0-5000000">Under ₹50 L</option>
                  <option value="0-10000000">Under ₹1 Cr ({affordableTotal} options)</option>
                  <option value="10000000-20000000">₹1 Cr – ₹2 Cr</option>
                  <option value="20000000-50000000">₹2 Cr – ₹5 Cr</option>
                  <option value="50000000-100000000">₹5 Cr – ₹10 Cr</option>
                  <option value="100000000-1000000000">Above ₹10 Cr</option>
                </select>

                <button
                  type="submit"
                  aria-label="Search properties"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "14px 28px",
                    borderRadius: "var(--radius-button)",
                    border: "none",
                    backgroundColor: "var(--emerald)",
                    color: "var(--on-forest)",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--emerald-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--emerald)";
                  }}
                >
                  <Search size={16} />
                  Search
                </button>
              </form>
            )}

            {/* Locality Quick Jump Chips on Forest */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 12, color: "var(--muted-on-forest)", fontWeight: 600 }}>
                Popular Areas:
              </span>
              {[
                "Jubilee Hills",
                "Banjara Hills",
                "Gachibowli",
                "Kokapet",
                "Miyapur",
                "Kondapur",
                "Tellapur",
                "Kukatpally",
              ].map((loc) => (
                <button
                  key={loc}
                  onClick={() => navigate(`/results?area=${encodeURIComponent(loc)}`)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "var(--radius-chip)",
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    color: "var(--on-forest)",
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--gold)";
                    e.currentTarget.style.color = "var(--forest)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
                    e.currentTarget.style.color = "var(--on-forest)";
                  }}
                >
                  {loc}
                </button>
              ))}
              <button
                onClick={() => navigate("/results?budget=0-10000000")}
                style={{
                  padding: "4px 12px",
                  borderRadius: "var(--radius-chip)",
                  backgroundColor: "var(--gold)",
                  border: "1px solid var(--gold)",
                  color: "var(--forest)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
              >
                💰 Under ₹1 Cr ({affordableTotal})
              </button>
            </div>
          </div>
        </HeroFlythrough>

        {/* ─── 3D Circular Estate Showcase Carousel ─────────────────── */}
        <EstateCarouselSection />

        {/* ─── Parallax Ride-Up Interior & Drum-Roll Counters ────────── */}
        <InteriorStats />

        {/* ─── Star Warp Iris Transition & 4K Showroom Video ─────────── */}
        <StarWarpShowreel />

      {/* ─── Budget-Friendly Homes Under ₹1 Cr ─────────────────────── */}
      <section style={{ padding: "64px 0", backgroundColor: "var(--surface-warm)", borderBottom: "1px solid var(--border)" }}>
        <div className="container-estate">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 40,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Tag size={16} style={{ color: "var(--emerald)" }} />
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--emerald)",
                    margin: 0,
                  }}
                >
                  Budget & Affordable Living
                </p>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 34,
                  fontWeight: 600,
                  margin: "0 0 6px",
                  color: "var(--ink)",
                }}
              >
                Homes Under ₹1 Crore
              </h2>
              <p style={{ fontSize: 14, color: "var(--muted)", margin: 0 }}>
                High-value 1, 2 & 3 BHK flats in Miyapur, Lingampally, Hafeezpet, Kukatpally, and more.
              </p>
            </div>
            <a
              href="/results?budget=0-10000000"
              onClick={(e) => {
                e.preventDefault();
                navigate("/results?budget=0-10000000");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--emerald)",
                textDecoration: "none",
                transition: "gap 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.gap = "10px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.gap = "6px";
              }}
            >
              View All {affordableTotal} Affordable Homes <ArrowRight size={16} />
            </a>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
            }}
          >
            {affordable.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Luxury Estates (Ivory Dominant) ─────────────── */}
      <section style={{ padding: "64px 0" }}>
        <div className="container-estate">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 40,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--emerald)",
                  marginBottom: 8,
                }}
              >
                Premier Collection
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 34,
                  fontWeight: 600,
                  margin: 0,
                  color: "var(--ink)",
                }}
              >
                Handpicked Luxury Estates
              </h2>
            </div>
            <a
              href="/results"
              onClick={(e) => {
                e.preventDefault();
                navigate("/results");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--emerald)",
                textDecoration: "none",
                transition: "gap 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.gap = "10px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.gap = "6px";
              }}
            >
              View All <ArrowRight size={16} />
            </a>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
            }}
          >
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Hyderabad Interactive Map Section ─── */}
      <section style={{ padding: "64px 0 80px", backgroundColor: "var(--surface)" }}>
        <div className="container-estate">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 32,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--emerald)",
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>🗺️</span> Google Maps Geographic Discovery
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 34,
                  fontWeight: 600,
                  margin: 0,
                  color: "var(--ink)",
                }}
              >
                Google Maps • {properties.length}+ Properties Across Hyderabad
              </h2>
              <p style={{ fontSize: 14, color: "var(--muted)", margin: "4px 0 0" }}>
                Switch between Google Maps Streets, Satellite imagery, and Terrain mode. Click any marker to view prices or open turn-by-turn Google Maps directions.
              </p>
            </div>
            <a
              href="/results"
              onClick={(e) => {
                e.preventDefault();
                navigate("/results");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--emerald)",
                textDecoration: "none",
              }}
            >
              Explore Full Map View <ArrowRight size={16} />
            </a>
          </div>

          <div style={{ height: 500, borderRadius: "var(--radius-card)", overflow: "hidden", border: "1px solid var(--border)" }}>
            <PropertyMap properties={properties} height="100%" />
          </div>
        </div>
      </section>

      {/* ─── Explore Hyderabad Localities ─── */}
      <section style={{ padding: "64px 0", backgroundColor: "var(--bg)" }}>
        <div className="container-estate">
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--emerald)", marginBottom: 8 }}>
              <MapPin size={16} />
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Area Guide
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 32,
                fontWeight: 600,
                color: "var(--ink)",
                margin: 0,
              }}
            >
              Explore by Hyderabad Neighborhood
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
              Select a locality to browse verified residences and real price trends.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            {areas.slice(0, 18).map((area) => (
              <button
                key={area.name}
                onClick={() => navigate(`/results?area=${encodeURIComponent(area.name)}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: "var(--radius-card)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--emerald)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                    {area.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    {area.count} {area.count === 1 ? "residence" : "residences"}
                  </div>
                </div>
                <ArrowRight size={14} style={{ color: "var(--muted)" }} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works (Warm Surface Inset) ───────────────────── */}
      <section
        style={{
          padding: "72px 0",
          backgroundColor: "var(--surface-warm)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container-estate">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 32,
                fontWeight: 600,
                margin: "0 0 8px",
                color: "var(--ink)",
              }}
            >
              How Imperial Estates Works
            </h2>
            <p style={{ fontSize: 15, color: "var(--muted)", margin: 0 }}>
              Three simple steps to finding your ideal property in Hyderabad
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
          >
            {[
              {
                icon: Building2,
                title: "Explore",
                desc: "Browse 145+ verified properties across Hyderabad's top neighborhoods, filtered by area, budget, or BHK.",
                step: "01",
              },
              {
                icon: BarChart3,
                title: "Compare",
                desc: "Add up to three properties to your compare list for a detailed side-by-side spec and amenity analysis.",
                step: "02",
              },
              {
                icon: Heart,
                title: "Save & Decide",
                desc: "Save your favourites, inspect interactive map locations, and connect directly with full confidence.",
                step: "03",
              },
            ].map(({ icon: Icon, title, desc, step }) => (
              <div
                key={step}
                style={{
                  padding: "32px",
                  borderRadius: "var(--radius-card)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-card)",
                  transition: "all 250ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "var(--shadow-card)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: "var(--surface-warm)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--emerald)",
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 36,
                      fontWeight: 700,
                      color: "var(--border)",
                      lineHeight: 1,
                    }}
                  >
                    {step}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 22,
                    fontWeight: 600,
                    margin: "0 0 8px",
                    color: "var(--ink)",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--muted)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
