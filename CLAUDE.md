# Performance Marketing — Project Context

## What this project is
A **reusable, public-data-only brand audit + digital-marketing-strategy system** for performance marketing and social media. It scores any brand `/100` across paid media, organic social, funnel, and competitive share-of-voice, then produces an executable strategy. Built once, re-run per brand.

**House style:** Markdown reports, numeric `/100` score with category breakdown, Top-5 prioritised actions, niche-specific examples (no generic placeholders). Adapted from the portfolio's `thevapegiant/audit-steps-sop.md` (weighted SOP) and `SEO automation/page-performance/templates/audit-report.md` (scorecard + Top-5 presentation).

## How the system is organised
- **`audit-sop.md`** — the methodology: data sources, 12-category rubric, SEO data tiers, proxy formulas (§3), run process (§4), output manifest with owners (§5), quality gate (§6), reliability doctrine (§7). **Read before any run.**
- **`presets.json`** — CANONICAL weights, business-type→preset mapping, +SEO-variant rule, module flags. If prose disagrees with it, presets.json wins.
- **`report-template.md`** — the report skeleton (incl. Data Gaps section, tier labels, 07/08 mini-scorecard scaffolds).
- **`.claude/workflows/brand-audit.js`** — the executable orchestrator: encodes the phase graph, §7.1 concurrency tiers, 2-round verifier loop, and manifest check.
- **`.claude/agents/`** — 12 project subagents (roster below); AI-visibility, deep-SEO, and the strategy chain reuse **global** agents (`ai-footprint-auditor`, `hobo-auditor`, `offer-ladder-builder`, `funnel-architect`, `gtm-rollout-planner`, `market-wedge-finder`).
- **`benchmarks.md`** — cross-run benchmark rows appended by `pm-scorer` (anonymised: vertical, not brand).
- **`audit-deck-template.html`** — client-deck skeleton; filled on `deck: true` runs.
- **`runs/<brand-slug>/`** — per-brand outputs: numbered reports, `run-config.json`, `data/` (structured JSON snapshots), `evidence/` subfolders, `inputs/` (Tier-2 exports), `archive/<date>/` (re-audit history).

