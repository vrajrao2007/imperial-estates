/**
 * EmptyState – a styled empty-state placeholder with icon, title, and CTA.
 * Uses tokens: --surface-warm, --border, --ink, --muted, --emerald, --on-forest.
 */
import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaTo?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaTo,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 40px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          backgroundColor: "var(--surface-warm)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          color: "var(--emerald)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <Icon size={32} />
      </div>

      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 28,
          fontWeight: 600,
          margin: "0 0 8px",
          color: "var(--ink)",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: 15,
          color: "var(--muted)",
          maxWidth: 400,
          margin: "0 0 24px",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: "var(--radius-button)",
            backgroundColor: "var(--emerald)",
            color: "var(--on-forest)",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "var(--font-body)",
            textDecoration: "none",
            transition: "all 200ms ease",
            border: "1px solid var(--emerald)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--emerald-hover)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--emerald)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
