/**
 * Styleguide – Comprehensive Design System Token & Component Showcase.
 * Built for export, Figma documentation, and case study presentation.
 * Adheres strictly to the 60/25/10/5 Ivory-Dominant Luxury Green Palette.
 */
import { useState } from "react";
import {
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Heart,
  Sparkles,
  MapPin,
  Award,
  Layers,
  Palette,
  Component,
  BarChart2,
  Compass,
} from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import { properties } from "../data/properties";

interface TokenCardProps {
  name: string;
  variable: string;
  hex: string;
  contrast?: string;
  role: string;
  border?: boolean;
}

function TokenCard({ name, variable, hex, contrast, role, border = false }: TokenCardProps) {
  return (
    <div
      style={{
        borderRadius: "var(--radius-card)",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          height: 80,
          backgroundColor: hex,
          borderBottom: border ? "1px solid var(--border)" : "none",
          display: "flex",
          alignItems: "flex-end",
          padding: 12,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 6,
            backgroundColor: "rgba(0,0,0,0.2)",
            color: "#FFFFFF",
            backdropFilter: "blur(4px)",
          }}
        >
          {hex}
        </span>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)", marginBottom: 2 }}>{name}</div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
          var({variable})
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{role}</div>
        {contrast && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginTop: 8,
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "var(--radius-chip)",
              backgroundColor: "var(--surface-warm)",
              border: "1px solid var(--border)",
              color: "var(--emerald)",
            }}
          >
            <Check size={11} /> WCAG {contrast}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Styleguide() {
  const [activeChip, setActiveChip] = useState("all");
  const sampleProp = properties[0];

  return (
    <main style={{ padding: "48px 0 100px", backgroundColor: "var(--bg)" }}>
      <div className="container-estate">
        {/* Styleguide Header */}
        <div style={{ marginBottom: 48, maxWidth: 840 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: "var(--radius-chip)",
                backgroundColor: "var(--surface-warm)",
                border: "1px solid var(--border)",
                color: "var(--emerald)",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              <Palette size={14} /> Design Token Reference & Styleguide
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 48,
              fontWeight: 700,
              color: "var(--ink)",
              margin: "0 0 16px",
              letterSpacing: "-0.03em",
            }}
          >
            Ivory-Dominant Luxury Green Design System
          </h1>
          <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
            Strict 60% warm neutrals (ivory surfaces), 25% deep forest, 10% emerald brand interactive, and 5% gold accent ratio.
            All color tokens meet or exceed WCAG AA contrast standards (≥4.5:1 for body text, ≥3.0:1 for UI elements).
          </p>
        </div>

        {/* ── 1. Color Palette Tokens ─────────────────────────────── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <Layers size={20} style={{ color: "var(--emerald)" }} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 28, margin: 0, color: "var(--ink)" }}>
              Core Design Tokens
            </h2>
          </div>

          {/* Surfaces */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 16 }}>
              Surfaces (60% Warm Neutrals & 25% Deep Forest)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
              <TokenCard name="Page Background" variable="--bg" hex="#F7F4EC" role="Global application background" border />
              <TokenCard name="Card Surface" variable="--surface" hex="#FFFFFF" role="Cards, modals, search containers" border />
              <TokenCard name="Warm Surface" variable="--surface-warm" hex="#FBF9F3" role="Inset sections, stripes, chips" border />
              <TokenCard name="Border Hairline" variable="--border" hex="#E4DFD1" role="1px structural borders & dividers" border />
              <TokenCard name="Deep Forest" variable="--forest" hex="#0A2E22" role="Top nav, hero, footer, verdict card" />
              <TokenCard name="Forest Raised" variable="--forest-2" hex="#123D2E" role="Raised cards/hover on dark forest" />
            </div>
          </div>

          {/* Typography & Text Tokens */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 16 }}>
              Typography & High-Contrast Text Tokens
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              <TokenCard name="Primary Ink" variable="--ink" hex="#10201A" contrast="15.4:1 on ivory" role="Headings & primary body copy" />
              <TokenCard name="Muted Slate" variable="--muted" hex="#5B6B63" contrast="5.1:1 on ivory" role="Secondary metadata & subtitles" />
              <TokenCard name="On Forest Text" variable="--on-forest" hex="#F7F4EC" contrast="13.4:1 on forest" role="Primary text on deep forest sections" border />
              <TokenCard name="Muted on Forest" variable="--muted-on-forest" hex="#A9BDB2" contrast="7.4:1 on forest" role="Secondary text on deep forest" />
            </div>
          </div>

          {/* Brand & Accent Tokens */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 16 }}>
              Brand & Accent Tokens (10% Emerald, 5% Gold)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
              <TokenCard name="Emerald Brand" variable="--emerald" hex="#1F6F54" contrast="5.5:1 on ivory" role="Interactive buttons, links, active states" />
              <TokenCard name="Emerald Hover" variable="--emerald-hover" hex="#185A44" role="Interactive hover state" />
              <TokenCard name="Sage Fill" variable="--sage" hex="#A8C3B0" role="Fills, chips, disabled, never small body" border />
              <TokenCard name="Champagne Gold" variable="--gold" hex="#C9A96E" contrast="6.6:1 on forest" role="Icons, borders, rare badges & hearts" />
              <TokenCard name="Gold Body Text" variable="--gold-text" hex="#8A6B2F" contrast="4.5:1 on ivory" role="Gold as text on ivory surfaces" />
            </div>
          </div>

          {/* Semantic Tokens */}
          <div>
            <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 16 }}>
              Semantic Tokens (Clearly Distinct from Brand Green, Paired with Icons)
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              <TokenCard name="Success Teal" variable="--success" hex="#167080" contrast="5.2:1 on ivory" role="Success states (always with check icon)" />
              <TokenCard name="Warning Amber" variable="--warning" hex="#8A5A00" contrast="5.4:1 on ivory" role="Cautionary notices & limits" />
              <TokenCard name="Error Crimson" variable="--error" hex="#B3382C" contrast="5.4:1 on ivory" role="Form errors, destructive action hovers" />
              <TokenCard name="Info Slate" variable="--info" hex="#3A5A78" contrast="6.6:1 on ivory" role="Informational badges & comparisons" />
            </div>
          </div>
        </section>

        {/* ── 2. Buttons & Interactive States ─────────────────────── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <Component size={20} style={{ color: "var(--emerald)" }} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 28, margin: 0, color: "var(--ink)" }}>
              Buttons & Action States
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* On Ivory Surfaces */}
            <div
              style={{
                padding: 32,
                borderRadius: "var(--radius-card)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                Buttons on Ivory / White Surfaces
              </h3>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 24px" }}>
                Primary buttons use emerald bg + ivory text. Secondary buttons use ivory/surface bg + 1px border + ink text.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
                {/* Primary */}
                <button className="btn-primary">
                  <Sparkles size={16} /> Primary Action
                </button>

                {/* Secondary */}
                <button className="btn-secondary">
                  Secondary Action
                </button>

                {/* Focus Ring Demonstration */}
                <button
                  className="btn-primary"
                  style={{
                    outline: "2px solid var(--emerald)",
                    outlineOffset: 2,
                  }}
                >
                  Focus State
                </button>
              </div>
            </div>

            {/* On Deep Forest Sections */}
            <div
              style={{
                padding: 32,
                borderRadius: "var(--radius-card)",
                backgroundColor: "var(--forest)",
                border: "1px solid var(--forest-2)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--on-forest)", margin: "0 0 8px" }}>
                Buttons on Deep Forest Sections
              </h3>
              <p style={{ fontSize: 13, color: "var(--muted-on-forest)", margin: "0 0 24px" }}>
                On forest sections, primary buttons invert to ivory bg + deep forest text with gold focus ring.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
                {/* On Forest Primary */}
                <button className="btn-on-forest">
                  Explore Collection
                </button>

                {/* On Forest Focus State */}
                <button
                  className="btn-on-forest"
                  style={{
                    outline: "2px solid var(--gold)",
                    outlineOffset: 2,
                  }}
                >
                  Forest Focus
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Filter Chips & Semantic Feedback ─────────────────── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <Compass size={20} style={{ color: "var(--emerald)" }} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 28, margin: 0, color: "var(--ink)" }}>
              Filter Chips & Semantic Badges
            </h2>
          </div>

          <div
            style={{
              padding: 32,
              borderRadius: "var(--radius-card)",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                Interactive Filter Chips
              </h3>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px" }}>
                Unselected chips feature ivory bg with border; selected chips highlight in emerald with ivory text.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {["All Properties", "Penthouse", "Villa", "Bungalow", "Heritage Estate"].map((label) => {
                  const isSelected = activeChip === label.toLowerCase();
                  return (
                    <button
                      key={label}
                      onClick={() => setActiveChip(label.toLowerCase())}
                      className={`chip-filter ${isSelected ? "chip-filter-selected" : ""}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                Semantic Feedback Badges (Icon + Label Accessible Pairs)
              </h3>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px" }}>
                Never rely on color alone. Each status pairs a dedicated token with a clear icon and label.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: "var(--radius-chip)",
                    backgroundColor: "var(--surface-warm)",
                    border: "1px solid var(--border)",
                    color: "var(--success)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={16} /> Verified Title Deed
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: "var(--radius-chip)",
                    backgroundColor: "var(--surface-warm)",
                    border: "1px solid var(--border)",
                    color: "var(--warning)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <AlertTriangle size={16} /> Comparison Limit Reached (3/3)
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: "var(--radius-chip)",
                    backgroundColor: "var(--surface-warm)",
                    border: "1px solid var(--border)",
                    color: "var(--error)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={16} /> Required Field Missing
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: "var(--radius-chip)",
                    backgroundColor: "var(--surface-warm)",
                    border: "1px solid var(--border)",
                    color: "var(--info)",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <Info size={16} /> Historic Architecture Listed 1928
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Map Pin States & Warm Cartography ─────────────────── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <MapPin size={20} style={{ color: "var(--emerald)" }} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 28, margin: 0, color: "var(--ink)" }}>
              Map Cartography & Price Pin States
            </h2>
          </div>

          <div
            style={{
              padding: 32,
              borderRadius: "var(--radius-card)",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 24px", maxWidth: 760 }}>
              Fixes green-on-green pin blending. The cartographic base uses warm neutral land (#EFEBDF), soft grey-blue water (#B8C9D9),
              and muted low-saturation sage parks (#D4DDD6). Price pins maintain strict consistent geometry across all states.
            </p>

            {/* Map Canvas Simulation */}
            <div
              style={{
                height: 320,
                borderRadius: "var(--radius-card)",
                backgroundColor: "var(--map-land)",
                border: "1px solid var(--border)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "inset 0 2px 8px rgba(10,46,34,0.06)",
              }}
            >
              {/* Simulated River / Waterway */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <path
                  d="M0 80 Q 200 40, 450 120 T 900 160 T 1400 110 L 1400 180 Q 900 230, 450 190 T 0 150 Z"
                  fill="var(--map-water)"
                  opacity="0.8"
                />
                {/* Simulated Park Area */}
                <rect x="180" y="190" width="220" height="90" rx="20" fill="var(--map-park)" />
                <text x="240" y="240" fill="var(--muted)" fontSize="12" fontFamily="var(--font-body)" fontWeight="500">
                  Estate Reserve Park
                </text>
              </svg>

              {/* Pin 1: Default State */}
              <div style={{ position: "absolute", top: 60, left: 120, textAlign: "center" }}>
                <div className="map-pin map-pin-default">
                  $3,850,000
                </div>
                <div style={{ fontSize: 11, color: "var(--ink)", fontWeight: 600, marginTop: 4 }}>Default (Ink)</div>
              </div>

              {/* Pin 2: Hover State */}
              <div style={{ position: "absolute", top: 110, left: 340, textAlign: "center" }}>
                <div className="map-pin map-pin-hover">
                  $4,200,000
                </div>
                <div style={{ fontSize: 11, color: "var(--ink)", fontWeight: 600, marginTop: 4 }}>Hover (Emerald)</div>
              </div>

              {/* Pin 3: Selected State (Gold Ring + Scale) */}
              <div style={{ position: "absolute", top: 70, left: 580, textAlign: "center" }}>
                <div className="map-pin map-pin-selected">
                  $5,750,000
                </div>
                <div style={{ fontSize: 11, color: "var(--ink)", fontWeight: 600, marginTop: 6 }}>Selected (Gold Ring)</div>
              </div>

              {/* Pin 4: Saved State (Gold Fill) */}
              <div style={{ position: "absolute", top: 150, left: 820, textAlign: "center" }}>
                <div className="map-pin map-pin-saved">
                  <Heart size={12} fill="var(--ink)" style={{ marginRight: 4 }} /> $6,100,000
                </div>
                <div style={{ fontSize: 11, color: "var(--ink)", fontWeight: 600, marginTop: 4 }}>Saved (Gold)</div>
              </div>

              {/* Pin 5: Cluster Marker */}
              <div style={{ position: "absolute", top: 180, left: 1080, textAlign: "center" }}>
                <div className="map-cluster">
                  14
                </div>
                <div style={{ fontSize: 11, color: "var(--ink)", fontWeight: 600, marginTop: 4 }}>Cluster (Forest)</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Charts, Scales & Comparison Palettes ─────────────── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <BarChart2 size={20} style={{ color: "var(--emerald)" }} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 28, margin: 0, color: "var(--ink)" }}>
              Data Visualization & Comparison Series
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Single-Metric Sequential Emerald Ramp */}
            <div
              style={{
                padding: 32,
                borderRadius: "var(--radius-card)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                Single-Metric Emerald Ramp (#E3EFE8 → #1F6F54)
              </h3>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 20px" }}>
                Used for single-variable progressions like square footage density, luxury indices, or energy scores.
              </p>

              <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 140, paddingBottom: 10 }}>
                {[
                  { step: "Q1 Low", color: "var(--chart-ramp-1)", h: 40, hex: "#E3EFE8" },
                  { step: "Q2 Mid", color: "var(--chart-ramp-2)", h: 70, hex: "#A8C3B0" },
                  { step: "Q3 High", color: "var(--chart-ramp-3)", h: 105, hex: "#52967C" },
                  { step: "Q4 Peak", color: "var(--chart-ramp-4)", h: 140, hex: "#1F6F54" },
                ].map((bar) => (
                  <div key={bar.step} style={{ flex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        height: bar.h,
                        backgroundColor: bar.color,
                        borderRadius: "8px 8px 0 0",
                        marginBottom: 8,
                      }}
                    />
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink)" }}>{bar.step}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)" }}>{bar.hex}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Property 3 Distinct Series */}
            <div
              style={{
                padding: 32,
                borderRadius: "var(--radius-card)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: "0 0 8px" }}>
                Multi-Property Series (3 Distinct Hues)
              </h3>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 20px" }}>
                Never three greens. Properties A, B, and C use clearly distinguishable hues with direct labels.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Property A (Emerald)", color: "var(--chart-prop-a)", hex: "#1F6F54", val: "88%", contrast: "5.5:1" },
                  { label: "Property B (Terracotta)", color: "var(--chart-prop-b)", hex: "#A4532B", val: "72%", contrast: "5.0:1" },
                  { label: "Property C (Slate)", color: "var(--chart-prop-c)", hex: "#3A5A78", val: "94%", contrast: "6.6:1" },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                      <span style={{ color: "var(--ink)" }}>{item.label}</span>
                      <span style={{ color: "var(--muted)" }}>{item.val} ({item.hex})</span>
                    </div>
                    <div style={{ height: 12, borderRadius: 6, backgroundColor: "var(--surface-warm)", overflow: "hidden" }}>
                      <div style={{ width: item.val, height: "100%", backgroundColor: item.color, borderRadius: 6 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Card Specification ────────────────────────────────── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <Layers size={20} style={{ color: "var(--emerald)" }} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 28, margin: 0, color: "var(--ink)" }}>
              Card Token Demonstration
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 32, alignItems: "start" }}>
            {/* Live Property Card */}
            <PropertyCard property={sampleProp} />

            {/* Spec breakdown */}
            <div
              style={{
                padding: 32,
                borderRadius: "var(--radius-card)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--ink)", margin: "0 0 12px" }}>
                Property Card Anatomy
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)", fontSize: 14, lineHeight: 1.8 }}>
                <li><strong>Card Surface:</strong> Pure white (`var(--surface)`) with 1px hairline border (`var(--border)`).</li>
                <li><strong>Elevation:</strong> Soft and low shadow (`rgba(10,46,34,0.06)`), never harsh black shadows.</li>
                <li><strong>Image Container:</strong> Warm inset backdrop (`var(--surface-warm)`) to prevent photos with lush lawns from turning muddy.</li>
                <li><strong>Best Match Badge:</strong> Champagne Gold (`var(--gold)`) with deep forest text (6.6:1 contrast).</li>
                <li><strong>Action Buttons:</strong> High-legibility pill buttons with crisp borders and immediate state feedback.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 7. Compare "Verdict" Card (Deep Forest) ─────────────── */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <Award size={20} style={{ color: "var(--emerald)" }} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 28, margin: 0, color: "var(--ink)" }}>
              Compare "Verdict" Card (Deep Forest Surface)
            </h2>
          </div>

          <div
            style={{
              padding: "40px",
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Award size={20} style={{ color: "var(--gold)" }} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--gold)",
                  }}
                >
                  Featured Comparison Verdict
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 28,
                  fontWeight: 600,
                  color: "var(--on-forest)",
                  margin: "0 0 10px",
                }}
              >
                The Banyan Estate – Prime Recommendation
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--muted-on-forest)",
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: 680,
                }}
              >
                Deep forest surface token strictly reserved for the compare verdict, top nav, landing hero, and footer.
                All text uses high-contrast ivory (`var(--on-forest)`) and muted sage-gray (`var(--muted-on-forest)`).
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 32, fontWeight: 700, color: "var(--gold)" }}>
                $4,250,000
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  padding: "6px 14px",
                  borderRadius: "var(--radius-chip)",
                  backgroundColor: "var(--forest-2)",
                  border: "1px solid var(--gold)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--on-forest)",
                }}
              >
                <Check size={14} style={{ color: "var(--gold)" }} /> Best Value Index
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
