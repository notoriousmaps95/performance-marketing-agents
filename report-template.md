# {{BRAND}} — Performance Marketing & Social Audit
*Region: {{MARKET}} · Data: public only · Preset: {{DTC|B2B|DTC+SEO|B2B+SEO|Local}} · SEO data tier: {{0|1|2|n/a}} · Date: {{DATE}}*

> **This is the `00-executive-summary.md` skeleton.** The deep reports (`01`–`10`) reuse the §-blocks below as needed — `07-seo-audit.md` and `08-local-seo-audit.md` carry their own /100 headline + mini-scorecard (scaffolds at the bottom of this file). Replace every `{{…}}`.
> **Labelling (SOP §1.1):** every figure carries its data-tier label — `(est.)` public proxy · `(GSC)` Tier-1 · `(Ahrefs export, <date>)` / `(Screaming Frog export, <date>)` Tier-2 · `(Wayback, <dates>)` · `(Google Trends, est.)`. Never mix labels up a tier.
> **Scores are not comparable across presets** — say so when the preset is not `DTC`/`B2B`. Appendix-module sub-scores (AI visibility etc.) stay OUTSIDE the /100.

---

## TL;DR
**Score: {{XX}}/100 — {{Strong ≥85 | Targeted fixes 70–84 | Rework <70}}**

Two-to-three sentence verdict: where {{BRAND}} wins, where it bleeds, and the single biggest unlock. Niche-specific, no placeholders.

## Scorecard
| # | Category | Weight | Score /100 | Weighted | Evidence |
|---|---|---:|---:|---:|---|
| 1 | Brand foundation & positioning | {{w}} | {{s}} | {{ws}} | [link] |
| 2 | Organic social presence & content | {{w}} | {{s}} | {{ws}} | [link] |
| 3 | Paid media — Meta | {{w}} | {{s}} | {{ws}} | [link] |
| 4 | Paid media — Google + YouTube | {{w}} | {{s}} | {{ws}} | [link] |
| 5 | Paid media — TikTok & emerging | {{w}} | {{s}} | {{ws}} | [link] |
| 6 | Paid media — LinkedIn | {{w}} | {{s}} | {{ws}} | [link] |
| 7 | Creative & messaging strategy | {{w}} | {{s}} | {{ws}} | [link] |
| 8 | Funnel & conversion signals | {{w}} | {{s}} | {{ws}} | [link] |
| 9 | Audience & targeting signals | {{w}} | {{s}} | {{ws}} | [link] |
| 10 | Competitive share of voice | {{w}} | {{s}} | {{ws}} | [link] |
| 11 | Organic search (SEO) *(SEO presets + Local only — omit row otherwise)* | {{w}} | {{s}} | {{ws}} | [07-seo-audit.md] |
| 12 | Local search *(Local preset only — omit row otherwise)* | {{w}} | {{s}} | {{ws}} | [08-local-seo-audit.md] |
| | **TOTAL** | **100** | | **{{XX}}** | |

## Appendix sub-scores *(non-scored modules — SOP §2.4; omit rows for modules that didn't run)*
| Module | Sub-score | Headline finding | Report |
|---|---|---|---|
| AI visibility | {{X}}/10 | {{one line — recognition/accuracy/citation/narrative}} | [09-ai-visibility.md] |
| Compliance *(regulated verticals)* | {{pass/flag count}} | {{one line — the binding policy ceiling}} | [10-compliance.md] |

## Competitive snapshot
| Metric (est.) | {{BRAND}} | {{COMP1}} | {{COMP2}} | {{COMP3}} |
|---|---|---|---|---|
| Est. monthly traffic | | | | |
| Active Meta ads | | | | |
| Active Google ads | | | | |
| Top organic platform (ER%) | | | | |
| Posting cadence /wk | | | | |
| Dominant offer | | | | |
| Share of search % (Google Trends, est.) | | | | |
| Reputation — rating · review count · velocity (est.) | | | | |
| Organic visibility (roundup/branded-SERP, est.) *(SEO/Local runs)* | | | | |
| Local pack presence (core city-modifier queries) *(Local runs)* | | | | |

