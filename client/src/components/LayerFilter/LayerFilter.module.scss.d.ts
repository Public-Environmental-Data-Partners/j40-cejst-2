declare namespace LayerFilterModuleScssNamespace {
  export interface ILayerFilterModuleScss {
    layerFilterContainer: string;
    filterHeader: string;
    newFeatureBadge: string;
    layersButton: string;
    chevron: string;
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
  }
}

declare const LayerFilterModuleScssModule: LayerFilterModuleScssNamespace.ILayerFilterModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LayerFilterModuleScssNamespace.ILayerFilterModuleScss;
};

export = LayerFilterModuleScssModule;

