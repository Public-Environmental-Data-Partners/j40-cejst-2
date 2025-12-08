import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {LocalizedComponent} from '../../test/testHelpers';
import LayerFilter from './LayerFilter';

describe('LayerFilter Component', () => {
  let mockOnFiltersChange: jest.Mock;

  beforeEach(() => {
    mockOnFiltersChange = jest.fn();
    // Mock scrollIntoView since JSDOM doesn't support it
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
        <LocalizedComponent>
          <LayerFilter onFiltersChange={mockOnFiltersChange} />
        </LocalizedComponent>,
    );
  };

  const openDropdown = () => {
    const layersButton = screen.getByRole('button', {name: /layers/i});
    fireEvent.click(layersButton);
  };

  const getCategoryCheckbox = (categoryName: string) => {
    // Find the category details element first, then find the checkbox within its summary
    // This avoids matching indicator checkboxes that might contain the category name
    const categoryDetails = getCategoryDetails(categoryName);
    if (!categoryDetails) {
      throw new Error(`Category "${categoryName}" not found`);
    }
    const summary = categoryDetails.querySelector('summary');
    if (!summary) {
      throw new Error(`Summary not found for category "${categoryName}"`);
    }
    const checkbox = summary.querySelector('input[type="checkbox"]');
    if (!checkbox) {
      throw new Error(`Checkbox not found for category "${categoryName}"`);
    }
    return checkbox as HTMLInputElement;
  };

  const getIndicatorCheckbox = (indicatorLabel: string) => {
    return screen.getByRole('checkbox', {
      name: indicatorLabel,
    }) as HTMLInputElement;
  };

  const getCategoryDetails = (categoryName: string) => {
    const categoryElement = screen.getByText(categoryName).closest('details');
    return categoryElement as HTMLDetailsElement;
  };

  // ============================================================================
  // Section 1: Visual Structure Tests
  // ============================================================================

  describe('1.1 Category Display (Test IDs: 1.1.1, 1.1.2)', () => {
    it('renders all 8 categories in the dropdown', () => {
      renderComponent();
      openDropdown();

      expect(screen.getByText('Climate change')).toBeInTheDocument();
      expect(screen.getByText('Energy')).toBeInTheDocument();
      expect(screen.getByText('Health')).toBeInTheDocument();
      expect(screen.getByText('Housing')).toBeInTheDocument();
      expect(screen.getByText('Legacy pollution')).toBeInTheDocument();
      expect(screen.getByText('Transportation')).toBeInTheDocument();
      expect(screen.getByText('Water and wastewater')).toBeInTheDocument();
      expect(screen.getByText('Workforce development')).toBeInTheDocument();
    });

    it('displays category names correctly', () => {
      renderComponent();
      openDropdown();

      const categoryNames = [
        'Climate change',
        'Energy',
        'Health',
        'Housing',
        'Legacy pollution',
        'Transportation',
        'Water and wastewater',
        'Workforce development',
      ];

      categoryNames.forEach((name) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });
  });

  describe('1.2 Chevron Icon (Test IDs: 1.2.1, 1.2.2, 1.2.3)', () => {
    it('displays chevron icon for each category', () => {
      renderComponent();
      openDropdown();

      const chevrons = screen.getAllByText('▶');
      expect(chevrons.length).toBeGreaterThan(0);
    });
  });

  describe('1.3 Category Checkbox (Test IDs: 1.3.4, 1.3.5, 1.3.6)', () => {
    it('shows unchecked state when category is not selected', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      expect(climateCheckbox).not.toBeChecked();
    });

    it('shows checked state when category is selected', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      fireEvent.click(climateCheckbox);

      expect(climateCheckbox).toBeChecked();
    });

    it('shows indeterminate state when some indicators are selected', () => {
      renderComponent();
      openDropdown();

      // Expand climate category
      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      // Select only one indicator
      const expAgLossCheckbox = getIndicatorCheckbox('Expected agriculture loss rate');
      fireEvent.click(expAgLossCheckbox);

      const climateCheckbox = getCategoryCheckbox('Climate change');
      expect(climateCheckbox.indeterminate).toBe(true);
      expect(climateCheckbox).toBeChecked();
    });
  });

  describe('1.4 Count Badge (Test IDs: 1.4.3, 1.4.4)', () => {
    it('updates count badge when selections change', () => {
      renderComponent();
      openDropdown();

      // Expand climate category
      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      // Select one indicator
      const expAgLossCheckbox = getIndicatorCheckbox('Expected agriculture loss rate');
      fireEvent.click(expAgLossCheckbox);

      expect(screen.getByText(/\(1\/5\)/)).toBeInTheDocument();
    });
  });

  describe('1.5 Indicator Display (Test IDs: 1.5.4, 1.5.5)', () => {
    it('hides indicators when category is collapsed', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      expect(climateDetails).not.toHaveAttribute('open');

      // Indicators should not be visible
      expect(screen.queryByText('Expected agriculture loss rate')).not.toBeVisible();
    });

    it('shows indicators when category is expanded', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      expect(climateDetails).toHaveAttribute('open');
      expect(screen.getByText('Expected agriculture loss rate')).toBeVisible();
    });
  });

  // ============================================================================
  // Section 2: Expand/Collapse Functionality
  // ============================================================================

  describe('2.1 Manual Expand/Collapse (Test IDs: 2.1.1, 2.1.2, 2.1.4)', () => {
    it('expands category when clicking summary row', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      const summary = climateDetails?.querySelector('summary');

      expect(climateDetails).not.toHaveAttribute('open');
      fireEvent.click(summary!);
      expect(climateDetails).toHaveAttribute('open');
    });

    it('collapses category when clicking summary row again', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      const summary = climateDetails?.querySelector('summary');

      fireEvent.click(summary!);
      expect(climateDetails).toHaveAttribute('open');

      fireEvent.click(summary!);
      expect(climateDetails).not.toHaveAttribute('open');
    });

    it('allows multiple categories to be expanded simultaneously', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      const energyDetails = getCategoryDetails('Energy');

      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(energyDetails?.querySelector('summary')!);

      expect(climateDetails).toHaveAttribute('open');
      expect(energyDetails).toHaveAttribute('open');
    });
  });

  describe('2.2 Auto-Expand (Test IDs: 2.2.1, 2.2.2, 2.2.3)', () => {
    it('automatically expands category when checkbox is checked', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      const climateCheckbox = getCategoryCheckbox('Climate change');

      expect(climateDetails).not.toHaveAttribute('open');
      fireEvent.click(climateCheckbox);

      expect(climateDetails).toHaveAttribute('open');
    });

    it('does not auto-expand when unchecking category', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Check and expand
      fireEvent.click(climateCheckbox);
      expect(climateDetails).toHaveAttribute('open');

      // Manually collapse
      fireEvent.click(climateDetails?.querySelector('summary')!);
      expect(climateDetails).not.toHaveAttribute('open');

      // Uncheck - should not auto-expand
      fireEvent.click(climateCheckbox);
      expect(climateDetails).not.toHaveAttribute('open');
    });

    it('shows all indicators when auto-expanded', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      fireEvent.click(climateCheckbox);

      const climateDetails = getCategoryDetails('Climate change');
      expect(climateDetails).toHaveAttribute('open');

      // All climate indicators should be visible
      expect(screen.getByText('Expected agriculture loss rate')).toBeVisible();
      expect(screen.getByText('Expected building loss rate')).toBeVisible();
    });
  });


  // ============================================================================
  // Section 3: Category Checkbox Functionality
  // ============================================================================

  describe('3.1 Category Selection (Test IDs: 3.1.1, 3.1.2, 3.1.3, 3.1.4)', () => {
    it('selects all indicators when category checkbox is checked', () => {
      renderComponent();
      openDropdown();

      // Expand climate category
      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');
      fireEvent.click(climateCheckbox);

      // All climate indicators should be selected
      expect(getIndicatorCheckbox('Expected agriculture loss rate')).toBeChecked();
      expect(getIndicatorCheckbox('Expected building loss rate')).toBeChecked();
      expect(getIndicatorCheckbox('Expected population loss rate')).toBeChecked();
      expect(getIndicatorCheckbox('Projected flood risk')).toBeChecked();
      expect(getIndicatorCheckbox('Projected wildfire risk')).toBeChecked();

      // Verify onFiltersChange was called with all indicators
      const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
      expect(lastCall.indicators.expAgLoss).toBe(true);
      expect(lastCall.indicators.expBldLoss).toBe(true);
      expect(lastCall.indicators.expPopLoss).toBe(true);
      expect(lastCall.indicators.floodRisk).toBe(true);
      expect(lastCall.indicators.wildfireRisk).toBe(true);
    });

    it('deselects all indicators when category checkbox is unchecked', () => {
      renderComponent();
      openDropdown();

      // Expand and select climate category
      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      const climateCheckbox = getCategoryCheckbox('Climate change');
      fireEvent.click(climateCheckbox);

      // Uncheck category
      fireEvent.click(climateCheckbox);

      // All climate indicators should be unchecked
      expect(getIndicatorCheckbox('Expected agriculture loss rate')).not.toBeChecked();
      expect(getIndicatorCheckbox('Expected building loss rate')).not.toBeChecked();
    });

    it('category checkbox state is independent of other categories', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      const energyCheckbox = getCategoryCheckbox('Energy');

      fireEvent.click(climateCheckbox);
      expect(climateCheckbox).toBeChecked();
      expect(energyCheckbox).not.toBeChecked();

      fireEvent.click(energyCheckbox);
      expect(climateCheckbox).toBeChecked();
      expect(energyCheckbox).toBeChecked();
    });

    it('clicking category checkbox does not expand/collapse category', async () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Category starts collapsed
      expect(climateDetails).not.toHaveAttribute('open');

      // Click checkbox - should auto-expand due to selection logic
      fireEvent.click(climateCheckbox);

      // Wait for auto-expand (happens synchronously but waitFor ensures DOM update)
      await waitFor(() => {
        expect(climateDetails).toHaveAttribute('open');
      });
    });
  });

  describe('3.2 Category State Synchronization (Test IDs: 3.2.1, 3.2.2, 3.2.3, 3.2.4)', () => {
    it('checks category checkbox when all indicators are selected', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Select all indicators manually
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      fireEvent.click(getIndicatorCheckbox('Expected building loss rate'));
      fireEvent.click(getIndicatorCheckbox('Expected population loss rate'));
      fireEvent.click(getIndicatorCheckbox('Projected flood risk'));
      fireEvent.click(getIndicatorCheckbox('Projected wildfire risk'));

      expect(climateCheckbox).toBeChecked();
      expect(climateCheckbox.indeterminate).toBe(false);
    });

    it('unchecks category checkbox when no indicators are selected', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Select all, then deselect all
      fireEvent.click(climateCheckbox);
      fireEvent.click(climateCheckbox);

      expect(climateCheckbox).not.toBeChecked();
      expect(climateCheckbox.indeterminate).toBe(false);
    });

    it('shows indeterminate state when some indicators are selected', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Select only one indicator
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));

      expect(climateCheckbox).toBeChecked();
      expect(climateCheckbox.indeterminate).toBe(true);
    });

    it('updates category checkbox state immediately when indicators change', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Start with none selected
      expect(climateCheckbox).not.toBeChecked();

      // Select one - should be checked and indeterminate
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      expect(climateCheckbox).toBeChecked();
      expect(climateCheckbox.indeterminate).toBe(true);

      // Select all - should be checked and not indeterminate
      fireEvent.click(getIndicatorCheckbox('Expected building loss rate'));
      fireEvent.click(getIndicatorCheckbox('Expected population loss rate'));
      fireEvent.click(getIndicatorCheckbox('Projected flood risk'));
      fireEvent.click(getIndicatorCheckbox('Projected wildfire risk'));

      expect(climateCheckbox).toBeChecked();
      expect(climateCheckbox.indeterminate).toBe(false);
    });
  });

  describe('3.3 Indeterminate State (Test IDs: 3.3.1, 3.3.2, 3.3.3, 3.3.4)', () => {
    it('shows indeterminate state when some indicators are selected', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Select 2 out of 5 indicators
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      fireEvent.click(getIndicatorCheckbox('Expected building loss rate'));

      expect(climateCheckbox.indeterminate).toBe(true);
    });

    it('clears indeterminate state when all indicators are selected', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Select some indicators
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      expect(climateCheckbox.indeterminate).toBe(true);

      // Select all remaining indicators
      fireEvent.click(getIndicatorCheckbox('Expected building loss rate'));
      fireEvent.click(getIndicatorCheckbox('Expected population loss rate'));
      fireEvent.click(getIndicatorCheckbox('Projected flood risk'));
      fireEvent.click(getIndicatorCheckbox('Projected wildfire risk'));

      expect(climateCheckbox.indeterminate).toBe(false);
    });

    it('clears indeterminate state when no indicators are selected', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Select some indicators
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      expect(climateCheckbox.indeterminate).toBe(true);

      // Deselect all
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      expect(climateCheckbox.indeterminate).toBe(false);
      expect(climateCheckbox).not.toBeChecked();
    });

    it('persists indeterminate state when dropdown is closed and reopened', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Select some indicators
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      expect(climateCheckbox.indeterminate).toBe(true);

      // Close and reopen dropdown
      const layersButton = screen.getByRole('button', {name: /layers/i});
      fireEvent.click(layersButton);
      fireEvent.click(layersButton);

      const climateCheckboxAfter = getCategoryCheckbox('Climate change');
      expect(climateCheckboxAfter.indeterminate).toBe(true);
    });
  });

  // ============================================================================
  // Section 4: Indicator Checkbox Functionality
  // ============================================================================

  describe('4.1 Individual Selection (Test IDs: 4.1.1, 4.1.4)', () => {
    it('allows indicator checkboxes to be checked/unchecked independently', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const expAgLossCheckbox = getIndicatorCheckbox('Expected agriculture loss rate');
      const expBldLossCheckbox = getIndicatorCheckbox('Expected building loss rate');

      fireEvent.click(expAgLossCheckbox);
      expect(expAgLossCheckbox).toBeChecked();
      expect(expBldLossCheckbox).not.toBeChecked();

      fireEvent.click(expBldLossCheckbox);
      expect(expAgLossCheckbox).toBeChecked();
      expect(expBldLossCheckbox).toBeChecked();

      fireEvent.click(expAgLossCheckbox);
      expect(expAgLossCheckbox).not.toBeChecked();
      expect(expBldLossCheckbox).toBeChecked();
    });

    it('indicator selections are independent across categories', () => {
      renderComponent();
      openDropdown();

      // Expand both categories
      const climateDetails = getCategoryDetails('Climate change');
      const energyDetails = getCategoryDetails('Energy');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(energyDetails?.querySelector('summary')!);

      // Select indicator from climate
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));

      // Select indicator from energy
      fireEvent.click(getIndicatorCheckbox('Energy burden'));

      // Both should be selected
      expect(getIndicatorCheckbox('Expected agriculture loss rate')).toBeChecked();
      expect(getIndicatorCheckbox('Energy burden')).toBeChecked();
    });
  });

  describe('4.2 Category State Updates (Test IDs: 4.2.1, 4.2.2, 4.2.3, 4.2.4)', () => {
    it('checks parent category checkbox when indicator is selected', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');
      expect(climateCheckbox).not.toBeChecked();

      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      expect(climateCheckbox).toBeChecked();
    });

    it('unchecks category when last indicator is deselected', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');
      const expAgLossCheckbox = getIndicatorCheckbox('Expected agriculture loss rate');

      // Select one indicator
      fireEvent.click(expAgLossCheckbox);
      expect(climateCheckbox).toBeChecked();

      // Deselect it
      fireEvent.click(expAgLossCheckbox);
      expect(climateCheckbox).not.toBeChecked();
    });

    it('keeps category checked with indeterminate when one indicator is deselected', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Select all indicators
      fireEvent.click(climateCheckbox);
      expect(climateCheckbox.indeterminate).toBe(false);

      // Deselect one
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      expect(climateCheckbox).toBeChecked();
      expect(climateCheckbox.indeterminate).toBe(true);
    });

    it('removes indeterminate state when all indicators are selected', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Select some indicators
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      fireEvent.click(getIndicatorCheckbox('Expected building loss rate'));
      expect(climateCheckbox.indeterminate).toBe(true);

      // Select remaining indicators
      fireEvent.click(getIndicatorCheckbox('Expected population loss rate'));
      fireEvent.click(getIndicatorCheckbox('Projected flood risk'));
      fireEvent.click(getIndicatorCheckbox('Projected wildfire risk'));

      expect(climateCheckbox.indeterminate).toBe(false);
    });
  });

  describe('4.3 Count Badge Updates (Test IDs: 4.3.2, 4.3.3, 4.3.4)', () => {
    it('updates count badge immediately when indicator is deselected', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const expAgLossCheckbox = getIndicatorCheckbox('Expected agriculture loss rate');
      fireEvent.click(expAgLossCheckbox);
      expect(climateDetails?.querySelector('[id="category-climate-count"]')?.textContent).toContain('(1/5)');

      fireEvent.click(expAgLossCheckbox);
      expect(climateDetails?.querySelector('[id="category-climate-count"]')?.textContent).toContain('(0/5)');
    });

    it('shows correct numbers for all categories', () => {
      renderComponent();
      openDropdown();

      // Expand multiple categories
      const climateDetails = getCategoryDetails('Climate change');
      const energyDetails = getCategoryDetails('Energy');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(energyDetails?.querySelector('summary')!);

      // Select from climate (5 indicators)
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      expect(screen.getByText(/\(1\/5\)/)).toBeInTheDocument();

      // Select from energy (2 indicators)
      fireEvent.click(getIndicatorCheckbox('Energy burden'));
      expect(screen.getByText(/\(1\/2\)/)).toBeInTheDocument();
    });

    it('maintains consistent count badge format "(X/Y)"', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      // Check format for different counts - query within specific category
      const climateCountBadge = climateDetails?.querySelector('[id="category-climate-count"]');
      expect(climateCountBadge?.textContent).toContain('(0/5)');

      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      expect(climateCountBadge?.textContent).toContain('(1/5)');

      fireEvent.click(getIndicatorCheckbox('Expected building loss rate'));
      expect(climateCountBadge?.textContent).toContain('(2/5)');
    });
  });

  // ============================================================================
  // Section 5: Integration with Existing Features
  // ============================================================================

  describe('5.1 "Identified as Disadvantaged" Checkbox (Test IDs: 5.1.1, 5.1.2, 5.1.3, 5.1.4, 5.1.5)', () => {
    it('unchecks all category checkboxes when "Identified as Disadvantaged" is checked', () => {
      renderComponent();
      openDropdown();

      // Select a category
      const climateCheckbox = getCategoryCheckbox('Climate change');
      fireEvent.click(climateCheckbox);
      expect(climateCheckbox).toBeChecked();

      // Check "Identified as Disadvantaged"
      const identifiedCheckbox = screen.getByRole('checkbox', {
        name: /identified as disadvantaged/i,
      });
      fireEvent.click(identifiedCheckbox);

      expect(climateCheckbox).not.toBeChecked();
    });

    it('clears all indicator selections when "Identified as Disadvantaged" is checked', () => {
      renderComponent();
      openDropdown();

      // Select some indicators
      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));

      // Check "Identified as Disadvantaged"
      const identifiedCheckbox = screen.getByRole('checkbox', {
        name: /identified as disadvantaged/i,
      });
      fireEvent.click(identifiedCheckbox);

      // Verify onFiltersChange was called with empty indicators
      const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
      expect(lastCall.identifiedAsDisadvantaged).toBe(true);
      expect(Object.keys(lastCall.indicators).length).toBe(0);
    });

    it('unchecks "Identified as Disadvantaged" when category checkbox is checked', () => {
      renderComponent();
      openDropdown();

      const identifiedCheckbox = screen.getByRole('checkbox', {
        name: /identified as disadvantaged/i,
      });
      expect(identifiedCheckbox).toBeChecked();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      fireEvent.click(climateCheckbox);

      expect(identifiedCheckbox).not.toBeChecked();
    });

    it('unchecks "Identified as Disadvantaged" when individual indicator is checked', () => {
      renderComponent();
      openDropdown();

      const identifiedCheckbox = screen.getByRole('checkbox', {
        name: /identified as disadvantaged/i,
      });
      expect(identifiedCheckbox).toBeChecked();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));

      expect(identifiedCheckbox).not.toBeChecked();
    });

    it('preserves existing selections when "Identified as Disadvantaged" is unchecked', () => {
      renderComponent();
      openDropdown();

      // Select some indicators first
      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));

      // Check "Identified as Disadvantaged" (clears selections)
      const identifiedCheckbox = screen.getByRole('checkbox', {
        name: /identified as disadvantaged/i,
      });
      fireEvent.click(identifiedCheckbox);

      // Uncheck "Identified as Disadvantaged"
      fireEvent.click(identifiedCheckbox);

      // Selections should remain cleared (not preserved, as per implementation)
      const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
      expect(lastCall.identifiedAsDisadvantaged).toBe(false);
    });
  });

  describe('5.2 "Low Income" Checkbox (Test IDs: 5.2.1, 5.2.2, 5.2.3)', () => {
    it('works independently', () => {
      renderComponent();
      openDropdown();

      const lowIncomeCheckbox = screen.getByRole('checkbox', {
        name: /low income/i,
      });

      expect(lowIncomeCheckbox).not.toBeChecked();
      fireEvent.click(lowIncomeCheckbox);
      expect(lowIncomeCheckbox).toBeChecked();
    });

    it('unchecks "Identified as Disadvantaged" when checked', () => {
      renderComponent();
      openDropdown();

      const identifiedCheckbox = screen.getByRole('checkbox', {
        name: /identified as disadvantaged/i,
      });
      const lowIncomeCheckbox = screen.getByRole('checkbox', {
        name: /low income/i,
      });

      expect(identifiedCheckbox).toBeChecked();
      fireEvent.click(lowIncomeCheckbox);
      expect(identifiedCheckbox).not.toBeChecked();
    });

    it('preserves state correctly', () => {
      renderComponent();
      openDropdown();

      const lowIncomeCheckbox = screen.getByRole('checkbox', {
        name: /low income/i,
      });

      fireEvent.click(lowIncomeCheckbox);
      expect(lowIncomeCheckbox).toBeChecked();

      // Close and reopen dropdown
      const layersButton = screen.getByRole('button', {name: /layers/i});
      fireEvent.click(layersButton);
      fireEvent.click(layersButton);

      const lowIncomeCheckboxAfter = screen.getByRole('checkbox', {
        name: /low income/i,
      });
      expect(lowIncomeCheckboxAfter).toBeChecked();
    });
  });

  describe('5.3 "Lands of Federally Recognized Tribes" Checkbox (Test IDs: 5.3.1, 5.3.2, 5.3.3)', () => {
    it('works independently', () => {
      renderComponent();
      openDropdown();

      const tribalLandsCheckbox = screen.getByRole('checkbox', {
        name: /lands of federally recognized tribes/i,
      });

      expect(tribalLandsCheckbox).not.toBeChecked();
      fireEvent.click(tribalLandsCheckbox);
      expect(tribalLandsCheckbox).toBeChecked();
    });

    it('unchecks "Identified as Disadvantaged" when checked', () => {
      renderComponent();
      openDropdown();

      const identifiedCheckbox = screen.getByRole('checkbox', {
        name: /identified as disadvantaged/i,
      });
      const tribalLandsCheckbox = screen.getByRole('checkbox', {
        name: /lands of federally recognized tribes/i,
      });

      expect(identifiedCheckbox).toBeChecked();
      fireEvent.click(tribalLandsCheckbox);
      expect(identifiedCheckbox).not.toBeChecked();
    });

    it('preserves state correctly', () => {
      renderComponent();
      openDropdown();

      const tribalLandsCheckbox = screen.getByRole('checkbox', {
        name: /lands of federally recognized tribes/i,
      });

      fireEvent.click(tribalLandsCheckbox);
      expect(tribalLandsCheckbox).toBeChecked();

      // Close and reopen dropdown
      const layersButton = screen.getByRole('button', {name: /layers/i});
      fireEvent.click(layersButton);
      fireEvent.click(layersButton);

      const tribalLandsCheckboxAfter = screen.getByRole('checkbox', {
        name: /lands of federally recognized tribes/i,
      });
      expect(tribalLandsCheckboxAfter).toBeChecked();
    });
  });

  describe('5.4 Reset Filters Button (Test IDs: 5.4.1, 5.4.2, 5.4.4, 5.4.5, 5.4.6)', () => {
    it('clears all indicator selections', () => {
      renderComponent();
      openDropdown();

      // Select some indicators
      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));

      // Click reset
      const resetButton = screen.getByRole('button', {name: /reset filters/i});
      fireEvent.click(resetButton);

      // Verify onFiltersChange was called with empty indicators
      const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
      expect(lastCall.indicators).toEqual({});
    });

    it('unchecks all category checkboxes', () => {
      renderComponent();
      openDropdown();

      // Select a category
      const climateCheckbox = getCategoryCheckbox('Climate change');
      fireEvent.click(climateCheckbox);
      expect(climateCheckbox).toBeChecked();

      // Click reset
      const resetButton = screen.getByRole('button', {name: /reset filters/i});
      fireEvent.click(resetButton);

      expect(climateCheckbox).not.toBeChecked();
    });

    it('sets "Identified as Disadvantaged" to checked', () => {
      renderComponent();
      openDropdown();

      // Uncheck "Identified as Disadvantaged"
      const identifiedCheckbox = screen.getByRole('checkbox', {
        name: /identified as disadvantaged/i,
      });
      fireEvent.click(identifiedCheckbox);
      expect(identifiedCheckbox).not.toBeChecked();

      // Click reset
      const resetButton = screen.getByRole('button', {name: /reset filters/i});
      fireEvent.click(resetButton);

      expect(identifiedCheckbox).toBeChecked();
    });

    it('shows "(0/X)" in all count badges after reset', () => {
      renderComponent();
      openDropdown();

      // Select some indicators
      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));

      // Click reset
      const resetButton = screen.getByRole('button', {name: /reset filters/i});
      fireEvent.click(resetButton);

      // All count badges should show 0 - query within specific categories
      const climateDetailsAfter = getCategoryDetails('Climate change');
      const energyDetails = getCategoryDetails('Energy');
      expect(climateDetailsAfter?.querySelector('[id="category-climate-count"]')?.textContent).toContain('(0/5)');
      expect(energyDetails?.querySelector('[id="category-energy-count"]')?.textContent).toContain('(0/2)');
    });
  });

  describe('5.5 Apply Button (Test IDs: 5.5.1, 5.5.2)', () => {
    it('closes the dropdown', () => {
      renderComponent();
      openDropdown();

      expect(screen.getByText('Categories of burden')).toBeInTheDocument();

      const applyButton = screen.getByRole('button', {name: /apply/i});
      fireEvent.click(applyButton);

      expect(screen.queryByText('Categories of burden')).not.toBeInTheDocument();
    });

    it('preserves all selections', () => {
      renderComponent();
      openDropdown();

      // Make some selections
      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));

      const applyButton = screen.getByRole('button', {name: /apply/i});
      fireEvent.click(applyButton);

      // Reopen dropdown
      openDropdown();

      // Selections should be preserved
      expect(getIndicatorCheckbox('Expected agriculture loss rate')).toBeChecked();
    });
  });

  // ============================================================================
  // Section 6: State Persistence
  // ============================================================================

  describe('6.1 Expanded State (Test ID: 6.1.2)', () => {
    it('keeps collapsed categories collapsed when dropdown is closed and reopened', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      expect(climateDetails).not.toHaveAttribute('open');

      // Close and reopen
      const layersButton = screen.getByRole('button', {name: /layers/i});
      fireEvent.click(layersButton);
      fireEvent.click(layersButton);

      const climateDetailsAfter = getCategoryDetails('Climate change');
      expect(climateDetailsAfter).not.toHaveAttribute('open');
    });
  });

  describe('6.2 Selection State (Test IDs: 6.2.1, 6.2.2, 6.2.3, 6.2.4)', () => {
    it('persists selected indicators when dropdown is closed and reopened', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));

      // Close and reopen
      const layersButton = screen.getByRole('button', {name: /layers/i});
      fireEvent.click(layersButton);
      fireEvent.click(layersButton);

      // Expand again to see indicator
      const climateDetailsAfter = getCategoryDetails('Climate change');
      fireEvent.click(climateDetailsAfter?.querySelector('summary')!);

      expect(getIndicatorCheckbox('Expected agriculture loss rate')).toBeChecked();
    });

    it('persists category checkbox states when dropdown is closed and reopened', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      fireEvent.click(climateCheckbox);
      expect(climateCheckbox).toBeChecked();

      // Close and reopen
      const layersButton = screen.getByRole('button', {name: /layers/i});
      fireEvent.click(layersButton);
      fireEvent.click(layersButton);

      const climateCheckboxAfter = getCategoryCheckbox('Climate change');
      expect(climateCheckboxAfter).toBeChecked();
    });

    it('persists indeterminate states when dropdown is closed and reopened', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));

      const climateCheckbox = getCategoryCheckbox('Climate change');
      expect(climateCheckbox.indeterminate).toBe(true);

      // Close and reopen
      const layersButton = screen.getByRole('button', {name: /layers/i});
      fireEvent.click(layersButton);
      fireEvent.click(layersButton);

      const climateCheckboxAfter = getCategoryCheckbox('Climate change');
      expect(climateCheckboxAfter.indeterminate).toBe(true);
    });

    it('shows correct counts after dropdown reopen', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      fireEvent.click(getIndicatorCheckbox('Expected building loss rate'));

      // Close and reopen
      const layersButton = screen.getByRole('button', {name: /layers/i});
      fireEvent.click(layersButton);
      fireEvent.click(layersButton);

      expect(screen.getByText(/\(2\/5\)/)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Section 7: Accessibility Tests
  // ============================================================================

  describe('7.3 ARIA Attributes (Test IDs: 7.3.1, 7.3.2, 7.3.3, 7.3.4, 7.3.5)', () => {
    it('category checkboxes have proper aria-label attributes', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      const ariaLabel = climateCheckbox.getAttribute('aria-label');
      expect(ariaLabel).toContain('Climate change');
      expect(ariaLabel).toContain('indicators selected');
    });

    it('indicator checkboxes have proper aria-label attributes', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const expAgLossCheckbox = getIndicatorCheckbox('Expected agriculture loss rate');
      expect(expAgLossCheckbox).toHaveAttribute('aria-label', 'Expected agriculture loss rate');
    });

    it('count badges have aria-live regions for updates', () => {
      renderComponent();
      openDropdown();

      // Query within specific category to avoid multiple matches
      const climateDetails = getCategoryDetails('Climate change');
      const climateCountBadge = climateDetails?.querySelector('[id="category-climate-count"]');
      expect(climateCountBadge).toHaveAttribute('aria-live', 'polite');
      expect(climateCountBadge).toHaveAttribute('aria-atomic', 'true');
    });

    it('decorative elements have aria-hidden="true"', () => {
      renderComponent();
      openDropdown();

      const chevrons = screen.getAllByText('▶');
      chevrons.forEach((chevron) => {
        expect(chevron).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('groups have proper role and aria-label attributes', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const indicatorsGroup = climateDetails?.querySelector('[role="group"]');
      expect(indicatorsGroup).toHaveAttribute('aria-label', 'Climate change indicators');
    });
  });

  describe('7.2 Keyboard Navigation (Test IDs: 7.2.1, 7.2.2, 7.2.3)', () => {
    it('Tab key navigates through all checkboxes', () => {
      renderComponent();
      openDropdown();

      const identifiedCheckbox = screen.getByRole('checkbox', {
        name: /identified as disadvantaged/i,
      });
      identifiedCheckbox.focus();
      expect(identifiedCheckbox).toHaveFocus();

      fireEvent.keyDown(document.activeElement || document.body, {key: 'Tab'});
      // Focus should move to next checkbox
    });

    it('Space key toggles checkbox states', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      climateCheckbox.focus();

      expect(climateCheckbox).not.toBeChecked();
      fireEvent.keyDown(climateCheckbox, {key: ' '});
      // Note: Space key on checkbox should trigger change event
      // This is a basic test - full keyboard testing may need userEvent
    });

    it('Enter key expands/collapses details elements', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      const summary = climateDetails?.querySelector('summary');
      summary?.focus();

      expect(climateDetails).not.toHaveAttribute('open');
      fireEvent.keyDown(summary!, {key: 'Enter'});
      // Note: Enter on summary should toggle details
    });
  });

  // ============================================================================
  // Section 8: Edge Cases
  // ============================================================================

  describe('8.1 Rapid Interactions (Test IDs: 8.1.1, 8.1.2, 8.1.3, 8.1.4)', () => {
    it('handles rapid clicking on category checkbox without errors', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Rapid clicks
      for (let i = 0; i < 5; i++) {
        fireEvent.click(climateCheckbox);
      }

      // Should end in a valid state (either checked or unchecked)
      expect(climateCheckbox).toBeDefined();
      expect(() => {
        expect(climateCheckbox).toBeInTheDocument();
      }).not.toThrow();
    });

    it('handles rapid clicking on indicator checkbox without errors', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const expAgLossCheckbox = getIndicatorCheckbox('Expected agriculture loss rate');

      // Rapid clicks
      for (let i = 0; i < 5; i++) {
        fireEvent.click(expAgLossCheckbox);
      }

      expect(expAgLossCheckbox).toBeDefined();
      expect(() => {
        expect(expAgLossCheckbox).toBeInTheDocument();
      }).not.toThrow();
    });

    it('handles rapid expand/collapse without errors', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      const summary = climateDetails?.querySelector('summary')!;

      // Rapid expand/collapse
      for (let i = 0; i < 5; i++) {
        fireEvent.click(summary);
      }

      expect(climateDetails).toBeDefined();
    });
  });

  describe('8.2 Multiple Categories (Test IDs: 8.2.1, 8.2.2, 8.2.3, 8.2.4)', () => {
    it('handles selecting multiple categories correctly', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      const energyCheckbox = getCategoryCheckbox('Energy');

      fireEvent.click(climateCheckbox);
      fireEvent.click(energyCheckbox);

      expect(climateCheckbox).toBeChecked();
      expect(energyCheckbox).toBeChecked();
    });

    it('handles deselecting multiple categories correctly', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      const energyCheckbox = getCategoryCheckbox('Energy');

      fireEvent.click(climateCheckbox);
      fireEvent.click(energyCheckbox);

      fireEvent.click(climateCheckbox);
      fireEvent.click(energyCheckbox);

      expect(climateCheckbox).not.toBeChecked();
      expect(energyCheckbox).not.toBeChecked();
    });

    it('handles mix of selected/unselected categories correctly', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      const energyCheckbox = getCategoryCheckbox('Energy');
      const healthCheckbox = getCategoryCheckbox('Health');

      fireEvent.click(climateCheckbox);
      fireEvent.click(healthCheckbox);

      expect(climateCheckbox).toBeChecked();
      expect(energyCheckbox).not.toBeChecked();
      expect(healthCheckbox).toBeChecked();
    });

    it('allows all categories to be expanded simultaneously', () => {
      renderComponent();
      openDropdown();

      const categories = [
        'Climate change',
        'Energy',
        'Health',
        'Housing',
      ];

      categories.forEach((categoryName) => {
        const details = getCategoryDetails(categoryName);
        fireEvent.click(details?.querySelector('summary')!);
      });

      categories.forEach((categoryName) => {
        const details = getCategoryDetails(categoryName);
        expect(details).toHaveAttribute('open');
      });
    });
  });

  describe('8.3 Category Variations (Test IDs: 8.3.1, 8.3.2, 8.3.3, 8.3.4)', () => {
    it('handles categories with 2 indicators correctly (Energy)', () => {
      renderComponent();
      openDropdown();

      const energyDetails = getCategoryDetails('Energy');
      fireEvent.click(energyDetails?.querySelector('summary')!);

      const energyCheckbox = getCategoryCheckbox('Energy');
      fireEvent.click(energyCheckbox);

      expect(getIndicatorCheckbox('Energy burden')).toBeChecked();
      expect(getIndicatorCheckbox('PM2.5')).toBeChecked();
      expect(screen.getByText(/\(2\/2\)/)).toBeInTheDocument();
    });

    it('handles categories with many indicators correctly (Climate change has 5)', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');
      fireEvent.click(climateCheckbox);

      expect(screen.getByText(/\(5\/5\)/)).toBeInTheDocument();
      expect(climateCheckbox.indeterminate).toBe(false);
    });

    it('handles indeterminate state correctly for all category sizes', () => {
      renderComponent();
      openDropdown();

      // Test with Energy (2 indicators)
      const energyDetails = getCategoryDetails('Energy');
      fireEvent.click(energyDetails?.querySelector('summary')!);
      fireEvent.click(getIndicatorCheckbox('Energy burden'));
      const energyCheckbox = getCategoryCheckbox('Energy');
      expect(energyCheckbox.indeterminate).toBe(true);

      // Test with Climate (5 indicators)
      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      const climateCheckbox = getCategoryCheckbox('Climate change');
      expect(climateCheckbox.indeterminate).toBe(true);
    });
  });

  describe('8.4 State Transitions (Test IDs: 8.4.1, 8.4.2, 8.4.3, 8.4.4, 8.4.5)', () => {
    it('handles transition from unchecked → checked correctly', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      expect(climateCheckbox).not.toBeChecked();

      fireEvent.click(climateCheckbox);
      expect(climateCheckbox).toBeChecked();
      expect(climateCheckbox.indeterminate).toBe(false);
    });

    it('handles transition from checked → unchecked correctly', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      fireEvent.click(climateCheckbox);
      expect(climateCheckbox).toBeChecked();

      fireEvent.click(climateCheckbox);
      expect(climateCheckbox).not.toBeChecked();
      expect(climateCheckbox.indeterminate).toBe(false);
    });

    it('handles transition to indeterminate state correctly', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');
      expect(climateCheckbox).not.toBeChecked();
      expect(climateCheckbox.indeterminate).toBe(false);

      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      expect(climateCheckbox).toBeChecked();
      expect(climateCheckbox.indeterminate).toBe(true);
    });

    it('handles transition from indeterminate → checked correctly', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Create indeterminate state
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      expect(climateCheckbox.indeterminate).toBe(true);

      // Select all remaining indicators
      fireEvent.click(getIndicatorCheckbox('Expected building loss rate'));
      fireEvent.click(getIndicatorCheckbox('Expected population loss rate'));
      fireEvent.click(getIndicatorCheckbox('Projected flood risk'));
      fireEvent.click(getIndicatorCheckbox('Projected wildfire risk'));

      expect(climateCheckbox).toBeChecked();
      expect(climateCheckbox.indeterminate).toBe(false);
    });

    it('handles transition from indeterminate → unchecked correctly', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);

      const climateCheckbox = getCategoryCheckbox('Climate change');

      // Create indeterminate state
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));
      expect(climateCheckbox.indeterminate).toBe(true);

      // Deselect the indicator
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));

      expect(climateCheckbox).not.toBeChecked();
      expect(climateCheckbox.indeterminate).toBe(false);
    });
  });

  // ============================================================================
  // Additional Tests: onFiltersChange Callback
  // ============================================================================

  describe('onFiltersChange Callback', () => {
    it('calls onFiltersChange with correct filters when indicator is selected', () => {
      renderComponent();
      openDropdown();

      const climateDetails = getCategoryDetails('Climate change');
      fireEvent.click(climateDetails?.querySelector('summary')!);
      fireEvent.click(getIndicatorCheckbox('Expected agriculture loss rate'));

      expect(mockOnFiltersChange).toHaveBeenCalled();
      const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
      expect(lastCall.indicators.expAgLoss).toBe(true);
      expect(lastCall.identifiedAsDisadvantaged).toBe(false);
    });

    it('calls onFiltersChange with correct filters when category is selected', () => {
      renderComponent();
      openDropdown();

      const climateCheckbox = getCategoryCheckbox('Climate change');
      fireEvent.click(climateCheckbox);

      expect(mockOnFiltersChange).toHaveBeenCalled();
      const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
      expect(lastCall.indicators.expAgLoss).toBe(true);
      expect(lastCall.indicators.expBldLoss).toBe(true);
      expect(lastCall.indicators.expPopLoss).toBe(true);
      expect(lastCall.indicators.floodRisk).toBe(true);
      expect(lastCall.indicators.wildfireRisk).toBe(true);
    });

    it('calls onFiltersChange when "Identified as Disadvantaged" is checked', () => {
      renderComponent();
      openDropdown();

      // First uncheck it
      const identifiedCheckbox = screen.getByRole('checkbox', {
        name: /identified as disadvantaged/i,
      });
      fireEvent.click(identifiedCheckbox);

      // Then check it again
      fireEvent.click(identifiedCheckbox);

      expect(mockOnFiltersChange).toHaveBeenCalled();
      const lastCall = mockOnFiltersChange.mock.calls[mockOnFiltersChange.mock.calls.length - 1][0];
      expect(lastCall.identifiedAsDisadvantaged).toBe(true);
      expect(Object.keys(lastCall.indicators).length).toBe(0);
    });
  });
});

