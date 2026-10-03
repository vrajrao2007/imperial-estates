import { chatCompletion } from "./ollama.js";

// In-memory cache: (propertyId + filtersHash) -> whyMatch sentence
const whyMatchCache = new Map();

/**
 * Creates a stable deterministic hash from user filters object.
 */
export function hashFilters(filters) {
  if (!filters || typeof filters !== "object") return "none";
  const keys = Object.keys(filters).sort();
  const pairs = keys.map((k) => `${k}:${JSON.stringify(filters[k])}`);
  return pairs.join("|");
}

/**
 * Deterministic fallback sentence, strictly <= 18 words.
 */
export function generateFallbackWhyMatch(property, userFilters = {}) {
  const area = property.area || property.location || "Hyderabad";
  const type = property.type ? property.type.toLowerCase() : "residence";
  const bhk = property.bhk ? `${property.bhk} BHK` : "";

  if (userFilters.bhk && property.bhk === Number(userFilters.bhk)) {
    return `Matches your ${property.bhk} BHK preference in prime ${area} with generous living spaces.`;
  }
  if (userFilters.type && property.type === userFilters.type) {
    return `Features a spacious luxury ${type} layout situated in desirable ${area}.`;
  }
  if (userFilters.locality || userFilters.area) {
    return `Prime ${bhk} ${type} located directly in sought-after ${area}.`;
  }
  return `Spacious ${bhk} ${type} in ${area} providing excellent architectural quality and value.`;
}

/**
 * Enforces maximum 18 words.
 */
function clampWords(text, maxWords = 18) {
  if (!text) return "";
  const words = text.trim().replace(/^["']|["']$/g, "").split(/\s+/);
  if (words.length <= maxWords) return words.join(" ");
  return words.slice(0, maxWords).join(" ") + "...";
}

/**
 * Generates or retrieves why-match summary.
 * @param {object} property
 * @param {object} userFilters
 * @returns {Promise<{reason: string, cached: boolean, source: "ai" | "fallback"}>}
 */
export async function getWhyMatch(property, userFilters = {}) {
  if (!property || !property.id) {
    return {
      reason: "Property details not provided.",
      cached: false,
      source: "fallback",
    };
  }

  const cacheKey = `${property.id}::${hashFilters(userFilters)}`;
  if (whyMatchCache.has(cacheKey)) {
    return {
      reason: whyMatchCache.get(cacheKey),
      cached: true,
      source: "ai",
    };
  }

  // Small context payload (<300 tokens)
  const context = {
    property: {
      title: property.title,
      area: property.area,
      type: property.type,
      bhk: property.bhk,
      price: property.price,
      amenities: (property.amenities || []).slice(0, 4),
    },
    userFilters,
  };

  const messages = [
    {
      role: "system",
      content:
        "Write exactly ONE short sentence explaining why this property matches the user's filters. Maximum 18 words. Only use the given property facts. Do not invent details.",
    },
    {
      role: "user",
      content: JSON.stringify(context),
    },
  ];

  try {
    const { text } = await chatCompletion(messages, undefined, 4000);
    const cleaned = clampWords(text.trim(), 18);
    if (!cleaned) throw new Error("Empty response");

    whyMatchCache.set(cacheKey, cleaned);
    return {
      reason: cleaned,
      cached: false,
      source: "ai",
    };
  } catch (err) {
    console.warn(`[why-match] Ollama failed (${err.message}). Using fallback.`);
    const fallback = clampWords(generateFallbackWhyMatch(property, userFilters), 18);
    whyMatchCache.set(cacheKey, fallback);
    return {
      reason: fallback,
      cached: false,
      source: "fallback",
    };
  }
}
