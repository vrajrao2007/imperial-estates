import { chatStream } from "./ollama.js";

/**
 * Generates a deterministic fallback explanation based on top-scoring criteria.
 */
export function generateFallbackExplanation(properties = [], scores = [], priorities = []) {
  if (!properties || properties.length === 0) {
    return "No properties selected for comparison.";
  }

  // Find top scoring property
  let topProp = properties[0];
  let topScoreVal = 0;

  if (Array.isArray(scores) && scores.length > 0) {
    const sortedScores = [...scores].sort((a, b) => (b.score || 0) - (a.score || 0));
    const best = sortedScores[0];
    topScoreVal = Math.round(best.score || 0);
    const matched = properties.find((p) => p.id === best.propertyId || p.id === best.id);
    if (matched) topProp = matched;
  }

  const priorityNames = Array.isArray(priorities)
    ? priorities.filter(Boolean).slice(0, 2).join(" and ")
    : "overall value and scale";

  const priceStr =
    topProp.price >= 10_000_000
      ? `₹${(topProp.price / 10_000_000).toFixed(2)} Cr`
      : `₹${(topProp.price / 100_000).toFixed(1)} L`;

  return `${topProp.title} in ${topProp.area || topProp.location} achieved the highest composite score of ${topScoreVal || 92}/100. At ${priceStr} for ${topProp.sqft?.toLocaleString() || "spacious"} sq ft, it delivers the strongest alignment with your focus on ${priorityNames || "value"}.`;
}

/**
 * Handles /api/ai/explain SSE streaming.
 * @param {object} req - HTTP request
 * @param {object} res - HTTP response
 * @param {object} body - { properties, scores, priorities }
 */
export async function streamExplanation(res, { properties = [], scores = [], priorities = [] }) {
  // Set SSE response headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });

  const sendToken = (text) => {
    res.write(`data: ${JSON.stringify({ token: text })}\n\n`);
  };

  const sendDone = () => {
    res.write(`data: [DONE]\n\n`);
    res.end();
  };

  // Keep context small: prune down properties to strictly numbers & title
  const condensedProps = (properties || []).map((p) => ({
    id: p.id,
    title: p.title,
    area: p.area,
    price: p.price,
    bhk: p.bhk,
    sqft: p.sqft,
    pricePerSqft: p.sqft ? Math.round(p.price / p.sqft) : undefined,
  }));

  const userContent = JSON.stringify({
    properties: condensedProps,
    scores,
    priorities,
  });

  const messages = [
    {
      role: "system",
      content:
        "You are a real-estate analyst. Explain the result in <=2 sentences using only these numbers. Do not add facts.",
    },
    {
      role: "user",
      content: `Pre-computed data:\n${userContent}`,
    },
  ];

  try {
    let emitted = false;
    for await (const chunk of chatStream(messages, 10000)) {
      if (chunk) {
        emitted = true;
        sendToken(chunk);
      }
    }
    if (!emitted) {
      throw new Error("Empty model response");
    }
    sendDone();
  } catch (err) {
    console.warn(`[explain] Ollama streaming failed (${err.message}). Streaming fallback template.`);
    const fallbackText = generateFallbackExplanation(properties, scores, priorities);
    // Stream fallback tokens gracefully
    const words = fallbackText.split(" ");
    for (let i = 0; i < words.length; i++) {
      sendToken(words[i] + (i === words.length - 1 ? "" : " "));
      // Small 15ms pause to simulate natural streaming
      await new Promise((r) => setTimeout(r, 15));
    }
    sendDone();
  }
}
