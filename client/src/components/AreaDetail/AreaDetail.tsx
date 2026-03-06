/* eslint-disable quotes */
// External Libs:
import {Accordion} from "@trussworks/react-uswds";
import {MessageDescriptor, useIntl} from "gatsby-plugin-intl";
import React from "react";

// Components:
import Category from "../Category";
import DonutCopy from "../DonutCopy";
import Indicator from "../Indicator";
import PrioritizationCopy from "../PrioritizationCopy";
import PrioritizationCopy2 from "../PrioritizationCopy2";
import TractDemographics from "../TractDemographics";
import TractInfo from "../TractInfo";
import TractPrioritization from "../TractPrioritization";

// Styles and constants:
import * as constants from "../../data/constants";
import * as EXPLORE_COPY from "../../data/copy/explore";
import {getIndicatorById, INDICATOR_REGISTRY} from "../../data/indicators/registry";
import type {LayerFilters} from "../LayerFilter";
import {getThresholdPropertyName} from "../../utils/indicatorRegion";
import {sidePanelStateToMapRegion} from "../../utils/mapRegion";
import * as styles from "./areaDetail.module.scss";

// @ts-ignore
import IslandCopy from "../IslandCopy/IslandCopy";

interface IAreaDetailProps {
  properties: constants.J40Properties;
  hash: string[];
  /** LayerFilter state; when provided, used to filter content and show selected-burdens summary. */
  layerFilters?: LayerFilters;
}

/**
 * There are a 4 different indicator types. Each indicator type will render in the UI differently.
 *
 * percentile - is the majority of indicators
 * percents - a few indicators fall into this type
 * boolean - 3 indicators are of boolean type
 *    - historic redlining
 *    - abandoned land mines
 *    - FUDS
 *
 */
export type indicatorType = "percentile" | "percent" | "boolean";

/**
 * This interface is used as define the various fields for each indicator in the side panel
 *  label: the indicator label or title
 *  description: the description of the indicator used in the side panel
 *  type: see indicatorType above
 *  value: the number from the geoJSON tile. If tile doesn't exist it get a null value. Could be boolean also
 *  isDisadvagtaged: the flag from the geoJSON tile
 *  threshold: a custom value of threshold for certain indicators
 *  */
export interface indicatorInfo {
  id?: string; // Canonical indicator ID (for future filtering)
  label: string;
  description: string;
  type: indicatorType;
  value: number | boolean | null;
  isDisadvagtaged: boolean;
  threshold?: number;
}

/**
 * This interface is used as define the various fields for category in the side panel
 * id: distict id
 * titleText: display text for the category title
 * indicators: an array of indicators
 * socioEcIndicators: an array of socioeconomic indicators
 * isDisadvagtaged: boolean to indicate if the category is disadvantaged
 * isExceed1MoreBurden: boolean to indicate if the category exceeds more than one burden
 * isExceedBothSocioBurdens: boolean to indicate if the category exceeds both socio-eco burdens
 *  */
export interface ICategory {
  id: string;
  titleText: string;
  indicators: indicatorInfo[];
  socioEcIndicators: indicatorInfo[];
  isDisadvagtaged: boolean | null;
  isExceed1MoreBurden: boolean | null;
  isExceedBothSocioBurdens: boolean | null;
}

/**
 * This filter will remove indicators from appearing in the side panel by returning
 * the filter function (currying). There is 1 use case. It can accept any indicator name
 * as an input.
 *
 * 1. For Historic underinvestment if the value is null
 *
 * Recommendation is to use a separate filter for each indicator that needs filtering.
 *
 * @param {MessageDescriptor} label - allows to re-use this filter for any number of indicators
 * @return {indicatorInfo}
 */
export const indicatorFilter = (label: MessageDescriptor) => {
  const intl = useIntl();

  return (indicator: indicatorInfo) =>
    indicator.label !== intl.formatMessage(label) ||
    (indicator.label == intl.formatMessage(label) && indicator.value != null);
};

/**
 * Function to calculate the tribal area percentage value to display when a tract is selected
 *
 * @param {number} tribalPercentRaw
 * @return {string}
 */
export const getTribalPercentValue = (tribalPercentRaw: number) => {
  if (tribalPercentRaw === undefined) {
    return ` none`;
  }

  if (tribalPercentRaw === 0) {
    // test tract = #9.03/42.9242/-98.8015
    return ` less than 1%`;
  }

  if (tribalPercentRaw && tribalPercentRaw > 0) {
    return ` ${parseFloat((tribalPercentRaw * 100).toFixed())} %`;
  }
};

/**
 * Map AreaDetail category IDs to registry/LayerFilter category IDs (for filtering by LayerFilter selection).
 */
const AREA_DETAIL_TO_REGISTRY_CATEGORY: {[key: string]: string} = {
  "climate-change": "climate",
  "clean-energy": "energy",
  "health-burdens": "health",
  "sustain-house": "housing",
  "leg-pollute": "pollution",
  "clean-transport": "transportation",
  "clean-water": "water",
  "work-dev": "workforce",
};

/**
 * This is the main component. It will render the entire side panel and show the details
 * of the area/feature that is selected.
 *
 * @param {IAreaDetailProps} {}
 * @return {void}
 */
