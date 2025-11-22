# Frontend Side Panel Data Flow and Rendering

## Overview

The side panel displays detailed information about selected census tracts. All data comes directly from vector tiles - no API calls are needed when a user clicks on a tract.

## Data Source

**Vector Tiles**: All tract data is embedded in the map tiles as feature properties. When a user clicks on a tract, MapLibre GL extracts the feature and its properties from the already-loaded tile.

## Data Flow

```
User clicks on tract
    ↓
MapLibre GL onClick event
    ↓
event.features[0].properties (contains all tract data)
    ↓
selectFeaturesOnMap() extracts properties
    ↓
Stored in state: detailViewData.properties
    ↓
Passed to MapInfoPanel component
    ↓
Passed to AreaDetail component
    ↓
AreaDetail reads properties and renders UI
```

## Key Components

### 1. **J40Map.tsx** - Click Handler

```typescript
const onClick = (event: MapEvent) => {
  const feature = event.features[0];  // Get clicked feature from tile
  if (feature && feature.properties) {
    selectFeaturesOnMap(feature);
  }
};
```

The `feature.properties` object contains all the data for that tract, including:
- Geographic info (GEOID, county, state, population)
- Score data (SN_C, percentiles, thresholds)
- Indicator values (PM2.5, asthma, energy burden, etc.)
- Demographic data (race/ethnicity breakdowns)
- Tribal information (if applicable)

### 2. **MapInfoPanel.tsx** - Router Component

```typescript
{featureProperties ?
  <AreaDetail properties={featureProperties} /> :
  <SidePanelInfo />
}
```

Conditionally renders:
- **AreaDetail**: When a tract is selected (shows detailed info)
- **SidePanelInfo**: When no tract is selected (shows default info)

### 3. **AreaDetail.tsx** - Main Side Panel Component

This component:
1. **Extracts basic info** from properties:
   ```typescript
   const blockGroup = properties[constants.GEOID_PROPERTY];
   const population = properties[constants.TOTAL_POPULATION];
   const countyName = properties[constants.COUNTY_NAME];
   const stateName = properties[constants.STATE_NAME];
   ```

2. **Creates indicator objects** for each category:
   ```typescript
   const expAgLoss: indicatorInfo = {
     label: "Expected Agriculture Loss",
     type: "percentile",
     value: properties[constants.EXP_AGRICULTURE_LOSS_PERCENTILE],
     isDisadvagtaged: properties[constants.IS_EXCEEDS_THRESH_FOR_EXP_AGR_LOSS],
   };
   ```

3. **Groups indicators by category**:
   - Climate (agriculture loss, building loss, population loss, flood, wildfire)
   - Energy (energy burden, PM2.5)
   - Transportation (diesel, traffic, travel burden)
   - Housing (housing burden, lead paint, kitchen/plumbing, impervious surface)
   - Pollution (abandoned mines, FUDS, hazardous waste, RMP, Superfund)
   - Water (leaky underground tanks, wastewater)
   - Health (asthma, diabetes, heart disease, life expectancy)
   - Workforce (unemployment, poverty, low income, education)

4. **Renders UI sections**:
   - **TractInfo**: GEOID, county, state, population
   - **TractDemographics**: Race/ethnicity breakdowns
   - **TractPrioritization**: Whether tract is disadvantaged (YES/NO/PARTIALLY)
   - **Categories**: Accordion sections with indicators
   - **DonutCopy**: Special messaging for "donut hole" tracts

## Property Access Pattern

The component uses a consistent pattern to safely read properties:

```typescript
value: properties.hasOwnProperty(constants.SOME_PROPERTY) ?
  properties[constants.SOME_PROPERTY] :
  null
```

This handles:
- Missing data (property not in tile)
- Null/undefined values
- Type safety

## Indicator Types

The side panel displays three types of indicators:

1. **Percentile** (most common):
   - Value range: 0-1 (displayed as percentage)
   - Example: PM2.5 percentile, asthma percentile

2. **Percent**:
   - Already formatted as percentage
   - Example: High school education rate

3. **Boolean**:
   - YES/NO values
   - Examples: Abandoned mines, FUDS, historic redlining

## Special Handling

### Territory-Specific Data

Island areas use different property names:
- States: `UNEMPLOYMENT_PERCENTILE`
- Island Areas: `ISLAND_AREAS_UNEMPLOYMENT_LOW_HS_EDU_PERCENTILE_FIELD`

The component checks `SIDE_PANEL_STATE` to determine which properties to use.

### Disadvantaged Flags

Each indicator has an `isDisadvagtaged` boolean that comes from properties like:
- `IS_EXCEEDS_THRESH_FOR_PM25`
- `IS_EXCEEDS_THRESH_FOR_ASTHMA`
- `IS_EXCEEDS_THRESH_FOR_ENERGY_BURDEN`

These flags determine visual styling (red highlighting) in the UI.

## Rendering Details

### Accordion UI

Categories are rendered as collapsible accordion sections using `@trussworks/react-uswds` Accordion component.

### Indicator Cards

Each indicator displays:
- **Label**: Human-readable name
- **Description**: Tooltip/help text
- **Value**: Formatted based on type (percentile, percent, or boolean)
- **Visual Indicator**: Color coding if threshold exceeded
- **Threshold Badge**: Shows if tract exceeds threshold

### Conditional Rendering

- Tribal information only shows if `TRIBAL_AREAS_PERCENTAGE > 0`
- Donut copy only shows for "donut hole" tracts
- Some indicators may be null/missing for certain territories

## Performance Characteristics

- **No Network Calls**: All data is already in the browser (from loaded tiles)
- **Instant Display**: Clicking a tract immediately shows data (no loading state)
- **Client-Side Only**: All processing happens in the browser
- **Efficient**: Only the clicked tract's data is extracted from the tile

## Summary

The side panel is a **client-side, tile-based** component that:
1. Extracts data from vector tile features when tracts are clicked
2. Reads properties directly from the tile (no API calls)
3. Transforms properties into UI components (indicators, categories, demographics)
4. Renders using React components with conditional logic for different data types and territories

All data flows from: **Tile → Click Event → State → Props → Component → UI**

