# Territory indicator testing checklist

Use this checklist when changing territory-related indicator logic (registry, mapRegion, indicatorRegion, MapTractLayers, AreaDetail, LayerFilter) to confirm behavior is unchanged.

## Nation

- [ ] Workforce indicators use Nation threshold properties; side panel shows correct isDisadv and values.
- [ ] X-of-Y selected burdens summary is correct when workforce (or other) indicators are selected.
- [ ] Map shading: tracts that exceed selected indicators are colored correctly.
- [ ] LayerFilter: all categories and indicators are enabled; Tribal lands checkbox is enabled.

## Puerto Rico

- [ ] Workforce indicators use same threshold properties as Nation (no IA_*); side panel matches.
- [ ] X-of-Y and map shading correct for selected indicators.
- [ ] LayerFilter: PR-disabled indicators (e.g. expAgLoss, lingIso) are greyed out and unchecked on entering PR view; other indicators remain available.
- [ ] Reset leaves disabled checkboxes disabled and unchecked.

## Island Areas (e.g. Guam)

- [ ] Workforce indicators use Island Areas threshold properties (IA_*, IALHE); side panel isDisadv and values correct for lowMedInc, unemploy, poverty, highSchool.
- [ ] X-of-Y selected burdens summary correct (e.g. "2 of 4" when tract exceeds unemploy and HS ed).
- [ ] Map shading: tracts in Island Areas that exceed selected workforce indicators are colored (not left transparent).
- [ ] LayerFilter: only Workforce category enabled; lingIso and non-workforce categories disabled and greyed out; Tribal lands disabled.
- [ ] Entering Island Areas view auto-unchecks any previously selected disabled indicators (and Tribal lands).
- [ ] Reset leaves disabled checkboxes disabled and unchecked.

## Edge cases

- [ ] Tract with missing or unknown `sidePanelState` (or no UI_EXP): treated as Nation (Nation threshold properties, no disabling).
- [ ] Zoom &lt; 5: LayerFilter disabled/low-zoom messaging; map region not applied for filter disabling (viewport may still be over a territory).

## After refactors

- [ ] Run the above for the changed code paths; add or adjust checks if new behavior is introduced.
