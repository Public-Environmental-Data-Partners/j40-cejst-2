import React, {useState, useRef, useEffect, useMemo} from 'react';
import {useIntl} from 'gatsby-plugin-intl';
import {Button} from '@trussworks/react-uswds';
import * as styles from './LayerFilter.module.scss';
import * as LAYER_FILTER_COPY from '../../data/copy/layerFilter';
import * as EXPLORE_COPY from '../../data/copy/explore';
import {INDICATOR_REGISTRY, getIndicatorsByCategory, getIndicatorById} from '../../data/indicators/registry';

interface ILayerFilter {
  onFiltersChange: (filters: LayerFilters) => void;
  onOverlayStateChange?: (isOpen: boolean) => void;
}

export interface LayerFilters {
  identifiedAsDisadvantaged: boolean;
  indicators: {
    [key: string]: boolean;
  };
}

/**
 * Builds the CATEGORIES array from the indicator registry.
 * Uses canonical IDs (AreaDetail variable names) as indicator IDs.
 * Category messages come directly from EXPLORE_COPY to match AreaDetail.
 * @return {Array} Array of category objects matching the CATEGORIES structure
 */
export const buildCategoriesFromRegistry = () => {
  // Map category IDs (from registry) to their message descriptors (from EXPLORE_COPY)
  // This ensures LayerFilter uses the same category names as AreaDetail
  const categoryMessageMap: {[key: string]: any} = {
    climate: EXPLORE_COPY.SIDE_PANEL_CATEGORY.CLIMATE,
    energy: EXPLORE_COPY.SIDE_PANEL_CATEGORY.CLEAN_ENERGY,
    health: EXPLORE_COPY.SIDE_PANEL_CATEGORY.HEALTH_BURDEN,
    housing: EXPLORE_COPY.SIDE_PANEL_CATEGORY.SUSTAIN_HOUSE,
    pollution: EXPLORE_COPY.SIDE_PANEL_CATEGORY.LEG_POLLUTE,
    transportation: EXPLORE_COPY.SIDE_PANEL_CATEGORY.CLEAN_TRANSPORT,
    water: EXPLORE_COPY.SIDE_PANEL_CATEGORY.CLEAN_WATER,
    workforce: EXPLORE_COPY.SIDE_PANEL_CATEGORY.WORK_DEV,
  };

  // Get all indicators from registry, grouped by category
  const categories: Array<{
    id: string;
    nameMessage: any;
    indicators: Array<{id: string; property: string}>;
  }> = [];

  // Get unique category IDs (excluding 'shared')
  const categoryIds = Array.from(
      new Set(
          Object.values(INDICATOR_REGISTRY)
              .map((indicator) => indicator.category)
              .filter((category) => category !== 'shared'),
      ),
  ).sort();

  // Build category structure
  for (const categoryId of categoryIds) {
    const indicators = getIndicatorsByCategory(categoryId);
    const categoryIndicators = indicators.map((indicator) => ({
      id: indicator.id, // Use canonical ID (AreaDetail variable name)
      property: indicator.thresholdPropertyName, // Use threshold property name
    }));

    categories.push({
      id: categoryId,
      nameMessage: categoryMessageMap[categoryId],
      indicators: categoryIndicators,
    });
  }

  return categories;
};

// Category structure with indicators
// Generated from registry using canonical IDs (AreaDetail variable names)
// Using message objects for i18n - names and labels will be formatted with intl.formatMessage()
export const CATEGORIES = buildCategoriesFromRegistry();

