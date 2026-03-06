/**
 * Tests for indicatorRegion (getThresholdPropertyName) and the getWorkForceIndicatorIsDisadv
 * behavior used in AreaDetail. The refactor replaced in-component logic with the shared helper
 * plus a simple properties lookup; these tests lock in that behavior.
 */

import * as constants from '../data/constants';
import {getThresholdPropertyName} from './indicatorRegion';
import {sidePanelStateToMapRegion} from './mapRegion';

describe('indicatorRegion', () => {
  describe('getThresholdPropertyName', () => {
    it('returns Nation threshold property for nation region', () => {
      expect(getThresholdPropertyName('lowMedInc', 'nation'))
          .toBe(constants.IS_EXCEEDS_THRESH_FOR_LOW_MEDIAN_INCOME);
      expect(getThresholdPropertyName('unemploy', 'nation'))
          .toBe(constants.IS_EXCEEDS_THRESH_FOR_UNEMPLOYMENT);
      expect(getThresholdPropertyName('poverty', 'nation'))
          .toBe(constants.IS_EXCEEDS_THRESH_FOR_BELOW_100_POVERTY);
      expect(getThresholdPropertyName('highSchool', 'nation'))
          .toBe(constants.IS_LOW_HS_EDUCATION_LOW_HIGHER_ED_PRIORITIZED);
    });

    it('returns Island Areas threshold property for island_areas region (workforce)', () => {
      expect(getThresholdPropertyName('lowMedInc', 'island_areas'))
          .toBe(constants.IS_EXCEEDS_THRESH_FOR_ISLAND_AREA_LOW_MEDIAN_INCOME);
      expect(getThresholdPropertyName('unemploy', 'island_areas'))
          .toBe(constants.IS_EXCEEDS_THRESH_FOR_ISLAND_AREA_UNEMPLOYMENT);
      expect(getThresholdPropertyName('poverty', 'island_areas'))
          .toBe(constants.IS_EXCEEDS_THRESH_FOR_ISLAND_AREA_BELOW_100_POVERTY);
      expect(getThresholdPropertyName('highSchool', 'island_areas'))
          .toBe(constants.ISLAND_AREA_LOW_HS_EDU);
    });

    it('returns same Nation property for puerto_rico (no PR-specific override)', () => {
      expect(getThresholdPropertyName('unemploy', 'puerto_rico'))
          .toBe(constants.IS_EXCEEDS_THRESH_FOR_UNEMPLOYMENT);
    });

    it('returns undefined for unknown indicator id', () => {
      expect(getThresholdPropertyName('unknownId', 'nation')).toBeUndefined();
      expect(getThresholdPropertyName('unknownId', 'island_areas')).toBeUndefined();
    });

    it('returns default threshold property for non-workforce indicators in any region', () => {
      expect(getThresholdPropertyName('asthma', 'nation'))
          .toBe(constants.IS_EXCEEDS_THRESH_FOR_ASTHMA);
      expect(getThresholdPropertyName('asthma', 'island_areas'))
          .toBe(constants.IS_EXCEEDS_THRESH_FOR_ASTHMA);
    });
  });

  describe('getWorkForceIndicatorIsDisadv behavior (refactor contract)', () => {
    /**
     * Replicates the logic used in AreaDetail.getWorkForceIndicatorIsDisadv after refactor:
     * getThresholdPropertyName(indicatorName, mapRegionForIndicator) then properties[prop].
     * @param {Record<string, unknown>} properties - Tract tile properties
     * @param {string | undefined} sidePanelState - Backend UI_EXP value (e.g. "Nation", "Island Areas")
     * @param {string} indicatorName - Canonical indicator ID (e.g. "unemploy", "highSchool")
     * @return {boolean | null} Threshold value when property present, null when missing
     */
    function getWorkForceIndicatorIsDisadv(
        properties: Record<string, unknown>,
        sidePanelState: string | undefined,
        indicatorName: string,
    ): boolean | null {
      const region = sidePanelStateToMapRegion(sidePanelState);
      const prop = getThresholdPropertyName(indicatorName, region);
      if (!prop) return null;
      return properties.hasOwnProperty(prop) ? (properties[prop] as boolean) : null;
    }

    it('returns true when Nation tract has threshold property true', () => {
      const properties: Record<string, unknown> = {
        [constants.IS_EXCEEDS_THRESH_FOR_UNEMPLOYMENT]: true,
      };
      expect(getWorkForceIndicatorIsDisadv(
          properties,
          constants.SIDE_PANEL_STATE_VALUES.NATION,
          'unemploy',
      )).toBe(true);
    });

    it('returns false when Nation tract has threshold property false', () => {
      const properties: Record<string, unknown> = {
        [constants.IS_EXCEEDS_THRESH_FOR_UNEMPLOYMENT]: false,
      };
      expect(getWorkForceIndicatorIsDisadv(
          properties,
          constants.SIDE_PANEL_STATE_VALUES.NATION,
          'unemploy',
      )).toBe(false);
    });

    it('returns null when Nation tract is missing threshold property', () => {
      const properties: Record<string, unknown> = {};
      expect(getWorkForceIndicatorIsDisadv(
          properties,
          constants.SIDE_PANEL_STATE_VALUES.NATION,
          'unemploy',
      )).toBe(null);
    });

    it('returns true when Island Areas tract has IA threshold property true', () => {
      const properties: Record<string, unknown> = {
        [constants.IS_EXCEEDS_THRESH_FOR_ISLAND_AREA_UNEMPLOYMENT]: true,
      };
      expect(getWorkForceIndicatorIsDisadv(
          properties,
          constants.SIDE_PANEL_STATE_VALUES.ISLAND_AREAS,
          'unemploy',
      )).toBe(true);
    });

    it('returns null when Island Areas tract has only Nation property set', () => {
      const properties: Record<string, unknown> = {
        [constants.IS_EXCEEDS_THRESH_FOR_UNEMPLOYMENT]: true,
      };
      expect(getWorkForceIndicatorIsDisadv(
          properties,
          constants.SIDE_PANEL_STATE_VALUES.ISLAND_AREAS,
          'unemploy',
      )).toBe(null);
    });

    it('returns correct value for highSchool in Island Areas (IALHE)', () => {
      const properties: Record<string, unknown> = {
        [constants.ISLAND_AREA_LOW_HS_EDU]: true,
      };
      expect(getWorkForceIndicatorIsDisadv(
          properties,
          constants.SIDE_PANEL_STATE_VALUES.ISLAND_AREAS,
          'highSchool',
      )).toBe(true);
    });

    it('treats unknown or missing sidePanelState as nation', () => {
      const properties: Record<string, unknown> = {
        [constants.IS_EXCEEDS_THRESH_FOR_UNEMPLOYMENT]: true,
      };
      expect(getWorkForceIndicatorIsDisadv(properties, undefined, 'unemploy'))
          .toBe(true);
      expect(getWorkForceIndicatorIsDisadv(properties, '', 'unemploy'))
          .toBe(true);
    });

    it('returns correct values for all four workforce indicators in island_areas', () => {
      const properties: Record<string, unknown> = {
        [constants.IS_EXCEEDS_THRESH_FOR_ISLAND_AREA_LOW_MEDIAN_INCOME]: true,
        [constants.IS_EXCEEDS_THRESH_FOR_ISLAND_AREA_UNEMPLOYMENT]: false,
        [constants.IS_EXCEEDS_THRESH_FOR_ISLAND_AREA_BELOW_100_POVERTY]: true,
        [constants.ISLAND_AREA_LOW_HS_EDU]: true,
      };
      expect(getWorkForceIndicatorIsDisadv(
          properties, constants.SIDE_PANEL_STATE_VALUES.ISLAND_AREAS, 'lowMedInc',
      )).toBe(true);
      expect(getWorkForceIndicatorIsDisadv(
          properties, constants.SIDE_PANEL_STATE_VALUES.ISLAND_AREAS, 'unemploy',
      )).toBe(false);
      expect(getWorkForceIndicatorIsDisadv(
          properties, constants.SIDE_PANEL_STATE_VALUES.ISLAND_AREAS, 'poverty',
      )).toBe(true);
      expect(getWorkForceIndicatorIsDisadv(
          properties, constants.SIDE_PANEL_STATE_VALUES.ISLAND_AREAS, 'highSchool',
      )).toBe(true);
    });
  });
});
