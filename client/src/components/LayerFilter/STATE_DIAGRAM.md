# LayerFilter Component - State Diagram

## Category Checkbox State Machine

```mermaid
stateDiagram-v2
    [*] --> Unchecked: Initial state
    
    Unchecked --> Checked: Check category<br/>Auto-expands
    Unchecked --> Indeterminate: Select some<br/>indicators
    
    Checked --> Unchecked: Uncheck category<br/>Deselects all
    Checked --> Indeterminate: Deselect some<br/>indicators
    
    Indeterminate --> Checked: Select remaining<br/>All selected
    Indeterminate --> Unchecked: Deselect all<br/>indicators
    
    Checked --> [*]: Reset filters
    Indeterminate --> [*]: Reset filters
    Unchecked --> [*]: Reset filters
```

## Category Expand/Collapse State Machine

```mermaid
stateDiagram-v2
    [*] --> Collapsed: Initial state
    
    Collapsed --> Expanded: Click summary<br/>OR<br/>Check category
    Expanded --> Collapsed: Click summary
    
    Expanded --> Expanded: Check category<br/>Already expanded
    Collapsed --> Expanded: Check category<br/>Auto-expand
    
    Expanded --> [*]: Reset filters<br/>Collapses all
    Collapsed --> [*]: Reset<br/>filters
```

## Indicator Selection State Machine (per category)

```mermaid
stateDiagram-v2
    [*] --> NoneSelected: Initial state
    
    NoneSelected --> SomeSelected: Select some<br/>Not all
    NoneSelected --> AllSelected: Select all<br/>OR<br/>Check category
    
    SomeSelected --> AllSelected: Select remaining<br/>OR<br/>Check category
    SomeSelected --> NoneSelected: Deselect all<br/>OR<br/>Uncheck category
    
    AllSelected --> SomeSelected: Deselect some<br/>indicators
    AllSelected --> NoneSelected: Deselect all<br/>OR<br/>Uncheck category
    
    NoneSelected --> [*]: Reset filters
    SomeSelected --> [*]: Reset filters
    AllSelected --> [*]: Reset filters
```

## Overall Filter State Machine

```mermaid
stateDiagram-v2
    [*] --> IdentifiedAsDisadvantaged: Initial state<br/>Default
    
    IdentifiedAsDisadvantaged --> IndicatorSelected: Select indicator<br/>OR<br/>Check category
    IndicatorSelected --> IdentifiedAsDisadvantaged: Check<br/>Identified Disadvantaged
    IndicatorSelected --> IndicatorSelected: Change<br/>selections
    
    IdentifiedAsDisadvantaged --> [*]: Reset filters
    IndicatorSelected --> [*]: Reset filters
```

## Combined Category State Diagram

```mermaid
stateDiagram-v2
    [*] --> State1: Initial
    
    state State1 {
        [*] --> CategoryUncheckedCollapsed
        CategoryUncheckedCollapsed --> CategoryUncheckedExpanded: Click summary
        CategoryUncheckedExpanded --> CategoryUncheckedCollapsed: Click summary
    }
    
    state State2 {
        [*] --> CategoryCheckedExpanded
        CategoryCheckedExpanded: All selected<br/>Expanded
    }
    
    state State3 {
        [*] --> CategoryIndeterminateExpanded
        CategoryIndeterminateExpanded: Some selected<br/>Expanded
    }
    
    state State4 {
        [*] --> CategoryIndeterminateCollapsed
        CategoryIndeterminateCollapsed: Some selected<br/>Collapsed
    }
    
    State1 --> State2: Check category<br/>Auto-expands
    State1 --> State3: Select some<br/>Expands manually
    State1 --> State4: Select some<br/>Stays collapsed
    
    State2 --> State3: Deselect some<br/>indicators
    State2 --> State1: Uncheck<br/>category
    
    State3 --> State2: Select all<br/>indicators
    State3 --> State1: Deselect all<br/>indicators
    State3 --> State4: Collapse<br/>category
    
    State4 --> State3: Expand<br/>category
    State4 --> State1: Deselect all<br/>indicators
    
    State1 --> [*]: Reset
    State2 --> [*]: Reset
    State3 --> [*]: Reset
    State4 --> [*]: Reset
```

## State Transition Table

| Current State | Action | Next State | Side Effects |
|--------------|--------|-----------|--------------|
| Category Unchecked, Collapsed | Check category | Category Checked, Expanded | All indicators selected, Auto-expand |
| Category Unchecked, Collapsed | Select some indicators | Category Indeterminate, Expanded/Collapsed | Category becomes checked with indeterminate |
| Category Unchecked, Expanded | Check category | Category Checked, Expanded | All indicators selected |
| Category Checked, Expanded | Uncheck category | Category Unchecked, Expanded | All indicators deselected |
| Category Checked, Expanded | Deselect some indicators | Category Indeterminate, Expanded | Category shows indeterminate |
| Category Indeterminate, Expanded | Select all indicators | Category Checked, Expanded | Indeterminate clears |
| Category Indeterminate, Expanded | Deselect all indicators | Category Unchecked, Expanded | Category becomes unchecked |
| Category Indeterminate, Collapsed | Expand category | Category Indeterminate, Expanded | No state change |
| Any state | Reset filters | Category Unchecked, Collapsed | All selections cleared |

## Key State Variables

### Category State
- `categoryStates[categoryId]`: boolean - Whether category checkbox is checked
- `categoryCheckboxRefs[categoryId].indeterminate`: boolean - Whether category shows indeterminate state
- `expandedCategories`: Set<string> - Which categories are expanded

### Filter State
- `filters.identifiedAsDisadvantaged`: boolean - Main filter state
- `filters.indicators`: {[key: string]: boolean} - Individual indicator selections

### Derived States
- **Category Checked**: `categoryStates[categoryId] === true && indeterminate === false`
- **Category Unchecked**: `categoryStates[categoryId] === false && indeterminate === false`
- **Category Indeterminate**: `categoryStates[categoryId] === true && indeterminate === true`
- **All Indicators Selected**: `selectedCount === category.indicators.length`
- **Some Indicators Selected**: `selectedCount > 0 && selectedCount < category.indicators.length`
- **No Indicators Selected**: `selectedCount === 0`

