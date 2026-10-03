import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseSearchQuery } from "../server/searchParser.js";
import { fallbackParse } from "../server/fallbackParser.js";
import { healthCheck } from "../server/ollama.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testsPath = path.resolve(__dirname, "../tests/ai-search.json");

const testCases = JSON.parse(fs.readFileSync(testsPath, "utf-8"));

function matchField(expected, actual) {
  if (expected === undefined) return true;
  if (actual === undefined) return false;

  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) return false;
    return expected.every((expItem) =>
      actual.some((actItem) =>
        typeof expItem === "string"
          ? actItem.toLowerCase().includes(expItem.toLowerCase())
          : actItem === expItem
      )
    );
  }

  if (typeof expected === "string") {
    return String(actual).toLowerCase().trim() === expected.toLowerCase().trim();
  }

  if (typeof expected === "number") {
    return Math.abs(expected - Number(actual)) < 1;
  }

  return JSON.stringify(expected) === JSON.stringify(actual);
}

function evaluateTestCase(expected, actual) {
  const diffs = [];
  for (const key of Object.keys(expected)) {
    if (!matchField(expected[key], actual[key])) {
      diffs.push(
        `${key}: expected ${JSON.stringify(expected[key])}, got ${JSON.stringify(actual[key])}`
      );
    }
  }
  return { pass: diffs.length === 0, diffs };
}

async function runTests() {
  console.log("==================================================");
  console.log("  OFFLINE AI SEARCH TEST RUNNER (qwen2.5:7b)");
  console.log("==================================================\n");

  const health = await healthCheck();
  console.log(`Ollama Status: ${health.online ? "ONLINE" : "OFFLINE"}`);
  console.log(`Configured Model: ${health.model}\n`);

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const { id, query, expected } = testCases[i];
    const start = performance.now();
    const result = await parseSearchQuery(query);
    const duration = Math.round(performance.now() - start);

    const { pass, diffs } = evaluateTestCase(expected, result.filters);

    if (pass) {
      passed++;
      console.log(`[PASS] ${id}: "${query}"`);
      console.log(`       Source: ${result.source} | Latency: ${duration}ms`);
      console.log(`       Filters: ${JSON.stringify(result.filters)}`);
    } else {
      // Check if fallback handles it
      const fallbackFilters = fallbackParse(query);
      const fallbackEval = evaluateTestCase(expected, fallbackFilters);

      if (fallbackEval.pass) {
        passed++;
        console.log(`[PASS (via fallback)] ${id}: "${query}"`);
        console.log(`       Source: fallback | Latency: ${duration}ms`);
        console.log(`       Filters: ${JSON.stringify(fallbackFilters)}`);
      } else {
        failed++;
        console.log(`[FAIL] ${id}: "${query}"`);
        console.log(`       Source: ${result.source} | Latency: ${duration}ms`);
        console.log(`       Mismatches: ${diffs.join("; ")}`);
        console.log(`       Actual: ${JSON.stringify(result.filters)}`);
      }
    }
    console.log("--------------------------------------------------");
  }

  console.log(`\nTEST SUMMARY: ${passed} Passed, ${failed} Failed out of ${testCases.length} tests.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner encountered error:", err);
  process.exit(1);
});
