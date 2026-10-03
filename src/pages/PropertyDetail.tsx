/**
 * Property detail page â€“ gallery, key facts, amenities, save/compare actions.
 * Strictly adheres to design tokens: --bg, --surface, --surface-warm, --border,
 * --ink, --muted, --emerald, --gold, --gold-text, --on-forest.
 */
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  GitCompareArrows,
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Calendar,
  Building2,
  Navigation,
} from "lucide-react";
import { properties, formatPrice } from "../data/properties";
import { usePropertyStore } from "../store/usePropertyStore";
import Gallery from "../components/Gallery";
import AmenityGrid from "../components/AmenityGrid";
import PropertyMap from "../components/PropertyMap";
import EmptyState from "../components/EmptyState";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const property = properties.find((p) => p.id === id);
  const { toggleSaved, isSaved, toggleCompare, isInCompare, compareIds } =
    usePropertyStore();

  if (!property) {
    return (
      <main style={{ padding: "80px 0" }}>
        <div className="container-estate">
          <EmptyState
            icon={Building2}
            title="Property not found"
            description="The property you're looking for doesn't exist or has been removed."
            ctaLabel="Browse Properties"
            ctaTo="/results"
          />
        </div>
      </main>
    );
  }

  const saved = isSaved(property.id);
  const inCompare = isInCompare(property.id);
  const compareFull = compareIds.length >= 3 && !inCompare;

  const factStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    padding: "20px 24px",
    borderRadius: "var(--radius-card)",
    backgroundColor: "var(--surface-warm)",
    border: "1px solid var(--border)",
    minWidth: 120,
  };

  return (
    <main style={{ padding: "32px 0 80px" }}>
      <div className="container-estate">
        {/* Back link */}
        <Link
          to="/results"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 500,
            color: "var(--muted)",
            textDecoration: "none",
            marginBottom: 24,
            transition: "color 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--emerald)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          <ArrowLeft size={16} /> Back to results
        </Link>

        {/* Gallery */}
        <Gallery gradient={property.gradient} images={property.images} title={property.title} />

        {/* Content grid: main info + sidebar actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 40,
            marginTop: 40,
          }}
        >
          {/* Main content */}
          <div>
            {/* Title + location */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                <span
                  style={{
                    padding: "4px 14px",
                    borderRadius: "var(--radius-chip)",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    backgroundColor: "var(--surface-warm)",
                    border: "1px solid var(--border)",
                    color: "var(--emerald)",
                  }}
                >
                  {property.type}
                </span>

                <Link
                  to={`/results?area=${encodeURIComponent(property.area)}`}
                  style={{
                    padding: "4px 14px",
                    borderRadius: "var(--radius-chip)",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    backgroundColor: "rgba(10, 46, 34, 0.08)",
                    border: "1px solid var(--border)",
                    color: "var(--forest)",
                    textDecoration: "none",
                  }}
                >
                  📍 {property.area}
                </Link>

                {property.price < 10_000_000 && (
                  <span
                    style={{
                      padding: "4px 14px",
                      borderRadius: "var(--radius-chip)",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      backgroundColor: "#fef3c7",
                      border: "1px solid #fde68a",
                      color: "#92400e",
                    }}
                  >
                    💰 Under ₹1 Cr
                  </span>
                )}

                {property.isBestMatch && (
                  <span
                    style={{
                      padding: "4px 14px",
                      borderRadius: "var(--radius-chip)",
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      backgroundColor: "var(--surface-warm)",
                      border: "1px solid var(--gold)",
                      color: "var(--gold-text)",
                    }}
                  >
                    Best Match
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 40,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  margin: "0 0 10px",
                  color: "var(--ink)",
                }}
              >
                {property.title}
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 15,
                  color: "var(--muted)",
                }}
              >
                <MapPin size={16} style={{ color: "var(--emerald)" }} />
                <span>{property.location}, {property.city}</span>
              </div>
            </div>

            {/* Key facts row */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 40,
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: BedDouble, label: "Bedrooms", value: `${property.bhk} BHK` },
                { icon: Bath, label: "Bathrooms", value: `${property.bathrooms}` },
                { icon: Maximize2, label: "Area", value: `${property.sqft.toLocaleString()} sqft` },
                { icon: Calendar, label: "Year Built", value: `${property.yearBuilt}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={factStyle}>
                  <Icon size={20} style={{ color: "var(--emerald)" }} />
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {value}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: 40 }}>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 24,
                  fontWeight: 600,
                  margin: "0 0 12px",
                  color: "var(--ink)",
                }}
              >
                About this property
              </h2>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 24,
                  fontWeight: 600,
                  margin: "0 0 16px",
                  color: "var(--ink)",
                }}
              >
                Amenities
              </h2>
              <AmenityGrid amenities={property.amenities} />
            </div>

            {/* Google Maps Location & Directions */}
            <div style={{ marginTop: 36 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 24,
                      fontWeight: 600,
                      margin: "0 0 4px",
                      color: "var(--ink)",
                    }}
                  >
                    Location on Google Maps
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--muted)", margin: 0 }}>
                    {property.location}, {property.area}, Hyderabad
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    property.title + " " + property.location + " " + property.area + " Hyderabad"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 18px",
                    borderRadius: "var(--radius-button)",
                    backgroundColor: "#EA4335",
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    boxShadow: "0 4px 12px rgba(234, 67, 53, 0.35)",
                    transition: "transform 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Navigation size={15} /> Directions on Google Maps ↗
                </a>
              </div>
              <div style={{ borderRadius: "var(--radius-card)", overflow: "hidden", border: "1px solid var(--border)" }}>
                <PropertyMap properties={[property]} selectedId={property.id} height={360} />
              </div>
            </div>
          </div>

          {/* Sidebar â€“ price + actions */}
          <aside>
            <div
              style={{
                position: "sticky",
                top: 96,
                padding: 28,
                borderRadius: "var(--radius-card)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Price */}
              <div style={{ marginBottom: 24 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--muted)",
                    margin: "0 0 4px",
                  }}
                >
                  Listed Price
                </p>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 36,
                    fontWeight: 700,
                    color: property.isBestMatch ? "var(--gold-text)" : "var(--emerald)",
                    lineHeight: 1.2,
                  }}
                >
                  {formatPrice(property.price)}
                </div>
              </div>

              {/* Save button (Secondary button rule: ivory/surface bg + border + ink text) */}
              <button
                onClick={() => toggleSaved(property.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "14px 24px",
                  borderRadius: "var(--radius-button)",
                  border: saved ? "1px solid var(--gold)" : "1px solid var(--border)",
                  backgroundColor: saved ? "var(--surface-warm)" : "var(--surface)",
                  color: saved ? "var(--gold-text)" : "var(--ink)",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  marginBottom: 10,
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!saved) {
                    e.currentTarget.style.borderColor = "var(--gold)";
                    e.currentTarget.style.color = "var(--gold-text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saved) {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--ink)";
                  }
                }}
              >
                <Heart size={16} fill={saved ? "var(--gold)" : "none"} />
                {saved ? "Saved in Favourites" : "Save Property"}
              </button>

              {/* Compare button (Primary button rule: emerald bg + ivory text) */}
              <button
                onClick={() => !compareFull && toggleCompare(property.id)}
                disabled={compareFull}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "14px 24px",
                  borderRadius: "var(--radius-button)",
                  border: "none",
                  backgroundColor: inCompare ? "var(--emerald-hover)" : "var(--emerald)",
                  color: "var(--on-forest)",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  cursor: compareFull ? "not-allowed" : "pointer",
                  opacity: compareFull ? 0.5 : 1,
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!compareFull) {
                    e.currentTarget.style.backgroundColor = "var(--emerald-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!compareFull) {
                    e.currentTarget.style.backgroundColor = inCompare
                      ? "var(--emerald-hover)"
                      : "var(--emerald)";
                  }
                }}
              >
                <GitCompareArrows size={16} />
                {compareFull
                  ? "Compare Full (3/3)"
                  : inCompare
                  ? "In Compare List"
                  : "Add to Compare"}
              </button>

              {compareFull && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    textAlign: "center",
                    marginTop: 8,
                    marginBottom: 0,
                  }}
                >
                  Maximum 3 properties allowed in comparison.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
