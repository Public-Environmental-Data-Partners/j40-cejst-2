# LayerFilter Component - Test Plan

## 1. Visual Structure Tests

### 1.1 Category Display
- **1.1.1** All 8 categories are visible in the dropdown
- **1.1.2** Category names are displayed correctly (Climate change, Energy, Health, Housing, Legacy pollution, Transportation, Water and wastewater, Workforce development)
- **1.1.3** Categories are properly separated with visual dividers
- **1.1.4** Layout is responsive on different screen sizes

### 1.2 Chevron Icon
- **1.2.1** Chevron (▶) appears to the left of each category name
- **1.2.2** Chevron rotates 90° (becomes ▼) when category is expanded
- **1.2.3** Chevron rotation animation is smooth
- **1.2.4** Chevron state matches expand/collapse state

### 1.3 Category Checkbox
- **1.3.1** Category checkbox appears between chevron and category name
- **1.3.2** Checkbox is properly aligned with other elements
- **1.3.3** Checkbox styling matches other checkboxes in component
- **1.3.4** Checkbox shows checked state when category is selected
- **1.3.5** Checkbox shows unchecked state when category is not selected
- **1.3.6** Checkbox shows indeterminate state (dash) when some indicators are selected

### 1.4 Count Badge
- **1.4.1** Count badge appears to the right of category name
- **1.4.2** Count badge format is "(X/Y)" where X = selected, Y = total
- **1.4.3** Count badge is readable and properly positioned
- **1.4.4** Count badge doesn't cause text wrapping issues
- **1.4.5** Count badge updates in real-time when selections change

### 1.5 Indicator Display
- **1.5.1** Indicators are properly indented (24px) when category is expanded
- **1.5.2** Indicator checkboxes are aligned correctly
- **1.5.3** Indicator labels are readable
- **1.5.4** Indicators are hidden when category is collapsed
- **1.5.5** Indicators are visible when category is expanded

---

## 2. Expand/Collapse Functionality

### 2.1 Manual Expand/Collapse
- **2.1.1** Clicking category summary row expands the category
- **2.1.2** Clicking category summary row again collapses the category
- **2.1.3** Clicking chevron expands/collapses the category
- **2.1.4** Multiple categories can be expanded simultaneously
- **2.1.5** Expand/collapse state persists when dropdown is closed and reopened

### 2.2 Auto-Expand
- **2.2.1** Checking a category checkbox automatically expands that category
- **2.2.2** Auto-expand only happens when checking (not when unchecking)
- **2.2.3** Auto-expanded category shows all its indicators
- **2.2.4** Auto-expand works even if category was previously collapsed
- **2.2.5** Auto-expand works even if category was previously expanded

### 2.3 Smooth Scroll
- **2.3.1** When category auto-expands, it smoothly scrolls into view
- **2.3.2** Scroll only happens if category is not already visible
- **2.3.3** Scroll is smooth (not jarring)

### 2.4 Animations
- **2.4.1** Expand animation (slideDown) works for auto-expand
- **2.4.2** Expand animation works for first manual expand
- **2.4.3** Chevron rotation animation is smooth
- **2.4.4** Animations don't cause layout jumps
- **2.4.5** Animations don't cause performance issues

---

## 3. Category Checkbox Functionality

### 3.1 Category Selection
- **3.1.1** Checking category checkbox selects all indicators in that category
- **3.1.2** Unchecking category checkbox deselects all indicators in that category
- **3.1.3** Category checkbox state is independent of other categories
- **3.1.4** Clicking category checkbox does NOT expand/collapse the category (only toggles selection)

### 3.2 Category State Synchronization
- **3.2.1** When all indicators in a category are selected, category checkbox is checked
- **3.2.2** When no indicators in a category are selected, category checkbox is unchecked
- **3.2.3** When some indicators in a category are selected, category checkbox shows indeterminate state
- **3.2.4** Category checkbox state updates immediately when indicators change
- **3.2.5** Category checkbox state is accurate after dropdown close/reopen

### 3.3 Indeterminate State
- **3.3.1** Indeterminate state shows when some (but not all) indicators are selected
- **3.3.2** Indeterminate state clears when all indicators are selected
- **3.3.3** Indeterminate state clears when no indicators are selected
- **3.3.4** Indeterminate state persists when dropdown is closed and reopened
- **3.3.5** Indeterminate state is visually distinct (shows dash)

---

## 4. Indicator Checkbox Functionality

### 4.1 Individual Selection
- **4.1.1** Indicator checkboxes can be checked/unchecked independently
- **4.1.2** Checking an indicator updates the map correctly
- **4.1.3** Unchecking an indicator updates the map correctly
- **4.1.4** Indicator selections are independent across categories

