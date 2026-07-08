# Performance Marketing & Social Media Audit — SOP

> Reusable, public-data-only methodology. Produces a `/100` score + Top-5 actions + DTC strategy for any brand. Read in full before a run; follow each phase in order; capture evidence as you go.

---

## 0. Inputs & setup
| Input | Required | Notes |
|---|---|---|
| Brand name + URL | ✅ | Anchors the run |
| Competitors (2–4) | ✅ | Or identify via SERP + market overlap, confirm before deep work |
| Target market + language | ✅ | Ad libraries & SERPs are geo-specific |
| Social handles | ⬜ | Discover if not provided |
| Weighting preset | ✅ | `DTC` (default) · `B2B` · `DTC+SEO` · `B2B+SEO` · `Local` — canonical weights live in **`presets.json`** (§2). Locked before the workflow launches; the workflow refuses `detect` |
| Business type | ✅ | `detect` (default) · `ecom` · `leadgen_national` · `local`. On `detect`, `pm-brand-auditor` runs a **classification-only pass before the workflow launches** (Phase 0), maps to a preset via `presets.json → business_type_map` (incl. the +SEO-variant rule), and the orchestrator confirms with the user before locking weights |
| Module flags | ⬜ | `presets.json → modules` defaults apply unless overridden: `ai_visibility` (on) · `compliance` (auto — regulated verticals) · `influencer` · `marketplace` · `seo_depth` · `strategy_depth` · `deck` (on) · `mode: audit\|reaudit` (§4.3) |
| SEO data tier | ✅ | `0` (public-only, default) · `1` (+GSC) · `2` (+exports) — see §1.1. Recorded as `data_tier` in every output |
| GSC property | ⬜ | Tier 1 only — **user-owned property only**, via `mcp__gsc__*` |
| Exports dir | ⬜ | Tier 2 only — Ahrefs/Semrush CSVs + Screaming Frog exports dropped in `runs/<brand>/inputs/` |
| City / service area | ⬜ | Required when `local` — anchors GBP, citations, and local-pack checks |

Create `runs/<brand>/` and capture all evidence (screenshots, ad URLs, counts) with dates into it.

---

## 1. Data sources & tools (public only)
| Signal | Source / tool | Capture |
|---|---|---|
| Meta paid creatives, active-ad count, run dates | **Meta Ad Library** `facebook.com/ads/library` (filter by country + advertiser) | # active ads, start dates, creative variants, offers, LP URLs, screenshots |
| Google Search/Shopping/PMax/YouTube ads | **Google Ads Transparency Center** | ad formats running, copy, regions, date range |
| LinkedIn ads | **LinkedIn Ad Library** (company → Ads tab) | active ads, copy, format |
| TikTok ad trends + top creatives | **TikTok Creative Center** / Commercial Content Library | top ads in niche, hooks, formats |
| Organic social content + engagement | WebFetch/WebSearch on public profiles | last ~20 posts, formats, likes/comments, follower count |
| Traffic volume, channel mix, geo split | Public traffic estimators via WebSearch (SimilarWeb-style) | monthly visits, channel %, top geos — **label as estimate** |
| Store UX, offers, capture, reviews, tech, schema | **WebFetch** crawl + **Chrome DevTools MCP** (screenshot, Lighthouse) | homepage, PDP, cart, popups, review widgets, platform (Shopify?), LP speed |
| Branded vs non-branded SERP / share of voice | **WebSearch** SERP checks | who ranks/runs ads on core niche + branded terms |
| Site crawl signals (SEO) | **WebFetch** — robots.txt, sitemap, canonicals, JSON-LD, titles/metas/H1s on sampled pages | crawl-sample inventory, schema matrix, on-page verdicts per priority page |
| SERP position bands | **WebSearch** — exact query + date + market | band per query: `top3` / `top10` / `top50` / `absent` — never exact ranks (§3.5) |
| GBP / Maps public view *(Local runs)* | Browser screenshot of the **named-place** listing (never Maps keyword search) | claimed status, primary category, rating + review count, photos, hours, booking links |
| Directories & review platforms *(Local runs)* | **WebSearch** on brand + phone/address fragments | NAP consistency matrix, citation presence, cross-platform review counts |
| AI answer surfaces (brand recognition, accuracy, citations) | **WebSearch/WebFetch** against Perplexity, Google AI Overviews, Bing Copilot (`ai-footprint-auditor` prompt battery) | per-prompt capture with date; recognition/accuracy/citation verdicts — labelled spot-checks, never "AI rankings" |
| Offer & promo history (12 mo) | **Wayback Machine** `web.archive.org` snapshots of homepage + key collection page (§3.8) | hero offer/banner per snapshot, ~4 points/yr → discount cadence, positioning drift |
| Share of search (branded-demand trend) | **Google Trends** brand vs competitor branded queries, market-filtered (§3.9) | relative curves + brand's share of the summed set — always `(Google Trends, est.)` |
| Reputation & reviews (all presets) | Trustpilot / Google reviews / Reddit + niche forums via WebSearch (§3.7 velocity proxy generalised) | rating, count, velocity, sentiment themes, response behaviour — dated |
| Measurement maturity | Page-source scan of fetched HTML (pixels/tags: GA4, Meta/TikTok/Pinterest pixels, GTM, ESP/SMS, attribution tools) | detected stack list — capability signal, feeds cats 3/8 + strategy |
| *(Optional)* first-party search data | `mcp__gsc__*` | only if brand is a user-owned property (Tier 1, §1.1) |

