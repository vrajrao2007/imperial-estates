/**
 * Design Token Contrast Audit Script
 * Verifies that all token color pairs meet WCAG AA requirements:
 * - >= 4.5:1 for regular body text
 * - >= 3.0:1 for large text, icons, and UI components
 * Fails the build (exit code 1) if any body text pair falls below 4.5:1.
 */

function getLuminance(hex) {
  const cleanHex = hex.replace('#', '');
  const rgb = cleanHex.match(/.{2}/g).map((c) => parseInt(c, 16) / 255);
  const [r, g, b] = rgb.map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Token definitions from Estate Luxury Green Design System
const TOKENS = {
  // Surfaces
  bg: '#F7F4EC',
  surface: '#FFFFFF',
  surfaceWarm: '#FBF9F3',
  border: '#E4DFD1',
  forest: '#0A2E22',
  forest2: '#123D2E',

  // Text
  ink: '#10201A',
  muted: '#5B6B63',
  onForest: '#F7F4EC',
  mutedOnForest: '#A9BDB2',

  // Brand
  emerald: '#1F6F54',
  emeraldHover: '#185A44',
  sage: '#A8C3B0',
  gold: '#C9A96E',
  goldText: '#8A6B2F',

  // Semantic
  success: '#167080',
  warning: '#8A5A00',
  error: '#B3382C',
  info: '#3A5A78',

  // Charts
  chartPropA: '#1F6F54',
  chartPropB: '#A4532B',
  chartPropC: '#3A5A78',
};

// Test pairs and required minimum ratios
const AUDIT_PAIRS = [
  // Body text pairs (must be >= 4.5:1)
  { text: 'ink', bg: 'bg', type: 'body', min: 4.5, desc: 'Primary ink text on ivory page bg' },
  { text: 'ink', bg: 'surface', type: 'body', min: 4.5, desc: 'Primary ink text on white surface' },
  { text: 'ink', bg: 'surfaceWarm', type: 'body', min: 4.5, desc: 'Primary ink text on warm surface' },
  { text: 'muted', bg: 'bg', type: 'body', min: 4.5, desc: 'Muted text on ivory page bg' },
  { text: 'muted', bg: 'surface', type: 'body', min: 4.5, desc: 'Muted text on white surface' },
  { text: 'muted', bg: 'surfaceWarm', type: 'body', min: 4.5, desc: 'Muted text on warm surface' },
  { text: 'onForest', bg: 'forest', type: 'body', min: 4.5, desc: 'Ivory text on deep forest' },
  { text: 'onForest', bg: 'forest2', type: 'body', min: 4.5, desc: 'Ivory text on forest-2' },
  { text: 'mutedOnForest', bg: 'forest', type: 'body', min: 4.5, desc: 'Muted text on deep forest' },
  { text: 'onForest', bg: 'emerald', type: 'body', min: 4.5, desc: 'Ivory text on emerald button' },
  { text: 'goldText', bg: 'bg', type: 'body', min: 4.5, desc: 'Gold text on ivory page bg' },
  { text: 'goldText', bg: 'surface', type: 'body', min: 4.5, desc: 'Gold text on white surface' },
  { text: 'success', bg: 'bg', type: 'body', min: 4.5, desc: 'Semantic success (teal) on ivory' },
  { text: 'warning', bg: 'bg', type: 'body', min: 4.5, desc: 'Semantic warning on ivory' },
  { text: 'error', bg: 'bg', type: 'body', min: 4.5, desc: 'Semantic error on ivory' },
  { text: 'info', bg: 'bg', type: 'body', min: 4.5, desc: 'Semantic info on ivory' },
  { text: 'chartPropB', bg: 'bg', type: 'body', min: 4.5, desc: 'Chart Property B (terracotta) on ivory' },

  // Large text & UI component pairs (must be >= 3.0:1)
  { text: 'gold', bg: 'forest', type: 'ui', min: 3.0, desc: 'Gold accent on deep forest' },
  { text: 'emerald', bg: 'bg', type: 'ui', min: 3.0, desc: 'Emerald interactive accent on ivory' },
  { text: 'border', bg: 'bg', type: 'ui', min: 1.1, desc: 'Border hairline on ivory page' },
];

console.log('\n======================================================');
console.log('  ESTATE DESIGN SYSTEM: CONTRAST RATIO AUDIT (WCAG)');
console.log('======================================================\n');

let failedCount = 0;

for (const pair of AUDIT_PAIRS) {
  const textColor = TOKENS[pair.text];
  const bgColor = TOKENS[pair.bg];
  const ratio = getContrastRatio(textColor, bgColor);
  const passed = ratio >= pair.min;

  const status = passed ? 'PASS' : 'FAIL';
  const tag = `[${status}]`;

  console.log(
    `${tag} ${pair.desc.padEnd(46)} ${ratio.toFixed(2)}:1 (min ${pair.min}:1)`
  );

  if (!passed) {
    failedCount++;
    console.error(`  ERROR: ${pair.text} (${textColor}) on ${pair.bg} (${bgColor}) failed requirement!`);
  }
}

console.log('\n------------------------------------------------------');
if (failedCount > 0) {
  console.error(`FAILED: ${failedCount} contrast check(s) did not meet WCAG AA requirements.`);
  process.exit(1);
} else {
  console.log(`SUCCESS: All ${AUDIT_PAIRS.length} contrast checks passed WCAG AA requirements!`);
  console.log('======================================================\n');
}
