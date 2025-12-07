import React, {useState, useRef, useEffect} from 'react';
// import {useIntl} from 'gatsby-plugin-intl';
import {Button} from '@trussworks/react-uswds';
import * as styles from './LayerFilter.module.scss';

interface ILayerFilter {
  onFiltersChange: (filters: LayerFilters) => void;
}

export interface LayerFilters {
  identifiedAsDisadvantaged: boolean;
  indicators: {
    [key: string]: boolean;
  };
}

const LayerFilter = ({onFiltersChange}: ILayerFilter) => {
//   const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<LayerFilters>({
    identifiedAsDisadvantaged: true,
    indicators: {},
  });
  // Track category checkbox states independently (not connected to indicators yet)
  const [categoryStates, setCategoryStates] = useState<{[key: string]: boolean}>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Category structure with indicators
  const categories = [
    {
      id: 'climate',
      name: 'Climate change',
      indicators: [
        {id: 'expAgLoss', label: 'Expected agriculture loss rate', property: 'EAL_ET'},
        {id: 'expBldLoss', label: 'Expected building loss rate', property: 'EBL_ET'},
        {id: 'expPopLoss', label: 'Expected population loss rate', property: 'EPL_ET'},
        {id: 'floodRisk', label: 'Projected flood risk', property: 'FLD_ET'},
        {id: 'wildfireRisk', label: 'Projected wildfire risk', property: 'WFR_ET'},
      ],
    },
    {
      id: 'energy',
      name: 'Energy',
      indicators: [
        {id: 'energyBurden', label: 'Energy burden', property: 'EB_ET'},
        {id: 'pm25', label: 'PM2.5', property: 'PM25_ET'},
      ],
    },
    {
      id: 'health',
      name: 'Health',
      indicators: [
        {id: 'asthma', label: 'Asthma', property: 'A_ET'},
        {id: 'diabetes', label: 'Diabetes', property: 'DB_ET'},
        {id: 'heartDisease', label: 'Heart disease', property: 'HD_ET'},
        {id: 'lifeExpectancy', label: 'Low life expectancy', property: 'LLE_ET'},
      ],
    },
    {
      id: 'housing',
      name: 'Housing',
      indicators: [
        {id: 'housingBurden', label: 'Housing burden', property: 'HB_ET'},
        {id: 'leadPaint', label: 'Lead paint', property: 'LPP_ET'},
        {id: 'kitchenPlumb', label: 'Lack of kitchen or indoor plumbing', property: 'KP_ET'},
        {id: 'impervious', label: 'Impervious surface', property: 'IS_ET'},
      ],
    },
    {
      id: 'pollution',
      name: 'Legacy pollution',
      indicators: [
        {id: 'abandonMines', label: 'Abandoned mine lands', property: 'AML_ET'},
        {id: 'fuds', label: 'Formerly used defense sites', property: 'FUDS_ET'},
        {id: 'hazWaste', label: 'Proximity to hazardous waste facilities', property: 'TSDF_ET'},
        {id: 'rmp', label: 'Proximity to RMP facilities', property: 'RMP_ET'},
        {id: 'superfund', label: 'Proximity to Superfund sites', property: 'NPL_ET'},
      ],
    },
    {
      id: 'transportation',
      name: 'Transportation',
      indicators: [
        {id: 'diesel', label: 'Diesel particulate matter exposure', property: 'DS_ET'},
        {id: 'traffic', label: 'Traffic proximity and volume', property: 'TP_ET'},
        {id: 'travelBurden', label: 'Transportation barriers', property: 'TD_ET'},
      ],
    },
    {
      id: 'water',
      name: 'Water and wastewater',
      indicators: [
        {id: 'leakyTanks', label: 'Leaky underground storage tanks', property: 'UST_ET'},
        {id: 'wastewater', label: 'Wastewater discharge', property: 'WD_ET'},
      ],
    },
    {
      id: 'workforce',
      name: 'Workforce development',
      indicators: [
        {id: 'unemployment', label: 'Unemployment', property: 'UN_ET'},
        {id: 'poverty', label: 'Poverty', property: 'POV_ET'},
        {id: 'lowIncome', label: 'Low median income', property: 'LMI_ET'},
        {id: 'education', label: 'Lack of high school education', property: 'LISO_ET'},
      ],
    },
  ];

  const handleIdentifiedAsDisadvantagedChange = (checked: boolean) => {
    const newFilters: LayerFilters = {
      identifiedAsDisadvantaged: checked,
      indicators: checked ? {} : {...filters.indicators},
    };
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
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    // For now, just track the checkbox state independently
    // In Phase 3, this will connect to indicators
    setCategoryStates((prev) => ({
      ...prev,
      [categoryId]: checked,
    }));
  };

  const handleResetFilters = () => {
    const defaultFilters: LayerFilters = {
      identifiedAsDisadvantaged: true,
      indicators: {},
    };
    setFilters(defaultFilters);
    setCategoryStates({});
    onFiltersChange(defaultFilters);
  };

  const handleApply = () => {
    setIsOpen(false);
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
        <span className={styles.newFeatureBadge}>new feature</span>
        <button
          type="button"
          className={styles.layersButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          Layers
          <span className={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={styles.dropdownPanel}
        >
          <div className={styles.panelTitle}>Categories of burden</div>

          {/* Identified as disadvantaged checkbox */}
          <label className={styles.mainCheckboxLabel}>
            <input
              type="checkbox"
              checked={filters.identifiedAsDisadvantaged}
              onChange={(e) => handleIdentifiedAsDisadvantagedChange(e.target.checked)}
              className={styles.checkbox}
            />
            <span>Identified as disadvantaged</span>
          </label>

          {/* Low income checkbox */}
          <label className={styles.mainCheckboxLabel}>
            <input
              type="checkbox"
              checked={filters.indicators.lowIncomeFPL || false}
              onChange={(e) => handleIndicatorChange('lowIncomeFPL', e.target.checked)}
              className={styles.checkbox}
            />
            <span>Low income</span>
          </label>

          {/* Category details/summary */}
          <div className={styles.categoriesContainer}>
            {categories.map((category) => (
              <details key={category.id} className={styles.categoryDetails}>
                <summary className={styles.categorySummary}>
                  <span className={styles.chevronIcon}>▶</span>
                  <input
                    type="checkbox"
                    checked={categoryStates[category.id] || false}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent details toggle when clicking checkbox
                      handleCategoryChange(category.id, e.target.checked);
                    }}
                    className={styles.checkbox}
                    onClick={(e) => e.stopPropagation()} // Also stop on click
                  />
                  <span className={styles.categoryName}>{category.name}</span>
                </summary>
                <div className={styles.indicatorsList}>
                  {category.indicators.map((indicator) => (
                    <label key={indicator.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={filters.indicators[indicator.id] || false}
                        onChange={(e) => handleIndicatorChange(indicator.id, e.target.checked)}
                        className={styles.checkbox}
                      />
                      <span>{indicator.label}</span>
                    </label>
                  ))}
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
            <span>Lands of federally recognized tribes</span>
          </label>

          {/* Action buttons */}
          <div className={styles.actionButtons}>
            <Button
              type="button"
              outline
              onClick={handleResetFilters}
              className={styles.resetButton}
            >
              Reset filters
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className={styles.applyButton}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerFilter;