**Capture discipline:** every score is backed by a dated artifact. Estimates are labelled `(est.)`. Never present a proxy as an account-verified number.

### 1.1 SEO data requirements (tiered)
The SEO module (cat 11) and local module (cat 12) run at one of three data tiers, **declared at setup** and recorded as `data_tier` in every output. Tier upgrades are allowed only between passes (user supplies access/exports), and `pm-scorer` notes which dimensions were re-scored.

| Tier | Access required | Sources | Unlocks | Labelling |
|---|---|---|---|---|
| **0 — public (default)** | none | WebFetch crawl sample, Lighthouse ×3 templates (Chrome DevTools MCP), WebSearch `site:`/SERP/mention checks, JSON-LD extraction, public Maps/GBP view, directories & review platforms | full rubric on proxies | `(est.)` on every third-party figure |
| **1 — GSC** | brand is a **user-owned property** (`mcp__gsc__*`) | 12-mo search analytics, `index_inspect`, sitemaps | exact impressions/position/CTR, impression×position-gap page prioritisation, cannibalisation detection, indexation truth | `(GSC)` |
| **2 — exports** | user-supplied files in `runs/<brand>/inputs/` | Ahrefs/Semrush CSVs, Screaming Frog exports | real backlink profile (spam % >40 → flag; single commercial anchor >15% → flag), crawl-scale title/meta error % (>10% → flag), depth/orphans | `(Ahrefs export, <date>)` etc. |

**Tier honesty (hard rule):** a Tier-0 run must never cite GSC-grade or backlink-tool-grade numbers; `audit-verifier` flags any over-tier claim. Pass/fail gates apply only at the tier that can measure them.

---

## 2. Scoring model (`/100`)

Up to twelve categories, each scored **0–100 internally**, then multiplied by its weight and summed. Five weighting presets; pick one at setup. `DTC` and `B2B` are the legacy presets (unchanged, 10 categories). The `+SEO` presets add cat 11; `Local` adds cats 11 + 12.

> **Canonical source: `presets.json`** — weights, business-type→preset mapping, +SEO-variant rule, and module flags. If the table below ever disagrees with `presets.json`, **presets.json wins**. The workflow validates every preset sums to 100 at Phase 0; `pm-scorer` re-validates before scoring.

| # | Category | DTC | B2B | DTC+SEO | B2B+SEO | Local |
|---|---|---:|---:|---:|---:|---:|
| 1 | Brand foundation & positioning | 10 | 10 | 9 | 9 | 8 |
| 2 | Organic social presence & content | 15 | 12 | 13 | 10 | 10 |
| 3 | Paid media — Meta (FB/IG) | 15 | 8 | 13 | 7 | 10 |
| 4 | Paid media — Google + YouTube | 12 | 15 | 10 | 13 | 10 |
| 5 | Paid media — TikTok & emerging | 8 | 4 | 7 | 3 | 4 |
| 6 | Paid media — LinkedIn | 5 | 15 | 4 | 13 | 2 |
| 7 | Creative & messaging strategy | 10 | 8 | 8 | 7 | 8 |
| 8 | Funnel & conversion signals | 10 | 12 | 9 | 10 | 12 |
| 9 | Audience & targeting signals | 5 | 6 | 4 | 5 | 4 |
| 10 | Competitive share of voice | 10 | 10 | 8 | 8 | 6 |
| 11 | Organic search (SEO) | — | — | 15 | 15 | 12 |
| 12 | Local search | — | — | — | — | 14 |
| | **Total** | **100** | **100** | **100** | **100** | **100** |

**Roll-up:** `Final = Σ (category_score/100 × weight)`. Weights are validated against `presets.json` (sum = 100) at workflow Phase 0 and re-checked by `pm-scorer` before scoring.

**Bands:** ≥85 **Strong** · 70–84 **Targeted fixes** · <70 **Rework**.

