# Frontend Map Tiles and Layer Coloring

## Overview

The frontend uses vector tiles to display census tract data on an interactive map. The map switches between different tile sets and layer configurations based on zoom level, and uses both threshold comparisons and pre-computed boolean values to determine which tracts are displayed as "prioritized" (disadvantaged communities).

## How Tiles Are Used

### 1. **Tile Sources**

The frontend uses two separate vector tile sources:

- **Low Zoom Tiles**: Simplified tiles for country/state-level views
  - URL pattern: `{base_url}/data/score/tiles/low/{z}/{x}/{y}.pbf`
  - Zoom range: 0-7
  - Contains simplified score data

- **High Zoom Tiles**: Detailed tiles for tract-level views
  - URL pattern: `{base_url}/data/score/tiles/high/{z}/{x}/{y}.pbf`
  - Zoom range: 5-11
  - Contains full score data with all properties

### 2. **Zoom-Based Switching**

The map automatically switches between tile sources based on zoom level:

- **Zoom 0-7**: Uses low zoom tiles (simplified, country/state view)
- **Zoom 5-11**: Uses high zoom tiles (detailed, tract-level view)
- **Overlap zone (5-7)**: Both tile sets are available, but the appropriate one is used based on current zoom

### 3. **Tile Loading Mechanism**

- **Format**: Mapbox Vector Tiles (MVT) in Protocol Buffer (PBF) format
- **Loading**: React Map GL (MapLibre GL) automatically requests tiles as users pan and zoom
- **Caching**: Browser caches tiles for performance
- **Data**: Each tile contains score data as feature properties embedded in the vector geometry

## How the Map Is Colored with Layers

### Layer Structure (Bottom to Top)

The map uses a layered approach where each layer stacks on top of the previous one:

```
┌─────────────────────────────────────────┐
│ Base Map Layer (raster background)     │
├─────────────────────────────────────────┤
│ Low Zoom Layer (zoom 0-7)              │
│   - Prioritized tracts only            │
├─────────────────────────────────────────┤
│ High Zoom Layers (zoom 5+)             │
│   - Non-prioritized tracts (transparent)│
│   - Prioritized tracts (blue fill)     │
│   - Grandfathered tracts (purple fill)  │
│   - Feature borders (outlines)         │
│   - Selected feature border (highlight)│
├─────────────────────────────────────────┤
│ Tribal Layer (separate overlay)        │
├─────────────────────────────────────────┤
│ Labels Layer                            │
└─────────────────────────────────────────┘
```

### Coloring Logic

#### Prioritized Tracts (Disadvantaged Communities)

**Low Zoom:**
- **Filter**: Uses threshold comparison `SCORE > 0.6`
- **Color**: `#0050D8` (blue)
- **Opacity**: 0.6
- **Zoom Range**: 0-7

**High Zoom:**
- **Filter**: Uses boolean `SN_C == true`
- **Color**: `#0050D8` (blue)
- **Opacity**: 0.3
- **Zoom Range**: 5-11

#### Non-Prioritized Tracts

**High Zoom Only:**
- **Filter**: `SN_C == false`
- **Opacity**: 0 (invisible/transparent)
- **Zoom Range**: 5-11

#### Grandfathered Tracts

- **Filter**: `SN_GRAND == true`
- **Color**: `#8168B3` (purple)
- **Opacity**: 0.3
- **Zoom Range**: 5-11
- **Purpose**: Tracts that were prioritized in v1.0 but may not meet current criteria

#### Borders

- **Standard Borders**:
  - Color: `#4EA5CF` (light blue)
  - Width: 1px
  - Opacity: 0.5
  - Purpose: Visual separation between tracts

- **Selected Feature Border**:
  - Color: `#1A4480` (darker blue)
  - Width: Thicker than standard borders
  - Purpose: Highlights user-selected tract

### Threshold vs Boolean: The Key Difference

**Answer: Both are used, depending on zoom level.**

#### Low Zoom: Threshold Comparison

```typescript
// Low zoom layer filter
filter: ['>', 'SCORE', 0.6]
```

- Uses the raw numeric `SCORE` property
- Compares against `SCORE_BOUNDARY_THRESHOLD` (0.6)
- Simple threshold check: if score > 0.6, show as prioritized
- Used in simplified low zoom tiles (zoom 0-7)

#### High Zoom: Pre-Computed Boolean

```typescript
// High zoom layer filter
filter: ['==', 'SN_C', true]
```

