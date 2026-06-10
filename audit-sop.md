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
| Weighting preset | ✅ | `DTC` (default) or `B2B` — see §2 |

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
| *(Optional)* first-party search data | `mcp__gsc__*` | only if brand is a user-owned property |

**Capture discipline:** every score is backed by a dated artifact. Estimates are labelled `(est.)`. Never present a proxy as an account-verified number.

---

## 2. Scoring model (`/100`)

Ten categories, each scored **0–100 internally**, then multiplied by its weight and summed. Two weighting presets; pick one at setup.

| # | Category | DTC weight | B2B weight |
|---|---|---|---|
| 1 | Brand foundation & positioning | 10 | 10 |
| 2 | Organic social presence & content | 15 | 12 |
| 3 | Paid media — Meta (FB/IG) | 15 | 8 |
| 4 | Paid media — Google + YouTube | 12 | 15 |
| 5 | Paid media — TikTok & emerging | 8 | 4 |
| 6 | Paid media — LinkedIn | 5 | 15 |
| 7 | Creative & messaging strategy | 10 | 8 |
| 8 | Funnel & conversion signals | 10 | 12 |
| 9 | Audience & targeting signals | 5 | 6 |
| 10 | Competitive share of voice | 10 | 10 |
| | **Total** | **100** | **100** |

**Roll-up:** `Final = Σ (category_score/100 × weight)`. Validate weights sum to 100 before scoring.

**Bands:** ≥85 **Strong** · 70–84 **Targeted fixes** · <70 **Rework**.

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

**7. Creative & messaging strategy** — hook quality, UGC vs polished mix, offer strategy (discount/bundle/guarantee/urgency), seasonal cadence, visible A/B-test signals.
`90–100` strong hooks, diverse formats, clear offer ladder, testing evident · `70–89` competent, limited testing · `50–69` repetitive/weak hooks · `<50` no coherent creative strategy.

**8. Funnel & conversion signals** — landing pages, offer clarity, email/SMS capture, retargeting evidence (pixel/ad presence), reviews & social proof, checkout UX, **LP speed** (Lighthouse/CWV).
`90–100` fast LPs, strong capture, proof everywhere, frictionless checkout · `70–89` good with gaps · `50–69` slow LPs / weak capture / thin proof · `<50` broken funnel.

**9. Audience & targeting signals** — inferred personas, ad targeting cues (language, casting, placements), influencer/partnership footprint.
`90–100` clear multi-persona targeting + active partnerships · `70–89` single clear persona · `50–69` vague · `<50` no discernible audience strategy.

**10. Competitive share of voice** — ad volume vs competitors, content velocity, estimated traffic/channel split, SERP/ad overlap on core terms.
`90–100` leads the set on ad volume + traffic + velocity · `70–89` competitive · `50–69` trailing · `<50` invisible vs competitors.

---

## 3. Proxy methodologies (public-data estimation)

### 3.1 Engagement-rate proxy
`ER% = (avg [likes + comments + shares] over last ~12 posts) ÷ followers × 100`.
Rough public benchmarks (label all as proxy): **Instagram** good >1% · **TikTok** (use likes ÷ views) good >5% · **LinkedIn** good >2% · **YouTube** (likes+comments ÷ views) good >2% · **Facebook** good >0.5%. Always state sample size and date.

### 3.2 Ad longevity / winner proxy
Brands kill losing ads fast, so **longevity ≈ performance**. From Meta Ad Library "started running on" dates: an ad live **30+ days**, or a concept with **many active variants**, is a likely winner. Record: # active ads, # distinct concepts, oldest active start date, most-replicated concept. Flag the inferred winners — these inform the creative strategy.

### 3.3 Spend & ROAS — DO NOT fabricate
Public data gives **no real spend or ROAS**. Express budget/performance only as relative signals (ad volume, longevity, channel breadth, offer aggressiveness) and **label every figure `(est.)`**. If account access is later granted, replace proxies with real numbers.

---

## 4. Run process (6 phases)
Executed as a multi-agent Workflow orchestrating the `.claude/agents/` roster.

