import { z } from "zod";
import { chatCompletion } from "./ollama.js";
import { fallbackParse, parseIndianAmount } from "./fallbackParser.js";

/**
 * Zod schema for parsed search filters.
 * Strips unknown fields, enforces strict types.
 */
export const SearchFiltersZod = z.object({
  maxPrice: z.number().positive().optional(),
  minPrice: z.number().positive().optional(),
  bhk: z.array(z.number().int().min(1).max(10)).optional(),
  types: z.array(z.enum(["apartment", "villa", "penthouse"])).optional(),
  amenities: z.array(z.string()).optional(),
  nearMetroMinutes: z.number().positive().optional(),
  locality: z.string().optional(),
  sortBy: z.string().optional(),
});

/**
 * Ollama JSON schema format parameter.
 */
export const SEARCH_JSON_SCHEMA = {
  type: "object",
  properties: {
    maxPrice: { type: "number" },
    minPrice: { type: "number" },
    bhk: {
      type: "array",
      items: { type: "number" },
    },
    types: {
      type: "array",
      items: { type: "string", enum: ["apartment", "villa", "penthouse"] },
    },
    amenities: {
      type: "array",
      items: { type: "string" },
    },
    nearMetroMinutes: { type: "number" },
    locality: { type: "string" },
    sortBy: {
      type: "string",
      enum: ["price-asc", "price-desc", "newest", "largest"],
    },
  },
};

const SYSTEM_PROMPT = `You are an expert real-estate query parser. Convert the user's natural language search query into JSON.
Return only fields the user actually stated; never guess.
Do NOT include fields not mentioned in the query.
Values:
- maxPrice, minPrice: numbers in INR (1 Lakh = 100000, 1 Crore = 10000000, e.g. 2 Cr = 20000000, 50 Lakhs = 5000000).
- bhk: array of numbers (e.g. [3])
- types: array containing ("apartment" | "villa" | "penthouse")
- amenities: array of strings if mentioned (e.g. ["swimming pool", "gym", "terrace"])
- nearMetroMinutes: number of minutes to metro
- locality: neighborhood string
- sortBy: DO NOT include unless user explicitly asked to sort (e.g. "price-asc", "price-desc", "newest", "largest")

Examples:
Query: "3 BHK apartment in Banjara Hills under 2 crore"
JSON: {"maxPrice": 20000000, "bhk": [3], "types": ["apartment"], "locality": "Banjara Hills"}

Query: "luxury villa with swimming pool near metro within 15 mins"
JSON: {"types": ["villa"], "amenities": ["swimming pool"], "nearMetroMinutes": 15}

Query: "flats between 50 lakhs and 1.5 cr in Gachibowli sorted by price low to high"
JSON: {"minPrice": 5000000, "maxPrice": 15000000, "types": ["apartment"], "locality": "Gachibowli", "sortBy": "price-asc"}

Query: "penthouse in Hitec City with gym and terrace"
JSON: {"types": ["penthouse"], "locality": "Hitec City", "amenities": ["gym", "terrace"]}

Query: "4 bhk under 3 cr"
JSON: {"bhk": [4], "maxPrice": 30000000}`;



/**
 * Normalizes raw output from model (e.g. string prices or single BHK).
 */
