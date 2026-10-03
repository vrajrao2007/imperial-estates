/**
 * PropertyCard - displays a single property in grid/list views.
 * Adheres strictly to Ivory-dominant luxury green tokens.
 * Cards: white surface, 1px border, soft shadow, real architectural photography.
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, GitCompareArrows, MapPin, Maximize2, BedDouble, Bath, Sparkles } from "lucide-react";
import { usePropertyStore } from "../store/usePropertyStore";
import { type Property, formatPrice } from "../data/properties";
import { fetchWhyMatch } from "../services/aiService";

interface PropertyCardProps {
  property: Property;
  userFilters?: Record<string, any>;
}

export default function PropertyCard({ property, userFilters }: PropertyCardProps) {
  const { toggleSaved, isSaved, toggleCompare, isInCompare, compareIds } = usePropertyStore();
  const saved = isSaved(property.id);
  const inCompare = isInCompare(property.id);
  const compareFull = compareIds.length >= 3 && !inCompare;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [whyMatch, setWhyMatch] = useState<string | null>(null);

  useEffect(() => {
    if (!userFilters || Object.keys(userFilters).length === 0) {
      setWhyMatch(null);
      return;
    }
    let cancelled = false;
    fetchWhyMatch(property, userFilters)
      .then((res) => {
        if (!cancelled && res.reason) {
          setWhyMatch(res.reason);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [property.id, JSON.stringify(userFilters)]);


  return (
    <article
      style={{
        position: "relative",
        borderRadius: "var(--radius-card)",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: isHovered ? "var(--shadow-card-hover)" : "var(--shadow-card)",
        overflow: "hidden",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 300ms cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Real property image container */}
      <Link to={`/property/${property.id}`} style={{ display: "block", textDecoration: "none" }}>
        <div
          style={{
            position: "relative",
            height: 230,
            background: property.gradient,
            backgroundColor: "var(--surface-warm)",
            overflow: "hidden",
          }}
        >
          {/* Actual property photograph */}
          {property.image && (
            <img
              src={property.image}
              alt={property.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: isHovered ? "scale(1.06)" : "scale(1)",
                transition: "transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 400ms ease",
                opacity: imageLoaded ? 1 : 0,
              }}
            />
          )}

          {/* Luxury subtle dark vignette for badge contrast */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(10,46,34,0.3) 0%, transparent 40%, rgba(10,46,34,0.6) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Badges */}
          <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, zIndex: 2 }}>
            {property.isBestMatch && (
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "var(--radius-chip)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  backgroundColor: "var(--gold)",
                  color: "var(--forest)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                Best Match
              </span>
            )}
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "var(--radius-chip)",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                backgroundColor: "rgba(10, 46, 34, 0.85)",
                backdropFilter: "blur(8px)",
                color: "var(--on-forest)",
                border: "1px solid rgba(247, 244, 236, 0.2)",
              }}
            >
              {property.type}
            </span>
          </div>

          {/* Price overlay in Indian Rupee */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              padding: "6px 14px",
              borderRadius: "var(--radius-input)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 20,
                fontWeight: 700,
                color: property.isBestMatch ? "var(--gold-text)" : "var(--forest)",
                letterSpacing: "-0.01em",
              }}
            >
              {formatPrice(property.price)}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: "18px 20px 20px" }}>
        {/* Locality & Affordable Tag */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--emerald)",
              backgroundColor: "rgba(10, 46, 34, 0.08)",
              padding: "2px 8px",
              borderRadius: "var(--radius-chip)",
            }}
          >
            {property.area}
          </span>
          {property.price < 10_000_000 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#92400e",
                backgroundColor: "#fef3c7",
                padding: "2px 8px",
                borderRadius: "var(--radius-chip)",
                border: "1px solid #fde68a",
              }}
            >
              Under ₹1 Cr
            </span>
          )}
        </div>

        <Link
          to={`/property/${property.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 19,
              fontWeight: 600,
              margin: "0 0 6px",
              lineHeight: 1.3,
              color: "var(--ink)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {property.title}
          </h3>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 13,
            color: "var(--muted)",
            marginBottom: whyMatch ? 8 : 14,
          }}
        >
          <MapPin size={14} style={{ color: "var(--emerald)", flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {property.location}, Hyderabad
          </span>
        </div>

        {/* Why Match AI insight (max 18 words, cached) */}
        {whyMatch && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 8,
              backgroundColor: "var(--surface-warm)",
              border: "1px solid var(--border)",
              marginBottom: 12,
              fontSize: 12,
              lineHeight: 1.35,
              color: "var(--forest)",
            }}
          >
            <Sparkles size={12} style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2 }} />
            <span>{whyMatch}</span>
          </div>
        )}

        {/* Key facts */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 14,
            borderTop: "1px solid var(--border)",
            fontSize: 13,
            color: "var(--muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <BedDouble size={15} style={{ color: "var(--emerald)" }} />
            <span>{property.bhk} BHK</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Bath size={15} style={{ color: "var(--emerald)" }} />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Maximize2 size={15} style={{ color: "var(--emerald)" }} />
            <span>{property.sqft.toLocaleString("en-IN")} sqft</span>
          </div>
        </div>
      </div>

      {/* Action buttons - top right */}
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6, zIndex: 3 }}>
        <button
          onClick={() => toggleSaved(property.id)}
          aria-label={saved ? "Remove from saved" : "Save property"}
          title={saved ? "Remove from saved" : "Save property"}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(6px)",
            color: saved ? "var(--gold)" : "var(--ink)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "all 200ms ease",
          }}
        >
          <Heart size={16} fill={saved ? "var(--gold)" : "none"} />
        </button>
        <button
          onClick={() => !compareFull && toggleCompare(property.id)}
          aria-label={inCompare ? "Remove from compare" : "Add to compare"}
          title={
            compareFull
              ? "Compare list is full (max 3)"
              : inCompare
              ? "Remove from compare"
              : "Add to compare"
          }
          disabled={compareFull}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: inCompare ? "1px solid var(--emerald)" : "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: compareFull ? "not-allowed" : "pointer",
            backgroundColor: inCompare ? "var(--emerald)" : "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(6px)",
            color: inCompare ? "var(--on-forest)" : "var(--ink)",
            opacity: compareFull ? 0.5 : 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            transition: "all 200ms ease",
          }}
        >
          <GitCompareArrows size={16} />
        </button>
      </div>
    </article>
  );
}