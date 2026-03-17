import {FormattedDate, FormattedMessage} from 'gatsby-plugin-intl';
import React from 'react';
import * as COMMON_COPY from './common';
import {VERSION_NUMBER} from './methodology';

const RELEASE_2_1_VERSION = '2.1';

export const RELEASE_2_1 = {
  HEADER: <FormattedMessage
    id={'download.page.release.2_1.update.HEADER'}
    defaultMessage={`Version {release} Release update - {date}`}
    description={'Download page release notes header for version 2.1'}
    values={{
      release: RELEASE_2_1_VERSION,
      date: <FormattedDate
        value={COMMON_COPY.METH_2_1_RELEASE_DATE}
        year="numeric"
        month="short"
        day="numeric"
      />,
    }}
  />,
  NEW_IMPROVED_SECTION: <FormattedMessage
    id={'download.page.release.2_1.update.NEW_IMPROVED_SECTION'}
    defaultMessage={`New & Improved`}
    description={'Download page release notes New & Improved section'}
  />,
  NEW_IMPROVED_CONTENT: [
    <FormattedMessage
      id={'download.page.release.2_1.update.NEW_IMPROVED_CONTENT_1'}
      key={'download.page.release.2_1.update.NEW_IMPROVED_CONTENT_1'}
      defaultMessage={`Added the ability to view disadvantaged communities by burdens of interest`}
      description={'Download page release notes 2.1 content'}
    />,
  ],
  NOTE: <FormattedMessage
    id={'download.page.release.2_1.update.NOTE'}
    defaultMessage={`Note: None of the underlying data has changed`}
    description={'Download page release notes 2.1 data disclaimer'}
  />,
};

export const RELEASE_2_0 = {
  HEADER: <FormattedMessage
    id={'download.page.release.2_0.update.HEADER'}
    defaultMessage={`Version {release} Release update - {date}`}
    description={'Navigate to the download page. This is first download file link'}
    values={{
      release: VERSION_NUMBER,
      date: <FormattedDate
        value={COMMON_COPY.METH_2_0_RELEASE_DATE}
        year="numeric"
        month="short"
        day="numeric"
      />,
    }}
  />,
  NEW_IMPROVED_SECTION: <FormattedMessage
    id={'download.page.release.2_0.update.NEW_IMPROVED_SECTION'}
    defaultMessage={`New & Improved`}
    description={'Navigate to the download page. This is new and improved section'}
  />,
  NEW_IMPROVED_CONTENT: [
    <FormattedMessage
      id={'download.page.release.2_0.update.NEW_IMPROVED_CONTENT_1'}
      key={'download.page.release.2_0.update.NEW_IMPROVED_CONTENT_1'}
      defaultMessage={`Added the low income burden to American Samoa, Guam, the Mariana Islands, and the U.S. Virgin
        Islands`}
      description={'Navigate to the download page. This is release content'}
    />,
    <FormattedMessage
      id={'download.page.release.2_0.update.NEW_IMPROVED_CONTENT_2'}
      key={'download.page.release.2_0.update.NEW_IMPROVED_CONTENT_2'}
      defaultMessage={`Tracts in these territories that are completely surrounded by disadvantaged tracts and exceed
        an adjusted low income threshold are now considered disadvantaged`}
      description={'Navigate to the download page. This is release content'}
    />,
    <FormattedMessage
      id={'download.page.release.2_0.update.NEW_IMPROVED_CONTENT_3'}
      key={'download.page.release.2_0.update.NEW_IMPROVED_CONTENT_3'}
      defaultMessage={`Additionally, census tracts in these four Territories are now considered disadvantaged if they
        meet the low income threshold only, because these Territories are not included in the nationally-consistent
        datasets on environmental and climate burdens used in the tool`}
      description={'Navigate to the download page. This is release content'}
    />,
    <FormattedMessage
      id={'download.page.release.2_0.update.NEW_IMPROVED_CONTENT_4'}
      key={'download.page.release.2_0.update.NEW_IMPROVED_CONTENT_4'}
      defaultMessage={`Updated the data in the workforce development category to the Census Decennial 2020 data for
        the U.S. territories of Guam, Virgin Islands, Northern Mariana Islands, and American Samoa`}
      description={'Navigate to the download page. This is release content'}
    />,
    <FormattedMessage
      id={'download.page.release.2_0.update.NEW_IMPROVED_CONTENT_5'}
      key={'download.page.release.2_0.update.NEW_IMPROVED_CONTENT_5'}
      defaultMessage={`Made improvements to the low income burden to better identify college students before they are
        excluded from that burden\u2019s percentile`}
      description={'Navigate to the download page. This is release content'}
    />,
    <FormattedMessage
      id={'download.page.release.2_0.update.NEW_IMPROVED_CONTENT_6'}
      key={'download.page.release.2_0.update.NEW_IMPROVED_CONTENT_6'}
      defaultMessage={`Census tracts that were disadvantaged under version 1.0 continue to be considered as
        disadvantaged in version 2.0`}
      description={'Navigate to the download page. This is release content'}
    />,
  ],
  TECHNICAL_FIXES_SECTION: <FormattedMessage
    id={'download.page.release.2_0.update.TECHNICAL_FIXES_SECTION'}
    defaultMessage={`Technical Fixes`}
    description={'Navigate to the download page. This is technical fixes section'}
  />,
  TECHNICAL_FIXES_CONTENT: [
    <FormattedMessage
      id={'download.page.release.2_0.update.TECHNICAL_FIXES_CONTENT_1'}
      key={'download.page.release.2_0.update.TECHNICAL_FIXES_CONTENT_1'}
      defaultMessage={`For tracts that have water boundaries, e.g. coastal or island tracts, the water boundaries are
        now excluded from the calculation to determine if a tract is 100% surrounded by disadvantaged census tracts`}
      description={'Navigate to the download page. This is release content'}
    />,
  ],
  UI_SECTION: <FormattedMessage
    id={'download.page.release.2_0.update.UI_SECTION'}
    defaultMessage={`User Interface Improvements`}
    description={'Navigate to the download page. This is the UI improvements section'}
  />,
  UI_CONTENT: [
    <FormattedMessage
      id={'download.page.release.2_0.update.UI_CONTENT_1'}
      key={'download.page.release.2_0.update.UI_CONTENT_1'}
      defaultMessage={`Added the ability to search by census tract ID`}
      description={'Navigate to the download page. This is release content'}
    />,
    <FormattedMessage
      id={'download.page.release.2_0.update.UI_CONTENT_2'}
      key={'download.page.release.2_0.update.UI_CONTENT_2'}
      defaultMessage={`The basemap has been updated to use a free, open source map`}
      description={'Navigate to the download page. This is release content'}
    />,
  ],
};
