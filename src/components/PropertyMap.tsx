/**
 * PropertyMap - Interactive Google Maps & Leaflet map plotting all luxury & residential
 * properties across the Hyderabad corridor.
 * Supports Google Maps Roadmap, Satellite, Hybrid, and Terrain layers,
 * corridor jumping, price markers, and direct Google Maps navigation links.
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ExternalLink } from "lucide-react";
import { type Property, formatPrice } from "../data/properties";

type MapLayerType = "google-streets" | "google-satellite" | "google-hybrid" | "google-terrain" | "carto-luxury";

interface PropertyMapProps {
  properties: Property[];
  selectedId?: string | null;
  onSelectProperty?: (id: string) => void;
  height?: string | number;
}

const TILE_LAYERS: Record<MapLayerType, { url: string; subdomains?: string[]; attribution: string; maxZoom: number }> = {
  "google-streets": {
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener">Google Maps</a>',
    maxZoom: 20,
  },
  "google-hybrid": {
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener">Google Maps Satellite & Roads</a>',
    maxZoom: 20,
  },
  "google-satellite": {
    url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener">Google Satellite</a>',
    maxZoom: 20,
  },
  "google-terrain": {
    url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener">Google Maps Terrain</a>',
    maxZoom: 20,
  },
  "carto-luxury": {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    subdomains: ["a", "b", "c", "d"],
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
    maxZoom: 20,
  },
};

const CORRIDOR_ZONES = [
  { name: "Jubilee Hills", lat: 17.432, lng: 78.407, zoom: 14 },
  { name: "Banjara Hills", lat: 17.415, lng: 78.435, zoom: 14 },
  { name: "Gachibowli", lat: 17.44, lng: 78.348, zoom: 14 },
  { name: "Kokapet", lat: 17.408, lng: 78.324, zoom: 14 },
  { name: "Miyapur", lat: 17.496, lng: 78.355, zoom: 14 },
  { name: "Tellapur", lat: 17.461, lng: 78.288, zoom: 14 },
];

export default function PropertyMap({
  properties,
  selectedId,
  onSelectProperty,
  height = "100%",
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayerType>("google-streets");

  // Switch Google Maps Layer
  const setTileLayer = useCallback((layerKey: MapLayerType) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const cfg = TILE_LAYERS[layerKey];
    const newLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      subdomains: cfg.subdomains || [],
      maxZoom: cfg.maxZoom,
    }).addTo(map);

    currentTileLayerRef.current = newLayer;
    setActiveLayer(layerKey);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Centered on Hyderabad Luxury Corridor
    const map = L.map(mapContainerRef.current, {
      center: [17.425, 78.385],
      zoom: 12,
      minZoom: 9,
      maxZoom: 19,
      zoomControl: false,
    });

    const cfg = TILE_LAYERS[activeLayer];
    const initialLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      subdomains: cfg.subdomains || [],
      maxZoom: cfg.maxZoom,
    }).addTo(map);

    currentTileLayerRef.current = initialLayer;

    // Zoom controls bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds([]);

    properties.forEach((prop) => {
      if (!prop.lat || !prop.lng) return;

      const isSelected = prop.id === selectedId;
      const formatted = formatPrice(prop.price);

      // Luxury Price Badge Marker with Google Maps aesthetic
      const icon = L.divIcon({
        className: "estate-map-marker",
        html: `
          <div style="
            background: ${isSelected ? "var(--gold, #C9A96E)" : "var(--forest, #0A2E22)"};
            color: ${isSelected ? "var(--forest, #0A2E22)" : "var(--on-forest, #F7F4EC)"};
            border: 2px solid ${isSelected ? "#FFFFFF" : "var(--gold, #C9A96E)"};
            border-radius: 9999px;
            padding: 4px 11px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.02em;
            font-family: var(--font-body, system-ui);
            box-shadow: 0 4px 16px rgba(0,0,0,0.35);
            white-space: nowrap;
            cursor: pointer;
            transform: translate(-50%, -50%) scale(${isSelected ? 1.2 : 1});
            transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span style="display:inline-block; width: 6px; height: 6px; border-radius: 50%; background: ${isSelected ? "var(--forest, #0A2E22)" : "var(--gold, #C9A96E)"};"></span>
            ${formatted}
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker([prop.lat, prop.lng], { icon }).addTo(map);

      marker.on("click", () => {
        setActiveProperty(prop);
        onSelectProperty?.(prop.id);
        map.panTo([prop.lat, prop.lng], { animate: true, duration: 0.5 });
      });

      markersRef.current[prop.id] = marker;
      bounds.extend([prop.lat, prop.lng]);
    });

    if (properties.length > 0 && bounds.isValid() && !selectedId) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [properties, selectedId, onSelectProperty]);

  // Pan to selected marker
  useEffect(() => {
    if (!selectedId || !mapInstanceRef.current) return;
    const prop = properties.find((p) => p.id === selectedId);
    if (prop && prop.lat && prop.lng) {
      mapInstanceRef.current.panTo([prop.lat, prop.lng], { animate: true });
      setActiveProperty(prop);
    }
  }, [selectedId, properties]);

  const jumpToZone = (zone: typeof CORRIDOR_ZONES[0]) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([zone.lat, zone.lng], zone.zoom, { duration: 1.2 });
  };

  const resetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([17.425, 78.385], 12, { duration: 1 });
  };

  return (
    <div style={{ position: "relative", width: "100%", height, minHeight: 480 }}>
      {/* Map Canvas */}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "var(--radius-card, 16px)",
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-card)",
        }}
      />

      {/* Top Left: Google Maps Header Badge */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: "calc(100% - 32px)",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(10, 46, 34, 0.92)",
            backdropFilter: "blur(12px)",
            color: "var(--on-forest)",
            border: "1px solid rgba(201, 169, 110, 0.35)",
            borderRadius: "9999px",
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
          }}
        >
          {/* Google Maps Pin Icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 2C7.58 2 4 5.58 4 10C4 16 12 22 12 22C12 22 20 16 20 10C20 5.58 16.42 2 12 2Z" fill="#EA4335" />
            <circle cx="12" cy="10" r="3.5" fill="#FFFFFF" />
          </svg>
          <span style={{ color: "var(--gold)", fontWeight: 700 }}>Google Maps</span>
          <span style={{ opacity: 0.6 }}>•</span>
          <span>Hyderabad Luxury Corridor ({properties.length})</span>
        </div>

        {/* Quick Corridor Selector Pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {CORRIDOR_ZONES.map((zone) => (
            <button
              key={zone.name}
              onClick={() => jumpToZone(zone)}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(10, 46, 34, 0.15)",
                borderRadius: "9999px",
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--forest)",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--forest)";
                e.currentTarget.style.color = "var(--gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                e.currentTarget.style.color = "var(--forest)";
              }}
            >
              📍 {zone.name}
            </button>
          ))}
          <button
            onClick={resetView}
            style={{
              backgroundColor: "rgba(10, 46, 34, 0.8)",
              border: "1px solid rgba(201, 169, 110, 0.3)",
              borderRadius: "9999px",
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--gold)",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Top Right: Google Maps Layer Switcher Pill */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(10, 46, 34, 0.18)",
          borderRadius: "9999px",
          padding: "4px",
          display: "flex",
          gap: 4,
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        }}
      >
        <button
          onClick={() => setTileLayer("google-streets")}
          style={{
            padding: "5px 12px",
            borderRadius: "9999px",
            border: "none",
            backgroundColor: activeLayer === "google-streets" ? "var(--forest)" : "transparent",
            color: activeLayer === "google-streets" ? "var(--gold)" : "var(--ink)",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 150ms ease",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          🗺️ Google Maps
        </button>

        <button
          onClick={() => setTileLayer("google-hybrid")}
          style={{
            padding: "5px 12px",
            borderRadius: "9999px",
            border: "none",
            backgroundColor: activeLayer === "google-hybrid" ? "var(--forest)" : "transparent",
            color: activeLayer === "google-hybrid" ? "var(--gold)" : "var(--ink)",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 150ms ease",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          🛰️ Satellite
        </button>

        <button
          onClick={() => setTileLayer("google-terrain")}
          style={{
            padding: "5px 12px",
            borderRadius: "9999px",
            border: "none",
            backgroundColor: activeLayer === "google-terrain" ? "var(--forest)" : "transparent",
            color: activeLayer === "google-terrain" ? "var(--gold)" : "var(--ink)",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 150ms ease",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          🏔️ Terrain
        </button>

        <button
          onClick={() => setTileLayer("carto-luxury")}
          style={{
            padding: "5px 12px",
            borderRadius: "9999px",
            border: "none",
            backgroundColor: activeLayer === "carto-luxury" ? "var(--forest)" : "transparent",
            color: activeLayer === "carto-luxury" ? "var(--gold)" : "var(--ink)",
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 150ms ease",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          🏛️ Luxury
        </button>
      </div>

      {/* Floating Property Preview Card when marker clicked */}
      {activeProperty && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            zIndex: 1000,
            width: "calc(100% - 48px)",
            maxWidth: 380,
            backgroundColor: "var(--surface)",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--border)",
            boxShadow: "0 20px 48px rgba(0,0,0,0.3)",
            overflow: "hidden",
            animation: "slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div style={{ position: "relative", height: 160, backgroundColor: "var(--surface-warm)" }}>
            <img
              src={activeProperty.image}
              alt={activeProperty.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <button
              onClick={() => setActiveProperty(null)}
              aria-label="Close preview"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: "rgba(10,46,34,0.75)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              ✕
            </button>
            <div
              style={{
                position: "absolute",
                bottom: 8,
                left: 8,
                backgroundColor: "var(--forest)",
                color: "var(--gold)",
                padding: "3px 10px",
                borderRadius: "var(--radius-chip)",
                fontSize: 14,
                fontWeight: 700,
                border: "1px solid rgba(201, 169, 110, 0.4)",
              }}
            >
              {formatPrice(activeProperty.price)}
            </div>
          </div>

          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--emerald)",
                  backgroundColor: "rgba(10,46,34,0.08)",
                  padding: "2px 6px",
                  borderRadius: "var(--radius-chip)",
                }}
              >
                {activeProperty.area}
              </span>
              {activeProperty.price < 10_000_000 && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#92400e",
                    backgroundColor: "#fef3c7",
                    padding: "2px 6px",
                    borderRadius: "var(--radius-chip)",
                    border: "1px solid #fde68a",
                  }}
                >
                  Under ₹1 Cr
                </span>
              )}
            </div>

            <h4
              style={{
                margin: "0 0 4px",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--ink)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {activeProperty.title}
            </h4>
            <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--muted)" }}>
              {activeProperty.location}, Hyderabad
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
                color: "var(--muted)",
                paddingTop: 8,
                borderTop: "1px solid var(--border)",
                gap: 8,
              }}
            >
              <span>
                {activeProperty.bhk} BHK • {activeProperty.sqft.toLocaleString("en-IN")} sqft
              </span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {/* Direct Google Maps Navigation Button */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    activeProperty.title + " " + activeProperty.location + " Hyderabad"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#EA4335",
                    fontSize: 11,
                    fontWeight: 700,
                    textDecoration: "none",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    backgroundColor: "#FEE2E2",
                  }}
                  title="Open property location directly in Google Maps"
                >
                  Google Maps <ExternalLink size={12} />
                </a>

                <Link
                  to={`/property/${activeProperty.id}`}
                  style={{
                    color: "var(--emerald)",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontSize: 12,
                  }}
                >
                  View Residence →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}