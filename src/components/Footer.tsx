/**
 * Footer – site footer with luxury branding.
 * Styled in Deep Forest (#0A2E22) token with on-forest text tokens.
 */
export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--forest)",
        borderTop: "1px solid var(--forest-2)",
        padding: "48px 0",
        marginTop: 80,
      }}
    >
      <div
        className="container-estate"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--emerald), var(--forest-2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--forest-2)",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 21V9l9-7 9 7v12a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1z"
                fill="var(--on-forest)"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--on-forest)",
            }}
          >
            Imperial Estates
          </span>
        </div>

        <p style={{ fontSize: 13, color: "var(--muted-on-forest)", margin: 0 }}>
          © {new Date().getFullYear()} Imperial Estates. Curated luxury & residential property discovery.
        </p>

        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map((label) => (
            <a
              key={label}
              href="#"
              style={{
                fontSize: 13,
                color: "var(--muted-on-forest)",
                textDecoration: "none",
                transition: "color 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--muted-on-forest)";
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
