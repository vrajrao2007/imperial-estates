/**
 * Results page - property grid & interactive Hyderabad map view with filter bar.
 * Reads initial filters from URL query params.
 * Ivory-dominant page surface with design tokens.
 * Features 145+ residences across Hyderabad plotted on an interactive map.
 */
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX, LayoutGrid, Map, Columns } from "lucide-react";
import { properties, getAreas } from "../data/properties";
import PropertyCard from "../components/PropertyCard";
import FilterBar, { type Filters } from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import PropertyMap from "../components/PropertyMap";
import AiSearchBar from "../components/AiSearchBar";

/** Parse budget string into min/max */
function parseBudget(budget: string): { min: number; max: number } {
  const [min, max] = budget.split("-").map(Number);
  return { min: min || 0, max: max || Infinity };
}

type ViewMode = "grid" | "split" | "map";

export default function Results() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const areas = useMemo(() => getAreas(), []);

  // Seed filters from URL query params
  const initialFilters = useMemo((): Filters => {
    const budget = searchParams.get("budget");
    const parsed = budget ? parseBudget(budget) : { min: 0, max: Infinity };
    return {
      priceMin: parsed.min,
      priceMax: parsed.max,
      type: searchParams.get("type") || "",
      bhk: searchParams.get("bhk") || "",
      area: searchParams.get("area") || searchParams.get("location") || "",
      amenities: searchParams.get("amenities")
        ? searchParams.get("amenities")!.split(",").filter(Boolean)
        : undefined,
      sort: searchParams.get("sort") || "featured",
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  /** Apply filters + sort */
  const filtered = useMemo(() => {
    let result = [...properties];

    // Area
    if (filters.area) {
      result = result.filter((p) => p.area === filters.area);
    }

    // Price
    if (filters.priceMin > 0 || filters.priceMax < Infinity) {
      result = result.filter(
        (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
      );
    }

    // Type
    if (filters.type) {
      result = result.filter((p) => p.type === filters.type);
    }

    // BHK
    if (filters.bhk) {
      result = result.filter((p) => p.bhk === Number(filters.bhk));
    }

    // Amenities (Natural language requested amenities)
    if (filters.amenities && filters.amenities.length > 0) {
      result = result.filter((p) =>
        filters.amenities!.every((reqAmenity) =>
          (p.amenities || []).some((pa) =>
            pa.toLowerCase().includes(reqAmenity.toLowerCase())
          )
        )
      );
    }

    // Sort
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => b.yearBuilt - a.yearBuilt);
        break;
      case "largest":
        result.sort((a, b) => b.sqft - a.sqft);
        break;
      default:
        result.sort((a, b) => {
          if (a.isBestMatch && !b.isBestMatch) return -1;
          if (!a.isBestMatch && b.isBestMatch) return 1;
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
    }

    return result;
  }, [filters]);

  /** Count properties under 1 Cr for badge */
  const affordableCount = useMemo(
    () => properties.filter((p) => p.price < 10_000_000).length,
    []
  );

  return (
    <main style={{ padding: "40px 0 80px", minHeight: "100vh" }}>
      <div className="container-estate">
        {/* Page header with View Mode Switcher */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-chip)",
                  backgroundColor: "var(--forest)",
                  color: "var(--gold)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Hyderabad Collection
              </span>
              <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>
                {filtered.length} Residences Available
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 34,
                fontWeight: 600,
                margin: "0 0 6px",
                color: "var(--ink)",
              }}
            >
              Properties in Hyderabad
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)", margin: 0 }}>
              Discover {properties.length}+ properties — from affordable ₹25L apartments to luxury ₹45Cr+ villas across 40+ localities.
            </p>
          </div>

          {/* View Mode Toggle Buttons */}
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-input)",
              padding: 4,
              gap: 4,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid View"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                backgroundColor: viewMode === "grid" ? "var(--forest)" : "transparent",
                color: viewMode === "grid" ? "var(--on-forest)" : "var(--muted)",
                transition: "all 200ms ease",
              }}
            >
              <LayoutGrid size={15} />
              <span>Grid</span>
            </button>

            <button
              onClick={() => setViewMode("split")}
              aria-label="Split Map View"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                backgroundColor: viewMode === "split" ? "var(--forest)" : "transparent",
                color: viewMode === "split" ? "var(--on-forest)" : "var(--muted)",
                transition: "all 200ms ease",
              }}
            >
              <Columns size={15} />
              <span>Split Map</span>
            </button>

            <button
              onClick={() => setViewMode("map")}
              aria-label="Full Map View"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                backgroundColor: viewMode === "map" ? "var(--forest)" : "transparent",
                color: viewMode === "map" ? "var(--on-forest)" : "var(--muted)",
                transition: "all 200ms ease",
              }}
            >
              <Map size={15} />
              <span>Full Map</span>
            </button>
          </div>
        </div>

        {/* On-device AI Natural Language Search */}
        <div style={{ marginBottom: 20 }}>
          <AiSearchBar
            compact
            onFiltersParsed={(parsed) => {
              setFilters((prev) => ({
                ...prev,
                priceMin: parsed.minPrice !== undefined ? parsed.minPrice : prev.priceMin,
                priceMax: parsed.maxPrice !== undefined ? parsed.maxPrice : prev.priceMax,
                area: parsed.locality || prev.area,
                type: parsed.types?.[0] || prev.type,
                bhk: parsed.bhk ? String(parsed.bhk[0]) : prev.bhk,
                sort: parsed.sortBy || prev.sort,
                amenities: parsed.amenities,
                nearMetroMinutes: parsed.nearMetroMinutes,
              }));
            }}
            onChipRemove={(_, remaining) => {
              setFilters((prev) => ({
                ...prev,
                priceMin: remaining.minPrice !== undefined ? remaining.minPrice : 0,
                priceMax: remaining.maxPrice !== undefined ? remaining.maxPrice : Infinity,
                area: remaining.locality || "",
                type: remaining.types?.[0] || "",
                bhk: remaining.bhk ? String(remaining.bhk[0]) : "",
                sort: remaining.sortBy || "featured",
                amenities: remaining.amenities || [],
                nearMetroMinutes: remaining.nearMetroMinutes,
              }));
            }}
          />
        </div>

        {/* Filter bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <FilterBar filters={filters} onChange={setFilters} resultCount={filtered.length} />

            {/* Area Quick Pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 4,
                scrollbarWidth: "none",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", whiteSpace: "nowrap" }}>
                Areas:
              </span>
              <button
                onClick={() => setFilters({ ...filters, area: "" })}
                style={{
                  padding: "5px 12px",
                  borderRadius: "var(--radius-chip)",
                  fontSize: 12,
                  fontWeight: filters.area === "" ? 600 : 400,
                  border: "1px solid",
                  borderColor: filters.area === "" ? "var(--emerald)" : "var(--border)",
                  backgroundColor: filters.area === "" ? "var(--emerald)" : "var(--surface)",
                  color: filters.area === "" ? "var(--on-forest)" : "var(--ink)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 150ms ease",
                }}
              >
                All ({properties.length})
              </button>

              {/* Affordable pill */}
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    area: "",
                    priceMin: 0,
                    priceMax: filters.priceMax === 10_000_000 && filters.priceMin === 0
                      ? Infinity : 10_000_000,
                  })
                }
                style={{
                  padding: "5px 12px",
                  borderRadius: "var(--radius-chip)",
                  fontSize: 12,
                  fontWeight: filters.priceMax === 10_000_000 && filters.priceMin === 0 ? 600 : 400,
                  border: "1px solid",
                  borderColor:
                    filters.priceMax === 10_000_000 && filters.priceMin === 0
                      ? "var(--gold)"
                      : "var(--border)",
                  backgroundColor:
                    filters.priceMax === 10_000_000 && filters.priceMin === 0
                      ? "var(--gold)"
                      : "var(--surface)",
                  color:
                    filters.priceMax === 10_000_000 && filters.priceMin === 0
                      ? "var(--forest)"
                      : "var(--ink)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 150ms ease",
                }}
              >
                💰 Under ₹1 Cr ({affordableCount})
              </button>

              {areas.slice(0, 12).map((a) => {
                const isSelected = filters.area === a.name;
                return (
                  <button
                    key={a.name}
                    onClick={() =>
                      setFilters({ ...filters, area: isSelected ? "" : a.name })
                    }
                    style={{
                      padding: "5px 12px",
                      borderRadius: "var(--radius-chip)",
                      fontSize: 12,
                      fontWeight: isSelected ? 600 : 400,
                      border: "1px solid",
                      borderColor: isSelected ? "var(--emerald)" : "var(--border)",
                      backgroundColor: isSelected ? "var(--emerald)" : "var(--surface)",
                      color: isSelected ? "var(--on-forest)" : "var(--ink)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 150ms ease",
                    }}
                  >
                    {a.name} ({a.count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* View Mode Rendering */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No properties found"
            description="Try adjusting your price range, area, or property type filters."
            ctaLabel="Reset All Filters"
            ctaTo="/results"
          />
        ) : viewMode === "grid" ? (
          /* ── 1. Standard Responsive Grid ── */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 24,
            }}
          >
            {filtered.map((property) => (
              <PropertyCard key={property.id} property={property} userFilters={filters} />
            ))}
          </div>
        ) : viewMode === "split" ? (
          /* ── 2. Split Screen: Cards + Sticky Hyderabad Map ── */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 24,
              alignItems: "start",
            }}
          >
            {/* Scrollable Cards List */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {filtered.map((property) => (
                <div
                  key={property.id}
                  onMouseEnter={() => setSelectedPropertyId(property.id)}
                >
                  <PropertyCard property={property} userFilters={filters} />
                </div>
              ))}
            </div>

            {/* Sticky Interactive Map */}
            <div
              style={{
                position: "sticky",
                top: 90,
                height: "calc(100vh - 120px)",
                borderRadius: "var(--radius-card)",
                overflow: "hidden",
              }}
            >
              <PropertyMap
                properties={filtered}
                selectedId={selectedPropertyId}
                onSelectProperty={setSelectedPropertyId}
                height="100%"
              />
            </div>
          </div>
        ) : (
          /* ── 3. Full Map View ── */
          <div style={{ height: "calc(100vh - 220px)", minHeight: 600 }}>
            <PropertyMap
              properties={filtered}
              selectedId={selectedPropertyId}
              onSelectProperty={setSelectedPropertyId}
              height="100%"
            />
          </div>
        )}
      </div>
    </main>
  );
}