# Performance Marketing Agents

A **reusable, public-data-only brand audit + digital-marketing-strategy system** built for [Claude Code](https://claude.ai/code). Drop the agents into any Claude Code project, point them at a brand, and get a scored `/100` performance marketing audit plus an executable DTC strategy — all from public data, no logins required.

## What it produces

Seven core output files per brand run (+ two on SEO/Local runs):

| File | Contents |
|---|---|
| `00-executive-summary.md` | `/100` overall score, category breakdown, Top-5 actions |
| `01-brand-audit.md` | Positioning, USP, funnel, tech stack, landing-page speed |
| `02-social-audit.md` | Organic social across Meta/IG, TikTok, LinkedIn, YouTube |
| `03-competitor-audit.md` | 2–4 competitor profiles + marketing-machine scores |
| `04-content-comparison.md` | Brand vs competitors — pillars, formats, white-space |
| `05-ads-teardown.md` | Paid creatives across Meta, Google, LinkedIn, TikTok |
| `06-digital-marketing-strategy.md` | Channel plan, creative roadmap, funnel fixes, 90-day priorities |
| `07-seo-audit.md` *(SEO/Local presets)* | Organic search audit — technical/CWV, on-page, schema, content, links, authority, AEO — own `/100` sub-score |
| `08-local-seo-audit.md` *(Local preset)* | GBP teardown, reviews, NAP/citations, local schema, local-pack visibility — own `/100` sub-score |

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

Copy `CLAUDE.md` into your project root so Claude knows the house rules and scoring conventions.

Also copy `audit-sop.md` and `report-template.md` — the agents reference these at runtime.

### 4 — Run an audit

Open Claude Code in your project directory and paste this prompt (fill in the bracketed fields):

```
Run a full performance marketing audit on:
- Brand: [Brand Name]
- Website: [https://example.com]
- Competitors: [URL1, URL2, URL3] (or "identify")
- Market: [UK / UAE / IN / etc.]
- Social handles: [discover]
- Business type: [detect / ecom / b2b / local]
- SEO data tier: [0 = public-only / 1 = GSC (own property) / 2 = exports in runs/[brand-slug]/inputs/]

Use the [DTC / B2B / DTC+SEO / B2B+SEO / Local] weighting preset. Output all reports to runs/[brand-slug]/.
```

On `detect`, the brand auditor classifies the business from public signals (address footprint, GBP presence, booking vs cart CTAs) and recommends a preset — confirmed with you before weights lock. Local businesses get the **Local** preset, which adds both the SEO audit and the local SEO audit (GBP, reviews, NAP, citations, local pack).

Claude will fan out the collection agents, compare, verify, score, and write the strategy — typically in one session.

---

## Agent roster

| Agent | Role |
|---|---|
| `pm-brand-auditor` | Website teardown — positioning, offers, funnel, speed |
| `social-content-auditor` | Organic social audit (one instance per platform) |
| `ad-teardown` | Paid creative analysis (one instance per ad library) |
| `competitor-intel` | Full external profile of one competitor |
| `traffic-sov` | Traffic volume + branded/non-branded SERP share-of-voice (+ local-pack SOV on Local runs) |
| `seo-auditor` | Organic search audit — 7-dimension `/100` sub-score (SEO/Local presets) |
| `local-seo-auditor` | Local search audit — GBP, reviews, NAP, citations, local schema (Local preset) |
| `content-comparator` | Brand vs competitors — content gaps + white-space |
| `audit-verifier` | Adversarial QA — challenges claims before scoring |
| `pm-scorer` | Computes the `/100` weighted score + executive summary |
| `dtc-strategist` | Writes the executable DTC strategy |

## Scoring rubric (DTC preset)

| Category | Weight |
|---|---|
| Brand Foundation | 10% |
| Organic Social | 15% |
| Paid Media — Meta | 15% |
| Paid Media — Google + YouTube | 12% |
| Paid Media — TikTok | 8% |
| Paid Media — LinkedIn | 5% |
| Creative Strategy | 10% |
| Funnel & Conversion | 10% |
| Audience & Targeting | 5% |
| Competitive Share of Voice | 10% |

Five presets in total: `DTC` · `B2B` · `DTC+SEO` / `B2B+SEO` (adds **Organic search (SEO)** at 15) · `Local` (adds **Organic search** at 12 + **Local search** at 14, and reads the funnel through a lead-gen/booking lens). Scores are **not comparable across presets**. The SEO module runs at one of three data tiers — Tier 0 public-only (default), Tier 1 + Google Search Console (user-owned properties), Tier 2 + Ahrefs/Screaming Frog exports. Full methodology in [`audit-sop.md`](audit-sop.md).

## Data sources used

- Meta Ad Library
- Google Ads Transparency Center
- LinkedIn Ad Library
- TikTok Creative Center / Commercial Content Library
- Public social profiles (IG, TikTok, LinkedIn, YouTube)
- Public traffic estimators (SimilarWeb-style, via WebSearch)
- WebFetch site crawl (robots, sitemaps, JSON-LD, on-page)
- Chrome DevTools MCP (screenshots, Lighthouse for LP speed + sitewide CWV)
- WebSearch SERP checks (position bands only — `top3`/`top10`/`top50`/`absent`)
- Public Google Maps / Business Profile listing view (Local runs)
- Directories & review platforms, market + vertical specific (Local runs)
- Google Search Console via MCP (Tier 1, user-owned properties only)

**All data is public-only.** Spend/ROAS/CPA figures are modelled proxies — never account-verified numbers.

## Hard rules

1. **Public-only honesty** — every metric is labelled as an estimate when it's a proxy.
2. **Evidence or it didn't happen** — every category score links to ≥1 dated artifact.
3. **No generic placeholders** — examples are tied to the brand's actual niche.
4. **Verify before scoring** — `audit-verifier` flags must be resolved before `pm-scorer` finalises.

## License

MIT — use freely, attribution appreciated.

---

Built by [@notoriousmaps95](https://github.com/notoriousmaps95) using [Claude Code](https://claude.ai/code).
