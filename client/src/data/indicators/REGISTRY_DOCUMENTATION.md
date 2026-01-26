# Indicator Registry Documentation

## Why We Created the Registry

The registry was created to solve the problem of inconsistent indicator identity across components. Previously, `AreaDetail`, `LayerFilter`, and `MapTractLayers` each maintained their own mappings between indicator names and backend properties, leading to redundancy and potential mismatches. The registry provides a single source of truth for all indicator metadata (IDs, backend property names, i18n keys, categories) using canonical IDs based on `AreaDetail` variable names. This eliminates redundant mappings, ensures consistency across components, and makes it easier to add or modify indicators in the future.

## Files Affected

**Created:**
- `client/src/data/indicators/registry.ts` - The central registry containing all 28 indicator definitions

**Modified:**
- `client/src/components/LayerFilter/LayerFilter.tsx` - Migrated to use registry for categories and indicator labels
- `client/src/components/AreaDetail/AreaDetail.tsx` - Migrated all 28 indicators to use registry for backend properties and i18n keys
- `client/src/components/MapTractLayers/MapTractLayers.tsx` - Builds a map from the registry

## Changes in Each File

**registry.ts (Created):** Defines `IndicatorDefinition` interface with canonical ID, threshold/percentile property names, i18n key, and category. Contains all 28 indicators organized by category. Exports helper functions `getIndicatorById()` and `getIndicatorsByCategory()` for component usage.

**LayerFilter.tsx:** Created a `buildCategoriesFromRegistry()` function that generates categories from registry using canonical IDs. Updated `getIndicatorLabelMessage()` to retrieve i18n keys directly from registry. Changed "Low Income" checkbox to use canonical ID `lowInc` for consistency.

**AreaDetail.tsx:** Migrated all 28 indicator definitions to use `getIndicatorById()` from registry. Each indicator now uses registry's `i18nKey` for labels, `thresholdPropertyName` and `percentilePropertyName` for backend properties. Added `id` field to all indicators using canonical IDs. Preserved special logic for boolean indicators and territory-specific workforce indicators.

**MapTractLayers.tsx:** Created `buildIndicatorPropertyMap()` function that dynamically generates the map from registry. Map keys now use canonical IDs (matching LayerFilter state) and values use `thresholdPropertyName` from registry. This fixed broken map coloring for indicators like `energyCost`, `lackPlumbing`, and `proxRMP`.

## Testing Done

**Registry Creation (Phase 1):** Verified app runs normally with registry present but unused. Confirmed no TypeScript errors, all 28 indicators populated correctly, boolean indicators have `percentilePropertyName: null`, and shared/workforce socioeconomic indicators included.

**LayerFilter Migration (Phase 2):** Tested that all categories and indicators display correctly in UI. Verified indicator labels show translated text (not raw IDs). Confirmed checkboxes work and state uses canonical IDs. Validated map coloring works for all indicators including previously broken ones (`energyCost`, `lackPlumbing`, `proxRMP`). Tested state retention when closing/reopening LayerFilter.

**AreaDetail Migration (Phase 3):** Tested each category incrementally (Climate → Energy → Health → Housing → Pollution → Transportation → Water → Workforce). Verified each indicator displays correctly with correct percentile values, threshold flags, labels, and descriptions. Confirmed boolean indicators work correctly. Validated territory-specific workforce indicators function properly. No console errors observed.

**MapTractLayers Migration (Phase 4):** Tested map coloring for all indicators. Verified tracts color correctly based on LayerFilter selections. Confirmed previously broken indicators now work. Validated no regressions in map behavior. All indicators tested and working correctly.