### 4.2 Category State Updates
- **4.2.1** Selecting an indicator checks its parent category checkbox
- **4.2.2** Deselecting the last indicator in a category unchecks the category
- **4.2.3** Deselecting one indicator (when others remain) keeps category checked with indeterminate
- **4.2.4** Selecting all indicators in a category removes indeterminate state

### 4.3 Count Badge Updates
- **4.3.1** Count badge updates immediately when indicator is selected
- **4.3.2** Count badge updates immediately when indicator is deselected
- **4.3.3** Count badge shows correct numbers for all categories
- **4.3.4** Count badge format is consistent "(X/Y)"

---

## 5. Integration with Existing Features

### 5.1 "Identified as Disadvantaged" Checkbox
- **5.1.1** Checking "Identified as Disadvantaged" unchecks all category checkboxes
- **5.1.2** Checking "Identified as Disadvantaged" clears all indicator selections
- **5.1.3** Checking a category checkbox unchecks "Identified as Disadvantaged"
- **5.1.4** Checking an individual indicator unchecks "Identified as Disadvantaged"
- **5.1.5** Unchecking "Identified as Disadvantaged" preserves existing selections (if any)

### 5.2 "Low Income" Checkbox
- **5.2.1** "Low income" checkbox works independently
- **5.2.2** Checking "Low income" unchecks "Identified as Disadvantaged"
- **5.2.3** "Low income" checkbox state is preserved correctly

### 5.3 "Lands of Federally Recognized Tribes" Checkbox
- **5.3.1** "Lands of federally recognized tribes" checkbox works independently
- **5.3.2** Checking "Lands of federally recognized tribes" unchecks "Identified as Disadvantaged"
- **5.3.3** "Lands of federally recognized tribes" checkbox state is preserved correctly

### 5.4 Reset Filters Button
- **5.4.1** "Reset filters" button clears all indicator selections
- **5.4.2** "Reset filters" button unchecks all category checkboxes
- **5.4.3** "Reset filters" button collapses all categories
- **5.4.4** "Reset filters" button sets "Identified as Disadvantaged" to checked
- **5.4.5** "Reset filters" button clears all indeterminate states
- **5.4.6** After reset, all count badges show "(0/X)"

### 5.5 Apply Button
- **5.5.1** "Apply" button closes the dropdown
- **5.5.2** "Apply" button preserves all selections
- **5.5.3** "Apply" button preserves expanded state

### 5.6 Map Integration
- **5.6.1** Selecting indicators updates the map visualization
- **5.6.2** Deselecting indicators updates the map visualization
- **5.6.3** Selecting categories updates the map visualization
- **5.6.4** Resetting filters updates the map visualization
- **5.6.5** Map updates are immediate (no delay)

---

## 6. State Persistence

### 6.1 Expanded State
- **6.1.1** Expanded categories stay expanded when dropdown is closed and reopened
- **6.1.2** Collapsed categories stay collapsed when dropdown is closed and reopened
- **6.1.3** Mix of expanded and collapsed categories persists correctly
- **6.1.4** Expanded state resets on page refresh

### 6.2 Selection State
- **6.2.1** Selected indicators persist when dropdown is closed and reopened
- **6.2.2** Category checkbox states persist when dropdown is closed and reopened
- **6.2.3** Indeterminate states persist when dropdown is closed and reopened
- **6.2.4** Count badges show correct counts after dropdown reopen

---

## 7. Accessibility Tests

### 7.1 Screen Reader Support
- **7.1.1** Screen reader announces category checkbox with name and count
- **7.1.2** Screen reader announces count changes when selections change
- **7.1.3** Screen reader announces indicator checkboxes with their labels
- **7.1.4** Screen reader announces expand/collapse state changes
- **7.1.5** Screen reader announcements are clear and helpful

### 7.2 Keyboard Navigation
- **7.2.1** Tab key navigates through all checkboxes
- **7.2.2** Space key toggles checkbox states
- **7.2.3** Enter key expands/collapses details elements
- **7.2.4** Focus indicators are visible
- **7.2.5** Focus doesn't get trapped
- **7.2.6** Keyboard navigation works for all interactive elements

### 7.3 ARIA Attributes
- **7.3.1** Category checkboxes have proper aria-label attributes
- **7.3.2** Indicator checkboxes have proper aria-label attributes
- **7.3.3** Count badges have aria-live regions for updates
- **7.3.4** Decorative elements have aria-hidden="true"
- **7.3.5** Groups have proper role and aria-label attributes

---

## 8. Edge Cases

### 8.1 Rapid Interactions
- **8.1.1** Rapid clicking on category checkbox doesn't cause errors
- **8.1.2** Rapid clicking on indicator checkbox doesn't cause errors
- **8.1.3** Rapid expand/collapse doesn't cause errors
- **8.1.4** Rapid selection changes don't cause state inconsistencies

