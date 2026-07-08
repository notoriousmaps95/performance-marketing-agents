export const meta = {
  name: 'brand-audit',
  description: 'Full public-data performance-marketing brand audit: text tier -> serial browser tier -> assembly -> verify (2-round cap) -> score -> strategy -> manifest check',
  whenToUse: 'Run a scored /100 brand audit per audit-sop.md. Preset must be locked first (never "detect") — on detect, classify inline with pm-brand-auditor and confirm with the user BEFORE invoking. Args: see REQUIRED list in Phase 0.',
  phases: [
    { title: 'Validate', detail: 'args + presets.json + run-config.json' },
    { title: 'Text tier', detail: 'traffic-sov, social x4, ai-footprint — parallel' },
    { title: 'Browser tier', detail: 'brand -> ads x4 -> seo -> local -> competitors — strictly serial' },
    { title: 'Assembly', detail: 'report-assembler -> 01/02/03/05 (+10)' },
    { title: 'Compare', detail: 'content-comparator -> 04' },
    { title: 'Verify', detail: 'audit-verifier + Pass-2 recapture, max 2 rounds' },
    { title: 'Score & strategy', detail: 'pm-scorer -> 00 (+00b), dtc-strategist -> 06 (+chain 06b/06c)' },
    { title: 'Finalise', detail: 'deck (default on, all 11 tabs) + manifest check vs SOP §5/§6' },
  ],
}

// ---------- Phase 0 — Validate (defends the known silent-args bug) ----------
phase('Validate')
// args is frozen in the workflow sandbox — clone before normalising.
// Known runtime quirk (the historical "silent args bug"): args can arrive as a JSON STRING
// instead of an object — parse it instead of crashing three phases later.
let RAW = args
if (typeof RAW === 'string') {
  try { RAW = JSON.parse(RAW) } catch (e) { throw new Error(`brand-audit: args arrived as an unparseable string (first 200 chars): ${RAW.slice(0, 200)}`) }
}
if (RAW !== null && RAW !== undefined && (typeof RAW !== 'object' || Array.isArray(RAW))) throw new Error(`brand-audit: args must be an object, got ${Array.isArray(RAW) ? 'array' : typeof RAW}`)
const A = Object.assign({}, RAW || {})
A.flags = typeof A.flags === 'string' ? JSON.parse(A.flags) : Object.assign({}, A.flags || {})

const REQUIRED = ['brand', 'brand_slug', 'url', 'market', 'preset', 'business_type', 'competitors', 'data_tier', 'date']
const missingArgs = REQUIRED.filter(k => A[k] === undefined || A[k] === null || A[k] === '')
if (missingArgs.length) throw new Error(`brand-audit: missing required args: ${missingArgs.join(', ')} — received keys: [${Object.keys(A).join(', ')}]. If this ran in the background, args may have been dropped (known bug): re-invoke with inputs hardcoded.`)
if (A.preset === 'detect') throw new Error('brand-audit: preset is "detect" — run the Phase-0 classification inline (pm-brand-auditor classify_only), confirm the preset with the user, then invoke with the locked preset.')
if (!Array.isArray(A.competitors) || A.competitors.length < 1) throw new Error('brand-audit: competitors must be a non-empty array of {name, url} — pass real values (SOP wants 2–4).')
if (![0, 1, 2].includes(A.data_tier)) throw new Error(`brand-audit: data_tier must be 0|1|2, got ${JSON.stringify(A.data_tier)}`)
if (A.preset === 'Local' && !A.city) throw new Error('brand-audit: Local preset requires args.city')
if ((A.flags.mode || 'audit') === 'reaudit' && !A.prior_archive_date) throw new Error('brand-audit: mode reaudit requires args.prior_archive_date (archive the prior reports to runs/<slug>/archive/<date>/ before launching — see CLAUDE.md run protocol).')
if (A.competitors.length < 2) log('WARNING: fewer than 2 competitors — SOP recommends 2–4; SOV and comparison will be thin.')

