/**
 * Indicator Registry
 *
 * Single source of truth for indicator identity, metadata, and mappings.
 * This registry eliminates redundant mappings between components.
 */

import {MessageDescriptor} from 'react-intl';
import * as constants from '../constants';
import * as EXPLORE_COPY from '../copy/explore';

/**
 * Definition of an indicator in the registry
 */
export interface IndicatorDefinition {
  /** Canonical identifier for this indicator */
  id: string;

  /** Property name for threshold exceeded flag (e.g., "EAL_ET") - used as key in properties object */
  thresholdPropertyName: string;

  /** When set, used for Island Areas instead of thresholdPropertyName (e.g. IA_* tile properties). */
  thresholdPropertyNameIslandAreas?: string;

  /** Property name for percentile value (e.g., "EALR_PFS"), null if indicator is a boolean. */
  percentilePropertyName: string | null;

  /** i18n message descriptor for the indicator label */
  i18nKey: MessageDescriptor;

  /** Category this indicator belongs to (matches LayerFilter category id) */
  category: string;
}

/**
 * Registry of all indicators
 *
 * This is the single source of truth for indicator identity.
 * Components should reference this registry instead of maintaining
 * their own mappings.
 */
export const INDICATOR_REGISTRY: {[key: string]: IndicatorDefinition} = {
  expAgLoss: {
    id: 'expAgLoss',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_EXP_AGR_LOSS,
    percentilePropertyName: constants.EXP_AGRICULTURE_LOSS_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.EXP_AG_LOSS,
    category: 'climate',
  },
  expBldLoss: {
    id: 'expBldLoss',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_EXP_BLD_LOSS,
    percentilePropertyName: constants.EXP_BUILDING_LOSS_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.EXP_BLD_LOSS,
    category: 'climate',
  },
  expPopLoss: {
    id: 'expPopLoss',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_EXP_POP_LOSS,
    percentilePropertyName: constants.EXP_POPULATION_LOSS_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.EXP_POP_LOSS,
    category: 'climate',
  },
  flooding: {
    id: 'flooding',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FLOODING,
    percentilePropertyName: constants.FLOODING_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.FLOODING,
    category: 'climate',
  },
  wildfire: {
    id: 'wildfire',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_WILDFIRE,
    percentilePropertyName: constants.WILDFIRE_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.WILDFIRE,
    category: 'climate',
  },
  // Energy category
  energyCost: {
    id: 'energyCost',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_ENERGY_BURDEN,
    percentilePropertyName: constants.ENERGY_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.ENERGY_COST,
    category: 'energy',
  },
  pm25: {
    id: 'pm25',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_PM25,
    percentilePropertyName: constants.PM25_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.PM_2_5,
    category: 'energy',
  },
  // Health category
  asthma: {
    id: 'asthma',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_ASTHMA,
    percentilePropertyName: constants.ASTHMA_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.ASTHMA,
    category: 'health',
  },
  diabetes: {
    id: 'diabetes',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_DIABETES,
    percentilePropertyName: constants.DIABETES_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.DIABETES,
    category: 'health',
  },
  heartDisease: {
    id: 'heartDisease',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_HEART_DISEASE,
    percentilePropertyName: constants.HEART_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.HEART_DISEASE,
    category: 'health',
  },
  lifeExpect: {
    id: 'lifeExpect',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_LOW_LIFE_EXP,
    percentilePropertyName: constants.LIFE_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LIFE_EXPECT,
    category: 'health',
  },
  // Housing category
  historicUnderinvest: {
    id: 'historicUnderinvest',
    thresholdPropertyName: constants.HISTORIC_UNDERINVESTMENT_EXCEED_THRESH,
    percentilePropertyName: null, // Note: boolean indicator, no percentile value
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.HIST_UNDERINVEST,
    category: 'housing',
  },
  houseCost: {
    id: 'houseCost',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_HOUSE_BURDEN,
    percentilePropertyName: constants.HOUSING_BURDEN_PROPERTY_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.HOUSE_COST,
    category: 'housing',
  },
  lackGreenSpace: {
    id: 'lackGreenSpace',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_IMPERVIOUS,
    percentilePropertyName: constants.IMPERVIOUS_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LACK_GREEN_SPACE,
    category: 'housing',
  },
  lackPlumbing: {
    id: 'lackPlumbing',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_KITCHEN_PLUMB,
    percentilePropertyName: constants.KITCHEN_PLUMB_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LACK_PLUMBING,
    category: 'housing',
  },
  leadPaint: {
    id: 'leadPaint',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_LEAD_PAINT_AND_MEDIAN_HOME_VAL,
    percentilePropertyName: constants.LEAD_PAINT_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LEAD_PAINT,
    category: 'housing',
  },
  // Pollution category
  abandonMines: {
    id: 'abandonMines',
    thresholdPropertyName: constants.ABANDON_LAND_MINES_EXCEEDS_THRESH,
    percentilePropertyName: null,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.ABANDON_MINES,
    category: 'pollution',
  },
  formerDefSites: {
    id: 'formerDefSites',
    thresholdPropertyName: constants.FORMER_DEF_SITES_EXCEEDS_THRESH,
    percentilePropertyName: null,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.FORMER_DEF_SITES,
    category: 'pollution',
  },
  proxHaz: {
    id: 'proxHaz',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_HAZARD_WASTE,
    percentilePropertyName: constants.PROXIMITY_TSDF_SITES_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.PROX_HAZ,
    category: 'pollution',
  },
  proxRMP: {
    id: 'proxRMP',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_RMP,
    percentilePropertyName: constants.PROXIMITY_RMP_SITES_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.PROX_RMP,
    category: 'pollution',
  },
  proxNPL: {
    id: 'proxNPL',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_SUPERFUND,
    percentilePropertyName: constants.PROXIMITY_NPL_SITES_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.PROX_NPL,
    category: 'pollution',
  },
  // Transportation category
  dieselPartMatter: {
    id: 'dieselPartMatter',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_DIESEL_PM,
    percentilePropertyName: constants.DIESEL_MATTER_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.DIESEL_PARTICULATE_MATTER,
    category: 'transportation',
  },
  barrierTransport: {
    id: 'barrierTransport',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_TRAVEL_DISADV,
    percentilePropertyName: constants.TRAVEL_DISADV_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.BARRIER_TRANS,
    category: 'transportation',
  },
  trafficVolume: {
    id: 'trafficVolume',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_TRAFFIC_PROX,
    percentilePropertyName: constants.TRAFFIC_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.TRAFFIC_VOLUME,
    category: 'transportation',
  },
  // Water category
  leakyTanks: {
    id: 'leakyTanks',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_LEAKY_UNDER,
    percentilePropertyName: constants.LEAKY_UNDER_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LEAKY_TANKS,
    category: 'water',
  },
  wasteWater: {
    id: 'wasteWater',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_WASTEWATER,
    percentilePropertyName: constants.WASTEWATER_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.WASTE_WATER,
    category: 'water',
  },
  // Workforce category
  lingIso: {
    id: 'lingIso',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_LINGUISITIC_ISO,
    percentilePropertyName: constants.LINGUISTIC_ISOLATION_PROPERTY_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LING_ISO,
    category: 'workforce',
  },
  lowMedInc: {
    id: 'lowMedInc',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_LOW_MEDIAN_INCOME,
    thresholdPropertyNameIslandAreas: constants.IS_EXCEEDS_THRESH_FOR_ISLAND_AREA_LOW_MEDIAN_INCOME,
    percentilePropertyName: constants.LOW_MEDIAN_INCOME_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LOW_MED_INC,
    category: 'workforce',
  },
  unemploy: {
    id: 'unemploy',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_UNEMPLOYMENT,
    thresholdPropertyNameIslandAreas: constants.IS_EXCEEDS_THRESH_FOR_ISLAND_AREA_UNEMPLOYMENT,
    percentilePropertyName: constants.UNEMPLOYMENT_PROPERTY_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.UNEMPLOY,
    category: 'workforce',
  },
  poverty: {
    id: 'poverty',
    thresholdPropertyName: constants.IS_EXCEEDS_THRESH_FOR_BELOW_100_POVERTY,
    thresholdPropertyNameIslandAreas: constants.IS_EXCEEDS_THRESH_FOR_ISLAND_AREA_BELOW_100_POVERTY,
    percentilePropertyName: constants.POVERTY_BELOW_100_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.POVERTY,
    category: 'workforce',
  },
  highSchool: {
    id: 'highSchool',
    thresholdPropertyName: constants.IS_LOW_HS_EDUCATION_LOW_HIGHER_ED_PRIORITIZED,
    thresholdPropertyNameIslandAreas: constants.ISLAND_AREA_LOW_HS_EDU,
    percentilePropertyName: constants.HIGH_SCHOOL_PROPERTY_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.HIGH_SCL,
    category: 'workforce',
  },
  // Shared socioeconomic indicator (appears in socioEcIndicators across all categories except workforce)
  lowInc: {
    id: 'lowInc',
    thresholdPropertyName: constants.IS_FEDERAL_POVERTY_LEVEL_200,
    percentilePropertyName: constants.POVERTY_BELOW_200_PERCENTILE,
    i18nKey: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LOW_INCOME,
    category: 'shared', // Used across all categories as socioeconomic indicator
  },
};

/**
 * Get an indicator definition by its canonical ID
 * @param {string} id - The canonical indicator ID (must be a key in INDICATOR_REGISTRY)
 * @return {IndicatorDefinition} The indicator definition
 */
export const getIndicatorById = (id: keyof typeof INDICATOR_REGISTRY): IndicatorDefinition => {
  return INDICATOR_REGISTRY[id];
};

/**
 * Get all indicators for a specific category
 * @param {string} categoryId - The category ID
 * @return {IndicatorDefinition[]} Array of indicator definitions for that category
 */
export const getIndicatorsByCategory = (categoryId: string): IndicatorDefinition[] => {
  return Object.values(INDICATOR_REGISTRY).filter(
      (indicator) => indicator.category === categoryId,
  );
};
