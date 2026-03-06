/**
 * Resolves indicator threshold property names by map region.
 * Used by MapTractLayers (map shading) and AreaDetail (side panel isDisadv / X-of-Y).
 */

import {INDICATOR_REGISTRY} from '../data/indicators/registry';
import type {MapRegion} from './mapRegion';

/**
 * Returns the tile property name for the threshold-exceeded flag for an indicator in the given region.
 * For Island Areas, uses thresholdPropertyNameIslandAreas when set (e.g. workforce IA_* / IALHE).
 * @param {string} indicatorId - Canonical indicator ID from registry
 * @param {MapRegion} region - Current map region
 * @return {string | undefined} Property name for tile lookup, or undefined if indicator not in registry
 */
export function getThresholdPropertyName(
    indicatorId: string,
    region: MapRegion,
): string | undefined {
  const def = INDICATOR_REGISTRY[indicatorId];
  if (!def) return undefined;
  if (
    region === 'island_areas' &&
    def.thresholdPropertyNameIslandAreas
  ) {
    return def.thresholdPropertyNameIslandAreas;
  }
  return def.thresholdPropertyName;
}
