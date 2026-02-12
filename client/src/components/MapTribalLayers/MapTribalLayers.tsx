import React from 'react';
import {Source, Layer} from 'react-map-gl';

import * as constants from '../../data/constants';

/**
 * This function will determine the URL for the tribal tiles.
 * @return {string}
 */
export const tribalURL = (): string => {
  const featureTileBaseURL = constants.TILE_BASE_URL;
  const featureTilePath = constants.GATSBY_DATA_PIPELINE_TRIBAL_PATH;
  const XYZ_SUFFIX = '{z}/{x}/{y}.pbf';

  return [
    featureTileBaseURL,
    featureTilePath,
    process.env.GATSBY_MAP_TILES_PATH,
    XYZ_SUFFIX,
  ].join('/');
};


/**
 * This component will return the appropriate source and layers for the tribal layer on the
 * map.
 *
 * There are two use cases here, eg, when the MapBox token is or isn't provided. When the token
 * is not provided, the open-source map will be rendered. When the open-source map is rendered
 * only the interactive layers are returned from this component. The reason being is that the
 * other layers are supplied by he getOSBaseMap function.
 *
 * @param {string | number} selectedFeatureId
 * @param {MapGeoJSONFeature | undefined} selectedFeature
 * @return {Style}
 */
const MapTribalLayer = () => {
  return (

    // In this case the MapBox token is found and ALL source(s)/layer(s) are returned.
    <Source
      id={constants.TRIBAL_SOURCE_NAME}
      type="vector"
      promoteId={constants.TRIBAL_ID}
      tiles={[tribalURL()]}
    >

      {/* Tribal layer */}
      <Layer
        id={constants.TRIBAL_LAYER_ID}
        source-layer={constants.TRIBAL_SOURCE_LAYER}
        type='fill'
        paint={{
          'fill-color': constants.PRIORITIZED_FEATURE_FILL_COLOR,
          'fill-opacity': constants.TRIBAL_FEATURE_FILL_OPACITY}}
        minzoom={constants.TRIBAL_MIN_ZOOM}
        maxzoom={constants.TRIBAL_MAX_ZOOM}
      />

      {/* Tribal layer - controls the border between features */}
      <Layer
        id={constants.TRIBAL_FEATURE_BORDER_LAYER_ID}
        source-layer={constants.TRIBAL_SOURCE_LAYER}
        type='line'
        paint={{
          'line-color': constants.FEATURE_BORDER_COLOR,
          'line-width': constants.FEATURE_BORDER_WIDTH,
          'line-opacity': constants.FEATURE_BORDER_OPACITY,
        }}
        minzoom={constants.TRIBAL_MIN_ZOOM}
        maxzoom={constants.TRIBAL_MAX_ZOOM}
      />

      {/* Alaska layer */}
      <Layer
        id={constants.TRIBAL_ALASKA_POINTS_LAYER_ID}
        source-layer={constants.TRIBAL_SOURCE_LAYER}
        filter={['==', ['geometry-type'], 'Point']}
        type='circle'
        paint={{
          'circle-radius': constants.TRIBAL_ALASKA_CIRCLE_RADIUS,
          'circle-color': constants.TRIBAL_ALASKA_CIRCLE_FILL_COLOR,
          'circle-opacity': constants.TRIBAL_FEATURE_FILL_OPACITY,
          'circle-stroke-color': constants.TRIBAL_BORDER_COLOR,
          'circle-stroke-width': constants.ALAKSA_POINTS_STROKE_WIDTH,
          'circle-stroke-opacity': constants.FEATURE_BORDER_OPACITY,
        }}
        minzoom={constants.ALASKA_MIN_ZOOM}
        maxzoom={constants.ALASKA_MAX_ZOOM}
      />

      {/* Tribal labels layer */}
      <Layer
        id={constants.TRIBAL_LABELS_LAYER_ID}
        source-layer={constants.TRIBAL_SOURCE_LAYER}
        type='symbol'
        layout={{
          'text-field': [
            'case',
            ['in', ' LAR', ['get', constants.LAND_AREA_NAME]],
            ['slice', ['get', constants.LAND_AREA_NAME], 0, ['-', ['length', ['get', constants.LAND_AREA_NAME]], 4]],
            ['in', ' IRA', ['get', constants.LAND_AREA_NAME]],
            ['slice', ['get', constants.LAND_AREA_NAME], 0, ['-', ['length', ['get', constants.LAND_AREA_NAME]], 4]],
            ['in', ' TSA', ['get', constants.LAND_AREA_NAME]],
            ['slice', ['get', constants.LAND_AREA_NAME], 0, ['-', ['length', ['get', constants.LAND_AREA_NAME]], 4]],
            ['get', constants.LAND_AREA_NAME],
          ],
          'text-anchor': 'top',
          'text-offset': [0, 1],
          'text-size': 12,
          'text-allow-overlap': false,
          'text-ignore-placement': false,
        }}
        paint={{
          'text-color': '#333333',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.5,
        }}
        minzoom={constants.TRIBAL_MIN_ZOOM}
        maxzoom={constants.TRIBAL_MAX_ZOOM}
      />
    </Source>
  );
};

export default MapTribalLayer;
