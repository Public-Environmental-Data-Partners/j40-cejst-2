/* eslint-disable max-len */
import {defineMessages} from 'react-intl';

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

  // Tract count summary (X of Y) on the map
  TRACT_COUNT_SUMMARY: {
    id: 'layer.filter.tract.count.summary',
    defaultMessage: '{selectedCount} of {totalCount}',
    description: 'Tract count summary displayed at bottom-right of map: selected tracts of total tracts',
  },
  TRACT_COUNT_ARIA_LABEL: {
    id: 'layer.filter.tract.count.aria.label',
    defaultMessage: 'Tracts matching current filters: {selectedCount} of {totalCount}',
    description: 'Accessibility label for the tract count summary',
  },
});

