declare namespace LayerFilterModuleScssNamespace {
  export interface ILayerFilterModuleScss {
    layerFilterContainer: string;
    filterHeader: string;
    zoomMessageBanner: string;
    zoomMessageBannerFadeIn: string;
    zoomMessageBannerEnabled: string;
    zoomMessageBannerReserveSpace: string;
    layersButton: string;
    layersButtonDisabled: string;
    chevron: string;
    fullScreenOverlay: string;
    fullScreenHeader: string;
    fullScreenTractCount: string;
    fullScreenClose: string;
    fullScreenPanel: string;
    dropdownPanel: string;
    panelTitle: string;
    mainCheckboxLabel: string;
    checkboxLabel: string;
    checkbox: string;
    indicatorsList: string;
    categoriesAccordion: string;
    actionButtons: string;
    resetButton: string;
    applyButton: string;
    categorySummary: string;
    chevronIcon: string;
    categoryCheckbox: string;
    categoryName: string;
    countBadge: string;
    categoryDetails: string;
    categoriesContainer: string;

  }
}

declare const LayerFilterModuleScssModule: LayerFilterModuleScssNamespace.ILayerFilterModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LayerFilterModuleScssNamespace.ILayerFilterModuleScss;
};

export = LayerFilterModuleScssModule;

