import React, {useState, useRef, useEffect} from 'react';
import {useIntl} from 'gatsby-plugin-intl';
import {Button} from '@trussworks/react-uswds';
import * as styles from './LayerFilter.module.scss';
import * as LAYER_FILTER_COPY from '../../data/copy/layerFilter';

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

  // Helper function to get indicator label message - all use explore.tsx messages
  const getIndicatorLabelMessage = (indicatorId: string) => {
    return LAYER_FILTER_COPY.getIndicatorMessage(indicatorId);
  };

  // Category structure with indicators
  // Using message objects for i18n - names and labels will be formatted with intl.formatMessage()
  const categories = [
    {
      id: 'climate',
      nameMessage: LAYER_FILTER_COPY.CATEGORIES.CLIMATE,
      indicators: [
        {id: 'expAgLoss', property: 'EAL_ET'},
        {id: 'expBldLoss', property: 'EBL_ET'},
        {id: 'expPopLoss', property: 'EPL_ET'},
        {id: 'floodRisk', property: 'FLD_ET'},
        {id: 'wildfireRisk', property: 'WFR_ET'},
      ],
    },
    {
      id: 'energy',
      nameMessage: LAYER_FILTER_COPY.CATEGORIES.ENERGY,
      indicators: [
        {id: 'energyBurden', property: 'EB_ET'},
        {id: 'pm25', property: 'PM25_ET'},
      ],
    },
    {
      id: 'health',
      nameMessage: LAYER_FILTER_COPY.CATEGORIES.HEALTH,
      indicators: [
        {id: 'asthma', property: 'A_ET'},
        {id: 'diabetes', property: 'DB_ET'},
        {id: 'heartDisease', property: 'HD_ET'},
        {id: 'lifeExpectancy', property: 'LLE_ET'},
      ],
    },
    {
      id: 'housing',
      nameMessage: LAYER_FILTER_COPY.CATEGORIES.HOUSING,
      indicators: [
        {id: 'housingBurden', property: 'HB_ET'},
        {id: 'histUnderinvest', property: 'HRS_ET'},
        {id: 'lackGreenSpace', property: 'IS_ET'},
        {id: 'kitchenPlumb', property: 'KP_ET'},
        {id: 'leadPaint', property: 'LPP_ET'},
        {id: 'medHomeVal', property: 'LPP_ET'},
      ],
    },
    {
      id: 'pollution',
      nameMessage: LAYER_FILTER_COPY.CATEGORIES.POLLUTION,
      indicators: [
        {id: 'abandonMines', property: 'AML_ET'},
        {id: 'fuds', property: 'FUDS_ET'},
        {id: 'hazWaste', property: 'TSDF_ET'},
        {id: 'rmp', property: 'RMP_ET'},
        {id: 'superfund', property: 'NPL_ET'},
      ],
    },
    {
      id: 'transportation',
      nameMessage: LAYER_FILTER_COPY.CATEGORIES.TRANSPORTATION,
      indicators: [
        {id: 'diesel', property: 'DS_ET'},
        {id: 'traffic', property: 'TP_ET'},
        {id: 'travelBurden', property: 'TD_ET'},
      ],
    },
    {
      id: 'water',
      nameMessage: LAYER_FILTER_COPY.CATEGORIES.WATER,
      indicators: [
        {id: 'leakyTanks', property: 'UST_ET'},
        {id: 'wastewater', property: 'WD_ET'},
      ],
    },
    {
      id: 'workforce',
      nameMessage: LAYER_FILTER_COPY.CATEGORIES.WORKFORCE,
      indicators: [
        {id: 'unemployment', property: 'UN_ET'},
        {id: 'poverty', property: 'POV_ET'},
        {id: 'lowIncome', property: 'LMI_ET'},
        {id: 'lingIso', property: 'LISO_ET'},
        {id: 'education', property: 'LHE'},
      ],
    },
  ];

  const handleIdentifiedAsDisadvantagedChange = (checked: boolean) => {
    const newFilters: LayerFilters = {
      identifiedAsDisadvantaged: checked,
      indicators: checked ? {} : {...filters.indicators},
    };

    // When "Identified as Disadvantaged" is checked, clear all category checkbox states
    // and indeterminate states since all indicators are cleared
    if (checked) {
      setCategoryStates({});
      // Clear all indeterminate states
      Object.keys(categoryCheckboxRefs.current).forEach((categoryId) => {
        if (categoryCheckboxRefs.current[categoryId]) {
          categoryCheckboxRefs.current[categoryId]!.indeterminate = false;
        }
      });
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
    const category = categories.find((cat) =>
      cat.indicators.some((ind) => ind.id === indicatorId),
    );

    if (category) {
      // Count how many indicators in this category are selected
      const selectedCount = category.indicators.filter((ind) =>
        newFilters.indicators[ind.id],
      ).length;

      // Update category checkbox state based on selection count:
      // - If all indicators selected → category checked, not indeterminate
      // - If no indicators selected → category unchecked, not indeterminate
      // - If some indicators selected → category checked AND indeterminate
      const allSelected = selectedCount === category.indicators.length;
      const someSelected = selectedCount > 0 && selectedCount < category.indicators.length;

      // Category is checked if any indicators are selected (all or some)
      // Category is unchecked only if no indicators are selected
      const categoryChecked = allSelected || someSelected;

      setCategoryStates((prev) => ({
        ...prev,
        [category.id]: categoryChecked,
      }));

      // Set indeterminate state on checkbox element
      // Indeterminate only when some (but not all) indicators are selected
      if (categoryCheckboxRefs.current[category.id]) {
        categoryCheckboxRefs.current[category.id]!.indeterminate = someSelected;
      }
    }

    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    // Find the category
    const category = categories.find((cat) => cat.id === categoryId);
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
      // Clear indeterminate state (all indicators are now selected)
      if (categoryCheckboxRefs.current[categoryId]) {
        categoryCheckboxRefs.current[categoryId]!.indeterminate = false;
      }
    } else {
      // Deselect all indicators in this category
      category.indicators.forEach((indicator) => {
        delete newFilters.indicators[indicator.id];
      });
      // Clear indeterminate state (no indicators are selected)
      if (categoryCheckboxRefs.current[categoryId]) {
        categoryCheckboxRefs.current[categoryId]!.indeterminate = false;
      }
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
    // Note: Indeterminate states are automatically cleared by the useEffect
    // that syncs indeterminate states when filters.indicators changes
    onFiltersChange(defaultFilters);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  // Calculate count of selected indicators for a category
  const getCategorySelectedCount = (categoryId: string): number => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return 0;

    // Handle edge case: category with no indicators
    if (category.indicators.length === 0) return 0;

    return category.indicators.filter((indicator) =>
      filters.indicators[indicator.id],
    ).length;
  };

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

  // Sync indeterminate states for all categories when filters or dropdown state changes
  // This ensures indeterminate state is restored when dropdown reopens
  useEffect(() => {
    categories.forEach((category) => {
      if (categoryCheckboxRefs.current[category.id]) {
        const selectedCount = category.indicators.filter((ind) =>
          filters.indicators[ind.id],
        ).length;
        const someSelected = selectedCount > 0 && selectedCount < category.indicators.length;
        categoryCheckboxRefs.current[category.id]!.indeterminate = someSelected;
      }
    });
  }, [filters.indicators, isOpen]);

  // Render categories using details/summary instead of accordion

  return (
    <div
      className={styles.layerFilterContainer}
      onWheel={(e) => {
        if (isOpen) {
          e.stopPropagation();
        }
      }}
    >
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
              checked={filters.indicators.lowIncomeFPL || false}
              onChange={(e) => handleIndicatorChange('lowIncomeFPL', e.target.checked)}
              className={styles.checkbox}
            />
            <span>{intl.formatMessage(LAYER_FILTER_COPY.LAYER_FILTER.LOW_INCOME_CHECKBOX)}</span>
          </label>

          {/* Category details/summary */}
          <div className={styles.categoriesContainer}>
            {categories.map((category) => (
              <details
                key={category.id}
                ref={(el) => {
                  categoryRefs.current[category.id] = el;
                }}
                className={styles.categoryDetails}
                open={expandedCategories.has(category.id)}
                onToggle={(e) => {
                  // Sync expanded state when user manually expands/collapses category
                  // This ensures state stays in sync with the native details element behavior
                  const details = e.currentTarget;
                  if (details.open) {
                    setExpandedCategories((prev) => new Set(prev).add(category.id));
                  } else {
                    setExpandedCategories((prev) => {
                      const next = new Set(prev);
                      next.delete(category.id);
                      return next;
                    });
                  }
                }}
              >
                <summary className={styles.categorySummary}>
                  <span className={styles.chevronIcon} aria-hidden="true">▶</span>
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
                    const indicatorLabel = labelMessage ?
                      intl.formatMessage(labelMessage) :
                      indicator.id; // Fallback to ID if message not found
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

