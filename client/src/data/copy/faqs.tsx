/* eslint-disable max-len */
// import {defineMessages, FormattedDate, FormattedMessage} from 'gatsby-plugin-intl';
import {defineMessages} from 'gatsby-plugin-intl';

// import React from 'react';

// import LinkTypeWrapper from '../../components/LinkTypeWrapper';

// import {DATA_SURVEY_LINKS, PAGES_ENDPOINTS, SITE_SATISFACTION_SURVEY_LINKS} from '../constants';
// import {CEJST_INSTRUCT, EXEC_ORDER_LINK, FED_RECOGNIZED_INDIAN_ENTITIES, WHEJAC_RECOMMENDATIONS} from './about';
// mport {boldFn, FEEDBACK_EMAIL, linkFn, METH_1_0_RELEASE_DATE, METH_2_0_RELEASE_DATE} from './common';
// import {DOWNLOAD_FILES} from './downloads';
// import {EXPLORE_PAGE_LINKS} from './explore';
// import {VERSION_NUMBER} from './methodology';

export const PAGE_INTRO = defineMessages({
  PAGE_TILE: {
    id: 'faqs.page.title.text',
    defaultMessage: 'Frequently asked questions',
    description: 'Navigate to the FAQs page, this will be the page title text',
  },
  COMING_SOON: {
    id: 'faqs.page.coming.soon.text',
    defaultMessage: 'Coming Soon!',
    description: 'Navigate to the FAQs page, this will be the page coming soon text',
  },
});

// commenting out all questions until we rework the FAQ page
export const QUESTIONS = [
  /*  <FormattedMessage
    id={ 'faqs.page.Q1'}
    key={ 'faqs.page.Q1'}
    defaultMessage={ 'What is the Climate and Economic Justice Screening Tool (CEJST)?'}
    description={ 'Navigate to the FAQs page, this will be Q1'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q2'}
    key={ 'faqs.page.Q2'}
    defaultMessage={ 'How does the tool identify and define communities?'}
    description={ 'Navigate to the FAQs page, this will be Q2'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q3'}
    key={ 'faqs.page.Q3'}
    defaultMessage={ 'Is race included in the tool’s methodology?'}
    description={ 'Navigate to the FAQs page, this will be Q3'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q4'}
    key={ 'faqs.page.Q4'}
    defaultMessage={ 'Does the tool include the U.S. territories? '}
    description={ 'Navigate to the FAQs page, this will be Q4'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q5'}
    key={ 'faqs.page.Q5'}
    defaultMessage={ 'Does the tool include Tribal Nations?'}
    description={ 'Navigate to the FAQs page, this will be Q5'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q6'}
    key={ 'faqs.page.Q6'}
    defaultMessage={ 'Why do some areas of the map have different shades?'}
    description={ 'Navigate to the FAQs page, this will be Q6'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q7'}
    key={ 'faqs.page.Q7'}
    defaultMessage={ 'Why does the tool have “partially disadvantaged” census tracts?'}
    description={ 'Navigate to the FAQs page, this will be Q7'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q12'}
    key={ 'faqs.page.Q12'}
    defaultMessage={ 'How is the Climate and Economic Justice Screening Tool (CEJST) different from other Federal environmental screening tools, such as EJScreen?'}
    description={ 'Navigate to the FAQs page, this will be Q12'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q13'}
    key={ 'faqs.page.Q13'}
    defaultMessage={ 'How is this tool different from state screening tools?'}
    description={ 'Navigate to the FAQs page, this will be Q13'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q14'}
    key={ 'faqs.page.Q14'}
    defaultMessage={ 'How were the White House Environmental Justice Advisory Council’s (WHEJAC)  recommendations considered for this tool?'}
    description={ 'Navigate to the FAQs page, this will be Q14'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q15'}
    key={ 'faqs.page.Q15'}
    defaultMessage={ 'Can the public provide feedback on this tool?'}
    description={ 'Navigate to the FAQs page, this will be Q15'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q16'}
    key={ 'faqs.page.Q16'}
    defaultMessage={ 'When was the CEJST released?'}
    description={ 'Navigate to the FAQs page, this will be Q16'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q19'}
    key={ 'faqs.page.Q19'}
    defaultMessage={ 'What files and documentation are available from the tool?'}
    description={ 'Navigate to the FAQs page, this will be Q19'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q20'}
    key={ 'faqs.page.Q20'}
    defaultMessage={ 'How do the tool’s shapefiles work?'}
    description={ 'Navigate to the FAQs page, this will be Q20'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q21'}
    key={ 'faqs.page.Q21'}
    defaultMessage={ 'Why are some tracts disadvantaged because they were disadvantaged in version 1.0 of the tool?'}
    description={ 'Navigate to the FAQs page, this will be Q21'}
  />,
  <FormattedMessage
    id={ 'faqs.page.Q22'}
    key={ 'faqs.page.Q22'}
    defaultMessage={ 'Why are some tracts disadvantaged in certain U.S. Territories because they only meet the low income threshold?'}
    description={ 'Navigate to the FAQs page, this will be Q22'}
  />, */
];

