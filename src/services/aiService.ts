/**
 * Client service for offline on-device AI endpoints.
 * Operates purely over local endpoints:
 * - /api/ai/health
 * - /api/ai/warmup
 * - /api/ai/parse-search
 * - /api/ai/explain
 * - /api/ai/why-match
 */

export interface ParsedSearchFilters {
  maxPrice?: number;
  minPrice?: number;
  bhk?: number[];
  types?: ("apartment" | "villa" | "penthouse")[];
  amenities?: string[];
  nearMetroMinutes?: number;
  locality?: string;
  sortBy?: string;
  source?: "ai" | "fallback";
  response?: string;
}

export interface AiHealthResponse {
  online: boolean;
  model: string;
  modelLoaded?: boolean;
}

export interface WhyMatchResponse {
  reason: string;
  cached: boolean;
  source: "ai" | "fallback";
}

export async function checkAiHealth(): Promise<AiHealthResponse> {
  try {
    const res = await fetch("/api/ai/health", { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return { online: false, model: "qwen2.5:7b", modelLoaded: false };
  }
}

export async function warmupAi(): Promise<void> {
  try {
    await fetch("/api/ai/warmup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    console.warn("AI warm-up notice:", err);
  }
}

export async function parseNaturalLanguageSearch(
  query: string
): Promise<ParsedSearchFilters> {
  const res = await fetch("/api/ai/parse-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Parse failed with HTTP ${res.status}`);
  return await res.json();
}

export async function fetchWhyMatch(
  property: {
    id: string;
    title: string;
    area: string;
    type?: string;
    bhk?: number;
    price: number;
    amenities?: string[];
  },
  userFilters: Record<string, any>
): Promise<WhyMatchResponse> {
  const res = await fetch("/api/ai/why-match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ property, userFilters }),
  });
  if (!res.ok) throw new Error(`Why-match failed with HTTP ${res.status}`);
  return await res.json();
}

export async function streamCompareExplanation(
  payload: {
    properties: any[];
    scores: any[];
    priorities?: string[];
  },
  onToken: (token: string) => void,
  onComplete: () => void,
  onError: (err: any) => void
): Promise<() => void> {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`Explain stream failed: HTTP ${res.status}`);
      if (!res.body) throw new Error("No response stream available");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const dataStr = trimmed.slice(5).trim();
          if (dataStr === "[DONE]") {
            onComplete();
            return;
          }
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.token) {
              onToken(parsed.token);
            }
          } catch {
            // Ignore malformed SSE chunk
          }
        }
      }
      onComplete();
    } catch (err: any) {
      if (err.name !== "AbortError") {
        onError(err);
      }
    }
  })();

  // Return cancel function
  return () => controller.abort();
}