export function normalizeRawOutput(raw) {
  if (!raw || typeof raw !== "object") return {};
  const cleaned = {};

  // Normalizing price fields
  for (const priceKey of ["maxPrice", "minPrice"]) {
    if (raw[priceKey] !== undefined && raw[priceKey] !== null) {
      if (typeof raw[priceKey] === "number") {
        // If the model mistakenly returned e.g. 1.5 instead of 15,000,000
        if (raw[priceKey] > 0 && raw[priceKey] < 500) {
          cleaned[priceKey] = Math.round(raw[priceKey] * 10_000_000);
        } else {
          cleaned[priceKey] = Math.round(raw[priceKey]);
        }
      } else if (typeof raw[priceKey] === "string") {
        const match = raw[priceKey].match(/([\d.]+)\s*(cr(?:ore)?s?|lakh?s?|lacs?|l)?/i);
        if (match) {
          const num = parseIndianAmount(match[1], match[2]);
          if (num) cleaned[priceKey] = num;
        }
      }
    }
  }

  // Normalizing BHK
  if (raw.bhk !== undefined && raw.bhk !== null) {
    if (Array.isArray(raw.bhk)) {
      cleaned.bhk = raw.bhk.map(Number).filter((n) => !isNaN(n) && n >= 1 && n <= 10);
    } else if (typeof raw.bhk === "number") {
      cleaned.bhk = [raw.bhk];
    }
  }

  // Normalizing types
  if (raw.types !== undefined && raw.types !== null) {
    const valid = ["apartment", "villa", "penthouse"];
    const arr = Array.isArray(raw.types) ? raw.types : [raw.types];
    const mapped = arr
      .map((t) => (t === "flat" ? "apartment" : String(t).toLowerCase()))
      .filter((t) => valid.includes(t));
    if (mapped.length > 0) cleaned.types = mapped;
  }

  // Normalizing amenities
  if (Array.isArray(raw.amenities) && raw.amenities.length > 0) {
    cleaned.amenities = raw.amenities.map(String);
  }

  // Locality
  if (typeof raw.locality === "string" && raw.locality.trim()) {
    cleaned.locality = raw.locality.trim();
  }

  // Metro minutes
  if (typeof raw.nearMetroMinutes === "number" && raw.nearMetroMinutes > 0) {
    cleaned.nearMetroMinutes = Math.round(raw.nearMetroMinutes);
  }

  // SortBy
  if (typeof raw.sortBy === "string" && raw.sortBy.trim()) {
    cleaned.sortBy = raw.sortBy.trim();
  }

  return cleaned;
}

/**
 * Parses user search query with Ollama qwen2.5:7b.
 * Falls back to deterministic regex parser on timeout (8s), error, or invalid JSON.
 * @param {string} query
 * @returns {Promise<{filters: object, source: "ai" | "fallback"}>}
 */
export async function parseSearchQuery(query) {
  if (!query || typeof query !== "string" || !query.trim()) {
    return { filters: {}, source: "fallback" };
  }

  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query.trim() },
    ];

    // 8s timeout enforced in chatCompletion
    const { text, latencyMs } = await chatCompletion(messages, SEARCH_JSON_SCHEMA, 8000);
    console.log(`[search-parser] raw text (${latencyMs}ms):`, text);

    let parsedJson;
    try {
      parsedJson = JSON.parse(text);
    } catch {
      // Sometimes models wrap json in markdown block ```json ... ```
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsedJson = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid JSON response from model");
      }
    }

    const normalized = normalizeRawOutput(parsedJson);
    const validated = SearchFiltersZod.parse(normalized);
    const responseText = buildResponseSummary(query, validated);

    // If AI parsed successfully with non-empty filters or clean result
    return {
      filters: validated,
      response: responseText,
      source: "ai",
    };
  } catch (err) {
    console.warn(`[search-parser] Ollama parse failed or timed out (${err.message}). Using fallback parser.`);
    const fallbackFilters = fallbackParse(query);
    const fallbackResponse = buildResponseSummary(query, fallbackFilters);
    return {
      filters: fallbackFilters,
      response: fallbackResponse,
      source: "fallback",
    };
  }
}

/**
 * Builds a natural language response summary based on user query and parsed filters.
 */
export function buildResponseSummary(query, filters = {}) {
  const parts = [];
  if (filters.bhk && filters.bhk.length > 0) {
    parts.push(`${filters.bhk.join(", ")} BHK`);
  }
  if (filters.types && filters.types.length > 0) {
    parts.push(filters.types.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" & "));
  } else {
    parts.push("residences");
  }

  let text = `Found ${parts.join(" ")}`;
  if (filters.locality) {
    text += ` in ${filters.locality}`;
  } else {
    text += ` in prime Hyderabad corridors`;
  }

  if (filters.maxPrice) {
    const cr = filters.maxPrice / 10000000;
    const lk = filters.maxPrice / 100000;
    const priceStr = cr >= 1 ? `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr` : `₹${lk.toFixed(0)} Lakhs`;
    text += ` under ${priceStr}`;
  }
  if (filters.minPrice) {
    const cr = filters.minPrice / 10000000;
    const lk = filters.minPrice / 100000;
    const priceStr = cr >= 1 ? `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr` : `₹${lk.toFixed(0)} Lakhs`;
    text += ` starting from ${priceStr}`;
  }
  if (filters.amenities && filters.amenities.length > 0) {
    text += ` featuring ${filters.amenities.join(", ")}`;
  }
  if (filters.nearMetroMinutes) {
    text += ` within ${filters.nearMetroMinutes} minutes of metro`;
  }
  text += ".";
  return text;
}