**No cross-preset comparison (hard rule):** a /100 under one preset is **not comparable** to a /100 under another. `pm-scorer` prints the preset name beside the score, and the executive summary states it. (SEO is capped at 15 by design — this is a performance-marketing audit, not an SEO-only recovery audit.)

### 2.1 Per-category rubric (0–100 internal)
For each, capture the listed evidence, then score against the guide.

**1. Brand foundation & positioning** — value-prop clarity above the fold, USP distinctiveness, message consistency across site + social + ads, store first-impression.
`90–100` sharp single-sentence USP, consistent everywhere · `70–89` clear but diluted across channels · `50–69` generic/“me-too” · `<50` no discernible positioning.

**2. Organic social presence & content** — per platform: posting cadence, format mix (Reels/Shorts/static/carousel/UGC), follower trajectory, **engagement-rate proxy** (§3.1), content-pillar coherence. Average the active platforms.
`90–100` consistent cadence + above-benchmark ER + clear pillars on ≥3 platforms · `70–89` solid on 2 platforms · `50–69` sporadic/low ER · `<50` near-dormant.

**3. Paid media — Meta** — active-ad count, creative volume & variety, distinct angles, offer architecture, **ad longevity / winner proxy** (§3.2), LP alignment.
`90–100` many active ads, multiple tested angles, long-running winners, tight LP match · `70–89` steady presence, some testing · `50–69` few ads, single angle · `<50` no active Meta ads.

**4. Paid media — Google + YouTube** — Search/Shopping/PMax presence, ad copy quality, YouTube ads/channel, branded vs non-branded coverage.
`90–100` covers non-brand + brand + Shopping + YouTube · `70–89` Search + brand defence · `50–69` brand-only or thin · `<50` absent.

**5. Paid media — TikTok & emerging** — TikTok ads/Spark Ads, creator/UGC content, trend participation.
`90–100` active Spark/UGC ads + trend-native content · `70–89` some presence · `50–69` organic only, no ads · `<50` absent.

**6. Paid media — LinkedIn** — ad presence + organic posts (brand/partnership/talent/thought-leadership signals).
`90–100` active ads + consistent organic (B2B) · `70–89` organic presence · `50–69` dormant page · `<50` none. *(Low DTC weight — keep proportionate.)*

**7. Creative & messaging strategy** — hook quality, UGC vs polished mix, offer strategy (discount/bundle/guarantee/urgency), seasonal cadence (cross-checked against the §3.8 Wayback offer-history probe — discount cadence + positioning drift over 12 mo), visible A/B-test signals.
`90–100` strong hooks, diverse formats, clear offer ladder, testing evident · `70–89` competent, limited testing · `50–69` repetitive/weak hooks · `<50` no coherent creative strategy.

**8. Funnel & conversion signals** — landing pages, offer clarity, **email/SMS capture depth** (popup offer/timing/fields, SMS prompt, footer capture, visible welcome-flow signals), **measurement maturity** (page-source pixel/tag scan: GA4, Meta/TikTok pixels, GTM, ESP/SMS, attribution tools — a weak pixel stack caps everything paid), retargeting evidence, **reviews & reputation** (all presets: Trustpilot/Google/Reddit sweep + §3.7 velocity — not just on-site widgets), checkout UX, **LP speed** (Lighthouse/CWV).
`90–100` fast LPs, strong capture, proof everywhere, frictionless checkout · `70–89` good with gaps · `50–69` slow LPs / weak capture / thin proof · `<50` broken funnel.

**9. Audience & targeting signals** — inferred personas, ad targeting cues (language, casting, placements), influencer/partnership footprint.
`90–100` clear multi-persona targeting + active partnerships · `70–89` single clear persona · `50–69` vague · `<50` no discernible audience strategy.

**10. Competitive share of voice** — ad volume vs competitors, content velocity, estimated traffic/channel split, SERP/ad overlap on core terms, plus **share-of-search** (§3.9 — Google Trends branded-demand curves, brand vs set, the leading SOV indicator). On `Local` runs, `traffic-sov` additionally records **local-pack SOV** (pack membership per core city-modifier term — collected once here, consumed by cat 12).
`90–100` leads the set on ad volume + traffic + velocity · `70–89` competitive · `50–69` trailing · `<50` invisible vs competitors.

**11. Organic search (SEO)** — *(SEO presets + Local only)* scored by `seo-auditor` on its own internal /100 rubric (Technical & crawlability 20 · On-page money pages 25 · Schema & entity 15 · Content quality & topical 15 · Internal linking 10 · Authority proxies 10 · AEO/AI visibility 5 — sums to 100). The category score is a **pass-through** of that roll-up; full detail lives in `07-seo-audit.md`.
`90–100` priority pages unique + intent-matched and ranking top-10 bands, clean schema, healthy authority footprint · `70–89` optimised but ranking 11–50 bands, partial schema · `50–69` templated metas / bare grids / thin authority · `<50` money pages not indexed or organically invisible.