## RUN PROTOCOL (how every audit starts)
1. **Classify (only when business type = detect):** spawn `pm-brand-auditor` with `mode: 'classify_only'` (fast, text-only). It returns business type + regulated-vertical + recommended preset via `presets.json → business_type_map`.
2. **Confirm the preset with the user** (hard gate — weights affect everything downstream).
3. **Invoke the workflow** — `Workflow({ name: 'brand-audit', args: {...} })` with ALL inputs **hardcoded as literals** (known bug: args passed to background workflows once arrived undefined — the workflow fails fast if so, but don't rely on it). Required args: `brand, brand_slug, url, market, preset (never 'detect'), business_type, competitors[{name,url}], data_tier, date` (+ `city` when Local; + `prior_archive_date` when `flags.mode='reaudit'`; optional: `handles, core_terms, branded_terms, vertical, regulated_vertical, gsc_property, language, local_subtype, flags{}`). Set `dry_run: true` to test wiring without spending.
4. **Re-audit runs:** before launching with `flags.mode='reaudit'`, copy the prior `00–10` reports + `run-config.json` into `runs/<slug>/archive/<YYYY-MM-DD>/` (evidence/ and inputs/ stay in place), then pass that date as `prior_archive_date`.

### Stall & resume runbook (memory: Ounass run sat dead 4 hrs)
- The browser tier logs a heartbeat per capture (`[browser k/N] …`). **No new log line for 20+ min → assume a hung browser op**: stop the run (TaskStop), then re-invoke with `Workflow({ scriptPath, resumeFromRunId })` — completed agents return from cache instantly; only the hung step re-runs.
- Partial results survive stalls: every collection agent snapshots its JSON to `runs/<slug>/data/` as it finishes.
- Prefer foreground runs for first-time/shakedown; background for known-good repeats.

### Workflow runtime quirks (found in the 2026-07-08 shakedown)
- **`args` can arrive as a JSON string** (this was the historical "silent args bug"). The script now parses strings and fails loudly otherwise — but still hardcode literals per the protocol.
- **Named invocation can serve a stale cached script.** After editing `brand-audit.js` mid-session, invoke via `Workflow({ scriptPath: "<project>/.claude/workflows/brand-audit.js", args })`, not by name.
- `args` is frozen inside the sandbox — the script clones it; never add mutations of `args` directly.
- Test wiring cheaply anytime with `dry_run: true` (validates args + presets, writes `run-config.json`, spawns nothing else — ~30 s).

## Agent roster (`.claude/agents/`)
**Collection:** `pm-brand-auditor` (+ classify_only mode, reputation sweep, measurement scan, compliance signals), `social-content-auditor` (×4 platforms), `ad-teardown` (×4 libraries; brand-Meta instance runs the Wayback offer-history probe), `competitor-intel` (×2–4), `traffic-sov` (text-only — runs FIRST; traffic, SOV, share-of-search, local-pack SOV), `seo-auditor` (SEO/Local presets), `local-seo-auditor` (Local, after seo-auditor).
**Synthesis:** `report-assembler` (writes 01/02/03/05/10 from collected JSON — formatter, invents nothing), `content-comparator`, `audit-verifier`, `pm-scorer`, `dtc-strategist`.
Ordering, concurrency, and file ownership are enforced by the workflow (SOP §4/§5/§7.1) — not by convention.

## Data sources (public)
Meta Ad Library · Google Ads Transparency Center · LinkedIn Ad Library · TikTok Creative Center / Commercial Content Library · public social profiles · public traffic estimators (via WebSearch) · Google Trends (share-of-search) · Wayback Machine (offer history) · WebFetch site crawl (robots/sitemap/JSON-LD/on-page + pixel/tag scan) · Chrome DevTools MCP (screenshots, Lighthouse) · WebSearch SERP checks (position bands only) · AI answer surfaces (Perplexity/AI Overviews/Bing — spot-checks) · public Maps/GBP listing view · directories & review platforms (Trustpilot/Google/Reddit — all presets). `mcp__gsc__*` only if the brand is a user-owned property (Tier 1).

## Hard rules
1. **Public-only honesty.** Spend/ROAS/CPA are *modelled proxies*, always labelled — never account-verified numbers.
2. **Evidence or it didn't happen.** Every category score links to ≥1 dated artifact.
3. **No generic placeholders.** Examples and recommendations tied to the brand's actual niche.
4. **Weights come from `presets.json` and sum to 100** — asserted at workflow Phase 0, re-checked by `pm-scorer`. Never from memory or prose.
5. **Verify before scoring.** `audit-verifier` gates `pm-scorer`; every flag resolved or (post-cap) force-footnoted into the Data Gaps section.
6. **Two-pass with a 2-round cap (SOP §4.1).** Pass 1 discovers data + `identifiers`; Pass 2 re-captures verifier-flagged gaps serially, max 2 rounds; survivors are force-footnoted `data_gap`s scored conservatively — the loop never blocks delivery.
7. **Reliability doctrine (SOP §7).** Browser tier serial with heartbeats; one page per capture, asserted active-tab URL; advertiser-ID-scoped ad-library URLs (never keyword search); GBP via named-place URL/knowledge panel (never Maps keyword search); source-priority ladder; retry ×2 then honest `null` + `data_gap` — a blocked read is never a confirmed weakness.
8. **SEO tier honesty (SOP §1.1).** `data_tier` declared and recorded everywhere; tier labels `(est.)` / `(GSC)` / `(Ahrefs export, <date>)` never mixed up a tier.
9. **No cross-preset comparison.** The preset prints beside every /100; re-audit deltas require the same preset.
10. **Local-pack findings are proxies.** City-modifier SERP checks, position bands only.
11. **Appendix modules never touch the /100 (SOP §2.4).** AI-visibility /10, compliance matrix, influencer, marketplace report outside the weighted score; compliance's policy matrix is a hard ceiling on the strategy's channel plan.
