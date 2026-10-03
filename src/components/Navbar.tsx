/**
 * Navbar – top navigation bar with logo, links, saved/compare counters.
 * Deep Forest (#0A2E22) surface token with on-forest text tokens.
 */
import { Link, useLocation } from "react-router-dom";
import { Heart, GitCompareArrows, Sun, Moon, Search } from "lucide-react";
import { usePropertyStore } from "../store/usePropertyStore";

export default function Navbar() {
  const location = useLocation();
  const { savedIds, compareIds, isDark, toggleTheme } = usePropertyStore();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/results", label: "Explore" },
    { to: "/styleguide", label: "Styleguide" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundColor: "var(--forest)",
        borderBottom: "1px solid var(--forest-2)",
        transition: "background-color 200ms ease",
      }}
    >
      <nav
        className="container-estate"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "var(--on-forest)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, var(--emerald), var(--forest-2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--forest-2)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 21V9l9-7 9 7v12a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1z"
                fill="var(--on-forest)"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--on-forest)",
            }}
          >
            Imperial Estates
          </span>
        </Link>

        {/* Center links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: "8px 20px",
                borderRadius: "var(--radius-chip)",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                color: isActive(link.to) ? "var(--on-forest)" : "var(--muted-on-forest)",
                backgroundColor: isActive(link.to) ? "var(--emerald)" : "transparent",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.to)) {
                  e.currentTarget.style.backgroundColor = "var(--forest-2)";
                  e.currentTarget.style.color = "var(--on-forest)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.to)) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--muted-on-forest)";
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Search shortcut */}
          <Link
            to="/results"
            aria-label="Search properties"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 12,
              color: "var(--muted-on-forest)",
              textDecoration: "none",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--forest-2)";
              e.currentTarget.style.color = "var(--on-forest)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--muted-on-forest)";
            }}
          >
            <Search size={18} />
          </Link>

          {/* Saved */}
          <Link
            to="/saved"
            aria-label={`Saved properties (${savedIds.length})`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              color: savedIds.length > 0 ? "var(--gold)" : "var(--muted-on-forest)",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--forest-2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Heart
              size={18}
              fill={savedIds.length > 0 ? "var(--gold)" : "none"}
            />
            {savedIds.length > 0 && <span>{savedIds.length}</span>}
          </Link>

          {/* Compare */}
          <Link
            to="/compare"
            aria-label={`Compare list (${compareIds.length})`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              color: compareIds.length > 0 ? "var(--gold)" : "var(--muted-on-forest)",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--forest-2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <GitCompareArrows size={18} />
            {compareIds.length > 0 && <span>{compareIds.length}/3</span>}
          </Link>

          {/* Theme toggle (kept for state compatibility) */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Theme toggle" : "Theme toggle"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 12,
              border: "none",
              backgroundColor: "transparent",
              color: "var(--muted-on-forest)",
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--forest-2)";
              e.currentTarget.style.color = "var(--on-forest)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--muted-on-forest)";
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
