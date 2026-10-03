/**
 * FilterBar – price range, property type, BHK, area/locality, and sort controls.
 * Uses tokens: --surface, --border, --ink, --muted, --emerald.
 */
import { ChevronDown, X } from "lucide-react";
import { PROPERTY_TYPES, BHK_OPTIONS, getAreas } from "../data/properties";

export interface Filters {
  priceMin: number;
  priceMax: number;
  type: string;
  bhk: string;
  area: string;
  sort: string;
  amenities?: string[];
  nearMetroMinutes?: number;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  resultCount: number;
}

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under ₹25 L", min: 0, max: 2_500_000 },
  { label: "₹25 L – ₹50 L", min: 2_500_000, max: 5_000_000 },
  { label: "₹50 L – ₹1 Cr", min: 5_000_000, max: 10_000_000 },
  { label: "₹1 Cr – ₹2 Cr", min: 10_000_000, max: 20_000_000 },
  { label: "₹2 Cr – ₹5 Cr", min: 20_000_000, max: 50_000_000 },
  { label: "₹5 Cr – ₹10 Cr", min: 50_000_000, max: 100_000_000 },
  { label: "₹10 Cr – ₹20 Cr", min: 100_000_000, max: 200_000_000 },
  { label: "Above ₹20 Cr", min: 200_000_000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
  { label: "Largest", value: "largest" },
];

const selectStyle: React.CSSProperties = {
  appearance: "none",
  padding: "10px 36px 10px 14px",
  borderRadius: "var(--radius-input)",
  border: "1px solid var(--border)",
  backgroundColor: "var(--surface)",
  color: "var(--ink)",
  fontSize: 13,
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 200ms ease",
  minWidth: 140,
};

export default function FilterBar({ filters, onChange, resultCount }: FilterBarProps) {
  const areas = getAreas();

  const hasActiveFilters =
    filters.type !== "" ||
    filters.bhk !== "" ||
    filters.area !== "" ||
    filters.priceMax !== Infinity ||
    filters.priceMin !== 0;

  const clearFilters = () =>
    onChange({ priceMin: 0, priceMax: Infinity, type: "", bhk: "", area: "", sort: filters.sort });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "16px 24px",
        borderRadius: "var(--radius-card)",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-card)",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {/* Price range */}
        <div style={{ position: "relative" }}>
          <select
            value={
              PRICE_RANGES.findIndex(
                (r) => r.min === filters.priceMin && r.max === filters.priceMax
              ).toString()
            }
            onChange={(e) => {
              const range = PRICE_RANGES[Number(e.target.value)];
              onChange({ ...filters, priceMin: range.min, priceMax: range.max });
            }}
            style={selectStyle}
            aria-label="Filter by price range"
          >
            {PRICE_RANGES.map((r, i) => (
              <option key={i} value={i}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "var(--muted)",
            }}
          />
        </div>

        {/* Area / Locality */}
        <div style={{ position: "relative" }}>
          <select
            value={filters.area}
            onChange={(e) => onChange({ ...filters, area: e.target.value })}
            style={selectStyle}
            aria-label="Filter by area"
          >
            <option value="">All Areas</option>
            {areas.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name} ({a.count})
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "var(--muted)",
            }}
          />
        </div>

        {/* Property type */}
        <div style={{ position: "relative" }}>
          <select
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
            style={selectStyle}
            aria-label="Filter by property type"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "var(--muted)",
            }}
          />
        </div>

        {/* BHK */}
        <div style={{ position: "relative" }}>
          <select
            value={filters.bhk}
            onChange={(e) => onChange({ ...filters, bhk: e.target.value })}
            style={selectStyle}
            aria-label="Filter by BHK"
          >
            <option value="">Any BHK</option>
            {BHK_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b} BHK
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "var(--muted)",
            }}
          />
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "8px 14px",
              borderRadius: "var(--radius-chip)",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg)",
              color: "var(--muted)",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--emerald)";
              e.currentTarget.style.color = "var(--emerald)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--muted)";
            }}
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Result count */}
        <span style={{ fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap" }}>
          {resultCount} {resultCount === 1 ? "property" : "properties"}
        </span>

        {/* Sort */}
        <div style={{ position: "relative" }}>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value })}
            style={{ ...selectStyle, minWidth: 160 }}
            aria-label="Sort properties"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "var(--muted)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
