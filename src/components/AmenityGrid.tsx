/**
 * AmenityGrid – displays property amenities as clean chips.
 * Uses tokens: --surface-warm, --border, --ink, --emerald.
 */
import {
  Waves,
  Dumbbell,
  Sparkles,
  TreePine,
  Tv2,
  Shield,
  Zap,
  Car,
  BookOpen,
  Baby,
  Sun,
  CloudRain,
  Wine,
  Wifi,
  Building,
  Phone,
  Footprints,
  type LucideIcon,
} from "lucide-react";

const AMENITY_ICONS: Record<string, LucideIcon> = {
  pool: Waves,
  gym: Dumbbell,
  spa: Sparkles,
  garden: TreePine,
  "home theater": Tv2,
  security: Shield,
  "power backup": Zap,
  parking: Car,
  garage: Car,
  library: BookOpen,
  study: BookOpen,
  "children's play area": Baby,
  "solar panels": Sun,
  "rainwater harvesting": CloudRain,
  "wine cellar": Wine,
  "smart home": Wifi,
  concierge: Phone,
  clubhouse: Building,
  "jogging track": Footprints,
  "ev charging": Zap,
  "rooftop terrace": Sun,
  "rooftop garden": TreePine,
  "lake view": Waves,
  terrace: Sun,
  helipad: Building,
  "meditation room": Sparkles,
  "staff quarters": Shield,
  "private elevator": Building,
};

function getIcon(amenity: string): LucideIcon {
  const key = amenity.toLowerCase();
  return AMENITY_ICONS[key] || Sparkles;
}

interface AmenityGridProps {
  amenities: string[];
}

export default function AmenityGrid({ amenities }: AmenityGridProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {amenities.map((amenity) => {
        const Icon = getIcon(amenity);
        return (
          <span
            key={amenity}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: "var(--radius-chip)",
              backgroundColor: "var(--surface-warm)",
              border: "1px solid var(--border)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--ink)",
              transition: "all 200ms ease",
            }}
          >
            <Icon size={15} style={{ color: "var(--emerald)" }} />
            {amenity}
          </span>
        );
      })}
    </div>
  );
}
