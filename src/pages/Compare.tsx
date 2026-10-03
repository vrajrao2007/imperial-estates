/**
 * Compare page – side-by-side comparison table for up to 3 properties.
 * Features the Compare "Verdict" Card in Deep Forest (#0A2E22) surface token
 * with streaming on-device explanation and privacy lock indicator.
 */
import { useState, useEffect, useMemo } from "react";
import { GitCompareArrows, Award, CheckCircle2, Lock, Sparkles, RefreshCw } from "lucide-react";
import { properties, formatPrice } from "../data/properties";
import { usePropertyStore } from "../store/usePropertyStore";
import CompareTable from "../components/CompareTable";
import EmptyState from "../components/EmptyState";
import { streamCompareExplanation } from "../services/aiService";

export default function Compare() {
  const { compareIds, clearCompare } = usePropertyStore();
  const compareProperties = properties.filter((p) => compareIds.includes(p.id));

  // Compute numbers, ratios, and evaluation scores in code
  const computedData = useMemo(() => {
    if (compareProperties.length === 0) return { scores: [], bestProp: null, topScore: null };

    const minPrice = Math.min(...compareProperties.map((p) => p.price));
    const maxSqft = Math.max(...compareProperties.map((p) => p.sqft));

    const scores = compareProperties.map((p) => {
      const priceRatio = minPrice / p.price; // 0 to 1 (1 = lowest price)
      const sqftRatio = p.sqft / maxSqft;   // 0 to 1 (1 = largest sqft)
      const pricePerSqft = Math.round(p.price / p.sqft);
      // Balanced score out of 100
      const score = Math.round((priceRatio * 0.5 + sqftRatio * 0.5) * 100);
      return {
        propertyId: p.id,
        score,
        price: p.price,
        sqft: p.sqft,
        pricePerSqft,
        bhk: p.bhk,
        area: p.area,
      };
    });

    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    const topScore = sortedScores[0];
    const bestProp =
      compareProperties.find((p) => p.id === topScore.propertyId) || compareProperties[0];

    return { scores, bestProp, topScore };
  }, [compareProperties]);

  const [verdictText, setVerdictText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const bestMatchProp = computedData.bestProp || compareProperties[0];

  const fetchStreamingVerdict = () => {
    if (compareProperties.length === 0) return;

    setVerdictText("");
    setIsStreaming(true);

    streamCompareExplanation(
      {
        properties: compareProperties,
        scores: computedData.scores,
        priorities: ["value per square foot", "architectural scale"],
      },
      (token) => {
        setVerdictText((prev) => prev + token);
      },
      () => {
        setIsStreaming(false);
      },
      (err) => {
        console.warn("Stream fallback notice:", err);
        setIsStreaming(false);
      }
    );
  };

  useEffect(() => {
    if (compareProperties.length >= 2) {
      setVerdictText("");
      setIsStreaming(true);

      let activeCancel: (() => void) | null = null;
      let isCancelled = false;

      streamCompareExplanation(
        {
          properties: compareProperties,
          scores: computedData.scores,
          priorities: ["value per square foot", "architectural scale"],
        },
        (token) => {
          if (!isCancelled) setVerdictText((prev) => prev + token);
        },
        () => {
          if (!isCancelled) setIsStreaming(false);
        },
        (err) => {
          console.warn("Stream fallback notice:", err);
          if (!isCancelled) setIsStreaming(false);
        }
      ).then((cancelFn) => {
        if (isCancelled) {
          cancelFn();
        } else {
          activeCancel = cancelFn;
        }
      });

      return () => {
        isCancelled = true;
        if (activeCancel) activeCancel();
      };
    } else {
      setVerdictText("");
    }
  }, [compareIds.join(",")]);

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
            flexWrap: "wrap",
            gap: 16,
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
              Compare Properties
            </h1>
            <p style={{ fontSize: 15, color: "var(--muted)", margin: 0 }}>
              {compareProperties.length > 0
                ? `Comparing ${compareProperties.length} of 3 curated estates`
                : "Add properties to compare them side by side"}
            </p>
          </div>

          {compareProperties.length > 0 && (
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={fetchStreamingVerdict}
                disabled={isStreaming}
                title="Re-generate comparison explanation on device"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 18px",
                  borderRadius: "var(--radius-button)",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--ink)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: isStreaming ? "not-allowed" : "pointer",
                  transition: "all 200ms ease",
                }}
              >
                <RefreshCw
                  size={14}
                  style={{ animation: isStreaming ? "spin 1s linear infinite" : "none" }}
                />
                Re-evaluate
              </button>

              <button
                onClick={clearCompare}
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
            </div>
          )}
        </div>

        {/* Table or empty state */}
        {compareProperties.length > 0 ? (
          <div>
            <CompareTable properties={compareProperties} />

            {/* ── Compare Verdict Card (Deep Forest Surface) ─────────────── */}
            <div
              style={{
                marginTop: 40,
                padding: "36px 40px",
                borderRadius: "var(--radius-card)",
                backgroundColor: "var(--forest)",
                border: "1px solid var(--forest-2)",
                boxShadow: "var(--shadow-elevated)",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: 32,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Award size={18} style={{ color: "var(--gold)" }} />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        color: "var(--gold)",
                      }}
                    >
                      Executive Comparison Verdict
                    </span>
                  </div>

                  {/* Privacy note with lock icon */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 10px",
                      borderRadius: "var(--radius-chip)",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "var(--muted-on-forest)",
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                    title="Computed strictly on local Ollama instance (qwen2.5:7b)"
                  >
                    <Lock size={12} style={{ color: "var(--gold)" }} />
                    <span>On-device, no data leaves your laptop</span>
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 26,
                    fontWeight: 600,
                    color: "var(--on-forest)",
                    margin: "0 0 10px",
                  }}
                >
                  Recommended: {bestMatchProp.title}
                </h3>

                <p
                  style={{
                    fontSize: 14,
                    color: "var(--muted-on-forest)",
                    lineHeight: 1.7,
                    margin: 0,
                    maxWidth: 680,
                    minHeight: 48,
                  }}
                >
                  {verdictText ||
                    (isStreaming ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <Sparkles size={14} style={{ color: "var(--gold)" }} />
                        Synthesizing verdict on-device using local model numbers...
                      </span>
                    ) : (
                      `Based on architectural scale, location prestige in ${bestMatchProp.location} (${bestMatchProp.city}), and value per square foot, this estate offers the most balanced proposition among your selected shortlist.`
                    ))}
                  {isStreaming && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 7,
                        height: 14,
                        backgroundColor: "var(--gold)",
                        marginLeft: 4,
                        animation: "pulse 0.8s ease-in-out infinite",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 28,
                    fontWeight: 700,
                    color: "var(--gold)",
                  }}
                >
                  {formatPrice(bestMatchProp.price)}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: "var(--radius-chip)",
                    backgroundColor: "var(--forest-2)",
                    border: "1px solid var(--gold)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--on-forest)",
                  }}
                >
                  <CheckCircle2 size={14} style={{ color: "var(--gold)" }} />
                  {computedData.topScore
                    ? `Score ${computedData.topScore.score}/100`
                    : "Best Curated Value"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={GitCompareArrows}
            title="Nothing to compare yet"
            description="Add up to 3 properties to your compare list from any property card or detail page."
            ctaLabel="Explore Properties"
            ctaTo="/results"
          />
        )}
      </div>
    </main>
  );
}
