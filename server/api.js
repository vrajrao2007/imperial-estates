import { healthCheck, warmUp } from "./ollama.js";
import { parseSearchQuery } from "./searchParser.js";
import { streamExplanation } from "./explainService.js";
import { getWhyMatch } from "./whyMatchService.js";

/**
 * Reads and parses JSON payload from incoming stream.
 */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2e6) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error(`Invalid JSON body: ${err.message}`));
      }
    });
    req.on("error", reject);
  });
}

/**
 * Standard JSON response helper.
 */
function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

/**
 * Connect/Vite/Express compatible middleware handling all /api/ai/* endpoints.
 */
export async function aiApiMiddleware(req, res, next) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  // Only intercept /api/ai routes
  if (!pathname.startsWith("/api/ai")) {
    return next ? next() : undefined;
  }

  // Handle CORS OPTIONS
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  try {
    // 1. GET /api/ai/health
    if (pathname === "/api/ai/health" && req.method === "GET") {
      const health = await healthCheck();
      return sendJson(res, 200, {
        online: health.online,
        model: health.model,
        modelLoaded: health.modelLoaded || false,
      });
    }

    // 2. POST /api/ai/warmup
    if (pathname === "/api/ai/warmup" && req.method === "POST") {
      await warmUp();
      return sendJson(res, 200, { status: "ok" });
    }

    // 3. POST /api/ai/parse-search
    if (pathname === "/api/ai/parse-search" && req.method === "POST") {
      const body = await readJsonBody(req);
      const query = body.query || "";
      const result = await parseSearchQuery(query);
      return sendJson(res, 200, {
        ...result.filters,
        response: result.response,
        source: result.source,
      });
    }

    // 4. POST /api/ai/explain (SSE Stream)
    if (pathname === "/api/ai/explain" && req.method === "POST") {
      const body = await readJsonBody(req);
      return await streamExplanation(res, {
        properties: body.properties || [],
        scores: body.scores || [],
        priorities: body.priorities || [],
      });
    }

    // 5. POST /api/ai/why-match
    if (pathname === "/api/ai/why-match" && req.method === "POST") {
      const body = await readJsonBody(req);
      const result = await getWhyMatch(body.property, body.userFilters);
      return sendJson(res, 200, result);
    }

    // Unmatched /api/ai path
    return sendJson(res, 404, { error: `Not found: ${pathname}` });
  } catch (error) {
    console.error(`[ai-api] Error handling ${req.method} ${pathname}:`, error);
    if (!res.headersSent) {
      return sendJson(res, 500, { error: error.message });
    }
    res.end();
  }
}