- Uses the pre-computed boolean `SN_C` (shortened name for `FINAL_SCORE_N_BOOLEAN`)
- This boolean is calculated in the backend during score generation
- Includes complex logic beyond simple threshold:
  - Base DAC determination (Definition N criteria)
  - Adjacency index logic ("donut hole" tracts)
  - Special cases (tribal DACs, territory DACs)
- Used in detailed high zoom tiles (zoom 5-11)

#### Why Both Approaches?

1. **Low Zoom Tiles**: Simplified for performance, may only contain raw numeric score
2. **High Zoom Tiles**: Full-featured with pre-computed boolean that includes adjacency and special case logic
3. **Performance**: Boolean comparison is faster than numeric comparison at high zoom levels
4. **Accuracy**: High zoom boolean includes more sophisticated logic than simple threshold

### Filtering Mechanism

Each layer uses MapLibre GL filter expressions to determine which features to display:

**Basic Filter Example:**
```typescript
filter: ['>', 'SCORE', 0.6]  // Show if score > 0.6
```

**Combined Filter Example (with indicator filters):**
```typescript
filter: [
  'all',
  ['==', 'SN_C', true],      // Must be prioritized
  ['==', 'PM25_ET', true]    // AND must exceed PM2.5 threshold
]
```

**Filter Operators:**
- `'>'`: Greater than (numeric comparison)
- `'=='`: Equals (boolean or exact match)
- `'all'`: All conditions must be true (AND)
- `'any'`: Any condition can be true (OR)
- `'in'`: Value is in array (for selected features)

### Indicator Filters

Users can filter tracts by specific indicators:

- **PM2.5**: `PM25_ET == true`
- **Asthma**: `A_ET == true`
- **Energy Burden**: `EB_ET == true`

When indicator filters are applied:
- Filter expression combines with prioritization filter using `'all'` operator
- Only shows tracts that are both prioritized AND match selected indicators
- If all indicators are checked, filter is removed (default behavior)
- If no indicators are checked, shows nothing

### Dynamic Layer Updates

Layers automatically re-render when:

1. **Zoom Changes**: Switches between low/high zoom tile sources
2. **Feature Selection**: Adds highlight border to selected tract
3. **Indicator Filters**: Shows only tracts matching selected indicators
4. **Pan**: Loads new tiles as user navigates

## Technical Implementation

### React Map GL Components

The implementation uses React Map GL (wrapper around MapLibre GL):

```tsx
<Source
  id="low-zoom-source"
  type="vector"
  tiles={[featureURLForTilesetName('low')]}
  minzoom={0}
  maxzoom={7}
>
  <Layer
    id="low-zoom-layer"
    source-layer="blocks"
    filter={['>', 'SCORE', 0.6]}
    type="fill"
    paint={{
      'fill-color': '#0050D8',
      'fill-opacity': 0.6
    }}
  />
</Source>
```

### Component Structure

- **`<Source>`**: Defines tile URL pattern and source properties
- **`<Layer>`**: Defines visual styling and filtering
  - `filter`: Which features to show
  - `paint`: How to style them (color, opacity, borders)
  - `minzoom`/`maxzoom`: When layer is visible
  - `type`: Layer type (fill, line, circle, symbol)

### Tile Properties

Each tile contains feature properties that can be used in filters:

**Common Properties:**
- `GEOID10`: Census tract identifier
- `SCORE`: Numeric score value (low zoom)
- `SN_C`: Boolean prioritized status (high zoom)
- `SN_GRAND`: Boolean grandfathered status
- `PM25_ET`, `A_ET`, `EB_ET`: Boolean indicator thresholds
- `SF`: State name
- `CF`: County name
- `TPF`: Total population

## Tribal Layer

The tribal layer is a separate overlay with its own tile source:

- **Tile Source**: `{base_url}/data/tribal/tiles/{z}/{x}/{y}.pbf`
- **Styling**: Same color scheme as prioritized tracts
- **Special Features**:
  - Labels for tribal area names
  - Point features for Alaska (circles instead of polygons)
  - Different opacity settings

## Summary

The frontend map system uses a sophisticated layering approach that:

1. **Switches tile sources** based on zoom level for optimal performance
2. **Uses threshold comparison** at low zoom (simple numeric comparison)
3. **Uses pre-computed boolean** at high zoom (includes complex adjacency logic)
4. **Stacks multiple layers** to create the final visual representation
5. **Supports dynamic filtering** by indicators and user selection
6. **Optimizes performance** through tile caching and zoom-based simplification

The dual approach (threshold vs boolean) allows for both performance optimization at low zoom and accuracy at high zoom, where the full complexity of the scoring algorithm (including adjacency index) is needed.

