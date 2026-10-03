/**
 * Deterministic regex/keyword search parser.
 * Used as immediate fallback when Ollama is offline, times out, or returns invalid JSON.
 * Returns normalized filters matching the schema:
 * { maxPrice?, minPrice?, bhk?, types?, amenities?, nearMetroMinutes?, locality?, sortBy? }
 */

// Common Hyderabad localities from property dataset
const LOCALITIES = [
  "Jubilee Hills",
  "Banjara Hills",
  "Hitec City",
  "Gachibowli",
  "Madhapur",
  "Kondapur",
  "Kokapet",
  "Financial District",
  "Tellapur",
  "Manikonda",
  "Narsingi",
  "Begumpet",
  "Somajiguda",
  "Kukatpally",
  "Miyapur",
  "Secunderabad",
  "Puppalguda",
  "Nanakramguda",
  "Gandipet",
  "Khajaguda",
  "Alwal",
  "Kompally",
  "Pragathi Nagar",
  "Nizampet",
  "Attapur",
  "Mehdipatnam",
  "Ameerpet",
  "Uppal",
  "LB Nagar",
  "Kothaguda",
  "Chandanagar",
  "Bachupally",
  "Bandlaguda Jagir",
  "Appa Junction",
  "Sun City",
  "Moinabad",
  "Shamshabad",
  "Pocharam",
  "Nagole",
  "Toli Chowki",
  "Film Nagar",
  "Sainikpuri",
  "Hafeezpet",
  "Bowenpally",
  "Tarnaka",
];

// Recognized amenities keywords
const AMENITY_KEYWORDS = [
  { match: /(?:swimming\s*)?pool/i, name: "Swimming Pool" },
  { match: /gym(?:nasium)?|fitness/i, name: "Gym" },
  { match: /clubhouse|club\s*house/i, name: "Clubhouse" },
  { match: /terrace|rooftop|panoramic\s*terrace/i, name: "Panoramic Terrace" },
  { match: /garden|landscaped/i, name: "Landscaped Garden" },
  { match: /parking|car\s*park|valet/i, name: "Car Parking" },
  { match: /security|biometric|cctv/i, name: "24/7 Security" },
  { match: /power\s*backup|generator/i, name: "100% Power Backup" },
  { match: /spa|jacuzzi/i, name: "Spa" },
  { match: /sports|tennis|badminton|court/i, name: "Sports Court" },
  { match: /home\s*automation|smart\s*home/i, name: "Home Automation" },
  { match: /marble|italian\s*marble/i, name: "Italian Marble" },
  { match: /lift|elevator/i, name: "High-speed Elevators" },
];

/**
 * Normalizes Indian currency multiplier strings to INR number.
 * e.g. "1.2 cr" -> 12000000, "50 lakh" -> 5000000
 */
export function parseIndianAmount(numStr, unitStr) {
  const val = parseFloat(numStr);
  if (isNaN(val)) return undefined;

  const unit = (unitStr || "").toLowerCase().trim();
  if (/^cr(?:ore)?s?$/.test(unit)) {
    return Math.round(val * 10_000_000);
  }
  if (/^(?:lakh?|lac)s?|l$/.test(unit)) {
    return Math.round(val * 100_000);
  }
  if (/^k$/.test(unit)) {
    return Math.round(val * 1_000);
  }

  // If number itself is already in raw rupees, return as is
  return Math.round(val);
}

/**
 * Deterministic keyword & regex parser
 * @param {string} query
 * @returns {object} Extracted search filters
 */
