/**
 * Saved page – displays all saved/bookmarked properties.
 * Uses tokens: --bg, --border, --ink, --muted, --error.
 */
import { Heart } from "lucide-react";
import { properties } from "../data/properties";
import { usePropertyStore } from "../store/usePropertyStore";
import PropertyCard from "../components/PropertyCard";
import EmptyState from "../components/EmptyState";

export default function Saved() {
  const { savedIds, clearSaved } = usePropertyStore();
  const savedProperties = properties.filter((p) => savedIds.includes(p.id));

  return (
    <main style={{ padding: "40px 0 80px" }}>
      <div className="container-estate">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 36,
                fontWeight: 600,
                margin: "0 0 4px",
                color: "var(--ink)",
              }}
            >
              Saved Properties
            </h1>
            <p style={{ fontSize: 15, color: "var(--muted)", margin: 0 }}>
              {savedProperties.length > 0
                ? `You have ${savedProperties.length} saved ${savedProperties.length === 1 ? "property" : "properties"}`
                : "Properties you love, all in one place"}
            </p>
          </div>

          {savedProperties.length > 0 && (
            <button
              onClick={clearSaved}
              style={{
                padding: "10px 20px",
                borderRadius: "var(--radius-button)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--muted)",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--error)";
                e.currentTarget.style.color = "var(--error)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--muted)";
              }}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Grid or empty state */}
        {savedProperties.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {savedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="No saved properties yet"
            description="Start exploring and tap the heart icon on any property to save it here."
            ctaLabel="Explore Properties"
            ctaTo="/results"
          />
        )}
      </div>
    </main>
  );
}
