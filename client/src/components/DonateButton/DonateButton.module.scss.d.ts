declare namespace DonateButtonNamespace {
    export interface IDonateButtonScss {
      donateButtonContainer: string;
      launchIcon: string;
    }
  }

declare const DonateButtonScssModule: DonateButtonNamespace.IDonateButtonScss & {
    /** WARNING: Only available when "css-loader" is used without "style-loader" or "mini-css-extract-plugin" */
    locals: DonateButtonNamespace.IDonateButtonScss;
  };

  export = DonateButtonScssModule;