const RUN = `runs/${A.brand_slug}`
const SEO_ON = ['DTC+SEO', 'B2B+SEO', 'Local'].includes(A.preset)
const LOCAL = A.preset === 'Local'
log(`brand-audit: ${A.brand} (${A.url}) · market ${A.market} · preset ${A.preset} · tier ${A.data_tier} · ${A.competitors.length} competitors · date ${A.date} · run folder ${RUN}`)

const CONFIG_SCHEMA = {
  type: 'object', required: ['ok', 'weights_sum', 'weights', 'modules', 'problems'],
  properties: {
    ok: { type: 'boolean' }, weights_sum: { type: 'number' }, weights: { type: 'object' },
    internal_rubrics_ok: { type: 'boolean' }, modules: { type: 'object' }, problems: { type: 'array', items: { type: 'string' } },
  }, additionalProperties: true,
}
const config = await agent(
  `Config loader for a brand-audit run. Do exactly this:
1. Read presets.json (project root). Extract the "${A.preset}" preset's weights; sum them; check the sum is 100. Check every other preset also sums to 100 and each internal_rubrics vector sums to 100 — list any violation in problems[].
2. Resolve module flags: start from presets.json -> modules defaults, override with: ${JSON.stringify(A.flags)}. Resolve "compliance":"auto" to true when regulated_vertical is set (regulated_vertical: ${JSON.stringify(A.regulated_vertical || null)}), else false. Return the resolved flat map in modules (ai_visibility, compliance, influencer, marketplace, seo_depth, strategy_depth, deck, mode as booleans/strings).
3. Write ${RUN}/run-config.json — the intake snapshot: ${JSON.stringify({ brand: A.brand, brand_slug: A.brand_slug, url: A.url, market: A.market, language: A.language || null, preset: A.preset, business_type: A.business_type, local_subtype: A.local_subtype || null, vertical: A.vertical || null, regulated_vertical: A.regulated_vertical || null, city: A.city || null, competitors: A.competitors, data_tier: A.data_tier, gsc_property: A.gsc_property || null, date: A.date })} plus the resolved modules map and the weights you loaded. Create the ${RUN}/ and ${RUN}/data/ directories if needed.
4. Return { ok, weights_sum, weights, internal_rubrics_ok, modules, problems }. ok=false if any sum is wrong or presets.json is unreadable.`,
  { label: 'config-loader', phase: 'Validate', schema: CONFIG_SCHEMA, effort: 'low' },
)
if (!config || !config.ok) throw new Error(`brand-audit: presets.json validation failed: ${JSON.stringify(config && config.problems)}`)
const MOD = config.modules || {}
log(`presets ok (sum ${config.weights_sum}) · modules: ai_visibility=${MOD.ai_visibility} compliance=${MOD.compliance} influencer=${MOD.influencer} marketplace=${MOD.marketplace} seo_depth=${MOD.seo_depth} strategy_depth=${MOD.strategy_depth} deck=${MOD.deck} mode=${MOD.mode}`)

if (A.dry_run) { log('dry_run=true — stopping after Validate.'); return { dry_run: true, config } }

// Shared bits for collection prompts
const ENVELOPE = { type: 'object', required: ['evidence', 'data_gaps'], properties: { evidence: { type: 'array' }, data_gaps: { type: 'array' }, identifiers: { type: 'object' } }, additionalProperties: true }
const COMMON = `Run folder: ${RUN}. Run date: ${A.date} (use this date on artifacts). Market: ${A.market}. data_tier: ${A.data_tier}. Follow your agent definition + audit-sop.md exactly (§4.2 output conventions, §7 doctrine). Save artifacts to the SOP §5 evidence subfolders.`
const snap = name => `Before returning, also Write your full structured JSON verbatim to ${RUN}/data/${name}.json (so a stalled run keeps partial results).`
const gapStub = which => ({ data_gaps: [{ field: 'entire_agent', reason: `${which} returned nothing (skipped or failed) — tooling block, NOT measured weakness`, tried: ['workflow spawn'] }], evidence: [], identifiers: {} })

