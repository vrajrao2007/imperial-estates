/**
 * Ollama client – single interface to the local Ollama server.
 * Env: OLLAMA_URL (default http://localhost:11434), OLLAMA_MODEL (default qwen2.5:7b).
 * Every call logs latency. keep_alive is "30m" to keep the model loaded.
 */

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b";
const KEEP_ALIVE = "30m";

/**
 * Non-streaming chat completion.
 * @param {Array<{role:string,content:string}>} messages
 * @param {object} [jsonSchema] - If provided, passed as `format` to force JSON output.
 * @param {number} [timeoutMs=8000]
 * @returns {Promise<{text: string, latencyMs: number}>}
 */
export async function chatCompletion(messages, jsonSchema, timeoutMs = 8000) {
  const start = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const body = {
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: { temperature: 0 },
      keep_alive: KEEP_ALIVE,
    };
    if (jsonSchema) {
      body.format = jsonSchema;
    }

    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Ollama HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const latencyMs = Math.round(performance.now() - start);
    console.log(`[ollama] chat ${latencyMs}ms model=${OLLAMA_MODEL} tokens=${data.eval_count || "?"}`);
    return { text: data.message?.content || "", latencyMs };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Streaming chat – yields chunks of text via an async generator.
 * @param {Array<{role:string,content:string}>} messages
 * @param {number} [timeoutMs=15000]
 */
export async function* chatStream(messages, timeoutMs = 15000) {
  const start = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: true,
        options: { temperature: 0.3 },
        keep_alive: KEEP_ALIVE,
      }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);

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
        if (!line.trim()) continue;
        try {
          const obj = JSON.parse(line);
          if (obj.message?.content) {
            yield obj.message.content;
          }
        } catch { /* skip malformed line */ }
      }
    }

    const latencyMs = Math.round(performance.now() - start);
    console.log(`[ollama] stream ${latencyMs}ms model=${OLLAMA_MODEL}`);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Health check – pings Ollama and verifies the model tag exists.
 * @returns {Promise<{online: boolean, model: string}>}
 */
export async function healthCheck() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { online: false, model: OLLAMA_MODEL };
    const data = await res.json();
    const models = (data.models || []).map((m) => m.name);
    const found = models.some(
      (n) => n === OLLAMA_MODEL || n.startsWith(OLLAMA_MODEL + ":")
    );
    return { online: true, model: OLLAMA_MODEL, modelLoaded: found, models };
  } catch {
    return { online: false, model: OLLAMA_MODEL };
  }
}

/**
 * Warm-up – send a tiny 1-token request to load the model into memory.
 */
export async function warmUp() {
  try {
    console.log(`[ollama] warming up model ${OLLAMA_MODEL}...`);
    await chatCompletion(
      [{ role: "user", content: "Hi" }],
      undefined,
      15000
    );
    console.log(`[ollama] warm-up complete`);
  } catch (e) {
    console.warn(`[ollama] warm-up failed: ${e.message}`);
  }
}
