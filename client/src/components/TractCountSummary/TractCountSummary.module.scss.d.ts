declare namespace TractCountSummaryModuleScssNamespace {
  export interface ITractCountSummaryModuleScss {
    tractCountSummary: string;
  }
}

declare const TractCountSummaryModuleScssModule: TractCountSummaryModuleScssNamespace.ITractCountSummaryModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TractCountSummaryModuleScssNamespace.ITractCountSummaryModuleScss;
};

export = TractCountSummaryModuleScssModule;