// ---------- Phase 1 — Text tier (parallel, no browser) ----------
phase('Text tier')
const PLATFORMS = ['meta_instagram', 'tiktok', 'linkedin', 'youtube']
const textWork = [
  () => agent(`${COMMON} ${snap('traffic-sov')} Inputs: ${JSON.stringify({ brand_domain: A.url, competitor_domains: A.competitors.map(c => c.url), core_terms: A.core_terms || 'derive 5-8 from the niche', branded_terms: A.branded_terms || 'derive from brand + competitor names', market: A.market, city: A.city || null, is_local: LOCAL })}. Include the §3.9 share-of-search step${LOCAL ? ' AND the §3.5 local-pack SOV collection (downstream agents consume it)' : ''}.`,
    { label: 'traffic-sov', phase: 'Text tier', agentType: 'traffic-sov', schema: ENVELOPE }),
  ...PLATFORMS.map(p => () => agent(`${COMMON} ${snap(`social-${p}`)} Inputs: ${JSON.stringify({ brand: A.brand, platform: p, handle_or_url: (A.handles && A.handles[p]) || 'discover', market: A.market, flags: { influencer: !!MOD.influencer } })}. Text-tier sources first; if you need grid screenshots (§7.5) keep them minimal — the browser is shared.`,
    { label: `social:${p}`, phase: 'Text tier', agentType: 'social-content-auditor', schema: ENVELOPE })),
]
if (MOD.ai_visibility) textWork.push(() => agent(`${COMMON} Run your AI Footprint audit battery for brand "${A.brand}" (${A.url}) vs competitors ${A.competitors.map(c => c.name).join(', ')} in ${A.market}. Write ${RUN}/09-ai-visibility.md: /10 sub-score (recognition · accuracy · citation · narrative control), per-surface findings each with prompt + surface + date, top 5 narrative vulnerabilities, remediation priorities. Frame every finding as a dated spot-check — NEVER "AI rankings". This sub-score stays OUTSIDE the /100 (SOP §2.4). Return a JSON summary { sub_score_10, top_vulnerabilities[], evidence[], data_gaps[] }.`,
  { label: 'ai-footprint', phase: 'Text tier', agentType: 'ai-footprint-auditor', schema: ENVELOPE }))

const textResults = await parallel(textWork)
const trafficSov = textResults[0] || gapStub('traffic-sov')
const socials = PLATFORMS.map((p, i) => textResults[1 + i] || gapStub(`social-${p}`))
const aiFootprint = MOD.ai_visibility ? (textResults[5] || gapStub('ai-footprint-auditor')) : null
log(`text tier done: traffic-sov ${trafficSov.data_gaps.length} gaps · social x4 · ai_visibility ${MOD.ai_visibility ? 'done' : 'off'}`)

// ---------- Phase 2 — Browser tier (STRICTLY SERIAL — SOP §7.1) ----------
phase('Browser tier')
const LIBRARIES = ['meta', 'google', 'linkedin', 'tiktok']
const browserTotal = 1 + LIBRARIES.length + (SEO_ON ? 1 : 0) + (LOCAL ? 1 : 0) + A.competitors.length + (SEO_ON && MOD.seo_depth === 'hobo' ? 1 : 0)
let step = 0
const beat = what => log(`[browser ${++step}/${browserTotal}] ${what}`)

beat(`pm-brand-auditor: full teardown of ${A.brand}`)
const brand = (await agent(`${COMMON} ${snap('brand')} Inputs: ${JSON.stringify({ brand: A.brand, url: A.url, market: A.market, mode: 'full', flags: { compliance: !!MOD.compliance, marketplace: !!MOD.marketplace } })}. Business type is already locked (${A.business_type}${A.regulated_vertical ? `, regulated vertical: ${A.regulated_vertical}` : ''}) — still report your step-0 block, but do not re-open the preset. Save your homepage Lighthouse trace to ${RUN}/evidence/perf/ (seo-auditor reuses it).`,
  { label: 'pm-brand-auditor', phase: 'Browser tier', agentType: 'pm-brand-auditor', schema: ENVELOPE })) || gapStub('pm-brand-auditor')