export const FAQ_ANSWERS = {
  /*  Q1_P1: <FormattedMessage
    id={ 'faqs.page.answers.Q1_P1'}
    defaultMessage={ 'The CEJST is a geospatial mapping tool that identifies disadvantaged communities that face burdens. The tool has an interactive map and uses datasets that are indicators of burdens.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q1_P1'}
    values={{
      link1: linkFn(EXEC_ORDER_LINK, false, true),
    }}
  />,
  Q1_P2: <FormattedMessage
    id={ 'faqs.page.answers.Q1_P2'}
    defaultMessage={ 'The public can find communities of interest and provide feedback. This feedback will be used to improve the tool.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q1_P2'}
  />,
  Q2_P1: <FormattedMessage
    id={ 'faqs.page.answers.Q2_P1'}
    defaultMessage={ 'The CEJST uses datasets that are indicators of burden related to climate change and the environment to assess communities that are disadvantaged by these burdens. They are also related to health and lack of economic opportunity.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q2_P1'}
  />,
  Q2_P2: <FormattedMessage
    id={ 'faqs.page.answers.Q2_P2'}
    defaultMessage={ 'The tool highlights disadvantaged communities across all 50 states, the District of Columbia, and the U.S. territories. Communities are shown on the map as disadvantaged:'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q2_P2'}
  />,
  Q2_P2_1: <FormattedMessage
    id={ 'faqs.page.answers.Q2_P2_1'}
    defaultMessage={ 'If they are in a census tract that meets the threshold for at least one of the tool’s categories of burden, or'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q2_P2_1'}
  />,
  Q2_P2_2: <FormattedMessage
    id={ 'faqs.page.answers.Q2_P2_2'}
    defaultMessage={ 'If they are on land within the boundaries of Federally Recognized Tribes'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q2_P2_2'}
  />,
  Q2_P3: <FormattedMessage
    id={ 'faqs.page.answers.Q2_P3'}
    defaultMessage={ 'Not all disadvantaged communities can be shown on the map. The map shows point locations for Alaska Native Villages. Some communities do not live in just one place. This tool focuses on identifying communities that can be geographically defined.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q2_P3'}
  />,
  Q2_P4: <FormattedMessage
    id={ 'faqs.page.answers.Q2_P4'}
    defaultMessage={ 'The tool uses census tracts. Census tracts are small units of geography. Census tract boundaries for <link1>statistical areas</link1> are determined by the U.S. Census Bureau once every ten years. The tool utilizes the census tract boundaries from 2010.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q2_P4'}
    values={{
      link1: linkFn(`https://www.census.gov/programs-surveys/acs/geography-acs/geography-boundaries-by-year.html`, false, true),
    }}
  />,
  Q2_P5: <FormattedMessage
    id={ 'faqs.page.answers.Q2_P5'}
    defaultMessage={ ' Tracts that were identified as disadvantaged in the 1.0 version of the tool remain disadvantaged in the 2.0 version of the tool.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q2_P5'}
  />,
  Q2_P6: <FormattedMessage
    id={ 'faqs.page.answers.Q2_P6'}
    defaultMessage={ 'Due to limited data availability, tracts in American Samoa, Guam, the Northern Mariana Islands, and the U.S. Virgin Islands are considered disadvantaged if they meet the low income threshold only.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q2_P6'}
  />,
  Q3_P1: <FormattedMessage
    id={ 'faqs.page.answers.Q3_P1'}
    defaultMessage={ 'No. The Climate and Economic Justice Screening Tool (CEJST) does not use racial demographics in its methodology. The current version of the tool displays data about race and age only to provide information when a census tract is selected.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q3_P1'}
  />,
  Q3_P2: <FormattedMessage
    id={ 'faqs.page.answers.Q3_P2'}
    defaultMessage={ 'It is well-documented that communities of color suffer disproportionately from environmental and health burdens. Due to decades of underinvestment, they also face greater risks from climate change.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q3_P2'}
  />,
  Q3_P3: <FormattedMessage
    id={ 'faqs.page.answers.Q3_P3'}
    defaultMessage={ 'Although the CEJST does not use race in its methodology, the tool creates a map that seeks to reflect the on-the-ground burdens and realities that disadvantaged communities face. The tool shows communities that have environmental burdens and face injustice.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q3_P3'}
  />,
  Q4_P1: <FormattedMessage
    id={ 'faqs.page.answers.Q4_P1'}
    defaultMessage={ 'Yes, version {currentVersion} of the CEJST has some data for all the territories, but not all the CEJST data are available or used for all U.S. territories.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q4_P1'}
    values={{
      currentVersion: VERSION_NUMBER,
    }}
  />,
  Q4_P2: <FormattedMessage
    id={ 'faqs.page.answers.Q4_P2'}
    defaultMessage={ `<boldtag>Puerto Rico:</boldtag> The data used for Puerto Rico are from all relevant and available fields in the energy, housing, legacy pollution, transportation, and workforce development categories. The following data are used: projected flood risk, energy cost, lack of plumbing, lead paint, housing cost, proximity to hazardous waste facilities, proximity to Superfund or National Priorities List (NPL) sites, proximity to Risk Management Plan (RMP) facilities, diesel particulate matter exposure, traffic proximity and volume, underground storage tanks and releases, wastewater discharge, poverty, unemployment, and high school education. Linguistic isolation was removed for Puerto Rico based on feedback received during the beta period. `}
    description={ 'Navigate to the FAQs page, this will be an answer, Q4_P2'}
    values={{
      boldtag: boldFn,
    }}
  />,
  Q4_P3: <FormattedMessage
    id={ 'faqs.page.answers.Q4_P3'}
    defaultMessage={ '<bold>American Samoa, Guam, the Northern Mariana Islands, and the U.S. Virgin Islands:</bold> For these U.S. Territories, the tool uses the following data: unemployment, poverty, low median income, and high school education. These burdens are in the workforce development category. Due to limited data availability, tracts in these U.S. Territories are also considered disadvantaged if they meet the low income threshold only.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q4_P3'}
    values={{
      bold: boldFn,
    }}
  />,
  Q5_P1: <FormattedMessage
    id={ 'faqs.page.answers.Q5_P1'}
    defaultMessage={`
      To respect Tribal sovereignty and self-government and to fulfill Federal trust and treaty responsibilities to Tribal Nations, land within the boundaries of Federally Recognized Tribes are highlighted as disadvantaged on the map. Alaska Native Villages are included as point locations that are smaller than census tracts. The boundaries of census tracts and the lands of Federally Recognized Tribes are different.
    `}
    description={ 'Navigate to the FAQs page, this will be an answer, Q5_P1'}
  />,
  Q5_P2: <FormattedMessage
    id={ 'faqs.page.answers.Q5_P2'}
    defaultMessage={ `Federally Recognized Tribes are those that are recognized by the U.S. Bureau of Indian Affairs in the <link1>annual notice</link1> it publishes in the Federal Register.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q5_P2'}
    values={{
      link1: linkFn(FED_RECOGNIZED_INDIAN_ENTITIES, false, true),
    }}
  />,
  Q5_P2_1: <FormattedMessage
    id={ 'faqs.page.answers.Q5_P2_1'}
    defaultMessage={ `This decision was made after meaningful and robust consultation with Tribal Nations. This approach is consistent with CEQ’s <link1>Action Plan</link1> for Consultation and Coordination with Tribal Nations, the <link3>Memorandum</link3> on Tribal Consultation and Strengthening Nation-to-Nation Consultation, and <link2>Executive Order 13175</link2> on Consultation and Coordination With Indian Tribal Governments.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q5_P2_1'}
    values={{
      link1: linkFn(EXPLORE_PAGE_LINKS.WH_GOV_TRIBAL_ACTION_PLAN_4_26_21, false, true),
      link2: linkFn(EXPLORE_PAGE_LINKS.FED_REGISTER_CONSULT_TRIBE_GOV_2000, false, true),
      link3: linkFn(EXPLORE_PAGE_LINKS.WH_GOV_TRIBAL_CONSULT_NATION_NATION_01_25_21, false, true),
    }}
  />,
  Q6_P1: <FormattedMessage
    id={ 'faqs.page.answers.Q6_P1'}
    defaultMessage={ `Different areas of the map will have different colors because they are identified as disadvantaged in different ways. Some census tracts that contain land within the boundaries of Federally Recognized Tribes are also considered disadvantaged because they meet the burden thresholds for at least one of the categories on the tool. When this happens, the areas appear darker on the tool’s map.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q6_P1'}
  />,
  Q6_P2: <FormattedMessage
    id={ 'faqs.page.answers.Q6_P2'}
    defaultMessage={ ` : Disadvantaged census tracts (meets threshold methodology OR contains lands of Tribes)`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q6_P2'}
  />,
  Q6_P3: <FormattedMessage
    id={ 'faqs.page.answers.Q6_P3'}
    defaultMessage={ ` : Disadvantaged census tracts and land within the boundaries of Federally Recognized Tribes (meets threshold methodology AND contains lands of Tribes)
    `}
    description={ 'Navigate to the FAQs page, this will be an answer, Q6_P3'}
  />,
  Q6_P4: <FormattedMessage
    id={ 'faqs.page.answers.Q6_P4'}
    defaultMessage={ ` : Disadvantaged census tracts (grandfathered)
    `}
    description={ 'Navigate to the FAQs page, this will be an answer, Q6_P4'}
  />,
  Q6_P5: <FormattedMessage
    id={ 'faqs.page.answers.Q6_P5'}
    defaultMessage={ `Any area that is highlighted is considered disadvantaged, regardless of whether it is a light shade or dark shade. The tool will show if a whole census tract is considered disadvantaged or just the parts that contain land within the boundaries of Federally Recognized Tribes.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q6_P4'}
  />,
  Q7: <FormattedMessage
    id={ 'faqs.page.answers.Q7'}
    defaultMessage={ `A census tract that does not meet any of the burden thresholds in the tool is usually not considered to be a disadvantaged community. However, if such a census tract contains land within the boundaries of Federally Recognized Tribes, then the parts of the tract that contain the land of Tribes are considered disadvantaged. The tool will display this type of census tract as “partially disadvantaged.”`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q7'}
  />,
  Q12_P1: <FormattedMessage
    id={ 'faqs.page.answers.Q12_P1'}
    defaultMessage={ `The CEJST uses lessons learned from the EPA's EJScreen. EJScreen is an environmental justice mapping and screening tool. EJScreen shows some environmental and demographic information and combines that information together into indices.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q12_P1'}
  />,
  Q12_P2: <FormattedMessage
    id={ 'faqs.page.answers.Q12_P2'}
    defaultMessage={ `In contrast, the CEJST helps to identify geographically defined disadvantaged communities that are marginalized by underinvestment and overburdened by pollution.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q12_P2'}
  />,
  Q12_P3: <FormattedMessage
    id={ 'faqs.page.answers.Q12_P3'}
    defaultMessage={ `<link1>This chart</link1> is helpful for understanding how the CEJST differs from some of the other Federal environmental screening tools.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q12_P3'}
    values={{
      link1: linkFn(DOWNLOAD_FILES.NARWAL.COMP_CHART.URL, false, true),
    }}
  />,
  Q13_P1: <FormattedMessage
    id={ 'faqs.page.answers.Q13_P1'}
    defaultMessage={ `Several states have environmental justice screening tools. CalEnviroScreen is an environmental justice screening tool for California. Other states, like New York and Michigan have screening tools as well. The Climate and Economic Justice Screening Tool (CEJST) incorporates lessons learned from these efforts.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q13_P1'}
  />,
  Q13_P2: <FormattedMessage
    id={ 'faqs.page.answers.Q13_P2'}
    defaultMessage={ `There is an important difference between state-based tools and the CEJST. State tools use data that may not be available for other states. The CEJST only uses data that are nationally-consistent and publicly-available.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q13_P2'}
  />,
  Q14: <FormattedMessage
    id={ 'faqs.page.answers.Q14'}
    defaultMessage={ `The WHEJAC provided <link1>recommendations</link1> on the Climate and Economic Justice Screening Tool (CEJST). The CEJST versions 1.0 and 2.0 include components that were informed by many of these recommendations.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q14'}
    values={{
      link1: linkFn(WHEJAC_RECOMMENDATIONS, false, true),
    }}
  />,
  Q15_P1: <FormattedMessage
    id={ 'faqs.page.answers.Q15_P1'}
    defaultMessage={ `Yes. The CEJST website has multiple ways to offer feedback on the tool.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q15_P1'}
  />,
  Q15_P1_1: <FormattedMessage
    id={ 'faqs.page.answers.Q15_P1_1'}
    defaultMessage={ `The public can find census tracts that they are familiar with and send feedback about those tracts. That feedback is used to “ground truth” the tool. This helps the tool to better reflect the realities for communities.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q15_P1_1'}
  />,
  Q15_P1_2: <FormattedMessage
    id={ 'faqs.page.answers.Q15_P1_2'}
    defaultMessage={ `The public can also submit <link1>data sources</link1> or ideas for consideration.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q15_P1_2'}
    values={{
      link1: linkFn(DATA_SURVEY_LINKS.EN, false, true),
    }}
  />,
  Q15_P1_3: <FormattedMessage
    id={ 'faqs.page.answers.Q15_P1_3'}
    defaultMessage={ `The public may also take a <link1>short survey</link1> to help improve the experience of using the tool.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q15_P1_3'}
    values={{
      link1: linkFn(SITE_SATISFACTION_SURVEY_LINKS.EN, false, true),
    }}
  />,
  Q15_P1_4: <FormattedMessage
    id={ 'faqs.page.answers.Q15_P1_4'}
    defaultMessage={ `The public can also email {general_email_address}`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q15_P1_4'}
    values={{
      general_email_address:
      <LinkTypeWrapper
        linkText={FEEDBACK_EMAIL}
        internal={false}
        url={`mailto:${FEEDBACK_EMAIL}`}
        openUrlNewTab={true}
      />,
    }}
  />,
  Q16_P1: <FormattedMessage
    id={ 'faqs.page.answers.Q16_P1'}
    defaultMessage={ `CEQ launched a beta—or draft—version of the CEJST in February 2022 with support from the U.S. Digital Service (USDS), and in collaboration with other Federal agencies and departments. The CEJST was released in a beta version in order to seek <link1>feedback</link1> from Federal agencies, Tribal Nations, State and local governments, Members of Congress, environmental justice stakeholders, and the public. The 90 day public comment period <link2>closed</link2> on May 25, 2022. CEQ and the USDS hosted several <link3>public training</link3> sessions on the beta version of the CEJST. All of this feedback on the beta version of the CEJST helped to inform the release of version 1.0 of the CEJST.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q16_P1'}
    values={{
      link1: linkFn('https://www.federalregister.gov/documents/2022/02/23/2022-03920/climate-and-economic-justice-screening-tool-beta-version', false, true),
      link2: linkFn('https://www.whitehouse.gov/ceq/news-updates/2022/04/21/ceq-extends-public-comment-period-on-beta-version-of-the-climate-and-economic-justice-screening-tool/', false, true),
      link3: linkFn('https://www.youtube.com/watch?v=QwHWcXbhw28', false, true),
    }}
  />,
  Q16_P2: <FormattedMessage
    id={ 'faqs.page.answers.Q16_P2'}
    defaultMessage={`The 1.0 version was released in <link1>{version1Release}</link1>. The current version, version {currentVersion}, was released in {currentVersionRelease}.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q16_P2'}
    values={{
      link1: linkFn('https://www.whitehouse.gov/ceq/news-updates/2022/11/22/biden-harris-administration-launches-version-1-0-of-climate-and-economic-justice-screening-tool-key-step-in-implementing-president-bidens-justice40-initiative/', false, true),
      version1Release: (<FormattedDate value={METH_1_0_RELEASE_DATE}
        year="numeric"
        month="long"
      />),
      currentVersion: VERSION_NUMBER,
      currentVersionRelease: (<FormattedDate value={METH_2_0_RELEASE_DATE}
        year="numeric"
        month="long"
      />),
    }}
  />,
  Q19: <FormattedMessage
    id={ 'faqs.page.answers.Q19'}
    defaultMessage={ `The Climate and Economic Justice Screening Tool (CEJST) has <link1>downloads</link1> for the current version available. Spreadsheets (.xlxs) and (.csv) contain the tool’s definitions and data. These data can be used for analysis. Shapefiles and GeoJSON files can be uploaded into other mapping programs such as Esri. The downloads include information on how to use the files (columns.csv). Information from previous versions of the tool is available on the <link2>previous versions</link2> page.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q19'}
    values={{
      link1: linkFn(PAGES_ENDPOINTS.DOWNLOADS, true, false),
      link2: linkFn(PAGES_ENDPOINTS.PREVIOUS_VERSIONS, true, false),
    }}
  />,
  Q20_P1: <FormattedMessage
    id={ 'faqs.page.answers.Q20_P1'}
    defaultMessage={ `The tool’s shapefile can be uploaded into other mapping programs such as Esri.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q20_P1'}
  />,
  Q20_P2: <FormattedMessage
    id={ 'faqs.page.answers.Q20_P2'}
    defaultMessage={ `The <link1>shapefile</link1> format is <link2>a geospatial vector data format</link2> for geographic information system (GIS) software. It can be loaded into any software that works with Esri, ArcGIS or any other compatible GIS software. You may choose to download the data in this format so that you can load the data from the Climate and Economic Justice Screening Tool (CEJST) into other tools and use those tools to combine the CEJST data with other datasets and alternative data sources.`}
    description={ 'Navigate to the FAQs page, this will be an answer, Q20_P2'}
    values= {{
      link1: linkFn('https://en.wikipedia.org/wiki/Shapefile', false, true),
      link2: linkFn('https://en.wikipedia.org/wiki/GIS_file_formats', false, true),
    }}
  />,
  Q21: <FormattedMessage
    id={ 'faqs.page.answers.Q21'}
    defaultMessage={ 'These tracts that have been "grandfathered" for at least two years. This helps to reduce disruption and to support a smooth transition for agencies, applicants, and the public as new versions of the tool are released. The tool’s <link1>instructions</link1> have more information about time-limited grandfathering.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q21'}
    values= {{
      link1: linkFn(CEJST_INSTRUCT, false, true),
    }}
  />,
  Q22: <FormattedMessage
    id={ 'faqs.page.answers.Q22'}
    defaultMessage={ 'Because some nationally-consistent datasets on indicators of environmental or climate burden used in the tool do not currently include data for certain U.S. Territories, tracts in these Territories are considered disadvantaged if they meet the low income threshold only.'}
    description={ 'Navigate to the FAQs page, this will be an answer, Q22'}
  />, */
};