const LayerFilter = ({onFiltersChange, onOverlayStateChange}: ILayerFilter) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<LayerFilters>({
    identifiedAsDisadvantaged: true,
    indicators: {},
  });
  // Track category checkbox states independently (not connected to indicators yet)
  const [categoryStates, setCategoryStates] = useState<{[key: string]: boolean}>({});
  // Track which categories are expanded
  // This state persists across dropdown open/close (component doesn't unmount)
  // State resets on page refresh (React component remounts)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  // Track which category was just auto-expanded (for smooth scroll)
  const [justExpanded, setJustExpanded] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{[key: string]: HTMLDetailsElement | null}>({});
  const categoryCheckboxRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

  // Helper function to get indicator label message from registry
  // Uses registry as single source of truth for i18n keys
  const getIndicatorLabelMessage = (indicatorId: keyof typeof INDICATOR_REGISTRY) => {
    const indicator = getIndicatorById(indicatorId);
    return indicator.i18nKey;
  };

  // Helper function to find category by ID
  const findCategoryById = (categoryId: string) => {
    return CATEGORIES.find((cat) => cat.id === categoryId);
  };

  const handleIdentifiedAsDisadvantagedChange = (checked: boolean) => {
    const newFilters: LayerFilters = {
      identifiedAsDisadvantaged: checked,
      indicators: checked ? {} : {...filters.indicators},
    };

    // When "Identified as Disadvantaged" is checked, clear all category checkbox states
    // since all indicators are cleared
    if (checked) {
      setCategoryStates({});
    }

    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleIndicatorChange = (indicatorId: string, checked: boolean) => {
    const newFilters: LayerFilters = {
      identifiedAsDisadvantaged: false, // Auto-uncheck when any indicator is checked
      indicators: {
        ...filters.indicators,
        [indicatorId]: checked,
      },
    };
    // Remove unchecked indicators
    if (!checked) {
      delete newFilters.indicators[indicatorId];
    }

    // Find which category this indicator belongs to and update category checkbox state
    const category = CATEGORIES.find((cat) =>
      cat.indicators.some((ind) => ind.id === indicatorId),
    );

    if (category) {
      // Count how many indicators in this category are selected
      const selectedCount = category.indicators.filter((ind) =>
        newFilters.indicators[ind.id],
      ).length;

      // Category is checked if any indicators are selected
      // Category is unchecked if no indicators are selected
      const categoryChecked = selectedCount > 0;

      setCategoryStates((prev) => ({
        ...prev,
        [category.id]: categoryChecked,
      }));
    }

    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    // Find the category
    const category = findCategoryById(categoryId);
    if (!category) {
      console.warn(`Category with id "${categoryId}" not found`);
      return;
    }

    // Handle edge case: category with no indicators
    if (category.indicators.length === 0) {
      console.warn(`Category "${intl.formatMessage(category.nameMessage)}" has no indicators`);
      return;
    }

    // Update category checkbox state
    setCategoryStates((prev) => ({
      ...prev,
      [categoryId]: checked,
    }));

    // Build new filters object
    const newFilters: LayerFilters = {
      identifiedAsDisadvantaged: checked ? false : filters.identifiedAsDisadvantaged,
      indicators: {
        ...filters.indicators,
      },
    };

    if (checked) {
      // Select all indicators in this category
      category.indicators.forEach((indicator) => {
        newFilters.indicators[indicator.id] = true;
      });
      // Auto-expand category when selected
      setExpandedCategories((prev) => new Set(prev).add(categoryId));
      // Mark as just expanded for smooth scroll
      setJustExpanded(categoryId);
    } else {
      // Deselect all indicators in this category
      category.indicators.forEach((indicator) => {
        delete newFilters.indicators[indicator.id];
      });
    }

    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters: LayerFilters = {
      identifiedAsDisadvantaged: true,
      indicators: {},
    };
    setFilters(defaultFilters);
    setCategoryStates({});
    setExpandedCategories(new Set()); // Collapse all categories on reset
    onFiltersChange(defaultFilters);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  // Calculate count of selected indicators for a category (memoized)
  const getCategorySelectedCount = useMemo(() => {
    const countMap: {[key: string]: number} = {};
    CATEGORIES.forEach((category) => {
      countMap[category.id] = category.indicators.filter((indicator) =>
        filters.indicators[indicator.id],
      ).length;
    });
    return (categoryId: string): number => {
      return countMap[categoryId] ?? 0;
    };
  }, [filters.indicators]);

  // Handle wheel events to prevent map scrolling when dropdown is open
  useEffect(() => {
    if (!isOpen || !dropdownRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      // Only stop propagation if the event is within the dropdown
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        e.stopPropagation();
      }
    };

    // Add event listener in capture phase to catch events before map
    document.addEventListener('wheel', handleWheel, {capture: true});

    return () => {
      document.removeEventListener('wheel', handleWheel, {capture: true});
    };
  }, [isOpen]);

  // Notify parent when overlay state changes (to disable/enable map double-click zoom)
  useEffect(() => {
    if (onOverlayStateChange) {
      onOverlayStateChange(isOpen);
    }
  }, [isOpen, onOverlayStateChange]);

  // Smooth scroll to category when it's auto-expanded
  useEffect(() => {
    if (justExpanded && categoryRefs.current[justExpanded]) {
      const categoryElement = categoryRefs.current[justExpanded];
      if (categoryElement) {
        // Small delay to ensure DOM has updated
        setTimeout(() => {
          categoryElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }, 100);
      }
      // Clear the justExpanded flag
      setJustExpanded(null);
    }
  }, [justExpanded]);


  return (
    <div className={styles.layerFilterContainer}>
      <div className={styles.filterHeader}>
        <span className={styles.newFeatureBadge}>
          {intl.formatMessage(LAYER_FILTER_COPY.LAYER_FILTER.NEW_FEATURE_BADGE)}
        </span>
        <button
          type="button"
          className={styles.layersButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={intl.formatMessage(LAYER_FILTER_COPY.LAYER_FILTER.LAYERS_BUTTON_ARIA_LABEL)}
        >
          {intl.formatMessage(LAYER_FILTER_COPY.LAYER_FILTER.LAYERS_BUTTON)}
          <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={styles.dropdownPanel}
        >
          <div className={styles.panelTitle}>
            {intl.formatMessage(LAYER_FILTER_COPY.LAYER_FILTER.PANEL_TITLE)}
          </div>

          {/* Identified as disadvantaged checkbox */}
          <label className={styles.mainCheckboxLabel}>
            <input
              type="checkbox"
              checked={filters.identifiedAsDisadvantaged}
              onChange={(e) => handleIdentifiedAsDisadvantagedChange(e.target.checked)}
              className={styles.checkbox}
            />
            <span>{intl.formatMessage(LAYER_FILTER_COPY.LAYER_FILTER.IDENTIFIED_AS_DISADVANTAGED)}</span>
          </label>

          {/* Low income checkbox */}
          <label className={styles.mainCheckboxLabel}>
            <input
              type="checkbox"
              checked={filters.indicators.lowInc || false}
              onChange={(e) => handleIndicatorChange('lowInc', e.target.checked)}
              className={styles.checkbox}
            />
            <span>{intl.formatMessage(LAYER_FILTER_COPY.LAYER_FILTER.LOW_INCOME_CHECKBOX)}</span>
          </label>

          {/* Category details/summary */}
          <div className={styles.categoriesContainer}>
            {CATEGORIES.map((category) => (
              <details
                key={category.id}
                ref={(el) => {
                  categoryRefs.current[category.id] = el;
                }}
                className={styles.categoryDetails}
                open={expandedCategories.has(category.id)}
                onToggle={(e) => {
                  // Prevent default toggle behavior - categories can only be opened via checkbox
                  e.preventDefault();
                }}
              >
                <summary
                  className={styles.categorySummary}
                  tabIndex={-1}
                  onClick={(e) => {
                    // Prevent summary click from toggling details
                    e.preventDefault();
                  }}
                >
                  <input
                    ref={(el) => {
                      categoryCheckboxRefs.current[category.id] = el;
                    }}
                    type="checkbox"
                    checked={categoryStates[category.id] || false}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent details toggle when clicking checkbox
                      handleCategoryChange(category.id, e.target.checked);
                    }}
                    className={styles.categoryCheckbox}
                    onClick={(e) => e.stopPropagation()} // Also stop on click
                    aria-label={intl.formatMessage(
                        LAYER_FILTER_COPY.LAYER_FILTER.CATEGORY_ARIA_LABEL,
                        {
                          categoryName: intl.formatMessage(category.nameMessage),
                          selectedCount: getCategorySelectedCount(category.id),
                          totalCount: category.indicators.length,
                        },
                    )}
                    aria-describedby={`category-${category.id}-count`}
                  />
                  <span className={styles.categoryName}>
                    {intl.formatMessage(category.nameMessage)}
                  </span>
                  <span
                    id={`category-${category.id}-count`}
                    className={styles.countBadge}
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {intl.formatMessage(
                        LAYER_FILTER_COPY.LAYER_FILTER.CATEGORY_COUNT_BADGE,
                        {
                          selectedCount: getCategorySelectedCount(category.id),
                          totalCount: category.indicators.length,
                        },
                    )}
                  </span>
                </summary>
                <div
                  className={styles.indicatorsList}
                  role="group"
                  aria-label={intl.formatMessage(
                      LAYER_FILTER_COPY.LAYER_FILTER.INDICATORS_GROUP_LABEL,
                      {
                        categoryName: intl.formatMessage(category.nameMessage),
                      },
                  )}
                >
                  {category.indicators.map((indicator) => {
                    const labelMessage = getIndicatorLabelMessage(indicator.id);
                    const indicatorLabel = intl.formatMessage(labelMessage);
                    return (
                      <label key={indicator.id} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={filters.indicators[indicator.id] || false}
                          onChange={(e) => handleIndicatorChange(indicator.id, e.target.checked)}
                          className={styles.checkbox}
                          aria-label={indicatorLabel}
                        />
                        <span>{indicatorLabel}</span>
                      </label>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>

          {/* Lands of federally recognized tribes checkbox */}
          <label className={styles.mainCheckboxLabel}>
            <input
              type="checkbox"
              checked={filters.indicators.tribalLands || false}
              onChange={(e) => handleIndicatorChange('tribalLands', e.target.checked)}
              className={styles.checkbox}
            />
            <span>{intl.formatMessage(LAYER_FILTER_COPY.LAYER_FILTER.TRIBAL_LANDS)}</span>
          </label>

          {/* Action buttons */}
          <div className={styles.actionButtons}>
            <Button
              type="button"
              outline
              onClick={handleResetFilters}
              className={styles.resetButton}
            >
              {intl.formatMessage(LAYER_FILTER_COPY.LAYER_FILTER.RESET_FILTERS)}
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className={styles.applyButton}
            >
              {intl.formatMessage(LAYER_FILTER_COPY.LAYER_FILTER.APPLY)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerFilter;

