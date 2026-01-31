/**
 * Tract counts for the disadvantaged-tract counter ("X of Y").
 *
 * Step 1: Constants and per-burden counts (number of disadvantaged tracts per indicator).
 * Step 2: Pure function to compute X from LayerFilter state.
 *
 * When the Layer Filter is in default state (Identified as disadvantaged, no burdens selected),
 * X = DEFAULT_DISADVANTAGED_COUNT. When one or more burdens are selected, X is the sum of
 * the per-burden counts for each selected indicator.
 */

/** Total number of census tracts (Y in "X of Y"). Fixed for the application session. */
export const TOTAL_TRACT_COUNT = 74_134;

/** Number of disadvantaged tracts when no specific burdens are selected (default filter state). */
export const DEFAULT_DISADVANTAGED_COUNT = 28_569;

/**
 * Number of disadvantaged tracts per indicator (per-burden counts).
 * Keys match LayerFilter indicator IDs (registry id or tribalLands).
 * When multiple burdens are selected, their counts are summed to produce X.
 */
export const INDICATOR_TRACT_COUNTS: Record<string, number> = {
  // Shared / top-level
  lowInc: 25_987,
  // Climate
  expAgLoss: 204,
  expBldLoss: 233,
  expPopLoss: 249,
  flooding: 349,
  wildfire: 373,
  // Energy
  energyCost: 166,
  pm25: 549,
  // Health
  asthma: 130,
  diabetes: 109,
  heartDisease: 259,
  lifeExpect: 232,
  // Housing
  historicUnderinvest: 215,
  houseCost: 309,
  lackGreenSpace: 538,
  lackPlumbing: 386,
  leadPaint: 484,
  // Legacy pollution
  abandonMines: 41,
  formerDefSites: 92,
  proxHaz: 626,
  proxRMP: 388,
  proxNPL: 454,
  // Transportation
  dieselPartMatter: 658,
  barrierTransport: 392,
  trafficVolume: 498,
  // Water and wastewater
  leakyTanks: 547,
  wasteWater: 318,
  // Workforce development
  lingIso: 1_519,
  lowMedInc: 117,
  poverty: 249,
  unemploy: 580,
  highSchool: 597,
  // Not in registry; LayerFilter exposes as checkbox
  tribalLands: 320,
};

/**
 * Filter state shape used by LayerFilter (identifiedAsDisadvantaged + indicators).
 * Structurally compatible with LayerFilters from the component.
 */
export interface TractCountFilterState {
  identifiedAsDisadvantaged: boolean;
  indicators: Record<string, boolean>;
}

/**
 * Computes the selected tract count (X) for the "X of Y" counter from current filter state.
 *
 * - Default state (Identified as disadvantaged checked, no indicators selected): returns DEFAULT_DISADVANTAGED_COUNT.
 * - Otherwise: returns the sum of INDICATOR_TRACT_COUNTS for each indicator that is selected.
 *   Unknown or missing indicator IDs are skipped (count 0).
 *
 * @param {TractCountFilterState} filterState - Current LayerFilter state (or equivalent shape)
 * @return {number} The number X to display (selected / matching tracts)
 */
export function getSelectedTractCount(filterState: TractCountFilterState): number {
  const {identifiedAsDisadvantaged, indicators} = filterState;

  const hasAnyIndicator = Object.keys(indicators).some((id) => indicators[id] === true);

  if (identifiedAsDisadvantaged && !hasAnyIndicator) {
    return DEFAULT_DISADVANTAGED_COUNT;
  }

  let sum = 0;
  for (const id of Object.keys(indicators)) {
    if (indicators[id] && id in INDICATOR_TRACT_COUNTS) {
      sum += INDICATOR_TRACT_COUNTS[id];
    }
  }
  return sum;
}