const AreaDetail = ({properties, layerFilters}: IAreaDetailProps) => {
  const intl = useIntl();

  /**
   * "ID as disadv only" = show full panel (current behavior).
   * "Custom selection" = show only selected indicators and X-of-Y summary.
   */
  const useCustomIndicatorView = Boolean(
      layerFilters &&
    !(
      layerFilters.identifiedAsDisadvantaged &&
      Object.keys(layerFilters.indicators).length === 0
    ),
  );

  /**
   * Selected burden IDs (registry only; excludes e.g. tribalLands).
   */
  const selectedBurdenIds =
    useCustomIndicatorView && layerFilters ?
      Object.keys(layerFilters.indicators).filter((id) =>
        Object.prototype.hasOwnProperty.call(INDICATOR_REGISTRY, id),
      ) :
      [];

  const selectedBurdenCountY = selectedBurdenIds.length;

  const tribalLandsFilterOn = Boolean(layerFilters?.indicators?.tribalLands);
  const tractHasTribalLand = Boolean(
      properties &&
      typeof properties[constants.TRIBAL_AREAS_PERCENTAGE] === "number" &&
      properties[constants.TRIBAL_AREAS_PERCENTAGE] > 0,
  );
  const showTribalLandsMessage = tribalLandsFilterOn && tractHasTribalLand;

  /**
   * Set the indicators for a given category.
   * @param {string} id the category ID
   * @param {indicatorInfo[]} indicators the indicators to set for the category.
   * @throws Error if the category ID does not exist
   */
  const setCategoryIndicators = (id: string, indicators: indicatorInfo[]) => {
    const cat = categories.find((category) => category.id === id);
    if (cat) cat.indicators = indicators;
    else throw new Error("Unknown side panel category ID " + id);
  };


  // console.log the properties of the census that is selected:
  console.log(
      "BE signals for tract (last one is the tract currently selected): ",
      properties,
  );

  // console.log around the donut, adjacency and tribal info:
  console.log(
      "Income imputed? ",
    properties[constants.IMPUTE_FLAG] === "0" ? " NO" : " YES",
  );
  console.log(
      "Adjacency indicator? ",
    properties[constants.ADJACENCY_EXCEEDS_THRESH] ? " YES" : " NO",
  );
  console.log(
      "% of tract tribal: ",
      getTribalPercentValue(properties[constants.TRIBAL_AREAS_PERCENTAGE]),
  );
  console.log(
      "Tribal count in AK: ",
    properties[constants.TRIBAL_AREAS_COUNT_AK] >= 1 ?
      ` ${properties[constants.TRIBAL_AREAS_COUNT_AK]}` :
      ` null`,
  );
  console.log(
      "Tribal count in CONUS: ",
    properties[constants.TRIBAL_AREAS_COUNT_CONUS] >= 1 ?
      ` ${properties[constants.TRIBAL_AREAS_COUNT_CONUS]}` :
      ` null`,
  );

  // Fix constants.MISSING_DATA_STRING import
  const blockGroup = properties[constants.GEOID_PROPERTY] ?
    properties[constants.GEOID_PROPERTY] :
    constants.MISSING_DATA_STRING;
  const population = properties[constants.TOTAL_POPULATION] ?
    properties[constants.TOTAL_POPULATION] :
    constants.MISSING_DATA_STRING;
  const countyName = properties[constants.COUNTY_NAME] ?
    properties[constants.COUNTY_NAME] :
    constants.MISSING_DATA_STRING;
  const stateName = properties[constants.STATE_NAME] ?
    properties[constants.STATE_NAME] :
    constants.MISSING_DATA_STRING;

  const sidePanelState = properties[constants.SIDE_PANEL_STATE];
  const mapRegionForIndicator = sidePanelStateToMapRegion(sidePanelState);
  const percentTractTribal =
    properties[constants.TRIBAL_AREAS_PERCENTAGE] >= 0 ?
      parseFloat(
          (properties[constants.TRIBAL_AREAS_PERCENTAGE] * 100).toFixed(),
      ) :
      null;

  /**
   * The workforce development category has some indicators who's source will vary depending on which
   * territory is selected. This function allows us to change the source of workforce development indicators
   * depending on which territory was selected
   *
   * @param {string} indicatorName
   * @return {void}
   */
  const getWorkForceIndicatorValue = (indicatorName: string) => {
    if (sidePanelState === constants.SIDE_PANEL_STATE_VALUES.ISLAND_AREAS) {
      if (indicatorName === "lowMedInc") {
        return properties.hasOwnProperty(
            constants.ISLAND_AREAS_LOW_MEDIAN_INCOME_LOW_HS_EDU_PERCENTILE_FIELD,
        ) ?
          properties[
              constants
                  .ISLAND_AREAS_LOW_MEDIAN_INCOME_LOW_HS_EDU_PERCENTILE_FIELD
          ] :
          null;
      }
      if (indicatorName === "unemploy") {
        return properties.hasOwnProperty(
            constants.ISLAND_AREAS_UNEMPLOYMENT_LOW_HS_EDU_PERCENTILE_FIELD,
        ) ?
          properties[
              constants.ISLAND_AREAS_UNEMPLOYMENT_LOW_HS_EDU_PERCENTILE_FIELD
          ] :
          null;
      }
      if (indicatorName === "poverty") {
        return properties.hasOwnProperty(
            constants.ISLAND_AREAS_POVERTY_LOW_HS_EDU_PERCENTILE_FIELD,
        ) ?
          properties[
              constants.ISLAND_AREAS_POVERTY_LOW_HS_EDU_PERCENTILE_FIELD
          ] :
          null;
      }
      if (indicatorName === "highSchool") {
        return properties.hasOwnProperty(
            constants.ISLAND_AREAS_HS_EDU_PERCENTAGE_FIELD,
        ) ?
          properties[constants.ISLAND_AREAS_HS_EDU_PERCENTAGE_FIELD] :
          null;
      }
    }

    if (indicatorName === "lowMedInc") {
      return properties.hasOwnProperty(constants.LOW_MEDIAN_INCOME_PERCENTILE) ?
        properties[constants.LOW_MEDIAN_INCOME_PERCENTILE] :
        null;
    }
    if (indicatorName === "unemploy") {
      return properties.hasOwnProperty(
          constants.UNEMPLOYMENT_PROPERTY_PERCENTILE,
      ) ?
        properties[constants.UNEMPLOYMENT_PROPERTY_PERCENTILE] :
        null;
    }
    if (indicatorName === "poverty") {
      return properties.hasOwnProperty(constants.POVERTY_BELOW_100_PERCENTILE) ?
        properties[constants.POVERTY_BELOW_100_PERCENTILE] :
        null;
    }
    if (indicatorName === "highSchool") {
      return properties.hasOwnProperty(
          constants.HIGH_SCHOOL_PROPERTY_PERCENTILE,
      ) ?
        properties[constants.HIGH_SCHOOL_PROPERTY_PERCENTILE] :
        null;
    }
  };

  /**
   * Workforce (and other) indicators use region-aware threshold property names (see indicatorRegion).
   * @param {string} indicatorName - Canonical indicator ID
   * @return {boolean | null} Threshold value when property present, null when missing
   */
  const getWorkForceIndicatorIsDisadv = (indicatorName: string) => {
    const prop = getThresholdPropertyName(indicatorName, mapRegionForIndicator);
    if (!prop) return null;
    return properties.hasOwnProperty(prop) ? properties[prop] : null;
  };

  /**
   * Count of selected burdens for which this tract exceeds the threshold (*_ET). Used for X-of-Y summary.
   * Uses region-aware threshold property names (Island Areas: IA_*, etc.).
   */
  const exceedCountX =
    useCustomIndicatorView && properties ?
      selectedBurdenIds.filter((id) => {
        const prop = getThresholdPropertyName(id, mapRegionForIndicator);
        return prop ? Boolean(properties[prop]) : false;
      }).length :
      0;

  /**
   * Define each indicator in the side panel with constants from copy file (for intl)
   *
   * Indicators are grouped by category
   */

  // Climate category
  const expAgLossDef = getIndicatorById('expAgLoss');
  const expAgLoss: indicatorInfo = {
    id: expAgLossDef.id,
    label: intl.formatMessage(expAgLossDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.EXP_AG_LOSS,
    ),
    type: "percentile",
    value: expAgLossDef.percentilePropertyName && properties.hasOwnProperty(expAgLossDef.percentilePropertyName) ?
      properties[expAgLossDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[expAgLossDef.thresholdPropertyName] ?
      properties[expAgLossDef.thresholdPropertyName] :
      null,
  };
  const expBldLossDef = getIndicatorById('expBldLoss');
  const expBldLoss: indicatorInfo = {
    id: expBldLossDef.id,
    label: intl.formatMessage(expBldLossDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.EXP_BLD_LOSS,
    ),
    type: "percentile",
    value: expBldLossDef.percentilePropertyName && properties.hasOwnProperty(expBldLossDef.percentilePropertyName) ?
      properties[expBldLossDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[expBldLossDef.thresholdPropertyName] ?
      properties[expBldLossDef.thresholdPropertyName] :
      null,
  };
  const expPopLossDef = getIndicatorById('expPopLoss');
  const expPopLoss: indicatorInfo = {
    id: expPopLossDef.id,
    label: intl.formatMessage(expPopLossDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.EXP_POP_LOSS,
    ),
    type: "percentile",
    value: expPopLossDef.percentilePropertyName && properties.hasOwnProperty(expPopLossDef.percentilePropertyName) ?
      properties[expPopLossDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[expPopLossDef.thresholdPropertyName] ?
      properties[expPopLossDef.thresholdPropertyName] :
      null,
  };
  const floodingDef = getIndicatorById('flooding');
  const flooding: indicatorInfo = {
    id: floodingDef.id,
    label: intl.formatMessage(floodingDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.FLOODING,
    ),
    type: "percentile",
    value: floodingDef.percentilePropertyName && properties.hasOwnProperty(floodingDef.percentilePropertyName) ?
      properties[floodingDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[floodingDef.thresholdPropertyName] ?
      properties[floodingDef.thresholdPropertyName] :
      null,
  };
  const wildfireDef = getIndicatorById('wildfire');
  const wildfire: indicatorInfo = {
    id: wildfireDef.id,
    label: intl.formatMessage(wildfireDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.WILDFIRE,
    ),
    type: "percentile",
    value: wildfireDef.percentilePropertyName && properties.hasOwnProperty(wildfireDef.percentilePropertyName) ?
      properties[wildfireDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[wildfireDef.thresholdPropertyName] ?
      properties[wildfireDef.thresholdPropertyName] :
      null,
  };
  // Shared socioeconomic indicator (appears in all categories)
  const lowIncDef = getIndicatorById('lowInc');
  const lowInc: indicatorInfo = {
    id: lowIncDef.id,
    label: intl.formatMessage(lowIncDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.LOW_INCOME,
    ),
    type: "percentile",
    value: lowIncDef.percentilePropertyName &&
      properties.hasOwnProperty(lowIncDef.percentilePropertyName) ?
      properties[lowIncDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[lowIncDef.thresholdPropertyName] ?
      properties[lowIncDef.thresholdPropertyName] :
      null,
    threshold: 65,
  };
  // const higherEd: indicatorInfo = {
  //   label: intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_INDICATORS.HIGH_ED),
  //   description: intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.HIGH_ED),
  //   type: 'percent',
  //   value: properties.hasOwnProperty(constants.NON_HIGHER_ED_PERCENTILE) ?
  //     properties[constants.NON_HIGHER_ED_PERCENTILE] : null,
  //   isDisadvagtaged: properties[constants.IS_HIGHER_ED_PERCENTILE] ?
  //     properties[constants.IS_HIGHER_ED_PERCENTILE] : null,
  //   threshold: 80,
  // };

  // Energy category
  const energyCostDef = getIndicatorById('energyCost');
  const energyCost: indicatorInfo = {
    id: energyCostDef.id,
    label: intl.formatMessage(energyCostDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.ENERGY_COST,
    ),
    type: "percentile",
    value: energyCostDef.percentilePropertyName && properties.hasOwnProperty(energyCostDef.percentilePropertyName) ?
      properties[energyCostDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[energyCostDef.thresholdPropertyName] ?
      properties[energyCostDef.thresholdPropertyName] :
      null,
  };
  const pm25Def = getIndicatorById('pm25');
  const pm25: indicatorInfo = {
    id: pm25Def.id,
    label: intl.formatMessage(pm25Def.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.PM_2_5,
    ),
    type: "percentile",
    value: pm25Def.percentilePropertyName && properties.hasOwnProperty(pm25Def.percentilePropertyName) ?
      properties[pm25Def.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[pm25Def.thresholdPropertyName] ?
      properties[pm25Def.thresholdPropertyName] :
      null,
  };

  // Health category
  const asthmaDef = getIndicatorById('asthma');
  const asthma: indicatorInfo = {
    id: asthmaDef.id,
    label: intl.formatMessage(asthmaDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.ASTHMA,
    ),
    type: "percentile",
    value: asthmaDef.percentilePropertyName && properties.hasOwnProperty(asthmaDef.percentilePropertyName) ?
      properties[asthmaDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[asthmaDef.thresholdPropertyName] ?
      properties[asthmaDef.thresholdPropertyName] :
      null,
  };
  const diabetesDef = getIndicatorById('diabetes');
  const diabetes: indicatorInfo = {
    id: diabetesDef.id,
    label: intl.formatMessage(diabetesDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.DIABETES,
    ),
    type: "percentile",
    value: diabetesDef.percentilePropertyName && properties.hasOwnProperty(diabetesDef.percentilePropertyName) ?
      properties[diabetesDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[diabetesDef.thresholdPropertyName] ?
      properties[diabetesDef.thresholdPropertyName] :
      null,
  };
  const heartDiseaseDef = getIndicatorById('heartDisease');
  const heartDisease: indicatorInfo = {
    id: heartDiseaseDef.id,
    label: intl.formatMessage(heartDiseaseDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.HEART_DISEASE,
    ),
    type: "percentile",
    value: heartDiseaseDef.percentilePropertyName && properties.hasOwnProperty(heartDiseaseDef.percentilePropertyName) ?
      properties[heartDiseaseDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[heartDiseaseDef.thresholdPropertyName] ?
      properties[heartDiseaseDef.thresholdPropertyName] :
      null,
  };
  const lifeExpectDef = getIndicatorById('lifeExpect');
  const lifeExpect: indicatorInfo = {
    id: lifeExpectDef.id,
    label: intl.formatMessage(lifeExpectDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.LOW_LIFE_EXPECT,
    ),
    type: "percentile",
    value: lifeExpectDef.percentilePropertyName && properties.hasOwnProperty(lifeExpectDef.percentilePropertyName) ?
      properties[lifeExpectDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[lifeExpectDef.thresholdPropertyName] ?
      properties[lifeExpectDef.thresholdPropertyName] :
      null,
  };

  // Housing category
  // NOTE: historicUnderinvest is a boolean indicator with special value checking logic
  const historicUnderinvestDef = getIndicatorById('historicUnderinvest');
  const historicUnderinvest: indicatorInfo = {
    id: historicUnderinvestDef.id,
    label: intl.formatMessage(historicUnderinvestDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.HIST_UNDERINVEST,
    ),
    type: "boolean",
    value: properties.hasOwnProperty(historicUnderinvestDef.thresholdPropertyName) ?
      properties[historicUnderinvestDef.thresholdPropertyName] ===
        constants.HISTORIC_UNDERINVESTMENT_RAW_YES ?
        true :
        false :
      null,
    isDisadvagtaged:
      properties.hasOwnProperty(historicUnderinvestDef.thresholdPropertyName) &&
      properties[historicUnderinvestDef.thresholdPropertyName] ===
        constants.HISTORIC_UNDERINVESTMENT_RAW_YES ?
      true :
      false,
  };
  const houseCostDef = getIndicatorById('houseCost');
  const houseCost: indicatorInfo = {
    id: houseCostDef.id,
    label: intl.formatMessage(houseCostDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.HOUSE_COST,
    ),
    type: "percentile",
    value: houseCostDef.percentilePropertyName && properties.hasOwnProperty(houseCostDef.percentilePropertyName) ?
      properties[houseCostDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[houseCostDef.thresholdPropertyName] ?
      properties[houseCostDef.thresholdPropertyName] :
      null,
  };
  const lackGreenSpaceDef = getIndicatorById('lackGreenSpace');
  const lackGreenSpace: indicatorInfo = {
    id: lackGreenSpaceDef.id,
    label: intl.formatMessage(lackGreenSpaceDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.LACK_GREEN_SPACE,
    ),
    type: "percentile",
    value: lackGreenSpaceDef.percentilePropertyName &&
      properties.hasOwnProperty(lackGreenSpaceDef.percentilePropertyName) ?
      properties[lackGreenSpaceDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[lackGreenSpaceDef.thresholdPropertyName] ?
      properties[lackGreenSpaceDef.thresholdPropertyName] :
      null,
  };
  const lackPlumbingDef = getIndicatorById('lackPlumbing');
  const lackPlumbing: indicatorInfo = {
    id: lackPlumbingDef.id,
    label: intl.formatMessage(lackPlumbingDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.LACK_PLUMBING,
    ),
    type: "percentile",
    value: lackPlumbingDef.percentilePropertyName && properties.hasOwnProperty(lackPlumbingDef.percentilePropertyName) ?
      properties[lackPlumbingDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[lackPlumbingDef.thresholdPropertyName] ?
      properties[lackPlumbingDef.thresholdPropertyName] :
      null,
  };
  const leadPaintDef = getIndicatorById('leadPaint');
  const leadPaint: indicatorInfo = {
    id: leadPaintDef.id,
    label: intl.formatMessage(leadPaintDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.LEAD_PAINT,
    ),
    type: "percentile",
    value: leadPaintDef.percentilePropertyName && properties.hasOwnProperty(leadPaintDef.percentilePropertyName) ?
      properties[leadPaintDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[leadPaintDef.thresholdPropertyName] ?
      properties[leadPaintDef.thresholdPropertyName] :
      null,
  };

  // Pollution categeory
  const abandonMinesDef = getIndicatorById('abandonMines');
  const abandonMines: indicatorInfo = {
    id: abandonMinesDef.id,
    label: intl.formatMessage(abandonMinesDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.ABANDON_MINES,
    ),
    type: "boolean",
    value: properties.hasOwnProperty(abandonMinesDef.thresholdPropertyName) ?
      properties[abandonMinesDef.thresholdPropertyName] :
      null,
    isDisadvagtaged: properties.hasOwnProperty(abandonMinesDef.thresholdPropertyName) ?
      properties[abandonMinesDef.thresholdPropertyName] :
      null,
  };
  // NOTE: formerDefSites is a boolean indicator with special value checking logic
  // Uses FORMER_DEF_SITES_RAW_VALUE for value (not thresholdPropertyName)
  const formerDefSitesDef = getIndicatorById('formerDefSites');
  const formerDefSites: indicatorInfo = {
    id: formerDefSitesDef.id,
    label: intl.formatMessage(formerDefSitesDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.FORMER_DEF_SITES,
    ),
    type: "boolean",
    // double equality is used in this instance as it seems that FUDS_RAW could be "1" or 1 from the BE
    value: properties.hasOwnProperty(constants.FORMER_DEF_SITES_RAW_VALUE) ?
      properties[constants.FORMER_DEF_SITES_RAW_VALUE] ==
        constants.FUDS_RAW_YES ?
        true :
        false :
      null,
    isDisadvagtaged: properties.hasOwnProperty(formerDefSitesDef.thresholdPropertyName) ?
      properties[formerDefSitesDef.thresholdPropertyName] :
      null,
  };
  const proxHazDef = getIndicatorById('proxHaz');
  const proxHaz: indicatorInfo = {
    id: proxHazDef.id,
    label: intl.formatMessage(proxHazDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.PROX_HAZ,
    ),
    type: "percentile",
    value: proxHazDef.percentilePropertyName &&
      properties.hasOwnProperty(proxHazDef.percentilePropertyName) ?
      properties[proxHazDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[proxHazDef.thresholdPropertyName] ?
      properties[proxHazDef.thresholdPropertyName] :
      null,
  };
  const proxRMPDef = getIndicatorById('proxRMP');
  const proxRMP: indicatorInfo = {
    id: proxRMPDef.id,
    label: intl.formatMessage(proxRMPDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.PROX_RMP,
    ),
    type: "percentile",
    value: proxRMPDef.percentilePropertyName &&
      properties.hasOwnProperty(proxRMPDef.percentilePropertyName) ?
      properties[proxRMPDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[proxRMPDef.thresholdPropertyName] ?
      properties[proxRMPDef.thresholdPropertyName] :
      null,
  };
  const proxNPLDef = getIndicatorById('proxNPL');
  const proxNPL: indicatorInfo = {
    id: proxNPLDef.id,
    label: intl.formatMessage(proxNPLDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.PROX_NPL,
    ),
    type: "percentile",
    value: proxNPLDef.percentilePropertyName &&
      properties.hasOwnProperty(proxNPLDef.percentilePropertyName) ?
      properties[proxNPLDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[proxNPLDef.thresholdPropertyName] ?
      properties[proxNPLDef.thresholdPropertyName] :
      null,
  };

  // Transpotation category
  const dieselPartMatterDef = getIndicatorById('dieselPartMatter');
  const dieselPartMatter: indicatorInfo = {
    id: dieselPartMatterDef.id,
    label: intl.formatMessage(dieselPartMatterDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.DIESEL_PARTICULATE_MATTER,
    ),
    type: "percentile",
    value: dieselPartMatterDef.percentilePropertyName &&
      properties.hasOwnProperty(dieselPartMatterDef.percentilePropertyName) ?
      properties[dieselPartMatterDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[dieselPartMatterDef.thresholdPropertyName] ?
      properties[dieselPartMatterDef.thresholdPropertyName] :
      null,
  };
  const barrierTransportDef = getIndicatorById('barrierTransport');
  const barrierTransport: indicatorInfo = {
    id: barrierTransportDef.id,
    label: intl.formatMessage(barrierTransportDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.BARRIER_TRANS,
    ),
    type: "percentile",
    value: barrierTransportDef.percentilePropertyName &&
      properties.hasOwnProperty(barrierTransportDef.percentilePropertyName) ?
      properties[barrierTransportDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[barrierTransportDef.thresholdPropertyName] ?
      properties[barrierTransportDef.thresholdPropertyName] :
      null,
  };
  const trafficVolumeDef = getIndicatorById('trafficVolume');
  const trafficVolume: indicatorInfo = {
    id: trafficVolumeDef.id,
    label: intl.formatMessage(trafficVolumeDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.TRAFFIC_VOLUME,
    ),
    type: "percentile",
    value: trafficVolumeDef.percentilePropertyName &&
      properties.hasOwnProperty(trafficVolumeDef.percentilePropertyName) ?
      properties[trafficVolumeDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[trafficVolumeDef.thresholdPropertyName] ?
      properties[trafficVolumeDef.thresholdPropertyName] :
      null,
  };

  // Water category
  const leakyTanksDef = getIndicatorById('leakyTanks');
  const leakyTanks: indicatorInfo = {
    id: leakyTanksDef.id,
    label: intl.formatMessage(leakyTanksDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.LEAKY_TANKS,
    ),
    type: "percentile",
    value: leakyTanksDef.percentilePropertyName &&
      properties.hasOwnProperty(leakyTanksDef.percentilePropertyName) ?
      properties[leakyTanksDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[leakyTanksDef.thresholdPropertyName] ?
      properties[leakyTanksDef.thresholdPropertyName] :
      null,
  };
  const wasteWaterDef = getIndicatorById('wasteWater');
  const wasteWater: indicatorInfo = {
    id: wasteWaterDef.id,
    label: intl.formatMessage(wasteWaterDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.WASTE_WATER,
    ),
    type: "percentile",
    value: wasteWaterDef.percentilePropertyName &&
      properties.hasOwnProperty(wasteWaterDef.percentilePropertyName) ?
      properties[wasteWaterDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[wasteWaterDef.thresholdPropertyName] ?
      properties[wasteWaterDef.thresholdPropertyName] :
      null,
  };

  // Workforce dev category
  const lingIsoDef = getIndicatorById('lingIso');
  const lingIso: indicatorInfo = {
    id: lingIsoDef.id,
    label: intl.formatMessage(lingIsoDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.LING_ISO,
    ),
    type: "percentile",
    value: lingIsoDef.percentilePropertyName &&
      properties.hasOwnProperty(lingIsoDef.percentilePropertyName) ?
      properties[lingIsoDef.percentilePropertyName] :
      null,
    isDisadvagtaged: properties[lingIsoDef.thresholdPropertyName] ?
      properties[lingIsoDef.thresholdPropertyName] :
      null,
  };
  // NOTE: lowMedInc uses special territory-specific logic via getWorkForceIndicatorValue
  const lowMedIncDef = getIndicatorById('lowMedInc');
  const lowMedInc: indicatorInfo = {
    id: lowMedIncDef.id,
    label: intl.formatMessage(lowMedIncDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.LOW_MED_INCOME,
    ),
    type: "percentile",
    value: getWorkForceIndicatorValue("lowMedInc"),
    isDisadvagtaged: getWorkForceIndicatorIsDisadv("lowMedInc"),
  };
  // NOTE: unemploy uses special territory-specific logic via getWorkForceIndicatorValue
  const unemployDef = getIndicatorById('unemploy');
  const unemploy: indicatorInfo = {
    id: unemployDef.id,
    label: intl.formatMessage(unemployDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.UNEMPLOY,
    ),
    type: "percentile",
    value: getWorkForceIndicatorValue("unemploy"),
    isDisadvagtaged: getWorkForceIndicatorIsDisadv("unemploy"),
  };
  // NOTE: poverty uses special territory-specific logic via getWorkForceIndicatorValue
  const povertyDef = getIndicatorById('poverty');
  const poverty: indicatorInfo = {
    id: povertyDef.id,
    label: intl.formatMessage(povertyDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.POVERTY,
    ),
    type: "percentile",
    value: getWorkForceIndicatorValue("poverty"),
    isDisadvagtaged: getWorkForceIndicatorIsDisadv("poverty"),
  };
  // NOTE: highSchool uses special territory-specific logic via getWorkForceIndicatorValue
  // Also note: type is "percent" not "percentile"
  const highSchoolDef = getIndicatorById('highSchool');
  const highSchool: indicatorInfo = {
    id: highSchoolDef.id,
    label: intl.formatMessage(highSchoolDef.i18nKey),
    description: intl.formatMessage(
        EXPLORE_COPY.SIDE_PANEL_INDICATOR_DESCRIPTION.HIGH_SKL,
    ),
    type: "percent",
    value: getWorkForceIndicatorValue("highSchool"),
    isDisadvagtaged: getWorkForceIndicatorIsDisadv("highSchool"),
    threshold: 10,
  };

  /**
   * Aggregate indicators based on categories
   *
   * The indicators property must be an array with last two elements being the
   * socioeconomic burdens.
   */
  let categories: ICategory[] = [
    {
      id: "climate-change",
      titleText: intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_CATEGORY.CLIMATE),
      indicators: [expAgLoss, expBldLoss, expPopLoss, flooding, wildfire],
      socioEcIndicators: [lowInc],
      isDisadvagtaged: properties[constants.IS_CLIMATE_FACTOR_DISADVANTAGED] ?
        properties[constants.IS_CLIMATE_FACTOR_DISADVANTAGED] :
        null,
      isExceed1MoreBurden: properties[
          constants.IS_CLIMATE_EXCEED_ONE_OR_MORE_INDICATORS
      ] ?
        properties[constants.IS_CLIMATE_EXCEED_ONE_OR_MORE_INDICATORS] :
        null,
      isExceedBothSocioBurdens: properties[
          constants.IS_EXCEED_BOTH_SOCIO_INDICATORS
      ] ?
        properties[constants.IS_EXCEED_BOTH_SOCIO_INDICATORS] :
        null,
    },
    {
      id: "clean-energy",
      titleText: intl.formatMessage(
          EXPLORE_COPY.SIDE_PANEL_CATEGORY.CLEAN_ENERGY,
      ),
      indicators: [energyCost, pm25],
      socioEcIndicators: [lowInc],
      isDisadvagtaged: properties[constants.IS_ENERGY_FACTOR_DISADVANTAGED] ?
        properties[constants.IS_ENERGY_FACTOR_DISADVANTAGED] :
        null,
      isExceed1MoreBurden: properties[
          constants.IS_ENERGY_EXCEED_ONE_OR_MORE_INDICATORS
      ] ?
        properties[constants.IS_ENERGY_EXCEED_ONE_OR_MORE_INDICATORS] :
        null,
      isExceedBothSocioBurdens: properties[
          constants.IS_EXCEED_BOTH_SOCIO_INDICATORS
      ] ?
        properties[constants.IS_EXCEED_BOTH_SOCIO_INDICATORS] :
        null,
    },
    {
      id: "health-burdens",
      titleText: intl.formatMessage(
          EXPLORE_COPY.SIDE_PANEL_CATEGORY.HEALTH_BURDEN,
      ),
      indicators: [asthma, diabetes, heartDisease, lifeExpect],
      socioEcIndicators: [lowInc],
      isDisadvagtaged: properties[constants.IS_HEALTH_FACTOR_DISADVANTAGED] ?
        properties[constants.IS_HEALTH_FACTOR_DISADVANTAGED] :
        null,
      isExceed1MoreBurden: properties[
          constants.IS_HEALTH_EXCEED_ONE_OR_MORE_INDICATORS
      ] ?
        properties[constants.IS_HEALTH_EXCEED_ONE_OR_MORE_INDICATORS] :
        null,
      isExceedBothSocioBurdens: properties[
          constants.IS_EXCEED_BOTH_SOCIO_INDICATORS
      ] ?
        properties[constants.IS_EXCEED_BOTH_SOCIO_INDICATORS] :
        null,
    },
    {
      id: "sustain-house",
      titleText: intl.formatMessage(
          EXPLORE_COPY.SIDE_PANEL_CATEGORY.SUSTAIN_HOUSE,
      ),
      indicators: [
        historicUnderinvest,
        houseCost,
        lackGreenSpace,
        lackPlumbing,
        leadPaint,
      ],
      socioEcIndicators: [lowInc],
      isDisadvagtaged: properties[constants.IS_HOUSING_FACTOR_DISADVANTAGED] ?
        properties[constants.IS_HOUSING_FACTOR_DISADVANTAGED] :
        null,
      isExceed1MoreBurden: properties[
          constants.IS_HOUSING_EXCEED_ONE_OR_MORE_INDICATORS
      ] ?
        properties[constants.IS_HOUSING_EXCEED_ONE_OR_MORE_INDICATORS] :
        null,
      isExceedBothSocioBurdens: properties[
          constants.IS_EXCEED_BOTH_SOCIO_INDICATORS
      ] ?
        properties[constants.IS_EXCEED_BOTH_SOCIO_INDICATORS] :
        null,
    },
    {
      id: "leg-pollute",
      titleText: intl.formatMessage(
          EXPLORE_COPY.SIDE_PANEL_CATEGORY.LEG_POLLUTE,
      ),
      indicators: [abandonMines, formerDefSites, proxHaz, proxRMP, proxNPL],
      socioEcIndicators: [lowInc],
      isDisadvagtaged: properties[constants.IS_POLLUTION_FACTOR_DISADVANTAGED] ?
        properties[constants.IS_POLLUTION_FACTOR_DISADVANTAGED] :
        null,
      isExceed1MoreBurden: properties[
          constants.IS_POLLUTION_EXCEED_ONE_OR_MORE_INDICATORS
      ] ?
        properties[constants.IS_POLLUTION_EXCEED_ONE_OR_MORE_INDICATORS] :
        null,
      isExceedBothSocioBurdens: properties[
          constants.IS_EXCEED_BOTH_SOCIO_INDICATORS
      ] ?
        properties[constants.IS_EXCEED_BOTH_SOCIO_INDICATORS] :
        null,
    },
    {
      id: "clean-transport",
      titleText: intl.formatMessage(
          EXPLORE_COPY.SIDE_PANEL_CATEGORY.CLEAN_TRANSPORT,
      ),
      indicators: [dieselPartMatter, barrierTransport, trafficVolume],
      socioEcIndicators: [lowInc],
      isDisadvagtaged: properties[constants.IS_TRANSPORT_FACTOR_DISADVANTAGED] ?
        properties[constants.IS_TRANSPORT_FACTOR_DISADVANTAGED] :
        null,
      isExceed1MoreBurden: properties[
          constants.IS_TRANSPORT_EXCEED_ONE_OR_MORE_INDICATORS
      ] ?
        properties[constants.IS_TRANSPORT_EXCEED_ONE_OR_MORE_INDICATORS] :
        null,
      isExceedBothSocioBurdens: properties[
          constants.IS_EXCEED_BOTH_SOCIO_INDICATORS
      ] ?
        properties[constants.IS_EXCEED_BOTH_SOCIO_INDICATORS] :
        null,
    },
    {
      id: "clean-water",
      titleText: intl.formatMessage(
          EXPLORE_COPY.SIDE_PANEL_CATEGORY.CLEAN_WATER,
      ),
      indicators: [leakyTanks, wasteWater],
      socioEcIndicators: [lowInc],
      isDisadvagtaged: properties[constants.IS_WATER_FACTOR_DISADVANTAGED] ?
        properties[constants.IS_WATER_FACTOR_DISADVANTAGED] :
        null,
      isExceed1MoreBurden: properties[
          constants.IS_WATER_EXCEED_ONE_OR_MORE_INDICATORS
      ] ?
        properties[constants.IS_WATER_EXCEED_ONE_OR_MORE_INDICATORS] :
        null,
      isExceedBothSocioBurdens: properties[
          constants.IS_EXCEED_BOTH_SOCIO_INDICATORS
      ] ?
        properties[constants.IS_EXCEED_BOTH_SOCIO_INDICATORS] :
        null,
    },
    {
      id: "work-dev",
      titleText: intl.formatMessage(EXPLORE_COPY.SIDE_PANEL_CATEGORY.WORK_DEV),
      indicators: [lingIso, lowMedInc, poverty, unemploy],
      socioEcIndicators: [highSchool],
      isDisadvagtaged: properties[constants.IS_WORKFORCE_FACTOR_DISADVANTAGED] ?
        properties[constants.IS_WORKFORCE_FACTOR_DISADVANTAGED] :
        null,
      isExceed1MoreBurden: properties[
          constants.IS_WORKFORCE_EXCEED_ONE_OR_MORE_INDICATORS
      ] ?
        properties[constants.IS_WORKFORCE_EXCEED_ONE_OR_MORE_INDICATORS] :
        null,
      isExceedBothSocioBurdens: properties[
          constants.IS_WORKFORCE_EXCEED_BOTH_SOCIO_INDICATORS
      ] ?
        properties[constants.IS_WORKFORCE_EXCEED_BOTH_SOCIO_INDICATORS] :
        null,
    },
  ];

  /**
   * Modify the category array depending on the sidePanelState field. This field comes from the backend
   * and is called UI_EXP.
   *
   * This sidePanelState has 3 values; namely, Nation, Puerto Rico and Island Areas.
   */
  if (sidePanelState === constants.SIDE_PANEL_STATE_VALUES.PUERTO_RICO) {
    // Re-define which burdens show up for each category:

    setCategoryIndicators("climate-change", [flooding]);
    setCategoryIndicators("clean-energy", [energyCost]);
    setCategoryIndicators("sustain-house", [
      historicUnderinvest,
      houseCost,
      lackPlumbing,
      leadPaint,
    ]);
    setCategoryIndicators("leg-pollute", [proxHaz, proxRMP, proxNPL]);
    setCategoryIndicators("clean-transport", [dieselPartMatter, trafficVolume]);
    setCategoryIndicators("work-dev", [lowMedInc, poverty, unemploy]);
  }

  if (sidePanelState === constants.SIDE_PANEL_STATE_VALUES.ISLAND_AREAS) {
    // For Island Areas - only show workforce dev category
    categories = categories.filter((category) => category.id === "work-dev");
    // For Island Areas - remove the linguistic Isolation
    categories[0].indicators = [lowMedInc, unemploy, poverty];
  }

  // Custom view: show only selected categories/indicators; if none selected, show none.
  if (useCustomIndicatorView) {
    // Registry category ids that have at least one selected indicator (e.g. climate, health).
    const selectedRegistryCategoryIds = new Set(
        selectedBurdenIds
            .map((id) => INDICATOR_REGISTRY[id]?.category)
            .filter(Boolean),
    );
    categories = categories
        // Keep only AreaDetail categories whose registry category is in the selected set.
        .filter((cat) =>
          selectedRegistryCategoryIds.has(
              AREA_DETAIL_TO_REGISTRY_CATEGORY[cat.id],
          ),
        )
        // Within each category, keep only indicators that are in the selected burden set.
        .map((cat) => ({
          ...cat,
          indicators: cat.indicators.filter(
              (ind): ind is indicatorInfo =>
                Boolean(ind.id && selectedBurdenIds.includes(ind.id)),
          ),
          socioEcIndicators: cat.socioEcIndicators.filter(
              (ind): ind is indicatorInfo =>
                Boolean(ind.id && selectedBurdenIds.includes(ind.id)),
          ),
        }))
        // Drop categories that end up with no indicators to show.
        .filter(
            (cat) =>
              cat.indicators.length > 0 || cat.socioEcIndicators.length > 0,
        );
  }

  const isTerritory = constants.TILES_ISLAND_AREA_FIPS_CODES.some((code) => {
    return properties[constants.GEOID_PROPERTY].startsWith(code);
  });

  const isGrandfathered = properties[constants.IS_GRANDFATHERED];
  // Show Donut information !isGrandfathered
  const showDonutCopy =
    !isGrandfathered &&
    properties[constants.ADJACENCY_EXCEEDS_THRESH] &&
    properties[constants.TOTAL_NUMBER_OF_DISADVANTAGE_INDICATORS] === 0;
  const showIslandCopy = isTerritory && !showDonutCopy;

  // For territories we use the poverty percentile from the census decennial data
  const poveryPercentile = isTerritory ?
    properties[
        constants.CENSUS_DECENNIAL_POVERTY_LESS_THAN_200_FPL_PERCENTILE
    ] :
    properties[constants.POVERTY_BELOW_200_PERCENTILE] > 0 ?
    properties[constants.POVERTY_BELOW_200_PERCENTILE] :
    null;
  /**
   * Create the AccoridionItems by mapping over the categories array. In this array we define the
   * various indicators for a specific category. This is an array which then maps over the
   * <Indicator /> component to render the actual Indicator
   */
  const categoryItems = categories.map((category) => ({
    id: category.id,

    /*
    As of trussworks 3.0.0, there were some breaking changes. This new prop of headingLevel
    is required, however, the title prop is already defining the category styling, so this
    is placed here to satisfy the requirement of the AccordionItems API, however it's not
    being used.

    Casting 'h4' as const because it needs to be a heading type as specified HeadingLevel.
    */
    headingLevel: "h4" as const,

    title: (
      <Category
        name={category.titleText}
        isDisadvantaged={category.isDisadvagtaged}
      />
    ),
    content: (
      <>
        {/* Indicators - filters then map */}
        {category.indicators.map((indicator: any, index: number) => {
          return <Indicator key={`ind${index}`} indicator={indicator} />;
        })}

        {/* AND - only when both indicator lists have items */}
        {category.indicators.length > 0 && category.socioEcIndicators.length > 0 && (
          <div className={styles.categorySpacer}>
            {EXPLORE_COPY.SIDE_PANEL_SPACERS.AND}
          </div>
        )}

        {/* socioeconomic indicators */}
        {category.socioEcIndicators.map((indicator: any, index: number) => {
          return (
            <Indicator
              key={`ind${index}`}
              indicator={indicator}
              isImpute={
                properties[constants.IMPUTE_FLAG] === "0" ? false : true
              }
              population={population}
            />
          );
        })}
      </>
    ),
    expanded: useCustomIndicatorView,
  }));

  return (
    <aside className={styles.areaDetailContainer} data-cy={"aside"}>
      {/* Tract Info */}
      <TractInfo
        blockGroup={blockGroup}
        countyName={countyName}
        stateName={stateName}
        population={population}
        sidePanelState={properties[constants.SIDE_PANEL_STATE]}
      />

      {/* Demographics */}
      <TractDemographics properties={properties} />

      {/* Disadvantaged? or X-of-Y selected burdens summary (custom view) */}
      <div className={styles.categorization}>
        {useCustomIndicatorView ? (
          <>
            {selectedBurdenCountY === 0 ? (
              showTribalLandsMessage ?
                <p className="selectedBurdensSummary">
                  {EXPLORE_COPY.tractContainsTribalLandsMessage}
                </p> :
                <p className="selectedBurdensSummary">
                  {EXPLORE_COPY.selectedBurdensSummary(0, 0)}
                </p>
            ) : (
              <>
                <p className="selectedBurdensSummary">
                  {EXPLORE_COPY.selectedBurdensSummary(exceedCountX, selectedBurdenCountY)}
                </p>
                {showTribalLandsMessage && (
                  <p className="selectedBurdensSummary">
                    {EXPLORE_COPY.tractContainsTribalLandsMessage}
                  </p>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {/* Questions asking if disadvantaged? */}
            <div className={styles.isInFocus}>
              {EXPLORE_COPY.COMMUNITY.IS_FOCUS}
            </div>

            {/* YES, NO or PARTIALLY disadvantaged  */}
            <div className={styles.communityOfFocus}>
              <TractPrioritization
                scoreNCommunities={
                  properties[constants.SCORE_N_COMMUNITIES] === true ?
                    properties[constants.SCORE_N_COMMUNITIES] :
                    false
                }
                tribalCountAK={
                  properties[constants.TRIBAL_AREAS_COUNT_AK] >= 1 ?
                    properties[constants.TRIBAL_AREAS_COUNT_AK] :
                    null
                }
                tribalCountUS={
                  properties[constants.TRIBAL_AREAS_COUNT_CONUS] >= 1 ?
                    properties[constants.TRIBAL_AREAS_COUNT_CONUS] :
                    null
                }
                percentTractTribal={percentTractTribal}
              />
            </div>
            <div className={styles.prioCopy}>
              <PrioritizationCopy
                totalCategoriesPrioritized={
                  properties[constants.COUNT_OF_CATEGORIES_DISADV]
                }
                totalBurdensPrioritized={
                  properties[constants.TOTAL_NUMBER_OF_DISADVANTAGE_INDICATORS]
                }
                isAdjacencyThreshMet={
                  properties[constants.ADJACENCY_EXCEEDS_THRESH]
                }
                isAdjacencyLowIncome={
                  properties[constants.ADJACENCY_LOW_INCOME_EXCEEDS_THRESH]
                }
                isIslandLowIncome={
                  properties[constants.IS_FEDERAL_POVERTY_LEVEL_200] &&
                  constants.TILES_ISLAND_AREA_FIPS_CODES.some((code) => {
                    return properties[constants.GEOID_PROPERTY].startsWith(code);
                  })
                }
                tribalCountAK={
                  properties[constants.TRIBAL_AREAS_COUNT_AK] >= 1 ?
                    properties[constants.TRIBAL_AREAS_COUNT_AK] :
                    null
                }
                tribalCountUS={
                  properties[constants.TRIBAL_AREAS_COUNT_CONUS] >= 1 ?
                    properties[constants.TRIBAL_AREAS_COUNT_CONUS] :
                    null
                }
                percentTractTribal={percentTractTribal}
                isGrandfathered={properties[constants.IS_GRANDFATHERED]}
              />
              <PrioritizationCopy2
                totalCategoriesPrioritized={
                  properties[constants.COUNT_OF_CATEGORIES_DISADV]
                }
                isAdjacencyThreshMet={
                  properties[constants.ADJACENCY_EXCEEDS_THRESH]
                }
                isAdjacencyLowIncome={
                  properties[constants.ADJACENCY_LOW_INCOME_EXCEEDS_THRESH]
                }
                tribalCountAK={
                  properties[constants.TRIBAL_AREAS_COUNT_AK] >= 1 ?
                    properties[constants.TRIBAL_AREAS_COUNT_AK] :
                    null
                }
                tribalCountUS={
                  properties[constants.TRIBAL_AREAS_COUNT_CONUS] >= 1 ?
                    properties[constants.TRIBAL_AREAS_COUNT_CONUS] :
                    null
                }
                percentTractTribal={percentTractTribal}
              />
            </div>
          </>
        )}
      </div>

      {showIslandCopy && <IslandCopy povertyPercentile={poveryPercentile} />}
      {showDonutCopy && (
        <DonutCopy
          isAdjacent={properties[constants.ADJACENCY_EXCEEDS_THRESH]}
          povertyBelow200Percentile={poveryPercentile}
        />
      )}

      {/* Send Feedback button */}
      {/* <a
        className={styles.sendFeedbackLink}
        href={
          intl.locale === `es` ?
            `${constants.CENSUS_TRACT_SURVEY_LINKS.ES}?tractid=${blockGroup}` :
            `${constants.CENSUS_TRACT_SURVEY_LINKS.EN}?tractid=${blockGroup}`
        }
        target={"_blank"}
        rel="noreferrer"
      >
        <Button type="button" className={styles.sendFeedbackBtn}>
          <div className={styles.buttonContainer}>
            <div className={styles.buttonText}>
              {EXPLORE_COPY.COMMUNITY.SEND_FEEDBACK.TITLE}
            </div>

            <Icon.Launch
              aria-label={intl.formatMessage(
                  EXPLORE_COPY.COMMUNITY.SEND_FEEDBACK.IMG_ICON.ALT_TAG,
              )}
            />
          </div>
        </Button>
      </a> */}

      {/* Key remounts accordion when switching to custom view so categories open. */}
      {
        <Accordion
          key={useCustomIndicatorView ? "custom-indicators" : "all-indicators"}
          multiselectable={true}
          items={categoryItems}
          className="-AreaDetail"
        />
      }

      {/* Methodology version */}
      <div className={styles.versionInfo}>
        {EXPLORE_COPY.SIDE_PANEL_VERSION.TITLE}
      </div>
    </aside>
  );
};

export default AreaDetail;