**12. Local search** — *(Local preset only)* scored by `local-seo-auditor` on its own internal /100 rubric (GBP signals 25 · Reviews & reputation 20 · Local on-page 20 · NAP & citations 15 · Local schema 10 · Local authority 10 — sums to 100). Pass-through roll-up; full detail in `08-local-seo-audit.md`. Local-pack visibility is **reported, not weighted** (it's an outcome, and only measurable as a city-modifier proxy — §3.5).
`90–100` claimed GBP with correct primary category, 4.5+ rating with live review velocity, consistent NAP, complete LocalBusiness-subtype schema · `70–89` claimed but under-optimised, minor NAP drift · `50–69` thin reviews, wrong/generic category, citation gaps · `<50` unclaimed/absent listing or contradictory NAP.

### 2.2 Boundary contracts (anti-double-collection)
Three seams between the SEO modules and existing categories — owners are fixed; cross-reference, never collect twice:
| Seam | Owner | Rule |
|---|---|---|
| Schema | `seo-auditor` owns the sitewide schema matrix (Organization/Product/Breadcrumb/FAQ); `local-seo-auditor` owns only LocalBusiness-subtype completeness | `seo-auditor` passes its JSON-LD inventory + site-footer NAP to `local-seo-auditor` — pages are never fetched twice |
| Lighthouse / speed | cat 8 (`pm-brand-auditor`) keeps **LP speed** as a conversion signal; cat 11 owns **sitewide CWV** across 3 templates | one Lighthouse trace per URL per pass, shared via `evidence/perf/` (§7.2) |
| SERP visibility | cat 10 (`traffic-sov`) owns overall + local-pack SOV; cat 11 owns organic-quality and per-page rank bands | local-pack SOV is collected once by `traffic-sov` **in the Phase-1 text tier** and consumed downstream by `local-seo-auditor` (browser tier) and `competitor-intel` — the producer always runs before its consumers (§4) |

### 2.3 Local preset lens (codifies the ritam-wedding-venue improvisation)
Under the `Local` preset: cat 8 is read as **"Lead capture & booking funnel"** (inquiry forms, click-to-call, WhatsApp, booking widgets, response-time signals — not cart/checkout), and cats 3/4 KPIs are read as leads/calls/bookings rather than purchases. Local sub-types: **brick-and-mortar** · **service-area business (SAB)** · **hybrid** — SABs skip embedded-map and physical-address checks (`areaServed` language instead).

### 2.4 Appendix modules (non-scored — the /100 is never touched)
Flag-gated modules (`presets.json → modules`) report **outside** the weighted score: each produces a labelled sub-score or findings section appended to the executive summary plus its own file. They feed the strategy and the verifier, never the scorecard — so preset comparability (hard rule) is preserved. A preset v2 that weights any module is minted only on explicit request.
| Module | Output | Sub-score | Notes |
|---|---|---|---|
| **AI visibility** (`ai_visibility`, default on) | `09-ai-visibility.md` | /10 (recognition · accuracy · citation · narrative control) | `ai-footprint-auditor` prompt battery vs brand + competitors; findings are dated spot-checks, never "AI rankings" |
| **Compliance** (`compliance: auto`) | `10-compliance.md` | pass/flag matrix | Regulated verticals (vape/nicotine, alcohol, supplements, CBD, gambling, finance, pharma): platform ad-policy matrix (what Meta/Google/TikTok/LinkedIn allow for this vertical in this market, verified via WebSearch with date), age-gate, cookie/consent, disclaimer audit. **Hard constraint on the strategy's channel plan** — e.g. Meta prohibits vape ads, so cat-3 weakness is re-read as a policy ceiling, not negligence |
| **Influencer/creator** (`influencer`) | section in `02` + `04` | — | Deep sweep: paid-partnership labels, collab inventory, affiliate detection (light signals always captured by `social-content-auditor`) |
| **Marketplace** (`marketplace`) | section in `01` + snapshot row | — | Amazon storefront/ratings/review-velocity/brand-store signals, brand vs competitors |

---

## 3. Proxy methodologies (public-data estimation)

### 3.1 Engagement-rate proxy
`ER% = (avg [likes + comments + shares] over last ~12 posts) ÷ followers × 100`.
Rough public benchmarks (label all as proxy): **Instagram** good >1% · **TikTok** (use likes ÷ views) good >5% · **LinkedIn** good >2% · **YouTube** (likes+comments ÷ views) good >2% · **Facebook** good >0.5%. Always state sample size and date.

### 3.2 Ad longevity / winner proxy
Brands kill losing ads fast, so **longevity ≈ performance**. From Meta Ad Library "started running on" dates: an ad live **30+ days**, or a concept with **many active variants**, is a likely winner. Record: # active ads, # distinct concepts, oldest active start date, most-replicated concept. Flag the inferred winners — these inform the creative strategy.

### 3.3 Spend & ROAS — DO NOT fabricate
Public data gives **no real spend or ROAS**. Express budget/performance only as relative signals (ad volume, longevity, channel breadth, offer aggressiveness) and **label every figure `(est.)`**. If account access is later granted, replace proxies with real numbers.

### 3.4 Authority proxy (no backlink tool)
Tier 0 has no Ahrefs. Measure off-site authority in this priority order:
1. **Mention inventory** — WebSearch `"Brand" -site:domain.com`; classify the first ~30 results (news / niche blog / directory / UGC); count distinct quality referring sites, each with URL + date.
2. **Branded-SERP ownership** — does the brand own its branded SERP (site, profiles, knowledge panel), or do aggregators/resellers outrank it?
3. **Roundup presence** — 3 link-worthy queries ("best <category> <market>"): is the brand cited in the listicles competitors appear in?
4. **Third-party DA/DR figures** surfaced in public snippets — last resort, always `(est., third-party)`, never stated as fact.

At Tier 2, replace with the real export: referring domains, spam % (>40% → flag), single-commercial-anchor concentration (>15% → flag) — flags, not auto-fails.

### 3.5 Local-pack proxy (city-modifier SERPs)
WebSearch cannot simulate "near me" or a geo-grid. Use **city-modifier queries only** ("<service> in <city>"), record pack presence + pack members + organic band, and label every result `(city-modifier SERP proxy, est. — not a geo-grid)`. Never promise or imply geo-grid/Share-of-Local-Voice measurement from public data. **All SERP positions are reported as bands** — `top3` / `top10` / `top50` / `absent` — with exact query + date + market (results vary by datacenter/personalisation; exact ranks are false precision).

### 3.6 NAP consistency method
Establish the **canonical Name/Address/Phone triple** from the site contact page. Build a consistency matrix against: (a) site JSON-LD, (b) the GBP listing, (c) the top ~5 market-relevant directories discovered via WebSearch on `"<brand>" "<phone>"` and `"<brand>" "<street fragment>"`. Normalise phone numbers to country format before comparing; score exact-match per field per source. A blocked directory read is a `data_gap`, not a mismatch.

### 3.7 Review-velocity proxy
From the public listing sorted by newest: take the dates of the most recent ~10 reviews → compute reviews/month. Flag a dry spell of **3+ weeks** with no new review. Record owner-response rate over the same 10. Cross-check the site's `aggregateRating` schema against the visible GBP count — a mismatch is a verifier flag.
**Generalised to all presets:** for non-local brands apply the same method to the dominant public review surface (Trustpilot / Google reviews / marketplace listing) and sweep Reddit + niche forums for sentiment themes — rating, count, velocity, response behaviour, all dated.

### 3.8 Offer-history probe (Wayback)
`web.archive.org` snapshots of the homepage (+ one key collection/offer page) at ~4 points across the trailing 12 months: record the visible hero offer/banner per snapshot → discount cadence (always-on vs seasonal), promo calendar shape, positioning drift. Label every finding `(Wayback, <snapshot dates>)`. Sparse snapshot coverage is a `data_gap`, never evidence of "no promos". Run on the **brand only** (competitor Wayback probes only if a specific verifier flag demands one).

### 3.9 Share-of-search proxy
Google Trends (12–24 mo, market-filtered) on each brand's **branded query**: capture the relative curves and compute the brand's share of the summed set — share-of-search, the classic leading indicator of share-of-market. Always relative, labelled `(Google Trends, est.)`, never absolute volumes. A brand term too low-volume to register is a `data_gap` (common for small locals — say so rather than reporting 0%).

---

## 4. Run process
Executed by the **`brand-audit` workflow** (`.claude/workflows/brand-audit.js`), which orchestrates the `.claude/agents/` roster and *encodes* this section: the phase graph, the §7.1 concurrency tiers, the §4.1 two-pass loop, and the §5 manifest. A run launches with one prompt (see CLAUDE.md run protocol) — it is never improvised phase-by-phase.

**Phase 0 — classify & lock the preset (before the workflow launches).** On `business type = detect`, run `pm-brand-auditor` inline in **classification-only mode**: business type (`ecom` / `leadgen_national` / `local` + local sub-type) + regulated-vertical check. Map to a preset via `presets.json → business_type_map` (+SEO-variant rule), **confirm with the user**, then invoke the workflow with the locked preset and flags. The workflow refuses to start on `preset: detect` or any missing required input.

Inside the workflow:
1. **Text tier (parallel)** — `traffic-sov` (traffic, SERP SOV, §3.9 share-of-search; + local-pack SOV when `Local`) · `social-content-auditor` ×4 (brand) · `ai-footprint-auditor` (when `ai_visibility` on → `09-ai-visibility.md`). No browser work in this wave.
2. **Browser tier (strictly serial — §7.1, heartbeat-logged)** — `pm-brand-auditor` (full teardown incl. §3.7 reputation sweep, measurement scan, email/SMS depth, compliance signals) → `ad-teardown` ×4 (brand; the Meta instance also runs the §3.8 offer-history probe) → `seo-auditor` *(SEO presets + Local — consumes the brand auditor's homepage trace)* → `local-seo-auditor` *(Local — consumes seo-auditor's schema matrix + footer NAP and traffic-sov's `local_pack_sov`)* → `competitor-intel` per competitor.
3. **Assembly (parallel)** — `report-assembler` ×4 writes `01-brand-audit.md`, `02-social-audit.md`, `03-competitor-audit.md`, `05-ads-teardown.md` from the held structured outputs (`07`/`08`/`09` are written by their own agents; `10-compliance.md` assembled when the module is on).
4. **Content comparison** — `content-comparator` → `04-content-comparison.md`.
5. **Verify** — `audit-verifier` challenges claims (incl. SEO/local/AI-visibility/Wayback/share-of-search challenge types) → `must_fix_before_scoring`.
6. **Pass 2 — targeted gap-fill (§4.1, hard cap 2 rounds)** — serial re-captures of flagged gaps using Pass-1 identifiers → re-verify.
7. **Score & strategy** — `pm-scorer` computes `/100` + appendix sub-scores, appends the `benchmarks.md` row, and on `mode: reaudit` writes `00b-delta-report.md` (§4.3) → `dtc-strategist` writes `06-digital-marketing-strategy.md` → *(`strategy_depth: full`)* the strategy chain writes `06b`/`06c`.
8. **Manifest check** — every preset/flag-expected file exists (§5) + the §6 quality gate passes; final summary logged.

### 4.1 Two-pass collection (default)
- **Pass 1 — broad discovery.** Fan out all collection agents; capture what's reachable AND record the *identifiers* needed for precision (§4.2): ad-library **advertiser IDs** + **page IDs**, exact social handles + channel IDs, confirmed domains, GBP named-place URLs. Anything blocked returns `null` + a `data_gap` — never a guessed number.
- **Pass 2 — targeted gap-fill (hard cap: 2 rounds).** Driven by `audit-verifier`'s `must_fix_before_scoring` list: re-capture only the flagged gaps using the Pass-1 identifiers, in **clean, serialized browser sessions** (see §7). SEO/local gaps (blocked GBP reads, failed Lighthouse traces, unverified schema claims) enter this loop like everything else. Re-verify after each round. **After round 2, any surviving high-severity flag is force-footnoted as an unfillable `data_gap`**: it lands in the report's Data Gaps section, and `pm-scorer` scores the affected category conservatively on what IS verified — a blocked read is never scored as confirmed weakness (§7.4). The loop caps; delivery is never blocked.

### 4.2 Structured-output conventions (the inter-agent contract)
Every collection/synthesis agent returns structured JSON. Shared shapes, defined once here:
- `evidence: [{ label, url_or_screenshot, date }]` — every claim links to one.
- `data_gaps: [{ field, reason, tried[] }]` — the honest-null registry (§7.4); `reason` states *"tooling block — NOT zero/absent"* where true.
- `identifiers: { page_id?, advertiser_id?, channel_id?, handle?, listing_url?, gsc_property? }` — identity keys discovered in Pass 1, recorded by **every collection agent** and reused verbatim in Pass 2. (This replaces any per-agent ad-hoc "metrics" store.)
- `data_tier: 0|1|2` — echoed in every SEO/local output.
- **Score field naming:** fixed-category agents return `catN_score_0_100` (e.g. `cat1_score_0_100`); instanced agents return `score_0_100` + `feeds_category` (e.g. ad-teardown/meta → `feeds_category: 3`).

### 4.3 Re-audit mode (`mode: reaudit`)
Same pipeline, **same preset** as the prior run (a delta across presets is meaningless — hard rule 9). Launch protocol first archives the prior `00–10` reports + `run-config.json` into `runs/<brand>/archive/<YYYY-MM-DD>/`; new outputs then overwrite in place (evidence/ and inputs/ persist). `pm-scorer` reads the newest archive and writes `00b-delta-report.md`: per-category score movement table, prior Top-5 action completion check, data gaps opened/closed, and a "what actually changed" narrative. This turns one-off audits into trackable engagements.

---

## 5. Output manifest (`runs/<brand>/`) — every file has a fixed owner
| Output | Owner (writer) | When |
|---|---|---|
| `run-config.json` | workflow Phase 0 | always — the intake snapshot (inputs, preset, flags, tier, date) |
| `00-executive-summary.md` | `pm-scorer` | always |
| `00b-delta-report.md` | `pm-scorer` | `mode: reaudit` (§4.3) |
| `01-brand-audit.md` | `report-assembler` ← pm-brand-auditor JSON | always |
| `02-social-audit.md` | `report-assembler` ← social-content-auditor ×4 JSON | always |
| `03-competitor-audit.md` | `report-assembler` ← competitor-intel ×N JSON | always |
| `04-content-comparison.md` | `content-comparator` | always |
| `05-ads-teardown.md` | `report-assembler` ← ad-teardown ×4 + traffic-sov JSON | always |
| `06-digital-marketing-strategy.md` | `dtc-strategist` | always |
| `06b-offer-and-funnel.md` · `06c-90day-rollout.md` | strategy chain (global `offer-ladder-builder`/`funnel-architect`/`gtm-rollout-planner`) | `strategy_depth: full` |
| `07-seo-audit.md` | `seo-auditor` | SEO presets + Local |
| `08-local-seo-audit.md` | `local-seo-auditor` | Local |
| `09-ai-visibility.md` | `ai-footprint-auditor` | `ai_visibility` on |
| `10-compliance.md` | `report-assembler` ← pm-brand-auditor compliance JSON | regulated vertical / `compliance: true` |
| `audit-deck.html` — all 11 tabs | deck step ← `audit-deck-template.html` | **always** (default; `deck: false` skips) |

**Canonical intermediate paths (workflow-enforced):** raw structured outputs snapshot to `data/<agent>-<instance>.json`; screenshots/artifacts to `evidence/perf/` (shared Lighthouse, §2.2) · `evidence/seo/` · `evidence/local/` · `evidence/adlibs/` · `evidence/social/`; Tier-2 export drops in `inputs/` (never `data/`); re-audit archives in `archive/<date>/`. Every report follows `report-template.md` and respects the §1 capture discipline. `pm-scorer` also appends one anonymised row per run to the repo-root `benchmarks.md`.

---

## 6. Quality gate (before delivery — automated by the workflow's manifest-check phase)
- [ ] Active preset validated against `presets.json` (sums to 100 — asserted at Phase 0, re-checked by `pm-scorer`); roll-up math reconciles
- [ ] Every category score links to ≥1 dated artifact
- [ ] All figures carry the correct tier label — `(est.)` / `(GSC)` / `(Ahrefs export, <date>)` / `(Wayback, <dates>)` / `(Google Trends, est.)`; no fabricated spend/ROAS
- [ ] All 4 platforms covered for brand + every competitor (social + ads)
- [ ] `audit-verifier` flags resolved — or **force-footnoted after the 2-round Pass-2 cap (§4.1)**, each appearing in the Data Gaps section
- [ ] **Data Gaps & tooling blocks section present** (even if empty) — `null`/`data_gap` reads never presented as zeros or weaknesses
- [ ] Score `/100` + breakdown + Top-5 + Next-Actions present; examples niche-specific
- [ ] Every §5 manifest file expected for this preset + flags exists
- [ ] **Client deck built** — `audit-deck.html` present with all 11 tabs (panels), scorecard rows matching the active preset's category set, and zero unresolved `{{` tokens (unless `deck: false`)
- [ ] *(SEO/Local runs)* cat 11/12 internal rubric weights each sum to 100 (`presets.json → internal_rubrics`); pass-through math checked
- [ ] *(SEO/Local runs)* every SERP claim carries query + date + market + band; no exact ranks
- [ ] *(SEO/Local runs)* `data_tier` declared in every output; no over-tier claims (§1.1)
- [ ] *(Local runs)* NAP consistency matrix present; GBP capture dated; local-pack findings labelled as city-modifier proxy
- [ ] *(`ai_visibility` on)* `09` present with /10 sub-score + dated prompt-battery evidence; framed as spot-checks, never "AI rankings"; sub-score stays OUT of the /100
- [ ] *(compliance on)* policy-matrix rows carry a source + date; channel plan respects policy ceilings
- [ ] *(`mode: reaudit`)* delta uses the same preset as the prior run; prior reports archived before overwrite

---

## 7. Reliability & data-quality hardening
*Learnings from the Pure Nutrition run (2026-06-03): 28 tool failures clustered into browser-stampede, fetch-timeout, and blocked-source. These rules prevent recurrence.*

### 7.1 Concurrency tiering (the #1 fix)
Do **not** run all collection agents at flat parallelism. Browser-driven work collides on a shared Chrome instance (wrong-tab traces, half-loaded pages).
| Tier | Agents | Concurrency |
|---|---|---|
| Text / WebSearch / RSS | **traffic-sov (entire agent — text-only, runs first in Phase 1)**, social-content-auditor text work, **ai-footprint-auditor**, seo-auditor + local-seo-auditor **WebSearch sub-work** (SERP bands, mentions, directories), report-assembler, synthesis, verifier | high (parallel) |
| **Browser-dependent** | ad-teardown (all libraries), pm-brand-auditor + competitor-intel **Lighthouse/perf traces**, **seo-auditor Lighthouse + screenshots**, **local-seo-auditor Maps/GBP captures**, IG-grid screenshots | **serial (1–2 at a time)** |
Never run two ad-library captures or two perf traces in the same browser concurrently. Within the browser tier, run `seo-auditor` → `local-seo-auditor` in that order (the latter consumes the former's site signals). The `brand-audit` workflow enforces this table — the browser tier is a serial pipeline with a heartbeat `log` per capture, so a stall is visible (see CLAUDE.md runbook) and resumable.

### 7.2 Browser discipline
- **One page per capture.** Create a fresh page, navigate, `wait_for` the real content selector, **assert the active-tab URL == target**, *then* screenshot / trace. (Fixes the "wrong-tab LCP" miss.)
- **Advertiser-ID-scoped URLs, never keyword search.** Meta: `…/ads/library/?active_status=active&country=<MARKET>&view_all_page_id=<PAGE_ID>`. Google: the advertiser `AR…` ID page. Keyword search returns category + reseller contamination — never report it as the brand's count.
- **GBP capture discipline (the local analogue).** Locate the listing via branded WebSearch → open the **named-place URL** (or the branded-search knowledge panel as fallback) in a fresh page. **Never keyword-search Maps** and report whatever listing appears — that's reseller/competitor contamination. Maps is the most bot-hostile surface in the system: 2 retries, then knowledge-panel fallback, then `null` + `data_gap`. An unclaimed-*looking* listing after a blocked read is a `data_gap`, never "unclaimed (confirmed)".
- **Shared Lighthouse artifacts.** One trace per URL per pass, saved to `evidence/perf/`. `seo-auditor` reuses `pm-brand-auditor`'s homepage trace instead of re-tracing (§2.2 seam).

### 7.3 Source-priority ladder (most → least reliable)
1. **Official structured feeds / APIs** — YouTube RSS (`/feeds/videos.xml?channel_id=`), JSON-LD, sitemaps, oEmbed, paid APIs. *(YouTube RSS was the only "verified-exact" evidence in the Pure Nutrition run.)*
2. **First-party rendered page** (brand's own site/profile via browser screenshot + read).
3. **HTML scrape** via WebFetch.
4. **Third-party aggregators** (Picuki/HypeAuditor/StarNgage) — **last resort**; they 403 bots and their figures are undated estimates.

### 7.4 Retry & honest-null doctrine
- Wrap every external call in **retry-with-backoff (2 attempts)** before falling down the §7.3 ladder.
- If all tiers fail, return `null` + a `data_gap` labelled *"tooling block — NOT zero/absent."* A blocked read is **never** scored as confirmed weakness, and never replaced with a guess.

### 7.5 Engagement-rate when aggregators block
Don't declare ER "not computable." Screenshot the profile grid (browser), read visible likes/comments on the latest ~12 posts, and compute the §3.1 proxy on that **real hand-sample** (state n + date).

### 7.6 Verifier-driven re-capture (closes the loop — capped)
`audit-verifier` emits `must_fix_before_scoring`. Feed that list into Pass 2 (§4.1) as a targeted re-collection round — don't merely footnote high-severity flags on round 1; re-capture them, then re-score. **Hard cap: 2 rounds.** A flag that survives both rounds (e.g. a hard-blocked Maps read) is force-footnoted as an unfillable `data_gap`, reported in the Data Gaps section, and scored conservatively — the loop never deadlocks delivery.

### 7.7 Optional paid-data layer (removes most estimate-labelling)
If keys are available: **SimilarWeb API** (traffic/channel/geo — replaces `(est.)` triangulation), **Meta Ad Library** stable advertiser URLs/API where category-eligible, **Semrush/Ahrefs** (paid keywords + ad copy). Record which figures are API-sourced vs estimated.
