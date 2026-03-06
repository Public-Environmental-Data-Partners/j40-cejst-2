import React from 'react';
import {Source, Layer} from 'react-map-gl';
import {MapGeoJSONFeature} from 'maplibre-gl';

// Contexts:
import {useFlags} from '../../contexts/FlagContext';

import * as constants from '../../data/constants';
import * as COMMON_COPY from '../../data/copy/common';
// Type definition for indicator selections (used for color-based approach)
import {LayerFilters} from '../LayerFilter';
import type {MapRegion} from '../../utils/mapRegion';
import {getThresholdPropertyName} from '../../utils/indicatorRegion';

interface IMapTractLayers {
    selectedFeatures: MapGeoJSONFeature[] | undefined,
    // Optional indicator selections for color-based approach
    // When provided, determines which tracts to color based on selected indicators
    indicatorFilters?: LayerFilters;
    /** When view is over Island Areas, workforce indicators use IA_* tile properties. */
    mapRegion?: MapRegion;
}

/**
 * This function will determine the URL for the map tiles. It will read in a string that will designate either
 * high or low tiles. It will allow to overide the URL to the pipeline staging tile URL via feature flag.
 * Lastly, it allows to set the tiles to be local or via the CDN as well.
 *
 * @param {string} tilesetName
 * @return {string}
 */
export const featureURLForTilesetName = (tilesetName: string): string => {
  const flags = useFlags();

  const pipelineStagingBaseURL = process.env.GATSBY_CDN_TILES_BASE_URL +`/data-pipeline-staging`;
  const XYZ_SUFFIX = '{z}/{x}/{y}.pbf';

  if ('stage_hash' in flags) {
    // Check if the stage_hash is valid
    const regex = /^[0-9]{4}\/[a-f0-9]{40}$/;
    if (!regex.test(flags['stage_hash'])) {
      console.error(COMMON_COPY.CONSOLE_ERROR.STAGE_URL);
    }

    return `${pipelineStagingBaseURL}/${flags['stage_hash']}/data/score/tiles/${tilesetName}/${XYZ_SUFFIX}`;
  } else {
    // The feature tile base URL and path can either point locally or the CDN.
    // This is selected based on the DATA_SOURCE env variable.
    const featureTileBaseURL = constants.TILE_BASE_URL;
    const featureTilePath = constants.TILE_PATH;

    return [
      featureTileBaseURL,
      featureTilePath,
      process.env.GATSBY_MAP_TILES_PATH,
      tilesetName,
      XYZ_SUFFIX,
    ].join('/');
  }
};

/**
 * This component will return the appropriate source and layers for the census layer on the
 * map.
 *
 * There are two use cases here, eg, when the MapBox token is or isn't provided. When the token
 * is not provided, the open-source map will be rendered. When the open-source map is rendered
 * only the interactive layers are returned from this component. The reason being is that the
 * other layers are supplied by he getOSBaseMap function.
 *
 * @param {MapGeoJSONFeature[] | undefined} selectedFeatures - Array of currently selected map features
 * @return {JSX.Element} React component containing map sources and layers
 */
