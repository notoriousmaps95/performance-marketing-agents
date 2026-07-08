# Performance Marketing Agents

A **reusable, public-data-only brand audit + digital-marketing-strategy system** built for [Claude Code](https://claude.ai/code). Drop the agents into any Claude Code project, point them at a brand, and get a scored `/100` performance marketing audit plus an executable DTC strategy — all from public data, no logins required.

## What it produces

Eight core reports **plus a client-facing HTML deck (all 11 tabs)** per brand run, plus preset/flag-gated extras (full owner manifest: `audit-sop.md` §5):

| File | Contents |
|---|---|
| `run-config.json` | Intake snapshot — inputs, preset, flags, tier, date (written at Phase 0) |
| `00-executive-summary.md` | `/100` score, category breakdown, appendix sub-scores, Data Gaps section, Top-5 actions |
| `01-brand-audit.md` | Positioning, USP, funnel & capture depth, reputation, measurement stack, LP speed |
| `02-social-audit.md` | Organic social across Meta/IG, TikTok, LinkedIn, YouTube + creator signals |
| `03-competitor-audit.md` | 2–4 competitor profiles, comparison table, tactics to borrow/counter |
| `04-content-comparison.md` | Brand vs competitors — pillars, formats, white-space |
| `05-ads-teardown.md` | Paid creatives across Meta, Google, LinkedIn, TikTok + Wayback offer history + share-of-search |
| `06-digital-marketing-strategy.md` | Channel plan, creative roadmap, funnel fixes, 90-day priorities |
| `07-seo-audit.md` *(SEO/Local presets)* | Organic search audit — 7-dimension `/100` sub-score (+ `07b` on `seo_depth: hobo`) |
| `08-local-seo-audit.md` *(Local preset)* | GBP teardown, reviews, NAP/citations, local schema, local-pack proxy — `/100` sub-score |
| `09-ai-visibility.md` *(`ai_visibility` flag, default on)* | What Perplexity / AI Overviews / Bing say about the brand — /10 sub-score, narrative vulnerabilities |
| `10-compliance.md` *(regulated verticals)* | Platform ad-policy matrix (vape/alcohol/supplements/finance…), age-gate/consent audit |
| `00b-delta-report.md` *(`mode: reaudit`)* | Score movement vs the prior run + prior Top-5 completion check |
| `06b` / `06c` *(`strategy_depth: full`)* | Offer ladder + funnel math · week-by-week 90-day rollout |
| `audit-deck.html` *(default on; `deck: false` skips)* | Client-facing slide deck — all 11 tabs — from `audit-deck-template.html` |

## How to use

### 1 — Prerequisites

- [Claude Code](https://claude.ai/code) (CLI or desktop app)
- No paid API required — runs entirely inside Claude Code's context

### 2 — Install the agents

Copy the `.claude/agents/` folder into your project root (or into `~/.claude/agents/` to make them globally available across all projects):

```bash
# Per-project (recommended)
cp -r .claude/agents/ /your/project/.claude/agents/

# Or globally
cp -r .claude/agents/ ~/.claude/agents/
```

### 3 — Add the project context

Copy `CLAUDE.md`, `audit-sop.md`, `report-template.md`, `presets.json`, `benchmarks.md`, `audit-deck-template.html`, and `.claude/workflows/` into your project root — the agents and the orchestrator reference these at runtime.

### 4 — Run an audit

Open Claude Code in your project directory and paste this prompt (fill in the bracketed fields):

```
Run a full performance marketing audit on:
- Brand: [Brand Name]
- Website: [https://example.com]
- Competitors: [URL1, URL2, URL3] (or "identify")
- Market: [UK / UAE / IN / etc.]
- Social handles: [discover]
- Business type: [detect / ecom / leadgen_national / local]
- SEO data tier: [0 = public-only / 1 = GSC (own property) / 2 = exports in runs/[brand-slug]/inputs/]
- Module flags: [defaults / e.g. strategy_depth: full, deck: true, mode: reaudit]
```

**What happens (the run protocol — see CLAUDE.md):** on `detect`, `pm-brand-auditor` first runs a fast classification-only pass and recommends a preset from `presets.json → business_type_map` — **confirmed with you before weights lock**. Claude then launches the **`brand-audit` workflow** (`.claude/workflows/brand-audit.js`), which executes the whole SOP deterministically: text-tier agents in parallel → browser-tier captures strictly serial (heartbeat-logged) → report assembly → adversarial verification with a capped 2-round gap-fill loop → scoring → strategy → manifest check.

**If a run stalls** (browser ops can hang silently): no new heartbeat log for 20+ minutes → stop it and resume with `Workflow({ scriptPath, resumeFromRunId })` — completed agents return from cache; only the hung step re-runs. Partial results are always on disk in `runs/<brand-slug>/data/`.

**Re-audits:** archive the prior reports to `runs/<brand-slug>/archive/<date>/`, then run with `mode: reaudit` — you get `00b-delta-report.md` with per-category movement and a completion check on the previous Top-5.

---

## Agent roster

Project agents (`.claude/agents/`):

| Agent | Role |
|---|---|
| `pm-brand-auditor` | Website teardown — positioning, offers, funnel & capture depth, reputation, measurement stack, compliance signals, speed. Also the Phase-0 classifier (`classify_only` mode) |
| `social-content-auditor` | Organic social audit + creator signals (one instance per platform) |
| `ad-teardown` | Paid creative analysis (one instance per ad library; brand-Meta instance adds the Wayback offer-history probe) |
| `competitor-intel` | Full external profile of one competitor (incl. reputation snapshot) |
| `traffic-sov` | Traffic volume + SERP share-of-voice + share-of-search trend (+ local-pack SOV on Local runs) — text-only, runs first |
| `seo-auditor` | Organic search audit — 7-dimension `/100` sub-score (SEO/Local presets) |
| `local-seo-auditor` | Local search audit — GBP, reviews, NAP, citations, local schema (Local preset) |
| `report-assembler` | Formats collected JSON into `01/02/03/05/10` — invents nothing (cheap model) |
| `content-comparator` | Brand vs competitors — content gaps + white-space |
| `audit-verifier` | Adversarial QA — challenges claims; drives the capped 2-round gap-fill loop |
| `pm-scorer` | Computes the `/100` from `presets.json` weights + executive summary + benchmarks row + delta report |
| `dtc-strategist` | Writes the executable strategy (policy-ceiling-aware on compliance runs) |

Reused **global** agents (flag-gated): `ai-footprint-auditor` (AI visibility, `09`) · `hobo-auditor` (`seo_depth: hobo`, `07b`) · `offer-ladder-builder` + `funnel-architect` (`06b`) + `gtm-rollout-planner` (`06c`) + `market-wedge-finder` (`strategy_depth: full`).

## Scoring

**Canonical weights live in [`presets.json`](presets.json)** — five presets: `DTC` · `B2B` · `DTC+SEO` / `B2B+SEO` (adds **Organic search** at 15) · `Local` (adds **Organic search** 12 + **Local search** 14, and reads the funnel through a lead-gen/booking lens). Scores are **not comparable across presets**. Non-scored appendix modules (AI visibility, compliance, influencer, marketplace) report outside the /100. The SEO module runs at one of three data tiers — Tier 0 public-only (default), Tier 1 + Google Search Console (user-owned properties), Tier 2 + Ahrefs/Screaming Frog exports dropped in `runs/<brand-slug>/inputs/`. Full methodology in [`audit-sop.md`](audit-sop.md); cross-run calibration accumulates in [`benchmarks.md`](benchmarks.md).

## Data sources used

- Meta Ad Library
- Google Ads Transparency Center
- LinkedIn Ad Library
- TikTok Creative Center / Commercial Content Library
- Public social profiles (IG, TikTok, LinkedIn, YouTube)
- Public traffic estimators (SimilarWeb-style, via WebSearch)
- Google Trends (share-of-search trend)
- Wayback Machine (12-month offer/promo history)
- AI answer surfaces — Perplexity, Google AI Overviews, Bing (dated spot-checks)
- Review & reputation platforms — Trustpilot, Google reviews, Reddit (all presets)
- WebFetch site crawl (robots, sitemaps, JSON-LD, on-page + pixel/tag scan)
- Chrome DevTools MCP (screenshots, Lighthouse for LP speed + sitewide CWV)
- WebSearch SERP checks (position bands only — `top3`/`top10`/`top50`/`absent`)
- Public Google Maps / Business Profile listing view (Local runs)
- Directories & review platforms, market + vertical specific (Local runs)
- Google Search Console via MCP (Tier 1, user-owned properties only)

**All data is public-only.** Spend/ROAS/CPA figures are modelled proxies — never account-verified numbers.

## Optional deliverables

- **Client deck** — built by **default** every run (pass `deck: false` to skip); fills [`audit-deck-template.html`](audit-deck-template.html) (self-contained, all 11 tabs, keyboard nav, print-to-PDF) from the executive summary → `runs/<brand-slug>/audit-deck.html`.
- **Hand-off zip** — `cd runs && zip -r <brand-slug>.zip <brand-slug> -x "<brand-slug>/data/*" "<brand-slug>/archive/*"`.
- **Proposal** — a follow-on doc built from `00` + `06` (pattern: `runs/potenza-motor-works/proposal.md`); not workflow-generated.

## Hard rules

1. **Public-only honesty** — every metric is labelled as an estimate when it's a proxy (`(est.)` / `(GSC)` / `(Ahrefs export, <date>)` / `(Wayback, <dates>)` / `(Google Trends, est.)`).
2. **Evidence or it didn't happen** — every category score links to ≥1 dated artifact.
3. **No generic placeholders** — examples are tied to the brand's actual niche.
4. **Verify before scoring** — `audit-verifier` gates `pm-scorer`; the gap-fill loop is capped at 2 rounds, survivors are force-footnoted as `data_gap`s (never scored as weaknesses).
5. **Weights from `presets.json` only** — validated at workflow Phase 0; appendix modules never enter the /100.

## License

MIT — use freely, attribution appreciated.

---

Built by [@notoriousmaps95](https://github.com/notoriousmaps95) using [Claude Code](https://claude.ai/code).
