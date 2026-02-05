# LayerFilter Design and Solution

This document summarizes the LayerFilter feature and related changes on this branch. It is aimed at developers who need to understand what was built and where non-obvious behavior lives.

## Context

The **LayerFilter** is the “Layers” control on the map that lets users choose how tracts are highlighted: either by the default **Identified as disadvantaged** view or by selecting specific burden indicators or categories. Its state drives:

- Which tract layers are colored on the map (`MapTractLayers` + `indicatorFilters`)
- The **tract count** summary (e.g. “X of Y tracts”)
- The **AreaDetail** side panel when a tract is selected (full view vs. custom indicator view)

State flows from LayerFilter → J40Map (`layerFilters`) → MapInfoPanel, MapTractLayers, TractCountSummary, and AreaDetail. LayerFilter itself is stateless for persistence; the parent holds `layerFilters` and passes it down.

---

## 1. Indicator registry

A shared **indicator registry** was introduced so LayerFilter, AreaDetail, and MapTractLayers all use the same indicator IDs and backend property names. Previously each had its own mappings, which led to drift and bugs (e.g. map coloring for some indicators).

- **Location:** `client/src/data/indicators/registry.ts` defines all indicators with canonical id, `thresholdPropertyName`, `percentilePropertyName`, i18n key, and **category** (e.g. `climate`, `health`).
- **LayerFilter:** Uses `buildCategoriesFromRegistry()` and the registry’s i18n keys for checkbox labels. Category and indicator ids in filter state match the registry.
- **Details:** See `client/src/data/indicators/REGISTRY_DOCUMENTATION.md` for why the registry exists, which files use it, and how migrations were done.

---

## 2. TractCountSummary

The **TractCountSummary** component shows a line like “X of Y” tracts (e.g. “1,234 of 74,134”) so users know how many tracts match the current filter.

- **Location:** `client/src/components/TractCountSummary/`. Rendered in J40Map above the map.
- **Connection to LayerFilter:** J40Map passes `selectedCount={getSelectedTractCount(layerFilters)}` and `totalCount={TOTAL_TRACT_COUNT}`. The count is derived from the current `layerFilters` (identified-as-disadvantaged vs. selected indicators).
- **Logic:** `client/src/data/indicators/tractCounts.ts` exports `getSelectedTractCount(filterState)`. It uses the same filter shape as LayerFilter (and precomputed tract counts per indicator) to compute how many tracts match. So the summary updates as soon as the user changes the layer filter.

---

## 3. Zoom-based messaging above the LayerFilter UI

At **low zoom** (below the threshold, e.g. zoom level &lt; 5), the map does not show per-indicator coloring; it shows a single “all disadvantaged” view. The LayerFilter UI reflects that with different copy and a disabled “Layers” button.

- **Location:** `LayerFilter.tsx` uses a `zoom` prop and constants (e.g. `GLOBAL_MIN_ZOOM`, `GLOBAL_MIN_ZOOM_HIGH`) to compute `zoomUiState` (1 | 2 | 3).
  - **State 1:** Low zoom + “Identified as disadvantaged” only → “zoom in to enable” and Layers button disabled.
  - **State 2:** High zoom → “select burdens” (prompt to pick indicators).
  - **State 3:** Low zoom + user has other indicators selected → “Zoom in to view selection.” and a second line (e.g. “Displaying all disadvantaged tracts.”).
- **Copy:** All zoom-related strings live in `client/src/data/copy/layerFilter.tsx` (e.g. `ZOOM_IN_TO_ENABLE`, `SELECT_BURDENS`, `ZOOM_IN_TO_VIEW_SELECTION`, `DISPLAYING_ALL_DISADVANTAGED_TRACT`). The banner above the Layers button and the optional line below it are driven by `messageAbove` and the `zoomUiState === 3` block in `LayerFilter.tsx`.

---

## 4. AreaDetail custom view and category ID mapping

When the user selects one or more burden indicators (instead of “Identified as disadvantaged” only), **AreaDetail** switches to a **custom view**: it shows only the selected indicators, grouped by category, and replaces the usual “Identified as disadvantaged?” block with a single line: “This tract is above the threshold for **X** of the **Y** selected burden(s).”

### 4.1 How custom view is determined

AreaDetail receives optional `layerFilters` (from J40Map via MapInfoPanel). It treats “ID as disadv only” as: `identifiedAsDisadvantaged === true` and no indicator checkboxes selected. Any other state is **custom view** (filtered categories/indicators + X-of-Y summary).

### 4.2 Category ID mapping

LayerFilter and the registry use **registry category ids** (e.g. `climate`, `energy`, `health`). AreaDetail’s internal category list uses **different ids** (e.g. `climate-change`, `clean-energy`, `health-burdens`). The registry did not change AreaDetail’s category list; it only unified **indicator** ids and gave each indicator a `category` field in registry terms.

So when filtering AreaDetail’s categories by “which registry categories have a selected indicator?”, we need a **mapping** from AreaDetail category id → registry category id.

- **Location:** `AreaDetail.tsx` defines `AREA_DETAIL_TO_REGISTRY_CATEGORY` (e.g. `"climate-change"` → `"climate"`, `"work-dev"` → `"workforce"`). The custom-view filter uses this to keep only AreaDetail categories whose registry category is in the set of selected registry categories, then filters each category’s indicators to the selected burden set.

### 4.3 Accordion key so categories open in custom view

In custom view, all shown category accordions should start **open**. The trussworks Accordion keeps internal expansion state; when the items array reference changes (e.g. user selects another category), it merges with that state and new item ids can render closed.

- **Location:** In `AreaDetail.tsx`, the Accordion is given `key={useCustomIndicatorView ? "custom-indicators" : "all-indicators"}`. When switching into or out of custom view, the key changes and the Accordion remounts, so it initializes with the correct `expanded` values (all true in custom view) instead of reusing previous state.

---

## Related docs

- **Indicator registry:** `client/src/data/indicators/REGISTRY_DOCUMENTATION.md`
- **LayerFilter state and tests:** `STATE_DIAGRAM.md`, `TEST_PLAN.md` in this directory
