/**
 * AiSearchBar - Natural language plain-English search bar with offline on-device AI.
 * Provides "Ask in plain English" mode alongside classic selectors.
 * Shows removable chips with "Interpreted by on-device AI" badge.
 * States: thinking skeleton, offline badge, error resilience.
 */
import { useState, useTransition } from "react";
import {
  Sparkles,
  Search,
  X,
  Cpu,
  WifiOff,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import { parseNaturalLanguageSearch, type ParsedSearchFilters } from "../services/aiService";
import { useAiStore } from "../store/useAiStore";
import { formatPrice } from "../data/properties";

export interface ActiveAiChip {
  id: string;
  field: keyof ParsedSearchFilters;
  label: string;
  value: any;
}

interface AiSearchBarProps {
  onFiltersParsed: (filters: ParsedSearchFilters) => void;
  onChipRemove?: (chipId: string, updatedFilters: ParsedSearchFilters) => void;
  initialQuery?: string;
  className?: string;
  compact?: boolean;
}

export default function AiSearchBar({
  onFiltersParsed,
  onChipRemove,
  initialQuery = "",
  compact = false,
}: AiSearchBarProps) {
  const { isOnline, model } = useAiStore();
  const [mode, setMode] = useState<"ai" | "standard">("ai");
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSource, setSearchSource] = useState<"ai" | "fallback" | null>(null);
  const [chips, setChips] = useState<ActiveAiChip[]>([]);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setErrorNotice(null);

    try {
      const result = await parseNaturalLanguageSearch(query.trim());
      setSearchSource(result.source || "ai");
      setAiResponseText(result.response || "Found verified residences in Hyderabad matching your criteria.");

      // Build removable chips
      const newChips: ActiveAiChip[] = [];

      if (result.bhk && result.bhk.length > 0) {
        newChips.push({
          id: "bhk",
          field: "bhk",
          label: `${result.bhk.join(", ")} BHK`,
          value: result.bhk,
        });
      }

      if (result.maxPrice) {
        newChips.push({
          id: "maxPrice",
          field: "maxPrice",
          label: `Under ${formatPrice(result.maxPrice)}`,
          value: result.maxPrice,
        });
      }

      if (result.minPrice) {
        newChips.push({
          id: "minPrice",
          field: "minPrice",
          label: `Above ${formatPrice(result.minPrice)}`,
          value: result.minPrice,
        });
      }

      if (result.locality) {
        newChips.push({
          id: "locality",
          field: "locality",
          label: result.locality,
          value: result.locality,
        });
      }

      if (result.types && result.types.length > 0) {
        newChips.push({
          id: "types",
          field: "types",
          label: result.types.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(", "),
          value: result.types,
        });
      }

      if (result.nearMetroMinutes) {
        newChips.push({
          id: "nearMetroMinutes",
          field: "nearMetroMinutes",
          label: `Metro <= ${result.nearMetroMinutes} min`,
          value: result.nearMetroMinutes,
        });
      }

      if (result.amenities && result.amenities.length > 0) {
        result.amenities.forEach((a, i) => {
          newChips.push({
            id: `amenity-${i}`,
            field: "amenities",
            label: a,
            value: a,
          });
        });
      }

      if (result.sortBy) {
        const sortLabels: Record<string, string> = {
          "price-asc": "Price: Low to High",
          "price-desc": "Price: High to Low",
          newest: "Newest Residences",
          largest: "Largest Sq Ft",
        };
        newChips.push({
          id: "sortBy",
          field: "sortBy",
          label: sortLabels[result.sortBy] || result.sortBy,
          value: result.sortBy,
        });
      }

      setChips(newChips);

      startTransition(() => {
        onFiltersParsed(result);
      });
    } catch (err: any) {
      console.warn("AI search error:", err);
      setErrorNotice("Using offline keyword match (AI temporarily unavailable)");
    } finally {
      setIsSearching(false);
    }
  };

  const removeChip = (chipToRemove: ActiveAiChip) => {
    const updated = chips.filter((c) => c.id !== chipToRemove.id);
    setChips(updated);

    // Reconstruct remaining filter object
    const reconstructed: ParsedSearchFilters = {};
    const remainingAmenities: string[] = [];

    updated.forEach((c) => {
      if (c.field === "amenities") {
        remainingAmenities.push(c.value);
      } else if (c.field === "bhk") {
        reconstructed.bhk = c.value;
      } else if (c.field === "maxPrice") {
        reconstructed.maxPrice = c.value;
      } else if (c.field === "minPrice") {
        reconstructed.minPrice = c.value;
      } else if (c.field === "locality") {
        reconstructed.locality = c.value;
      } else if (c.field === "types") {
        reconstructed.types = c.value;
      } else if (c.field === "nearMetroMinutes") {
        reconstructed.nearMetroMinutes = c.value;
      } else if (c.field === "sortBy") {
        reconstructed.sortBy = c.value;
      }
    });

    if (remainingAmenities.length > 0) {
      reconstructed.amenities = remainingAmenities;
    }

    if (onChipRemove) {
      onChipRemove(chipToRemove.id, reconstructed);
    } else {
      onFiltersParsed(reconstructed);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: compact ? "100%" : 920,
        margin: compact ? "0" : "0 auto",
      }}
    >
      {/* Search Header Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => setMode("ai")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: "var(--radius-chip)",
              backgroundColor: mode === "ai" ? "var(--forest)" : "transparent",
              color: mode === "ai" ? "var(--gold)" : "var(--muted)",
              border: mode === "ai" ? "1px solid var(--forest)" : "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
          >
            <Sparkles size={14} style={{ color: mode === "ai" ? "var(--gold)" : "inherit" }} />
            Ask in Plain English
          </button>

          <button
            type="button"
            onClick={() => setMode("standard")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: "var(--radius-chip)",
              backgroundColor: mode === "standard" ? "var(--forest)" : "transparent",
              color: mode === "standard" ? "var(--gold)" : "var(--muted)",
              border: mode === "standard" ? "1px solid var(--forest)" : "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
          >
            <SlidersHorizontal size={13} />
            Structured Filters
          </button>
        </div>

        {/* Status Indicator Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isOnline ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: "var(--radius-chip)",
                backgroundColor: "rgba(27, 122, 90, 0.12)",
                border: "1px solid rgba(27, 122, 90, 0.3)",
                color: "var(--emerald)",
                fontSize: 11,
                fontWeight: 600,
              }}
              title={`On-device AI active using ${model}`}
            >
              <Cpu size={12} />
              <span>On-Device AI Active ({model})</span>
            </div>
          ) : (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: "var(--radius-chip)",
                backgroundColor: "rgba(102, 102, 102, 0.1)",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                fontSize: 11,
                fontWeight: 600,
              }}
              title="Ollama is offline. Queries are handled by the instant keyword engine."
            >
              <WifiOff size={12} />
              <span>AI offline - using basic search</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Search Input Box */}
      <form
        onSubmit={handleSearch}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          borderRadius: 20,
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-elevated)",
          padding: "6px 8px 6px 18px",
          gap: 12,
        }}
      >
        <Sparkles size={18} style={{ color: "var(--gold)", flexShrink: 0 }} />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            mode === "ai"
              ? "Ask naturally, e.g. 3 BHK villa in Jubilee Hills under 10 Cr with pool near metro..."
              : "Search by locality, BHK, or keywords..."
          }
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            color: "var(--ink)",
            fontSize: 14,
            fontFamily: "var(--font-body)",
            padding: "8px 0",
          }}
          disabled={isSearching}
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted)",
              padding: 4,
            }}
          >
            <X size={16} />
          </button>
        )}

        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "12px 22px",
            borderRadius: "var(--radius-button)",
            border: "none",
            backgroundColor: isSearching ? "var(--muted)" : "var(--emerald)",
            color: "var(--on-forest)",
            fontSize: 13,
            fontWeight: 600,
            cursor: isSearching || !query.trim() ? "not-allowed" : "pointer",
            transition: "all 150ms ease",
            whiteSpace: "nowrap",
          }}
        >
          {isSearching ? (
            <>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "#FFF",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Interpreting...
            </>
          ) : (
            <>
              <Search size={15} />
              Search
            </>
          )}
        </button>
      </form>

      {/* Thinking Skeleton State */}
      {isSearching && (
        <div
          style={{
            marginTop: 12,
            padding: "12px 16px",
            borderRadius: "var(--radius-card)",
            backgroundColor: "var(--surface-warm)",
            border: "1px dashed var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: "var(--gold)",
              animation: "pulse 1.2s ease-in-out infinite",
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--forest)",
                marginBottom: 4,
              }}
            >
              On-device AI is parsing your criteria...
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div
                style={{
                  height: 18,
                  width: 80,
                  backgroundColor: "var(--border)",
                  borderRadius: 12,
                  animation: "pulse 1.5s infinite",
                }}
              />
              <div
                style={{
                  height: 18,
                  width: 120,
                  backgroundColor: "var(--border)",
                  borderRadius: 12,
                  animation: "pulse 1.7s infinite",
                }}
              />
              <div
                style={{
                  height: 18,
                  width: 90,
                  backgroundColor: "var(--border)",
                  borderRadius: 12,
                  animation: "pulse 1.3s infinite",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Error state that never blocks normal search */}
      {errorNotice && (
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          <AlertCircle size={13} style={{ color: "var(--gold)" }} />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* AI Assistant Natural Language Response Banner */}
      {aiResponseText && !isSearching && (
        <div
          style={{
            marginTop: 12,
            padding: "14px 18px",
            borderRadius: "var(--radius-card)",
            backgroundColor: "rgba(10, 46, 34, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(201, 169, 110, 0.4)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            animation: "slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              backgroundColor: "rgba(201, 169, 110, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sparkles size={16} style={{ color: "var(--gold)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                }}
              >
                Imperial AI Response • {searchSource === "ai" ? "Local Qwen 2.5" : "Instant Search"}
              </span>
              <button
                type="button"
                onClick={() => setAiResponseText(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                ✕
              </button>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "var(--on-forest)",
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              {aiResponseText}
            </p>
          </div>
        </div>
      )}

      {/* Understood Filters Chips Section */}
      {chips.length > 0 && !isSearching && (
        <div
          style={{
            marginTop: 14,
            padding: "10px 14px",
            borderRadius: "var(--radius-card)",
            backgroundColor: "var(--surface-warm)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--forest)",
              }}
            >
              <Cpu size={12} style={{ color: "var(--emerald)" }} />
              <span>
                {searchSource === "ai"
                  ? "Interpreted by on-device AI (qwen2.5:7b)"
                  : "Interpreted by basic search"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setChips([]);
                onFiltersParsed({});
              }}
              style={{
                background: "none",
                border: "none",
                fontSize: 11,
                color: "var(--muted)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Clear all interpreted criteria
            </button>
          </div>

          {/* Chips list */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {chips.map((chip) => (
              <span
                key={chip.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  borderRadius: "var(--radius-chip)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--emerald)",
                  color: "var(--forest)",
                  fontSize: 12,
                  fontWeight: 600,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={() => removeChip(chip)}
                  aria-label={`Remove filter ${chip.label}`}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "var(--muted)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--forest)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