### 8.2 Multiple Categories
- **8.2.1** Selecting multiple categories works correctly
- **8.2.2** Deselecting multiple categories works correctly
- **8.2.3** Mix of selected/unselected categories works correctly
- **8.2.4** All categories can be expanded simultaneously without issues

### 8.3 Category Variations
- **8.3.1** Categories with 2 indicators work correctly (e.g., Energy)
- **8.3.2** Categories with many indicators work correctly (e.g., Climate change has 5)
- **8.3.3** All category sizes handle indeterminate state correctly
- **8.3.4** Count badges work correctly for all category sizes

### 8.4 State Transitions
- **8.4.1** Transition from unchecked → checked works correctly
- **8.4.2** Transition from checked → unchecked works correctly
- **8.4.3** Transition to indeterminate state works correctly
- **8.4.4** Transition from indeterminate → checked works correctly
- **8.4.5** Transition from indeterminate → unchecked works correctly

### 8.5 Error Handling
- **8.5.1** Component handles missing categories gracefully
- **8.5.2** Component handles empty categories gracefully (if any exist)
- **8.5.3** No console errors during normal operation
- **8.5.4** No null reference errors

---

## 9. Performance Tests

### 9.1 Rendering Performance
- **9.1.1** Component renders quickly on initial load
- **9.1.2** Expanding/collapsing categories doesn't cause lag
- **9.1.3** Selecting/deselecting doesn't cause lag
- **9.1.4** All categories expanded simultaneously doesn't cause performance issues

### 9.2 Animation Performance
- **9.2.1** Animations are smooth (60fps)
- **9.2.2** Animations don't cause jank or lag
- **9.2.3** Multiple animations simultaneously work smoothly

### 9.3 Memory
- **9.3.1** No memory leaks during extended use
- **9.3.2** Component cleanup works correctly
- **9.3.3** Event listeners are properly removed

---

## 10. Cross-Browser Tests

### 10.1 Chrome/Edge
- **10.1.1** All functionality works in Chrome
- **10.1.2** All functionality works in Edge
- **10.1.3** Visual appearance is consistent
- **10.1.4** Animations work correctly

### 10.2 Firefox
- **10.2.1** All functionality works in Firefox
- **10.2.2** Visual appearance is consistent
- **10.2.3** Animations work correctly
- **10.2.4** Indeterminate state displays correctly

### 10.3 Safari
- **10.3.1** All functionality works in Safari (if available)
- **10.3.2** Visual appearance is consistent
- **10.3.3** Animations work correctly
- **10.3.4** Indeterminate state displays correctly

---

## 11. Mobile/Responsive Tests

### 11.1 Touch Interactions
- **11.1.1** Touch targets are adequate size (44x44px minimum)
- **11.1.2** Tapping category checkbox works correctly
- **11.1.3** Tapping indicator checkbox works correctly
- **11.1.4** Tapping summary row expands/collapses correctly
- **11.1.5** No accidental triggers from small touch targets

### 11.2 Layout
- **11.2.1** Layout works on mobile screen sizes
- **11.2.2** Layout works on tablet screen sizes
- **11.2.3** Layout works on desktop screen sizes
- **11.2.4** No horizontal scrolling issues
- **11.2.5** Text doesn't overflow or wrap incorrectly

### 11.3 Dropdown Behavior
- **11.3.1** Dropdown opens/closes correctly on mobile
- **11.3.2** Dropdown is scrollable on mobile
- **11.3.3** Dropdown doesn't get cut off on small screens

---

## 12. Regression Tests

### 12.1 Existing Functionality
- **12.1.1** "Identified as Disadvantaged" checkbox still works as before
- **12.1.2** "Low income" checkbox still works as before
- **12.1.3** "Lands of federally recognized tribes" checkbox still works as before
- **12.1.4** Map updates still work correctly
- **12.1.5** All existing filter logic still works

### 12.2 No Breaking Changes
- **12.2.1** Component API hasn't changed (onFiltersChange callback)
- **12.2.2** LayerFilters interface is compatible
- **12.2.3** No console errors or warnings
- **12.2.4** No visual regressions

---

## Test Execution Notes

### Test Environment
- Test in development and production builds
- Test with different data states
- Test with various selection combinations

### Test Priority
- **Critical**: Sections 2, 3, 4, 5 (core functionality)
- **High**: Sections 1, 6, 7 (visual and accessibility)
- **Medium**: Sections 8, 9 (edge cases and performance)
- **Low**: Sections 10, 11, 12 (cross-browser and regression)

### Test References
- Use test IDs (e.g., 3.1.1, 5.4.2) to reference specific tests in bug reports
- Document any failures with the test ID and steps to reproduce
- Update this document if new test cases are discovered

