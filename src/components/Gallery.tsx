/**
 * Gallery - displays real architectural property photographs in an asymmetric grid.
 * Uses tokens: --surface-warm, --border, --forest.
 */
import { useState } from "react";

interface GalleryProps {
  gradient?: string;
  images?: string[];
  title: string;
}

export default function Gallery({ gradient, images, title }: GalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // If real images exist, use them; otherwise fallback to gradients
  const photoList = images && images.length > 0 ? images : [];

  return (
    <>
      <div
        role="region"
        aria-label={`Photo gallery for ${title}`}
        style={{
          display: "grid",
          gridTemplateColumns: "1.8fr 1fr",
          gridTemplateRows: "215px 215px",
          gap: 12,
          height: 442,
          borderRadius: "var(--radius-card)",
          overflow: "hidden",
          backgroundColor: "var(--surface-warm)",
        }}
      >
        {/* Main Hero Photograph */}
        <div
          onClick={() => photoList[0] && setSelectedPhoto(photoList[0])}
          style={{
            gridRow: "1 / 3",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
            background: gradient || "var(--forest)",
          }}
        >
          {photoList[0] ? (
            <img
              src={photoList[0]}
              alt={`${title} - Primary Exterior View`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 500ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <span style={{ color: "var(--on-forest)", fontSize: 14 }}>Primary View</span>
            </div>
          )}

          {/* Badge */}
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              padding: "6px 14px",
              borderRadius: "var(--radius-chip)",
              backgroundColor: "rgba(10, 46, 34, 0.75)",
              backdropFilter: "blur(8px)",
              color: "var(--on-forest)",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.05em",
            }}
          >
            Primary Exterior
          </div>
        </div>

        {/* Secondary Photographs (Right side stack) */}
        {[1, 2].map((idx) => {
          const photo = photoList[idx] || photoList[0];
          return (
            <div
              key={idx}
              onClick={() => photo && setSelectedPhoto(photo)}
              style={{
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                background: gradient || "var(--forest)",
              }}
            >
              {photo ? (
                <img
                  src={photo}
                  alt={`${title} - Angle ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 500ms ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              ) : null}
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  padding: "4px 10px",
                  borderRadius: "var(--radius-chip)",
                  backgroundColor: "rgba(10, 46, 34, 0.7)",
                  backdropFilter: "blur(6px)",
                  color: "var(--on-forest)",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                {idx === 1 ? "Interior & Living" : "Terrace & Grounds"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            backgroundColor: "rgba(10, 46, 34, 0.92)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            cursor: "zoom-out",
          }}
        >
          <img
            src={selectedPhoto}
            alt={title}
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: "12px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </>
  );
}