## Strengths
- …

## Critical gaps
- …

## Top 5 prioritised actions
*(ranked impact × ease — the operative output)*
| # | Action | Category | Impact | Ease | Expected effect |
|---|---|---|---|---|---|
| 1 | | | H/M/L | H/M/L | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

## Data gaps & tooling blocks *(SOP §7.4 — mandatory section, keep even when empty)*
Honest-null registry: blocked or unmeasurable reads are recorded here, **never** scored as zeros or weaknesses. Force-footnoted verifier flags (post 2-round Pass-2 cap, SOP §4.1) land here too.
| Field / claim | Reason | What was tried | Treatment in scoring |
|---|---|---|---|
| {{e.g. TikTok active-ad count}} | {{tooling block — NOT zero ads}} | {{navigate ×2 → WebFetch → WebSearch}} | {{cat 5 scored on organic signals only, floor noted}} |

## Evidence appendix
Dated artifacts: ad-library URLs, screenshots, counts, SERP captures, traffic estimates (source + date). Artifact paths follow SOP §5: `evidence/perf/` · `evidence/seo/` · `evidence/local/` · `evidence/adlibs/` · `evidence/social/`.

## Verifier notes
Claims challenged by `audit-verifier` and how each was resolved/footnoted (round-2 survivors cross-reference the Data Gaps table).

## Next Actions
Immediate (week 1) · 30-day · 90-day — cross-referenced to `06-digital-marketing-strategy.md`{{, and to `06b`/`06c` on `strategy_depth: full` runs}}.

---

## Template block — `07-seo-audit.md` headline + mini-scorecard *(copy into that file; weights from `presets.json → internal_rubrics`)*
```markdown
# {{BRAND}} — SEO Audit (cat 11) · {{CAT11}}/100
*Data tier: {{0|1|2}} · Market: {{MARKET}} · Date: {{DATE}}*

| # | Dimension | Wt | Score /100 | Weighted | Evidence |
|---|---|---:|---:|---:|---|
| 1 | Technical & crawlability | 20 | {{s}} | {{ws}} | [link] |
| 2 | On-page: money pages | 25 | {{s}} | {{ws}} | [link] |
| 3 | Schema & entity | 15 | {{s}} | {{ws}} | [link] |
| 4 | Content quality & topical | 15 | {{s}} | {{ws}} | [link] |
| 5 | Internal linking | 10 | {{s}} | {{ws}} | [link] |
| 6 | Authority (off-site proxies) | 10 | {{s}} | {{ws}} | [link] |
| 7 | AEO / AI visibility | 5 | {{s}} | {{ws}} | [link] |
| | **cat 11 roll-up** | **100** | | **{{CAT11}}** | |
```

## Template block — `08-local-seo-audit.md` headline + mini-scorecard *(copy into that file)*
```markdown
# {{BRAND}} — Local SEO Audit (cat 12) · {{CAT12}}/100
*City: {{CITY}} · Sub-type: {{brick_and_mortar|service_area|hybrid}} · Data tier: {{0|1|2}} · Date: {{DATE}}*

| # | Dimension | Wt | Score /100 | Weighted | Evidence |
|---|---|---:|---:|---:|---|
| 1 | GBP signals | 25 | {{s}} | {{ws}} | [link] |
| 2 | Reviews & reputation | 20 | {{s}} | {{ws}} | [link] |
| 3 | Local on-page | 20 | {{s}} | {{ws}} | [link] |
| 4 | NAP & citations | 15 | {{s}} | {{ws}} | [link] |
| 5 | Local schema | 10 | {{s}} | {{ws}} | [link] |
| 6 | Local authority | 10 | {{s}} | {{ws}} | [link] |
| | **cat 12 roll-up** | **100** | | **{{CAT12}}** | |
```