const ads = []
for (const lib of LIBRARIES) {
  beat(`ad-teardown: ${lib} library, advertiser ${A.brand}`)
  ads.push((await agent(`${COMMON} ${snap(`ads-${lib}`)} Inputs: ${JSON.stringify({ advertiser: A.brand, library: lib, market: A.market, is_brand: true })}. One capture at a time — the browser is exclusively yours for this step.${lib === 'meta' ? ' Include the §3.8 Wayback offer-history probe (brand Meta instance).' : ''}`,
    { label: `ads:${lib}`, phase: 'Browser tier', agentType: 'ad-teardown', schema: ENVELOPE })) || gapStub(`ad-teardown-${lib}`))
}

let seo = null, localSeo = null, hobo = null
if (SEO_ON) {
  beat(`seo-auditor: ${A.url} (tier ${A.data_tier})`)
  seo = (await agent(`${COMMON} ${snap('seo')} Inputs: ${JSON.stringify({ brand: A.brand, url: A.url, market: A.market, business_type: A.business_type, data_tier: A.data_tier, gsc_property: A.gsc_property || null, exports_dir: A.data_tier === 2 ? `${RUN}/inputs/` : null })} plus brand_auditor_signals from this JSON: ${JSON.stringify({ lp_speed: brand.funnel && brand.funnel.lp_speed, platform: brand.tech_stack && brand.tech_stack.platform })}. Reuse the homepage trace in ${RUN}/evidence/perf/ — do not re-trace it. Write ${RUN}/07-seo-audit.md (mini-scorecard scaffold at the bottom of report-template.md).`,
    { label: 'seo-auditor', phase: 'Browser tier', agentType: 'seo-auditor', schema: ENVELOPE })) || gapStub('seo-auditor')
  if (MOD.seo_depth === 'hobo') {
    beat('hobo-auditor: deep-SEO pass')
    hobo = await agent(`Audit ${A.url} (market ${A.market}) against the Hobo Technical SEO 2025 framework. Write the full /100 report to ${RUN}/07b-hobo-deep-seo.md. This complements ${RUN}/07-seo-audit.md — cross-reference it, don't duplicate its Lighthouse work. Return { score_100, top_actions[], evidence[], data_gaps[] }.`,
      { label: 'hobo-auditor', phase: 'Browser tier', agentType: 'hobo-auditor', schema: ENVELOPE })
  }
}
if (LOCAL) {
  beat(`local-seo-auditor: ${A.city}`)
  localSeo = (await agent(`${COMMON} ${snap('local-seo')} Inputs: ${JSON.stringify({ brand: A.brand, url: A.url, market: A.market, city: A.city, local_subtype: A.local_subtype || 'brick_and_mortar', vertical: A.vertical || 'derive' })} plus seo_auditor_signals (schema matrix + footer NAP): ${JSON.stringify(seo && seo.schema_entity ? { schema_matrix: seo.schema_entity.schema_matrix, footer_nap: seo.schema_entity.footer_nap } : null)} and traffic-sov local_pack_sov: ${JSON.stringify(trafficSov.local_pack_sov || null)}. Never re-fetch seo-auditor's pages; never re-run the pack queries. Write ${RUN}/08-local-seo-audit.md.`,
    { label: 'local-seo-auditor', phase: 'Browser tier', agentType: 'local-seo-auditor', schema: ENVELOPE })) || gapStub('local-seo-auditor')
}