const MapTractLayers = ({
  selectedFeatures,
  indicatorFilters,
  mapRegion = 'nation',
}: IMapTractLayers) => {
  // Build filter for selected features (used for highlighting selected tracts)
  const selectedFeatureIds = selectedFeatures ? (selectedFeatures.map((feat) => feat.id)) : [''];
  const filter = ['in', constants.GEOID_PROPERTY, ...selectedFeatureIds];

  /**
   * Determines whether grandfathered tracts should be shown.
   * Grandfathered tracts are only shown when:
   * - "Identified as disadvantaged" is checked AND
   * - No individual indicator checkboxes are checked
   *
   * @param {LayerFilters | undefined} filters - The current layer filters
   * @return {boolean} True if grandfathered tracts should be shown
   */
  const shouldShowGrandfathered = (filters?: LayerFilters): boolean => {
    if (!filters) return true; // Default state - show grandfathered
    if (!filters.identifiedAsDisadvantaged) return false; // Hide if "Identified as disadvantaged" is unchecked
    return Object.keys(filters.indicators).length === 0; // Show only if no individual indicators checked
  };

  /**
   * COLOR-BASED APPROACH:
   *
   * This component uses a "color-based" approach for indicator filtering, which means:
   * - Tracts that match selected indicators are colored (visible with fill color)
   * - Tracts that don't match are made transparent (still rendered but invisible)
   * - This differs from a "filter-based" approach which would hide/show entire tracts
   *
   * Benefits:
   * - All tracts remain in the DOM, allowing for smooth transitions
   * - Users can see the full map context while filtering
   * - Better performance than adding/removing features dynamically
   * - Simpler state management (no need to track which tracts to show/hide)
   *
   * Implementation:
   * - Uses MapLibre GL conditional paint expressions (case statements)
   * - Matching tracts: use normal fill color (PRIORITIZED_FEATURE_FILL_COLOR)
   * - Non-matching tracts: use transparent color (rgba(0, 0, 0, 0))
   * - Condition is built from selected indicators using getThresholdPropertyName (region-aware)
   */

  /**
   * Builds a MapLibre GL expression that checks if a tract matches at least one of the selected indicators.
   * Returns null if "Identified as disadvantaged" is checked (meaning color all tracts).
   * For Island Areas view, workforce indicators use territory-specific tile properties (IA_*, IALHE).
   *
   * @param {LayerFilters | undefined} layerFilters - LayerFilters object with selected indicators
   * @param {MapRegion} region - Current map region (affects which tile properties are used)
   * @return {any[] | null} MapLibre GL expression or null (null = color all tracts)
   */
  const buildIndicatorColorCondition = (
      layerFilters?: LayerFilters,
      region: MapRegion = 'nation',
  ): any[] | null => {
    // If no filters provided, return null (color all tracts - default behavior)
    if (!layerFilters) {
      return null;
    }

    // If "Identified as disadvantaged" is checked, return null (color all tracts)
    if (layerFilters.identifiedAsDisadvantaged) {
      return null;
    }

    // Get all checked indicators
    const checkedIndicators = Object.keys(layerFilters.indicators).filter(
        (key) => layerFilters.indicators[key] === true,
    );

    // If no indicators are checked, return always-false expression (color nothing)
    if (checkedIndicators.length === 0) {
      return ['==', 1, 0]; // Always false
    }

    // Build condition expressions for checked indicators (region-aware via getThresholdPropertyName)
    const indicatorConditions: any[] = checkedIndicators
        .map((indicatorId) => getThresholdPropertyName(indicatorId, region))
        .filter((prop): prop is string => Boolean(prop))
        .map((propName) => ['==', ['get', propName], true]);

    // If no valid conditions, return always-false
    if (indicatorConditions.length === 0) {
      return ['==', 1, 0]; // Always false
    }

    // Return 'any' expression: true if tract matches at least one selected indicator
    return ['any', ...indicatorConditions];
  };

  // Build the color condition expression (region-aware for Island Areas workforce)
  const colorCondition = buildIndicatorColorCondition(indicatorFilters, mapRegion);

  /**
   * Builds a MapLibre GL paint color expression that conditionally colors tracts.
   * - If condition is null: use default color (color all tracts)
   * - If condition is always-false: use transparent (color nothing)
   * - If condition exists: use case expression to color matching tracts
   *
   * @param {any[] | null} condition - The color condition from buildIndicatorColorCondition
   * @param {string} defaultColor - The default color to use (e.g., PRIORITIZED_FEATURE_FILL_COLOR)
   * @return {any} Color value or conditional expression (MapLibre GL Expression type)
   */
  const buildColorExpression = (
      condition: any[] | null,
      defaultColor: string,
  ): any => {
    // If condition is null, color all tracts (default behavior)
    if (condition === null) {
      return defaultColor;
    }

    // Check if condition is always-false (no indicators selected)
    const isAlwaysFalse = condition &&
      Array.isArray(condition) &&
      condition.length === 3 &&
      condition[0] === '==' &&
      condition[1] === 1 &&
      condition[2] === 0;

    // If always-false, return transparent (no color)
    if (isAlwaysFalse) {
      return 'rgba(0, 0, 0, 0)'; // Fully transparent
    }

    // Otherwise, use case expression: color if condition is true, transparent if false
    return [
      'case',
      condition, // If tract matches selected indicators
      defaultColor, // Use the normal color
      'rgba(0, 0, 0, 0)', // Otherwise, transparent (uncolored)
    ];
  };

  // Build color expression for high zoom prioritized layer (testing only)
  const highZoomPrioritizedColor = buildColorExpression(
      colorCondition,
      constants.PRIORITIZED_FEATURE_FILL_COLOR,
  );

  return (
    <>
      <Source
        id={constants.LOW_ZOOM_SOURCE_NAME}
        type="vector"
        promoteId={constants.GEOID_PROPERTY}
        tiles={[featureURLForTilesetName('low')]}
        maxzoom={constants.GLOBAL_MAX_ZOOM_LOW}
        minzoom={constants.GLOBAL_MIN_ZOOM_LOW}
      >

        {/* Low zoom layer (static) - prioritized features only */}
        <Layer
          id={constants.LOW_ZOOM_LAYER_ID}
          source-layer={constants.SCORE_SOURCE_LAYER}
          filter={['>', constants.SCORE_PROPERTY_LOW, constants.SCORE_BOUNDARY_THRESHOLD]}
          type='fill'
          paint={{
            'fill-color': constants.PRIORITIZED_FEATURE_FILL_COLOR,
            'fill-opacity': constants.LOW_ZOOM_PRIORITIZED_FEATURE_FILL_OPACITY}}
          maxzoom={constants.GLOBAL_MAX_ZOOM_LOW}
          minzoom={constants.GLOBAL_MIN_ZOOM_LOW}
        />
      </Source>

      {/* The high zoom source */}
      <Source
        id={constants.HIGH_ZOOM_SOURCE_NAME}
        type="vector"
        promoteId={constants.GEOID_PROPERTY}
        tiles={[featureURLForTilesetName('high')]}
        maxzoom={constants.GLOBAL_MAX_ZOOM_HIGH}
        minzoom={constants.GLOBAL_MIN_ZOOM_HIGH}
      >

        {/* High zoom layer (static) - non-prioritized features only */}
        <Layer
          id={constants.HIGH_ZOOM_LAYER_ID}
          source-layer={constants.SCORE_SOURCE_LAYER}
          filter={['==', constants.SCORE_PROPERTY_HIGH, false]}
          type='fill'
          paint={{
            'fill-opacity': constants.NON_PRIORITIZED_FEATURE_FILL_OPACITY,
          }}
          minzoom={constants.GLOBAL_MIN_ZOOM_HIGH}
        />

        {/* High zoom layer (static) - prioritized features only */}
        <Layer
          id={constants.PRIORITIZED_HIGH_ZOOM_LAYER_ID}
          source-layer={constants.SCORE_SOURCE_LAYER}
          filter={['==', constants.SCORE_PROPERTY_HIGH, true]}
          type='fill'
          paint={{
            'fill-color': highZoomPrioritizedColor, // Conditional color based on indicator selections
            'fill-opacity': constants.HIGH_ZOOM_PRIORITIZED_FEATURE_FILL_OPACITY,
          }}
          minzoom={constants.GLOBAL_MIN_ZOOM_HIGH}
        />

        {/* High zoom layer (static) - grandfathered features only */}
        {shouldShowGrandfathered(indicatorFilters) && (
          <Layer
            id={constants.GRANDFATHERED_HIGH_ZOOM_LAYER_ID}
            source-layer={constants.SCORE_SOURCE_LAYER}
            filter={['==', constants.IS_GRANDFATHERED, true]}
            type='fill'
            paint={{
              'fill-color': constants.GRANDFATHERED_FEATURE_FILL_COLOR,
              'fill-opacity': constants.HIGH_ZOOM_PRIORITIZED_FEATURE_FILL_OPACITY,
            }}
            minzoom={constants.GLOBAL_MIN_ZOOM_HIGH}
          />
        )}

        {/* High zoom layer (static) - controls the border between features */}
        <Layer
          id={constants.FEATURE_BORDER_LAYER_ID}
          source-layer={constants.SCORE_SOURCE_LAYER}
          type='line'
          paint={{
            'line-color': constants.FEATURE_BORDER_COLOR,
            'line-width': constants.FEATURE_BORDER_WIDTH,
            'line-opacity': constants.FEATURE_BORDER_OPACITY,
          }}
          maxzoom={constants.GLOBAL_MAX_ZOOM_FEATURE_BORDER}
          minzoom={constants.GLOBAL_MIN_ZOOM_FEATURE_BORDER}
        />

        {/* High zoom layer (dynamic) - border styling around the selected feature */}
        <Layer
          id={constants.SELECTED_FEATURE_BORDER_LAYER_ID}
          source-layer={constants.SCORE_SOURCE_LAYER}
          filter={filter} // This filter filters out all other features except the selected feature.
          type='line'
          paint={{
            'line-color': constants.SELECTED_FEATURE_BORDER_COLOR,
            'line-width': constants.SELECTED_FEATURE_BORDER_WIDTH,
          }}
          minzoom={constants.GLOBAL_MIN_ZOOM_HIGH}
        />
      </Source>
    </>
  );
};

export default MapTractLayers;
