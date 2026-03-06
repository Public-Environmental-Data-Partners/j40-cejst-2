import type {LngLatBoundsLike} from 'maplibre-gl';
import {
  PUERTO_RICO_BOUNDS,
  GUAM_BOUNDS,
  AMERICAN_SAMOA_BOUNDS,
  MARIANA_ISLAND_BOUNDS,
  US_VIRGIN_ISLANDS_BOUNDS,
  SIDE_PANEL_STATE_VALUES,
} from '../data/constants';

export type MapRegion = 'nation' | 'puerto_rico' | 'island_areas';

/**
 * Returns true if the point (lng, lat) is inside the given bounds.
 * Bounds format: [[minLng, minLat], [maxLng, maxLat]]
 * Normalizes longitude when bounds use wrapped convention (minLng < -180, e.g. Pacific
 * territories): viewport may report 144 for Guam while bounds use -215; we convert 144 to -216.
 * @param {number} lng Longitude
 * @param {number} lat Latitude
 * @param {LngLatBoundsLike} bounds Bounding box [[minLng, minLat], [maxLng, maxLat]]
 * @return {boolean} True if point is inside bounds
 */
export function pointInBounds(
    lng: number,
    lat: number,
    bounds: LngLatBoundsLike,
): boolean {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds as [
    [number, number],
    [number, number],
  ];
  let lngNorm = lng;
  if (minLng < -180 && lng > 0 && lng <= 180) {
    lngNorm = lng - 360;
  }
  return lngNorm >= minLng && lngNorm <= maxLng && lat >= minLat && lat <= maxLat;
}

const ISLAND_AREA_BOUNDS: LngLatBoundsLike[] = [
  GUAM_BOUNDS,
  AMERICAN_SAMOA_BOUNDS,
  MARIANA_ISLAND_BOUNDS,
  US_VIRGIN_ISLANDS_BOUNDS,
];

/**
 * Returns the map region for the given viewport center.
 * Check Puerto Rico first, then Island Areas (AS, GU, MP, VI), else Nation.
 * @param {number} longitude Viewport center longitude
 * @param {number} latitude Viewport center latitude
 * @return {MapRegion} 'puerto_rico' | 'island_areas' | 'nation'
 */
export function getMapRegionFromViewport(
    longitude: number,
    latitude: number,
): MapRegion {
  if (pointInBounds(longitude, latitude, PUERTO_RICO_BOUNDS)) {
    return 'puerto_rico';
  }
  if (
    ISLAND_AREA_BOUNDS.some((bounds) =>
      pointInBounds(longitude, latitude, bounds),
    )
  ) {
    return 'island_areas';
  }
  return 'nation';
}

/**
 * Converts backend side panel state (UI_EXP) to MapRegion.
 * Unknown or missing values default to 'nation'.
 * @param {string | undefined} sidePanelState - Tract property value: "Nation" | "Puerto Rico" | "Island Areas"
 * @return {MapRegion} 'nation' | 'puerto_rico' | 'island_areas'
 */
export function sidePanelStateToMapRegion(
    sidePanelState: string | undefined,
): MapRegion {
  if (sidePanelState === SIDE_PANEL_STATE_VALUES.PUERTO_RICO) return 'puerto_rico';
  if (sidePanelState === SIDE_PANEL_STATE_VALUES.ISLAND_AREAS) return 'island_areas';
  return 'nation';
}
