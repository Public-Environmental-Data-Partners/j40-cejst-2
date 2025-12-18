/* eslint-disable max-len */
import {defineMessages} from 'react-intl';
import * as EXPLORE_COPY from './explore';

// Re-export category messages from explore.tsx for consistency
export const CATEGORIES = {
  CLIMATE: EXPLORE_COPY.SIDE_PANEL_CATEGORY.CLIMATE,
  ENERGY: EXPLORE_COPY.SIDE_PANEL_CATEGORY.CLEAN_ENERGY,
  HEALTH: EXPLORE_COPY.SIDE_PANEL_CATEGORY.HEALTH_BURDEN,
  HOUSING: EXPLORE_COPY.SIDE_PANEL_CATEGORY.SUSTAIN_HOUSE,
  POLLUTION: EXPLORE_COPY.SIDE_PANEL_CATEGORY.LEG_POLLUTE,
  TRANSPORTATION: EXPLORE_COPY.SIDE_PANEL_CATEGORY.CLEAN_TRANSPORT,
  WATER: EXPLORE_COPY.SIDE_PANEL_CATEGORY.CLEAN_WATER,
  WORKFORCE: EXPLORE_COPY.SIDE_PANEL_CATEGORY.WORK_DEV,
};

// Helper to get indicator message - all indicators use explore.tsx messages
export const getIndicatorMessage = (indicatorId: string) => {
  const indicatorMap: {[key: string]: any} = {
    // Climate
    expAgLoss: EXPLORE_COPY.SIDE_PANEL_INDICATORS.EXP_AG_LOSS,
    expBldLoss: EXPLORE_COPY.SIDE_PANEL_INDICATORS.EXP_BLD_LOSS,
    expPopLoss: EXPLORE_COPY.SIDE_PANEL_INDICATORS.EXP_POP_LOSS,
    floodRisk: EXPLORE_COPY.SIDE_PANEL_INDICATORS.FLOODING,
    wildfireRisk: EXPLORE_COPY.SIDE_PANEL_INDICATORS.WILDFIRE,

    // Energy
    energyBurden: EXPLORE_COPY.SIDE_PANEL_INDICATORS.ENERGY_COST,
    pm25: EXPLORE_COPY.SIDE_PANEL_INDICATORS.PM_2_5,

    // Health
    asthma: EXPLORE_COPY.SIDE_PANEL_INDICATORS.ASTHMA,
    diabetes: EXPLORE_COPY.SIDE_PANEL_INDICATORS.DIABETES,
    heartDisease: EXPLORE_COPY.SIDE_PANEL_INDICATORS.HEART_DISEASE,
    lifeExpectancy: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LIFE_EXPECT,

    // Housing
    housingBurden: EXPLORE_COPY.SIDE_PANEL_INDICATORS.HOUSE_COST,
    histUnderinvest: EXPLORE_COPY.SIDE_PANEL_INDICATORS.HIST_UNDERINVEST,
    lackGreenSpace: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LACK_GREEN_SPACE,
    kitchenPlumb: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LACK_PLUMBING,
    leadPaint: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LEAD_PAINT,
    medHomeVal: EXPLORE_COPY.SIDE_PANEL_INDICATORS.MED_HOME_VAL,

    // Legacy Pollution
    abandonMines: EXPLORE_COPY.SIDE_PANEL_INDICATORS.ABANDON_MINES,
    fuds: EXPLORE_COPY.SIDE_PANEL_INDICATORS.FORMER_DEF_SITES,
    hazWaste: EXPLORE_COPY.SIDE_PANEL_INDICATORS.PROX_HAZ,
    rmp: EXPLORE_COPY.SIDE_PANEL_INDICATORS.PROX_RMP,
    superfund: EXPLORE_COPY.SIDE_PANEL_INDICATORS.PROX_NPL,

    // Transportation
    diesel: EXPLORE_COPY.SIDE_PANEL_INDICATORS.DIESEL_PARTICULATE_MATTER,
    traffic: EXPLORE_COPY.SIDE_PANEL_INDICATORS.TRAFFIC_VOLUME,
    travelBurden: EXPLORE_COPY.SIDE_PANEL_INDICATORS.BARRIER_TRANS,

    // Water
    leakyTanks: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LEAKY_TANKS,
    wastewater: EXPLORE_COPY.SIDE_PANEL_INDICATORS.WASTE_WATER,

    // Workforce
    unemployment: EXPLORE_COPY.SIDE_PANEL_INDICATORS.UNEMPLOY,
    poverty: EXPLORE_COPY.SIDE_PANEL_INDICATORS.POVERTY,
    lowIncome: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LOW_MED_INC,
    lingIso: EXPLORE_COPY.SIDE_PANEL_INDICATORS.LING_ISO,
    education: EXPLORE_COPY.SIDE_PANEL_INDICATORS.HIGH_SCL,
  };

  return indicatorMap[indicatorId] || null;
};

// LayerFilter-specific UI messages
export const LAYER_FILTER = defineMessages({
  // UI Elements
  NEW_FEATURE_BADGE: {
    id: 'layer.filter.new.feature.badge',
    defaultMessage: 'new feature',
    description: 'Badge text indicating this is a new feature in the layer filter',
  },
  LAYERS_BUTTON: {
    id: 'layer.filter.layers.button',
    defaultMessage: 'Layers',
    description: 'Button text to open/close the layers filter panel',
  },
  LAYERS_BUTTON_ARIA_LABEL: {
    id: 'layer.filter.layers.button.aria.label',
    defaultMessage: 'Toggle layers filter panel',
    description: 'Accessibility label for the layers button describing its action',
  },
  PANEL_TITLE: {
    id: 'layer.filter.panel.title',
    defaultMessage: 'Categories of burden',
    description: 'Title of the layer filter dropdown panel',
  },
  IDENTIFIED_AS_DISADVANTAGED: {
    id: 'layer.filter.identified.as.disadvantaged',
    defaultMessage: 'Identified as disadvantaged',
    description: 'Checkbox label for filtering by identified as disadvantaged communities',
  },
  LOW_INCOME_CHECKBOX: {
    id: 'layer.filter.low.income.checkbox',
    defaultMessage: 'Low income',
    description: 'Checkbox label for filtering by low income indicator',
  },
  TRIBAL_LANDS: {
    id: 'layer.filter.tribal.lands',
    defaultMessage: 'Lands of federally recognized tribes',
    description: 'Checkbox label for filtering by tribal lands',
  },
  RESET_FILTERS: {
    id: 'layer.filter.reset.filters',
    defaultMessage: 'Reset filters',
    description: 'Button text to reset all filters to default state',
  },
  APPLY: {
    id: 'layer.filter.apply',
    defaultMessage: 'Apply',
    description: 'Button text to apply the selected filters',
  },


  // Dynamic content messages
  CATEGORY_ARIA_LABEL: {
    id: 'layer.filter.category.aria.label',
    defaultMessage: '{categoryName}, {selectedCount} of {totalCount} indicators selected',
    description: 'Accessibility label for category checkbox indicating selection count',
  },
  CATEGORY_COUNT_BADGE: {
    id: 'layer.filter.category.count.badge',
    defaultMessage: '({selectedCount}/{totalCount})',
    description: 'Count badge showing number of selected indicators in a category',
  },
  INDICATORS_GROUP_LABEL: {
    id: 'layer.filter.indicators.group.label',
    defaultMessage: '{categoryName} indicators',
    description: 'Accessibility label for the group of indicators within a category',
  },
});

