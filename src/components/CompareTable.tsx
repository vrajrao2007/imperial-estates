/**
 * CompareTable â€“ side-by-side comparison of up to 3 properties.
 * Distinct series colors for multi-property comparison:
 *   Property A emerald (#1F6F54), B terracotta (#A4532B), C slate (#3A5A78).
 * Direct labels, winner highlighting with subtle sage-tint + gold tick + text.
 */
import { X, Check } from "lucide-react";
import { type Property, formatPrice } from "../data/properties";
import { usePropertyStore } from "../store/usePropertyStore";

interface CompareTableProps {
  properties: Property[];
}

const PROPERTY_SERIES = [
  { label: "Property A", color: "var(--chart-prop-a)" },
  { label: "Property B", color: "var(--chart-prop-b)" },
  { label: "Property C", color: "var(--chart-prop-c)" },
];

export default function CompareTable({ properties }: CompareTableProps) {
  const { removeFromCompare } = usePropertyStore();

  // Determine winners for key metrics
  const minPrice = properties.length > 0 ? Math.min(...properties.map((p) => p.price)) : 0;
  const maxSqft = properties.length > 0 ? Math.max(...properties.map((p) => p.sqft)) : 0;

  const comparisonRows = [
    {
      label: "Price",
      isWinner: (p: Property) => p.price === minPrice && properties.length > 1,
      winnerText: "Best Price",
      render: (p: Property) => formatPrice(p.price),
    },
    {
      label: "Type",
      render: (p: Property) => p.type.charAt(0).toUpperCase() + p.type.slice(1),
    },
    {
      label: "BHK",
      render: (p: Property) => `${p.bhk} BHK`,
    },
    {
      label: "Area",
      isWinner: (p: Property) => p.sqft === maxSqft && properties.length > 1,
      winnerText: "Largest Space",
      render: (p: Property) => `${p.sqft.toLocaleString()} sqft`,
    },
    {
      label: "Bathrooms",
      render: (p: Property) => `${p.bathrooms}`,
    },
    {
      label: "Year Built",
      render: (p: Property) => `${p.yearBuilt}`,
    },
    {
      label: "Location",
      render: (p: Property) => `${p.location}, ${p.city}`,
    },
    {
      label: "Amenities",
      render: (p: Property) => p.amenities.join(", "),
    },
  ];

  return (
    <div
      style={{
        borderRadius: "var(--radius-card)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        backgroundColor: "var(--surface)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--font-body)",
        }}
      >
        <thead>
          <tr>
            {/* Empty corner cell */}
            <th
              style={{
                width: 170,
                padding: "20px 24px",
                textAlign: "left",
                borderBottom: "1px solid var(--border)",
                backgroundColor: "var(--surface-warm)",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--muted)",
                }}
              >
                Attributes
              </span>
            </th>
            {properties.map((p, idx) => {
              const series = PROPERTY_SERIES[idx] || PROPERTY_SERIES[0];
              return (
                <th
                  key={p.id}
                  style={{
                    padding: "18px 20px",
                    textAlign: "center",
                    borderBottom: "1px solid var(--border)",
                    borderLeft: "1px solid var(--border)",
                    backgroundColor: "var(--surface-warm)",
                    position: "relative",
                  }}
                >
                  {/* Distinct Series Badge */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "3px 10px",
                        borderRadius: "var(--radius-chip)",
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: series.color,
                        color: "var(--on-forest)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {series.label}
                    </span>
                  </div>

                  {/* Real property photo thumbnail */}
                  <div
                    style={{
                      width: "100%",
                      height: 100,
                      borderRadius: 12,
                      background: p.gradient,
                      backgroundColor: "var(--surface-warm)",
                      marginBottom: 12,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <svg
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          opacity: 0.08,
                        }}
                      >
                        <pattern id={`ct-${p.id}`} width="30" height="30" patternUnits="userSpaceOnUse">
                          <circle cx="15" cy="15" r="1" fill="var(--on-forest)" />
                        </pattern>
                        <rect width="100%" height="100%" fill={`url(#ct-${p.id})`} />
                      </svg>
                    )}
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 17,
                      fontWeight: 600,
                      color: "var(--ink)",
                      lineHeight: 1.3,
                    }}
                  >
                    {p.title}
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCompare(p.id)}
                    aria-label={`Remove ${p.title} from comparison`}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--surface)",
                      color: "var(--muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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
                    <X size={14} />
                  </button>
                </th>
              );
            })}

            {/* Fill empty slots */}
            {Array.from({ length: 3 - properties.length }).map((_, i) => (
              <th
                key={`empty-${i}`}
                style={{
                  padding: "16px 20px",
                  textAlign: "center",
                  borderBottom: "1px solid var(--border)",
                  borderLeft: "1px solid var(--border)",
                  backgroundColor: "var(--surface-warm)",
                  color: "var(--muted)",
                  fontSize: 13,
                  fontWeight: 400,
                  verticalAlign: "middle",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 100,
                    borderRadius: 12,
                    border: "2px dashed var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                    color: "var(--muted)",
                    fontSize: 13,
                  }}
                >
                  Empty Slot
                </div>
                <span style={{ opacity: 0.7 }}>Add property</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row, ri) => (
            <tr key={row.label}>
              <td
                style={{
                  padding: "14px 24px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderBottom: "1px solid var(--border)",
                  backgroundColor: ri % 2 === 0 ? "transparent" : "var(--surface-warm)",
                }}
              >
                {row.label}
              </td>
              {properties.map((p) => {
                const won = row.isWinner ? row.isWinner(p) : false;
                return (
                  <td
                    key={p.id}
                    style={{
                      padding: "14px 20px",
                      fontSize: 14,
                      color: "var(--ink)",
                      borderBottom: "1px solid var(--border)",
                      borderLeft: "1px solid var(--border)",
                      textAlign: "center",
                      backgroundColor: won
                        ? "var(--winner-bg)"
                        : ri % 2 === 0
                        ? "transparent"
                        : "var(--surface-warm)",
                      fontWeight: row.label === "Price" ? 600 : 400,
                      fontFamily: row.label === "Price" ? "var(--font-heading)" : "inherit",
                      ...(row.label === "Price"
                        ? { color: "var(--gold-text)", fontSize: 18 }
                        : {}),
                    }}
                  >
                    <div>{row.render(p)}</div>
                    {won && row.winnerText && (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 4,
                          padding: "2px 8px",
                          borderRadius: "var(--radius-chip)",
                          backgroundColor: "var(--surface)",
                          border: "1px solid var(--winner-border)",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--gold-text)",
                        }}
                      >
                        <Check size={12} style={{ color: "var(--gold)" }} />
                        <span>{row.winnerText}</span>
                      </div>
                    )}
                  </td>
                );
              })}
              {/* Empty cells for vacant slots */}
              {Array.from({ length: 3 - properties.length }).map((_, i) => (
                <td
                  key={`empty-${i}`}
                  style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid var(--border)",
                    borderLeft: "1px solid var(--border)",
                    textAlign: "center",
                    backgroundColor: ri % 2 === 0 ? "transparent" : "var(--surface-warm)",
                    color: "var(--muted)",
                    fontSize: 13,
                  }}
                >
                  â€”
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
