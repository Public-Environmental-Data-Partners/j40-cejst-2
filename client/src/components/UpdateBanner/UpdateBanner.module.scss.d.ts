declare namespace UpdateBannerNamespace {
  export interface IUpdateBannerScss {
    updateBannerAlert: string;
    updateBannerContainer: string;
    updateBanner: string;
    updateBannerContent: string;
    updateBannerText: string;
    updatePillIcon: string;
    updateHeading: string;
  }
}

declare const UpdateBannerScssModule: UpdateBannerNamespace.IUpdateBannerScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UpdateBannerNamespace.IUpdateBannerScss;
};

export = UpdateBannerScssModule;
