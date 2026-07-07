# Performance Marketing — Project Context

## What this project is
A **reusable, public-data-only brand audit + digital-marketing-strategy system** for performance marketing and social media. It scores any brand `/100` across paid media, organic social, funnel, and competitive share-of-voice, then produces an executable strategy. Built once, re-run per brand.

**House style:** Markdown reports, numeric `/100` score with category breakdown, Top-5 prioritised actions, niche-specific examples (no generic placeholders). Adapted from the portfolio's `thevapegiant/audit-steps-sop.md` (weighted SOP) and `SEO automation/page-performance/templates/audit-report.md` (scorecard + Top-5 presentation).

## How the system is organised
- **`audit-sop.md`** — the methodology: data sources, 12-category scoring rubric, weighting presets (DTC · B2B · DTC+SEO · B2B+SEO · Local), SEO data tiers, proxy formulas, 7-phase run process. **Read this before any run.**
- **`report-template.md`** — the scored-report skeleton every run fills in.
- **`.claude/agents/`** — 11 reusable custom subagents that execute a run (see roster below).
- **`runs/<brand>/`** — one folder per brand audited; holds the output reports (+ `inputs/` for Tier-2 export drops, `evidence/` subfolders).

## Default run parameters (this engagement)
- **Data access:** Public only — no logins. Brand is analysed with the same external lens as competitors (ad libraries, public social, site crawl, traffic estimators). SEO module defaults to **Tier 0** (public); Tier 1 = GSC (user-owned property only); Tier 2 = user-supplied Ahrefs/Screaming Frog exports (SOP §1.1).
- **Platforms:** Meta (FB/IG), TikTok, LinkedIn, Google + YouTube.
- **Strategy objective:** E-commerce / DTC sales (ROAS, AOV, purchase volume). Use the **DTC weighting preset** unless a run is flagged B2B/lead-gen — or **Local** when `pm-brand-auditor`'s classification detects a location-based business (confirm preset with the user before locking).

## Inputs required to start a brand run (fill per brand)
| Field | Value |
|---|---|
| Brand name | _TBD_ |
| Website URL | _TBD_ |
| Competitors (2–4) | _TBD — or "identify"_ |
| Target market + language | _TBD_ |
| Social handles | _TBD — or discover_ |
| Business type | _detect (default) · ecom · b2b · local_ |
| Weighting preset | _DTC (default) · B2B · DTC+SEO · B2B+SEO · Local_ |
| SEO data tier | _0 (default) · 1 (GSC, user-owned only) · 2 (exports in `runs/<brand>/inputs/`)_ |
| City / service area | _required when local_ |

## Agent roster (`.claude/agents/`)
**Collection:** `pm-brand-auditor`, `social-content-auditor` (×4 platforms), `ad-teardown` (×4 libraries), `competitor-intel` (×2–4), `traffic-sov`, `seo-auditor` (SEO/Local presets), `local-seo-auditor` (Local preset only, runs after seo-auditor).
**Synthesis:** `content-comparator`, `pm-scorer`, `dtc-strategist`, `audit-verifier`.
Orchestration: `pm-brand-auditor` classifies business type → user confirms preset → collection agents fan out (seo-auditor → local-seo-auditor serial within the browser tier) → `content-comparator` compares → `audit-verifier` challenges → `pm-scorer` scores → `dtc-strategist` writes the strategy.

## Data sources (public)
Meta Ad Library · Google Ads Transparency Center · LinkedIn Ad Library · TikTok Creative Center / Commercial Content Library · public social profiles · public traffic estimators (SimilarWeb-style, via WebSearch) · WebFetch site crawl (robots/sitemap/JSON-LD/on-page) · Chrome DevTools MCP (screenshots, Lighthouse for LP speed + sitewide CWV) · WebSearch SERP checks (position bands only) · public Maps/GBP listing view · directories & review platforms (market + vertical tier-1). `mcp__gsc__*` only if the brand is a user-owned property (Tier 1).

## Hard rules
1. **Public-only honesty.** Spend/ROAS/CPA are *modelled proxies* (ad volume, longevity, offer/LP analysis), always labelled as estimates — never presented as account-verified numbers.
2. **Evidence or it didn't happen.** Every category score links to ≥1 dated artifact (ad-library URL, screenshot, count, SERP capture).
3. **No generic placeholders.** Examples and recommendations are tied to the brand's actual niche.
4. **Weights sum to 100.** Validate the active preset before scoring.
5. **Verify before scoring.** `audit-verifier` flags must be resolved or footnoted before `pm-scorer` finalises.
6. **Two-pass by default (SOP §4.1).** Pass 1 discovers data + identifiers (page_ids, advertiser_ids, channel_ids); Pass 2 re-captures verifier-flagged gaps in clean, serialized browser sessions. Loop until no high-severity flag remains.
7. **Reliability doctrine (SOP §7).** Tier concurrency (browser-dependent agents run serial); one page per capture with asserted active-tab URL; advertiser-ID-scoped ad-library URLs (never keyword search); GBP via named-place URL or knowledge panel (never Maps keyword search); source-priority ladder (official feeds/APIs → first-party render → scrape → aggregators last); retry-with-backoff then honest `null` + `data_gap` — a blocked read is never scored as confirmed weakness.
8. **SEO tier honesty (SOP §1.1).** The run's `data_tier` is declared at setup and recorded in every output; a Tier-0 run never cites GSC-grade or backlink-tool-grade numbers.
9. **No cross-preset comparison.** A /100 under one preset is not comparable to a /100 under another; the preset is printed beside the score.
10. **Local-pack findings are proxies.** City-modifier SERP checks only, position bands only — never presented as geo-grid / Share-of-Local-Voice measurement.