export function fallbackParse(query) {
  if (!query || typeof query !== "string") return {};
  const q = query.trim();
  const lower = q.toLowerCase();
  const result = {};

  // 1. Locality extraction (case-insensitive substring match)
  for (const loc of LOCALITIES) {
    const locLower = loc.toLowerCase();
    const regex = new RegExp(`\\b${locLower}\\b`, "i");
    if (regex.test(lower)) {
      result.locality = loc;
      break;
    }
  }

  // 2. BHK extraction
  const bhkMatch = lower.match(/\b([1-9])\s*(?:bhk|bedroom|bed|b\.h\.k)\b/i);
  if (bhkMatch) {
    const bhkNum = parseInt(bhkMatch[1], 10);
    if (!isNaN(bhkNum) && bhkNum >= 1 && bhkNum <= 10) {
      result.bhk = [bhkNum];
    }
  }

  // 3. Property Types
  const types = [];
  if (/\b(?:apartment|apartments|flat|flats)\b/i.test(lower)) {
    types.push("apartment");
  }
  if (/\b(?:villa|villas|independent\s*house)\b/i.test(lower)) {
    types.push("villa");
  }
  if (/\b(?:penthouse|penthouses)\b/i.test(lower)) {
    types.push("penthouse");
  }
  if (types.length > 0) {
    result.types = types;
  }

  // 4. Price range extraction
  const betweenMatch = lower.match(
    /(?:between|from)\s+([\d.]+)\s*(cr(?:ore)?s?|lakh?s?|lacs?|l)?\s*(?:to|and|-)\s*([\d.]+)\s*(cr(?:ore)?s?|lakh?s?|lacs?|l)/i
  );
  if (betweenMatch) {
    const minUnit = betweenMatch[2] || betweenMatch[4];
    const maxUnit = betweenMatch[4];
    const min = parseIndianAmount(betweenMatch[1], minUnit);
    const max = parseIndianAmount(betweenMatch[3], maxUnit);
    if (min) result.minPrice = min;
    if (max) result.maxPrice = max;
  } else {
    // Under / below / max / up to:
    const maxMatch = lower.match(
      /(?:under|below|max|up\s*to|less\s*than|within|budget(?:\s*of)?)\s*(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(cr(?:ore)?s?|lakh?s?|lacs?|l)\b/i
    );
    if (maxMatch) {
      const max = parseIndianAmount(maxMatch[1], maxMatch[2]);
      if (max) result.maxPrice = max;
    }

    // Above / min / more than / starting from:
    const minMatch = lower.match(
      /(?:above|min(?:imum)?|more\s*than|over|starting\s*(?:from|at)?)\s*(?:₹|rs\.?|inr)?\s*([\d.]+)\s*(cr(?:ore)?s?|lakh?s?|lacs?|l)\b/i
    );
    if (minMatch) {
      const min = parseIndianAmount(minMatch[1], minMatch[2]);
      if (min) result.minPrice = min;
    }
  }

  // 5. Metro proximity
  const metroMatch = lower.match(
    /(?:near|close\s*to|within|<=|<)\s*([0-9]+)\s*(?:min(?:ute)?s?)?\s*(?:of\s*)?metro/i
  );
  if (metroMatch) {
    result.nearMetroMinutes = parseInt(metroMatch[1], 10);
  } else if (/near\s*metro|metro\s*(?:station|connectivity)/i.test(lower)) {
    result.nearMetroMinutes = 10;
  }

  // 6. Amenities
  const foundAmenities = [];
  for (const { match, name } of AMENITY_KEYWORDS) {
    if (match.test(lower)) {
      foundAmenities.push(name);
    }
  }
  if (foundAmenities.length > 0) {
    result.amenities = foundAmenities;
  }

  // 7. Sort By
  if (/(?:cheap(?:est)?|price\s*low\s*(?:to|→)\s*high|lowest\s*price)/i.test(lower)) {
    result.sortBy = "price-asc";
  } else if (/(?:expensive|luxury|price\s*high\s*(?:to|→)\s*low|highest\s*price)/i.test(lower)) {
    result.sortBy = "price-desc";
  } else if (/(?:new(?:est)?|recent|latest)/i.test(lower)) {
    result.sortBy = "newest";
  } else if (/(?:largest|biggest|most\s*spacious)/i.test(lower)) {
    result.sortBy = "largest";
  }

  return result;
}