1. **Brand teardown** — `pm-brand-auditor` + `ad-teardown`(brand) + `social-content-auditor`(brand ×4) → `01-brand-audit.md`
2. **Social deep-dive** — `social-content-auditor` per platform → `02-social-audit.md`
3. **Competitor audit** — `competitor-intel` per competitor (wraps brand-auditor + ad + social lenses) → `03-competitor-audit.md`
4. **Content comparison** — `content-comparator` (brand vs competitors) → `04-content-comparison.md`
5. **Ads teardown** — `ad-teardown` per library, brand + competitors; `traffic-sov` for share of voice → `05-ads-teardown.md`
6. **Synthesis** — `audit-verifier` challenges claims → `pm-scorer` computes `/100` → `dtc-strategist` writes strategy → `00-executive-summary.md` + `06-digital-marketing-strategy.md`

### 4.1 Two-pass collection (default)
- **Pass 1 — broad discovery.** Fan out all collection agents; capture what's reachable AND record the *identifiers* needed for precision: ad-library **advertiser IDs** + **page IDs**, exact social handles + channel IDs, confirmed domains. Anything blocked returns `null` + a `data_gap` — never a guessed number.
- **Pass 2 — targeted gap-fill.** Driven by `audit-verifier`'s `must_fix_before_scoring` list: re-capture only the flagged gaps using the Pass-1 identifiers, in **clean, serialized browser sessions** (see §7). Loop Pass 2 until no high-severity flag remains or two consecutive rounds add nothing (loop-until-confidence). Only then does `pm-scorer` finalise.

---

## 5. Output manifest (`runs/<brand>/`)
`00-executive-summary.md` (score + breakdown + Top 5) · `01-brand-audit.md` · `02-social-audit.md` · `03-competitor-audit.md` · `04-content-comparison.md` · `05-ads-teardown.md` · `06-digital-marketing-strategy.md`. Every report follows `report-template.md` and respects the §1 capture discipline.

---

## 6. Quality gate (before delivery)
- [ ] Active weighting preset sums to 100; roll-up math checked
- [ ] Every category score links to ≥1 dated artifact
- [ ] All estimates labelled `(est.)`; no fabricated spend/ROAS
- [ ] All 4 platforms covered for brand + every competitor (social + ads)
- [ ] `audit-verifier` flags resolved or footnoted
- [ ] Score `/100` + breakdown + Top-5 + Next-Actions present; examples niche-specific

---

## 7. Reliability & data-quality hardening
*Learnings from the Pure Nutrition run (2026-06-03): 28 tool failures clustered into browser-stampede, fetch-timeout, and blocked-source. These rules prevent recurrence.*

### 7.1 Concurrency tiering (the #1 fix)
Do **not** run all collection agents at flat parallelism. Browser-driven work collides on a shared Chrome instance (wrong-tab traces, half-loaded pages).
| Tier | Agents | Concurrency |
|---|---|---|
| Text / WebSearch / RSS | traffic-sov (search part), synthesis, verifier | high (parallel) |
| **Browser-dependent** | ad-teardown (all libraries), pm-brand-auditor + competitor-intel **Lighthouse/perf traces**, IG-grid screenshots | **serial (1–2 at a time)** |
Never run two ad-library captures or two perf traces in the same browser concurrently.

### 7.2 Browser discipline
- **One page per capture.** Create a fresh page, navigate, `wait_for` the real content selector, **assert the active-tab URL == target**, *then* screenshot / trace. (Fixes the "wrong-tab LCP" miss.)
- **Advertiser-ID-scoped URLs, never keyword search.** Meta: `…/ads/library/?active_status=active&country=<MARKET>&view_all_page_id=<PAGE_ID>`. Google: the advertiser `AR…` ID page. Keyword search returns category + reseller contamination — never report it as the brand's count.

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

### 7.6 Verifier-driven re-capture (closes the loop)
`audit-verifier` emits `must_fix_before_scoring`. Feed that list into Pass 2 (§4.1) as a targeted re-collection round — don't merely footnote high-severity flags; re-capture them, then re-score.

### 7.7 Optional paid-data layer (removes most estimate-labelling)
If keys are available: **SimilarWeb API** (traffic/channel/geo — replaces `(est.)` triangulation), **Meta Ad Library** stable advertiser URLs/API where category-eligible, **Semrush/Ahrefs** (paid keywords + ad copy). Record which figures are API-sourced vs estimated.
