# LayerFilter Component - State Diagram

## Category Checkbox State Machine

```mermaid
stateDiagram-v2
    [*] --> Unchecked: Initial state
    
    Unchecked --> Checked: Check category<br/>Auto-expands<br/>Selects all
    Unchecked --> Checked: Select any<br/>indicator
    
    Checked --> Unchecked: Uncheck category<br/>Deselects all
    Checked --> Checked: Select/deselect<br/>indicators<br/>(stays checked if any selected)
    
    Checked --> [*]: Reset filters
    Unchecked --> [*]: Reset filters
```

## Category Expand/Collapse State Machine

```mermaid
stateDiagram-v2
    [*] --> Collapsed: Initial state
    
    Collapsed --> Expanded: Check category<br/>Auto-expands
    Expanded --> Expanded: Check category<br/>Already expanded
    Expanded --> Expanded: Select indicator<br/>Stays open
    
    Expanded --> [*]: Reset filters<br/>Collapses all
    Collapsed --> [*]: Reset<br/>filters
    
    note right of Expanded
        Categories stay open
        once expanded
        (cannot be collapsed)
    end note
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
        CategoryUncheckedCollapsed: Unchecked<br/>Collapsed
    }
    
    state State2 {
        [*] --> CategoryCheckedExpanded
        CategoryCheckedExpanded: Checked<br/>Expanded<br/>(any indicators selected)
    }
    
    State1 --> State2: Check category<br/>Auto-expands<br/>Selects all
    State1 --> State2: Select any<br/>indicator<br/>Auto-expands
    
    State2 --> State2: Select/deselect<br/>indicators<br/>(stays checked if any selected)
    State2 --> State1: Uncheck category<br/>Deselects all<br/>(stays expanded)
    
    State1 --> [*]: Reset
    State2 --> [*]: Reset
    
    note right of State2
        Categories stay open
        once expanded
        (cannot be collapsed)
    end note
```

## State Transition Table

| Current State | Action | Next State | Side Effects |
|--------------|--------|-----------|--------------|
| Category Unchecked, Collapsed | Check category | Category Checked, Expanded | All indicators selected, Auto-expand |
| Category Unchecked, Collapsed | Select any indicator | Category Checked, Expanded | Category auto-expands |
| Category Unchecked, Expanded | Check category | Category Checked, Expanded | All indicators selected |
| Category Checked, Expanded | Uncheck category | Category Unchecked, Expanded | All indicators deselected, stays expanded |
| Category Checked, Expanded | Deselect some indicators | Category Checked, Expanded | Category stays checked (if any remain selected) |
| Category Checked, Expanded | Deselect all indicators | Category Unchecked, Expanded | Category becomes unchecked, stays expanded |
| Any state | Reset filters | Category Unchecked, Collapsed | All selections cleared |

## Key State Variables

### Category State
- `categoryStates[categoryId]`: boolean - Whether category checkbox is checked
- `expandedCategories`: Set<string> - Which categories are expanded (stay open once opened)

### Filter State
- `filters.identifiedAsDisadvantaged`: boolean - Main filter state
- `filters.indicators`: {[key: string]: boolean} - Individual indicator selections

### Derived States
- **Category Checked**: `categoryStates[categoryId] === true` (when any indicators are selected)
- **Category Unchecked**: `categoryStates[categoryId] === false` (when no indicators are selected)
- **All Indicators Selected**: `selectedCount === category.indicators.length`
- **Some Indicators Selected**: `selectedCount > 0 && selectedCount < category.indicators.length`
- **No Indicators Selected**: `selectedCount === 0`

