# Layer Filter UI Design Considerations

## Overview
This document outlines the design trade-offs for implementing the layer filter/toggle functionality, specifically focusing on the placement and interaction pattern of the layer selection UI.

## Design Options Evaluated

### Option 1: Dropdown on Map (Current Implementation)
**Placement:** Floating dropdown button/panel directly on the map canvas

**Pros:**
- ✅ Contextually located - users can see the map while adjusting layers
- ✅ Doesn't take up header space
- ✅ Familiar pattern for map applications (similar to Mapbox, Google Maps)
- ✅ Easy to position relative to map controls
- ✅ Works well on both desktop and mobile
- ✅ Doesn't interfere with existing header navigation
- ✅ Can be positioned to avoid overlapping with other map controls

**Cons:**
- ❌ May overlap with map features when open
- ❌ Requires z-index management to ensure it appears above map
- ❌ Could be obscured by map popups or other overlays
- ❌ May need to handle map scrolling/wheel events when dropdown is open
- ❌ Mobile may be touch with scrolling (need to test)


**Implementation Notes:**
- Positioned as a child of ReactMapGL component
- Uses CSS modules for styling
- Handles wheel event propagation to prevent map scrolling when dropdown is open
- Can be positioned using CSS (top, left, right, bottom) relative to map container

---

### Option 2: Header Navigation Integration
**Placement:** Layer filter integrated into the main site header/navigation

**Pros:**
- ✅ Consistent with other site navigation elements
- ✅ Always visible and accessible
- ✅ Doesn't interfere with map view
- ✅ Standard web pattern - users expect filters in headers
- ✅ Can be part of a persistent navigation bar
- ✅ Good for accessibility (keyboard navigation, screen readers)

**Cons:**
- ❌ Takes up valuable header space
- ❌ May require header redesign to accommodate
- ❌ Less contextually connected to the map
- ❌ Could be missed by users focused on the map
- ❌ May need to scroll to see on mobile
- ❌ Header might become cluttered with too many controls

**Implementation Considerations:**
- Would require modifying header component
- Need to coordinate with existing navigation structure
- May need responsive design for mobile (hamburger menu, etc.)
- Would need to pass filter state between header and map components

---

### Option 3: Modal/Dialog
**Placement:** Full-screen or overlay modal that opens when user clicks a button

**Pros:**
- ✅ Doesn't take up persistent screen space
- ✅ Can display more information and options
- ✅ Clear focus - user knows they're in a settings mode
- ✅ Good for complex filtering with many options
- ✅ Can include help text, descriptions, examples
- ✅ Standard pattern for "settings" or "filters" in web apps
- ✅ Easy to make responsive (full screen on mobile)

**Cons:**
- ❌ Blocks map view when open
- ❌ Requires additional click to open/close
- ❌ Less convenient for quick toggles
- ❌ May feel heavy/over-engineered for simple layer selection
- ❌ Users can't see map changes in real-time while adjusting
- ❌ Modal management complexity (focus trapping, escape key, etc.)

**Implementation Considerations:**
- Would need modal component (possibly from USWDS)
- State management for open/closed
- Accessibility requirements (ARIA labels, focus management)
- Animation/transition considerations

---

### Option 4: Side Panel Integration
**Placement:** Layer filter integrated into the existing side panel (AreaDetail)

**Pros:**
- ✅ Uses existing side panel space
- ✅ No additional UI elements needed
- ✅ Contextually related to area details
- ✅ Users already look at side panel for information
- ✅ Consistent with existing panel patterns

**Cons:**
- ❌ Side panel is for displaying selected area details, not controls
- ❌ May confuse users about panel purpose
- ❌ Side panel may be collapsed/hidden
- ❌ Less discoverable if panel is closed
- ❌ Mixing display (read-only) with controls (interactive) may be confusing
- ❌ Side panel content changes based on selection - layer filter should be persistent

---

### Option 5: Toolbar/Control Strip
**Placement:** Dedicated toolbar above or below the map

**Pros:**
- ✅ Clear separation of controls from map
- ✅ Can accommodate multiple controls together
- ✅ Persistent visibility
- ✅ Good for power users who want quick access
- ✅ Can be styled as a cohesive control group

**Cons:**
- ❌ Takes up screen real estate
- ❌ May need to be collapsible/hideable
- ❌ Additional UI element to maintain
- ❌ May feel cluttered if many controls added
- ❌ Positioning relative to map can be tricky

---

## Decision: Dropdown on Map (Option 1)

### Rationale

After evaluating all options, **Option 1 (Dropdown on Map)** was selected for the following reasons:

1. **Contextual Relevance**: Layer filters are directly related to map visualization, so placing them on the map maintains clear context
2. **Space Efficiency**: Doesn't require header redesign or take up persistent screen space
3. **User Expectations**: Common pattern in modern map applications (Mapbox, Google Maps, Leaflet plugins)
4. **Flexibility**: Can be positioned to avoid conflicts with other map controls
5. **Progressive Disclosure**: Dropdown pattern allows hiding complexity until needed
6. **Mobile Friendly**: Works well on touch devices, can be positioned for thumb reach

### Implementation Details

**Component Structure:**
```
<ReactMapGL>
  <LayerFilter />  {/* Positioned on map */}
  <MapTractLayers />
  <MapTribalLayer />
  {/* Other map controls */}
</ReactMapGL>
```

**Key Features:**
- Collapsible dropdown with "Layers" button
- "New feature" badge to highlight the functionality
- Accordion for category organization
- Checkboxes for individual indicators
- "Reset filters" and "Apply" buttons
- Prevents map scrolling when dropdown is open (wheel event handling)

**Positioning:**
- Positioned using CSS relative to map container
- Can be adjusted via CSS variables or module styles
- Z-index managed to appear above map but below modals/popups

**Accessibility:**
- Button with `aria-expanded` attribute
- Keyboard navigable (accordion and checkboxes)
- Screen reader friendly labels
- Focus management when opening/closing

---

## Alternative Considerations for Future

### If Dropdown on Map Becomes Problematic:

1. **Hybrid Approach**: Keep dropdown on map, but add a header link that opens it
2. **Responsive Behavior**: On mobile, could convert to bottom sheet or full-screen modal
3. **Persistent Mini Panel**: Small always-visible panel with most-used filters, expandable for full options
4. **Keyboard Shortcut**: Add keyboard shortcut to open layer filter from anywhere

### Potential Enhancements:

- **Filter Presets**: Save/load common filter combinations
- **Filter History**: Remember recently used filter combinations
- **Visual Preview**: Show small preview of what each filter shows
- **Filter Count**: Display number of visible tracts based on current filters
- **Animation**: Smooth transitions when filters change

---

## User Testing Considerations

When testing the layer filter implementation, consider:

1. **Discoverability**: Can users find the layer filter?
2. **Usability**: Is it easy to understand and use?
3. **Performance**: Does filtering cause noticeable lag?
4. **Mobile Experience**: Is it usable on touch devices?
5. **Accessibility**: Can users with assistive technologies use it?
6. **Context Switching**: Do users understand what filters do?

---

## References

- Mapbox GL JS layer visibility patterns
- Google Maps layer control patterns
- USWDS accordion and form components
- React Map GL component patterns
- Accessibility guidelines for interactive map controls

