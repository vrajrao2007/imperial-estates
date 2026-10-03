# Imperial Estates — Luxury & Residential Property Discovery

> Cinematic, offline-AI-powered real estate platform for discovering 145+ verified properties across 50+ Hyderabad localities — from budget-friendly homes starting at ₹22 Lakhs to ultra-luxury estates in Jubilee Hills.

---

## ✨ Features

| Category | Details |
|---|---|
| **Search & Filters** | Filter by area, budget range, BHK, property type (apartment / villa / penthouse), and amenities. Locality quick-jump chips. |
| **Map Discovery** | Interactive Google Maps integration (Streets, Satellite, Hybrid, Terrain) with Leaflet — corridor jumping, price markers, and Google Maps navigation links. |
| **Detail & Gallery** | Full property detail pages with image galleries, amenity grids, and Google Maps location embeds. |
| **Compare with Decision Support** | Side-by-side comparison of up to 3 properties with AI-streamed verdicts explaining which is the best pick and why. |
| **Saved Properties** | Save favourites to localStorage, review and manage your shortlist anytime. |
| **On-Device AI Search** | Natural language search powered by a local Ollama server — "Find 3 BHK villas under 2 crore near Gachibowli" gets parsed into structured filters. No cloud APIs, zero data leaves your machine. |

---

## 🖼️ Architecture

```
┌──────────────────────────────────────────────────┐
│                    Vite + React                  │
│  Home ─ Results ─ Detail ─ Compare ─ Saved       │
│  AiSearchBar · PropertyMap · PropertyCard        │
├──────────────────────────────────────────────────┤
│         Vite Dev Server Middleware               │
│   /api/ai/health · parse-search · explain ·      │
│   why-match · warmup                             │
├──────────────────────────────────────────────────┤
│           Ollama (localhost:11434)                │
│           qwen2.5:7b  ·  stream:false            │
│           temperature:0  ·  JSON schema          │
└──────────────────────────────────────────────────┘
```

### AI Principle

> **The model handles LANGUAGE only.**
> All filtering, scoring, sorting, ranking, and numerical comparisons are computed in TypeScript / JavaScript code. The model never invents, hallucinates, or estimates property data.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Ollama](https://ollama.com/) (for AI features — optional, app works without it)

### 1. Clone & Install

```bash
git clone https://github.com/<your-username>/imperial-estates.git
cd imperial-estates
npm install
```

### 2. Set Up Ollama (optional)

```bash
ollama pull qwen2.5:7b
ollama serve
```

### 3. Start the Dev Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Copy `.env.example` to `.env` and fill in values if you need to customize defaults:

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_URL` | `http://localhost:11434` | Address of the local Ollama server |
| `OLLAMA_MODEL` | `qwen2.5:7b` | Model tag for chat completions |

---

## 🗂️ Project Structure

```
imperial-estates/
├── public/              # Static assets (hero images, videos, icons)
├── server/              # AI middleware (Ollama client, parsers, services)
│   ├── api.js           # Vite middleware router for /api/ai/*
│   ├── ollama.js        # Ollama HTTP client (chat, stream, health)
│   ├── searchParser.js  # AI + Zod parse-search with JSON schema
│   ├── fallbackParser.js# Deterministic regex fallback parser
│   ├── explainService.js# SSE streaming compare explanations
│   └── whyMatchService.js# Per-card AI match reasons (cached)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── AiSearchBar.tsx
│   │   ├── PropertyMap.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── CompareTable.tsx
│   │   ├── HeroFlythrough.tsx
│   │   ├── Loader.tsx
│   │   ├── EstateCarouselSection.tsx
│   │   ├── InteriorStats.tsx
│   │   └── StarWarpShowreel.tsx
│   ├── pages/           # Route pages (Home, Results, Detail, Compare, Saved)
│   ├── data/            # Property dataset & helpers
│   ├── services/        # Client-side API service layer
│   ├── store/           # State management (compare, saved)
│   └── hooks/           # Custom React hooks (Lenis smooth scroll)
├── tests/               # AI search test suite
├── .env.example         # Environment variable template
├── vite.config.ts       # Vite config with AI middleware plugin
└── package.json
```

---

## 🧪 Testing

Run the AI search test suite (evaluates 10 real-world queries):

```bash
npm run test:ai
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/ai/health` | `GET` | Checks Ollama status and model availability |
| `/api/ai/warmup` | `POST` | Loads model weights into GPU/RAM |
| `/api/ai/parse-search` | `POST` | Parses natural language → structured JSON filters |
| `/api/ai/explain` | `POST` | Streams comparison verdict via SSE |
| `/api/ai/why-match` | `POST` | Returns cached 1-sentence match explanation |

### Resilience

- **Offline detection**: UI badge shows "AI offline — using basic search"
- **Regex fallback**: If Ollama is down/timeout, `fallbackParser.js` handles prices, BHK, localities, types deterministically
- **Explain fallback**: Template-based verdict from pre-computed scores
- **Why-match fallback**: Rule-based attribute alignment

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Vanilla CSS design tokens (forest/ivory/gold palette)
- **Maps**: Leaflet + Google Maps tile layers
- **Animations**: GSAP + ScrollTrigger + Lenis smooth scroll
- **AI**: Ollama (qwen2.5:7b) — fully local, zero cloud
- **State**: Zustand (compare/saved stores)

---

## 📜 License

MIT
