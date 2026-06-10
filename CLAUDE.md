# Performance Marketing — Project Context

## What this project is
A **reusable, public-data-only brand audit + digital-marketing-strategy system** for performance marketing and social media. It scores any brand `/100` across paid media, organic social, funnel, and competitive share-of-voice, then produces an executable strategy. Built once, re-run per brand.

**House style:** Markdown reports, numeric `/100` score with category breakdown, Top-5 prioritised actions, niche-specific examples (no generic placeholders). Adapted from the portfolio's `thevapegiant/audit-steps-sop.md` (weighted SOP) and `SEO automation/page-performance/templates/audit-report.md` (scorecard + Top-5 presentation).

## How the system is organised
- **`audit-sop.md`** — the methodology: data sources, 10-category scoring rubric, weighting presets (DTC + B2B), proxy formulas, 6-phase run process. **Read this before any run.**
- **`report-template.md`** — the scored-report skeleton every run fills in.
- **`.claude/agents/`** — 9 reusable custom subagents that execute a run (see roster below).
- **`runs/<brand>/`** — one folder per brand audited; holds the 7 output reports.

## Default run parameters (this engagement)
- **Data access:** Public only — no logins. Brand is analysed with the same external lens as competitors (ad libraries, public social, site crawl, traffic estimators).
- **Platforms:** Meta (FB/IG), TikTok, LinkedIn, Google + YouTube.
- **Strategy objective:** E-commerce / DTC sales (ROAS, AOV, purchase volume). Use the **DTC weighting preset** unless a run is flagged B2B/lead-gen.

## Inputs required to start a brand run (fill per brand)
| Field | Value |
|---|---|
| Brand name | _TBD_ |
| Website URL | _TBD_ |
| Competitors (2–4) | _TBD — or "identify"_ |
| Target market + language | _TBD_ |
| Social handles | _TBD — or discover_ |

## Agent roster (`.claude/agents/`)
**Collection:** `pm-brand-auditor`, `social-content-auditor` (×4 platforms), `ad-teardown` (×4 libraries), `competitor-intel` (×2–4), `traffic-sov`.
**Synthesis:** `content-comparator`, `pm-scorer`, `dtc-strategist`, `audit-verifier`.
Orchestration: collection agents fan out → `content-comparator` compares → `audit-verifier` challenges → `pm-scorer` scores → `dtc-strategist` writes the strategy.

## Data sources (public)
Meta Ad Library · Google Ads Transparency Center · LinkedIn Ad Library · TikTok Creative Center / Commercial Content Library · public social profiles · public traffic estimators (SimilarWeb-style, via WebSearch) · WebFetch site crawl · Chrome DevTools MCP (screenshots, Lighthouse for LP speed) · WebSearch SERP checks. `mcp__gsc__*` only if the brand is a user-owned property.

## Hard rules
1. **Public-only honesty.** Spend/ROAS/CPA are *modelled proxies* (ad volume, longevity, offer/LP analysis), always labelled as estimates — never presented as account-verified numbers.
2. **Evidence or it didn't happen.** Every category score links to ≥1 dated artifact (ad-library URL, screenshot, count, SERP capture).
3. **No generic placeholders.** Examples and recommendations are tied to the brand's actual niche.
4. **Weights sum to 100.** Validate the active preset before scoring.
5. **Verify before scoring.** `audit-verifier` flags must be resolved or footnoted before `pm-scorer` finalises.
6. **Two-pass by default (SOP §4.1).** Pass 1 discovers data + identifiers (page_ids, advertiser_ids, channel_ids); Pass 2 re-captures verifier-flagged gaps in clean, serialized browser sessions. Loop until no high-severity flag remains.
7. **Reliability doctrine (SOP §7).** Tier concurrency (browser-dependent agents run serial); one page per capture with asserted active-tab URL; advertiser-ID-scoped ad-library URLs (never keyword search); source-priority ladder (official feeds/APIs → first-party render → scrape → aggregators last); retry-with-backoff then honest `null` + `data_gap` — a blocked read is never scored as confirmed weakness.