const competitors = []
for (const c of A.competitors) {
  beat(`competitor-intel: ${c.name}`)
  competitors.push((await agent(`${COMMON} ${snap(`competitor-${(c.name || 'x').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)} Inputs: ${JSON.stringify({ competitor: c.name, url: c.url, handles: c.handles || null, market: A.market, platforms: PLATFORMS, libraries: LIBRARIES, traffic_sov_signals: { serp_overlap: trafficSov.serp_sov || null, local_pack_sov: trafficSov.local_pack_sov || null } })}. SEO snapshot ${SEO_ON ? 'ON (bounded: max 2 fetches, no Lighthouse)' : 'OFF'}. Browser work serial — one capture at a time.`,
    { label: `competitor:${c.name}`, phase: 'Browser tier', agentType: 'competitor-intel', schema: ENVELOPE })) || gapStub(`competitor-intel ${c.name}`))
}

// ---------- Phase 3 — Assembly (report-assembler owns 01/02/03/05 + 10) ----------
phase('Assembly')
const ASSEMBLE = { type: 'object', required: ['target_path'], properties: { target_path: { type: 'string' }, sections_written: { type: 'array' }, gaps_carried: { type: 'number' } }, additionalProperties: true }
const asm = (target, title, sources, spec) => () => agent(
  `Assemble ${RUN}/${target}. report_title: "${A.brand} — ${title}". brand ${A.brand} · market ${A.market} · preset ${A.preset} · data_tier ${A.data_tier} · date ${A.date}. sections_spec: ${spec}. source_json follows (format it, invent nothing):\n${JSON.stringify(sources)}`,
  { label: `assemble:${target}`, phase: 'Assembly', agentType: 'report-assembler', schema: ASSEMBLE, effort: 'low' },
)
const assemblyWork = [
  asm('01-brand-audit.md', 'Brand Audit', { pm_brand_auditor: brand }, 'positioning; tech & measurement stack; offers; funnel & capture depth; reputation; cat1+cat8 scores; data gaps; evidence'),
  asm('02-social-audit.md', 'Organic Social Audit', { platforms: socials }, 'one section per platform (cadence, format mix, ER proxy + benchmark, pillars, top posts, creator signals); cross-platform summary table; data gaps; evidence'),
  asm('03-competitor-audit.md', 'Competitor Audit', { competitors }, 'one profile per competitor; comparison table (traffic, ads, ER, reputation, offer); vs_brand highlights; data gaps; evidence'),
  asm('05-ads-teardown.md', 'Paid Ads Teardown', { libraries: ads, traffic_sov: trafficSov }, 'one section per library (counts, concepts, winners, offers, LP alignment); Wayback offer-history table; SOV + share-of-search summary; data gaps; evidence'),
]
if (MOD.compliance && brand.compliance) assemblyWork.push(asm('10-compliance.md', 'Compliance & Ad-Policy Audit', { compliance: brand.compliance, regulated_vertical: A.regulated_vertical || (brand.business_type && brand.business_type.regulated_vertical) }, 'policy matrix table (platform × rule × paid_allowed × source + date); age-gate/consent/disclaimers; channel-plan implications'))
const assembled = (await parallel(assemblyWork)).filter(Boolean)
log(`assembly done: ${assembled.map(a => a.target_path).join(' · ')}`)

// ---------- Phase 4 — Compare ----------
phase('Compare')
const comparison = (await agent(`${COMMON} ${snap('content-comparison')} Compare brand vs competitors and write ${RUN}/04-content-comparison.md. Inputs: brand social x4, brand ads x4, competitor profiles — read them from ${RUN}/data/*.json (social-*.json, ads-*.json, competitor-*.json); the files were just written. influencer flag: ${!!MOD.influencer}.`,
  { label: 'content-comparator', phase: 'Compare', agentType: 'content-comparator', schema: ENVELOPE })) || gapStub('content-comparator')

// ---------- Phases 5–6 — Verify + Pass-2 (hard cap 2 rounds) ----------
phase('Verify')
const VERIFY_SCHEMA = {
  type: 'object', required: ['flags', 'must_fix_before_scoring', 'overall_confidence_0_100'],
  properties: {
    flags: { type: 'array' },
    must_fix_before_scoring: { type: 'array', items: { type: 'object', required: ['claim', 'recapture_agent'], properties: { claim: { type: 'string' }, recapture_agent: { type: 'string' }, recapture_instruction: { type: 'string' }, identifiers: { type: 'object' } }, additionalProperties: true } },
    spot_checks: { type: 'array' }, overall_confidence_0_100: { type: 'number' },
  }, additionalProperties: true,
}
const verifierPrompt = extra => `${COMMON} Adversarially verify the draft audit per your method (incl. module challenge types 14–17 where relevant). Evidence: read ${RUN}/data/*.json and the written reports 01–05 (+07/08/09/10 when present). data_tier: ${A.data_tier}. For every must_fix item include recapture_agent (one of: ad-teardown, social-content-auditor, pm-brand-auditor, seo-auditor, local-seo-auditor, competitor-intel, traffic-sov), a one-line recapture_instruction, and the Pass-1 identifiers to reuse. ${extra}`
let verify = await agent(verifierPrompt('This is verification round 1.'), { label: 'verify:round1', phase: 'Verify', agentType: 'audit-verifier', schema: VERIFY_SCHEMA })
if (!verify) { verify = { flags: [], must_fix_before_scoring: [], overall_confidence_0_100: 0, spot_checks: [] }; log('WARNING: verifier returned nothing — scoring will proceed with confidence 0 and a data_gap note.') }

const recaptures = []
for (let round = 1; round <= 2 && verify.must_fix_before_scoring.length > 0; round++) {
  log(`Pass-2 round ${round}: ${verify.must_fix_before_scoring.length} must-fix flags — serial re-capture`)
  for (const fix of verify.must_fix_before_scoring) {
    const at = ['ad-teardown', 'social-content-auditor', 'pm-brand-auditor', 'seo-auditor', 'local-seo-auditor', 'competitor-intel', 'traffic-sov'].includes(fix.recapture_agent) ? fix.recapture_agent : 'pm-brand-auditor'
    recaptures.push(await agent(`${COMMON} Pass-2 TARGETED re-capture (round ${round}) — clean session, this gap only: ${fix.claim}. Instruction: ${fix.recapture_instruction || 'recapture per your method'}. Reuse Pass-1 identifiers verbatim: ${JSON.stringify(fix.identifiers || {})}. Return only the re-captured fields + evidence + data_gaps. Also append your JSON to ${RUN}/data/pass2-round${round}.json (Write; create or extend).`,
      { label: `recapture:${at}`, phase: 'Verify', agentType: at, schema: ENVELOPE }))
  }
  verify = (await agent(verifierPrompt(`This is re-verification after Pass-2 round ${round}. Recapture results: ${JSON.stringify(recaptures.filter(Boolean))}. ${round === 2 ? 'FINAL round: mark any still-unfillable high-severity flag verdict "footnoted_unfillable" instead of must_fix — the 2-round cap applies and scoring proceeds conservatively.' : ''}`),
    { label: `verify:round${round + 1}`, phase: 'Verify', agentType: 'audit-verifier', schema: VERIFY_SCHEMA })) || verify
}
if (verify.must_fix_before_scoring.length > 0) log(`2-round cap reached: ${verify.must_fix_before_scoring.length} flags force-footnoted as unfillable data_gaps (they land in the Data Gaps section).`)

// ---------- Phase 7 — Score & strategy ----------
phase('Score & strategy')
const SCORE_SCHEMA = { type: 'object', required: ['final_score', 'band', 'preset'], properties: { final_score: { type: 'number' }, band: { type: 'string' }, preset: { type: 'string' }, scorecard: { type: 'array' }, delta_summary: { type: 'string' } }, additionalProperties: true }
const score = await agent(
  `${COMMON} Score the run. Active preset: ${A.preset} (load weights from presets.json yourself — step 1 of your method). mode: ${MOD.mode}${MOD.mode === 'reaudit' ? ` · prior archive: ${RUN}/archive/${A.prior_archive_date}/` : ''}. Inputs: all structured outputs in ${RUN}/data/*.json, the reports 01–10 as present, verifier result: ${JSON.stringify(verify)}. Appendix sub-scores: ai_visibility ${MOD.ai_visibility ? `sub_score_10=${JSON.stringify(aiFootprint && aiFootprint.sub_score_10)}` : 'off'}, compliance ${MOD.compliance ? 'on — summarise 10-compliance.md' : 'off'}. Write ${RUN}/00-executive-summary.md (Data Gaps section is mandatory)${MOD.mode === 'reaudit' ? ' and 00b-delta-report.md' : ''}, append the benchmarks.md row, and return { final_score, band, preset, scorecard[] }.`,
  { label: 'pm-scorer', phase: 'Score & strategy', agentType: 'pm-scorer', schema: SCORE_SCHEMA },
)
if (!score) throw new Error('pm-scorer returned nothing — check the journal; resume this run after fixing.')
log(`SCORE: ${score.final_score}/100 (${score.band}) · preset ${score.preset}`)

const strategy = await agent(`${COMMON} Write ${RUN}/06-digital-marketing-strategy.md from the scored audit (00, 04, 05${SEO_ON ? ', 07' : ''}${LOCAL ? ', 08' : ''}${MOD.ai_visibility ? ', 09' : ''}${MOD.compliance ? ', 10 — the policy matrix is a hard channel ceiling' : ''}). Objective: ${LOCAL ? 'leads/calls/bookings (§2.3 lens)' : A.business_type === 'leadgen_national' ? 'leads/MQL' : 'DTC e-commerce sales'}. ${MOD.strategy_depth === 'full' ? 'End with the handoff block — the strategy chain runs next.' : ''} Return the executive thesis + roadmap${MOD.strategy_depth === 'full' ? ' + handoff' : ''}.`,
  { label: 'dtc-strategist', phase: 'Score & strategy', agentType: 'dtc-strategist' })

if (MOD.strategy_depth === 'full') {
  log('strategy chain (full): offer ladder + funnel -> 06b, rollout -> 06c')
  const wedge = A.competitors.length >= 2
    ? await agent(`Synthesize the competitor teardowns in ${RUN}/data/competitor-*.json and ${RUN}/03-competitor-audit.md into the white-space wedge for ${A.brand} (${A.market}). Return the wedge + 3 scored positioning options as JSON — this feeds the offer/funnel doc; do not write files.`,
      { label: 'market-wedge-finder', phase: 'Score & strategy', agentType: 'market-wedge-finder' })
    : null
  const ladder = await agent(`Build the pricing/value ladder for ${A.brand} (${A.market}, ${A.vertical || A.business_type}) grounded in ${RUN}/00-executive-summary.md + 06-digital-marketing-strategy.md${wedge ? ' + this wedge: ' + JSON.stringify(wedge).slice(0, 4000) : ''}. Return the ladder as structured markdown — funnel-architect writes the file.`,
    { label: 'offer-ladder-builder', phase: 'Score & strategy', agentType: 'offer-ladder-builder' })
  await agent(`Design the funnel for ${A.brand} and write ${RUN}/06b-offer-and-funnel.md: the offer ladder below, then your funnel model + stage benchmarks + three-scenario math. Ground everything in ${RUN}/06-digital-marketing-strategy.md. Offer ladder input:\n${String(ladder || '(offer-ladder-builder returned nothing — note as data_gap and build the funnel from 06 alone)').slice(0, 12000)}`,
    { label: 'funnel-architect', phase: 'Score & strategy', agentType: 'funnel-architect' })
  await agent(`Write ${RUN}/06c-90day-rollout.md: week-by-week 90-day rollout sequencing ${RUN}/06-digital-marketing-strategy.md + 06b-offer-and-funnel.md. Validate-before-build gates, KPI dashboard by funnel layer.`,
    { label: 'gtm-rollout-planner', phase: 'Score & strategy', agentType: 'gtm-rollout-planner' })
}

// ---------- Phase 8 — Finalise ----------
phase('Finalise')
// Deck is a STANDARD deliverable (presets.json modules.deck default true) — build unless the caller passed deck:false.
if (MOD.deck) await agent(`Build ${RUN}/audit-deck.html — the client-facing visual deck. Copy audit-deck-template.html verbatim, then replace every {{...}} token with real values from ${RUN}/00-executive-summary.md (+ ${RUN}/06-digital-marketing-strategy.md for the 90-day slide). KEEP all 11 tabs/panels — Title · TL;DR · Scorecard · Competitive · Strengths · Gaps · Actions 1–3 · Actions 4–5 · Method · 90-Day · Appendix — never delete a panel (the Method-honesty slide is mandatory). The active preset is ${A.preset}, which scores ${SEO_ON ? (LOCAL ? '12' : '11') : '10'} categories: DELETE the scorecard rows AND their radar data-short entries for any category this preset does not weight, so the bars and 12-axis radar render with no empty spokes. Re-tint via --accent/--accent2/--accent-soft only — never touch band colours or thresholds. Keep data_tier ${A.data_tier}, the public-only disclaimer, and the preset-${A.preset} non-comparability note. Invent nothing — an honest data_gap beats a fabricated value; estimates keep their (est.) label. Unresolved tokens are a bug: before returning, grep the finished file for "{{" (must be zero) and confirm all 11 <section class="panel"> blocks are present.`,
  { label: 'deck-builder', phase: 'Finalise', effort: 'low' })

const CHECK_SCHEMA = { type: 'object', required: ['ok', 'missing', 'warnings'], properties: { ok: { type: 'boolean' }, missing: { type: 'array' }, warnings: { type: 'array' } }, additionalProperties: true }
const expected = ['run-config.json', '00-executive-summary.md', '01-brand-audit.md', '02-social-audit.md', '03-competitor-audit.md', '04-content-comparison.md', '05-ads-teardown.md', '06-digital-marketing-strategy.md']
if (SEO_ON) expected.push('07-seo-audit.md')
if (SEO_ON && MOD.seo_depth === 'hobo') expected.push('07b-hobo-deep-seo.md')
if (LOCAL) expected.push('08-local-seo-audit.md')
if (MOD.ai_visibility) expected.push('09-ai-visibility.md')
if (MOD.compliance && brand.compliance) expected.push('10-compliance.md')
if (MOD.mode === 'reaudit') expected.push('00b-delta-report.md')
if (MOD.strategy_depth === 'full') expected.push('06b-offer-and-funnel.md', '06c-90day-rollout.md')
if (MOD.deck) expected.push('audit-deck.html')

const check = await agent(
  `Manifest + quality-gate check for ${RUN}/ (SOP §5/§6). 1) Verify each of these files exists and is non-trivial (>500 bytes): ${JSON.stringify(expected)} — list absences in missing[]. 2) In 00-executive-summary.md check: the preset name "${A.preset}" is printed beside the score; a "Data gaps" section exists; the scorecard TOTAL weight is 100; data_tier ${A.data_tier} is stated. 3) Spot-check one report for unresolved "{{" tokens. ${MOD.deck ? `4) In audit-deck.html: confirm 11 tab buttons AND 11 <section class="panel"> blocks are present (all tabs) and there are ZERO unresolved "{{" tokens — a missing panel or leftover token is a missing[] entry ("audit-deck.html incomplete: …"), not a soft warning.` : ''} Put soft issues in warnings[]. Return { ok, missing, warnings }.`,
  { label: 'manifest-check', phase: 'Finalise', schema: CHECK_SCHEMA, effort: 'low' },
)
const gaps = [brand, ...socials, ...ads, seo, localSeo, ...competitors, comparison].filter(Boolean).reduce((n, r) => n + ((r.data_gaps && r.data_gaps.length) || 0), 0)
log(`FINAL: ${A.brand} ${score.final_score}/100 (${score.band}, preset ${score.preset}) · verifier confidence ${verify.overall_confidence_0_100} · ${gaps} data_gaps · manifest ${check && check.ok ? 'OK' : `INCOMPLETE: ${JSON.stringify(check && check.missing)}`}`)

return {
  brand: A.brand, run_folder: RUN, preset: score.preset, score: score.final_score, band: score.band,
  verifier_confidence: verify.overall_confidence_0_100, data_gap_count: gaps,
  force_footnoted: verify.must_fix_before_scoring.length,
  manifest: check, strategy_thesis: typeof strategy === 'string' ? strategy.slice(0, 600) : null,
}
