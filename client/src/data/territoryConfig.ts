/**
 * Centralized config for which indicators and categories are disabled per map region.
 * Used by LayerFilter to grey out and auto-uncheck options when view is over a territory.
 */

import {getIndicatorsByCategory} from './indicators/registry';
import type {MapRegion} from '../utils/mapRegion';

/** Category IDs disabled in Island Areas (only Workforce is shown in side panel). */
export const DISABLED_CATEGORY_IDS_WHEN_ISLAND_AREAS = new Set([
  'climate',
  'energy',
  'health',
  'housing',
  'pollution',
  'transportation',
  'water',
]);

/** Indicator IDs disabled in Puerto Rico (side panel subset). */
const PUERTO_RICO_DISABLED_INDICATOR_IDS = new Set([
  'expAgLoss',
  'expBldLoss',
  'expPopLoss',
  'wildfire',
  'pm25',
  'lackGreenSpace',
  'abandonMines',
  'formerDefSites',
  'barrierTransport',
  'lingIso',
]);

/**
 * Indicator IDs disabled in Island Areas: all from disabled categories plus lingIso.
 * @return {Set<string>} Indicator IDs to disable when map region is island_areas
 */
function buildIslandAreasDisabledIndicatorIds(): Set<string> {
  const ids = new Set<string>();
  DISABLED_CATEGORY_IDS_WHEN_ISLAND_AREAS.forEach((categoryId) => {
    getIndicatorsByCategory(categoryId).forEach((ind) => ids.add(ind.id));
  });
  ids.add('lingIso');
  return ids;
}

const ISLAND_AREAS_DISABLED_INDICATOR_IDS = buildIslandAreasDisabledIndicatorIds();

/**
 * Returns the set of indicator IDs that are disabled for the given region.
 * Tribal lands are not in this set; LayerFilter disables tribalLands when region !== 'nation'.
 * @param {MapRegion} region - Current map region
 * @return {Set<string>} Indicator IDs to disable (empty for nation)
 */
export function getDisabledIndicatorIdsForRegion(region: MapRegion): Set<string> {
  if (region === 'nation') return new Set<string>();
  if (region === 'puerto_rico') return PUERTO_RICO_DISABLED_INDICATOR_IDS;
  return ISLAND_AREAS_DISABLED_INDICATOR_IDS;
}
