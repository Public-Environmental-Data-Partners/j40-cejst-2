/* eslint-disable max-len */
import {FormattedMessage, FormattedNumber} from 'gatsby-plugin-intl';
import React from 'react';
import {defineMessages} from 'react-intl';
import * as COMMON_COPY from './common';
import {VERSION_NUMBER, VERSIONS} from './methodology';
import {TILE_BASE_URL} from '../constants';

export const PAGE_INTRO = defineMessages({
  PAGE_TILE: {
    id: 'downloads.page.title.text',
    defaultMessage: 'Downloads',
    description: 'Navigate to the Downloads page, this will be the page title text',
  },
  PAGE_HEADING1: {
    id: 'downloads.page.heading1.text',
    defaultMessage: 'Downloads',
    description: 'Navigate to the Downloads page, this will be the page heading1 text',
  },
  VIEW: {
    id: 'downloads.page.view.text',
    defaultMessage: 'View',
    description: 'Navigate to the Downloads page, this will be the view of change log',
  },
  CHANGE_LOG: {
    id: 'downloads.page.change.log.text',
    defaultMessage: 'release notes',
    description: 'Navigate to the Downloads page, this will be the view of release notes',
  },
});

export const getDownloadFileUrl = (filePath: string | undefined, version: VERSIONS = VERSIONS.V2_0) => {
  let scorePath;

  if (process.env.DATA_SOURCE === 'local') {
    scorePath = process.env.GATSBY_DATA_PIPELINE_SCORE_PATH_LOCAL;
  } else {
    scorePath = version === VERSIONS.BETA ?
      process.env.GATSBY_BETA_SCORE_PATH :
      version === VERSIONS.V1_0 ?
      process.env.GATSBY_1_0_SCORE_PATH :
      process.env.GATSBY_2_0_SCORE_PATH;
  }

  return [
    TILE_BASE_URL,
    scorePath,
    filePath,
  ].join('/');
};

// Define meta data on download files
export const DOWNLOAD_FILES = {
  NARWAL: {
    COMMUNITIES_LIST_XLS: {
      SIZE: 35.6, // MB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_2_0_COMMUNITIES_LIST_XLS),
      LAST_UPDATED: COMMON_COPY.METH_2_0_RELEASE_DATE,
    },
    COMMUNITIES_LIST_CSV: {
      SIZE: 42, // MB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_2_0_COMMUNITIES_LIST_CSV),
      LAST_UPDATED: COMMON_COPY.METH_2_0_RELEASE_DATE,
    },
    SHAPE_FILE: {
      SIZE: 356.8, // MB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_2_0_SHAPE_FILE_ZIP),
      LAST_UPDATED: COMMON_COPY.METH_2_0_RELEASE_DATE,
    },
    TSD: {
      SIZE: 79, // KB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_2_0_TSD_PDF),
      LAST_UPDATED: COMMON_COPY.METH_2_0_RELEASE_DATE,
    },
    TSD_ES: {
      SIZE: 4.8, // MB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_TSD_ES_PDF),
      LAST_UPDATED: COMMON_COPY.METH_2_0_RELEASE_DATE,
    },
    HOW_TO_COMMUNITIES: {
      SIZE: 687.9, // KB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_2_0_COMMUNITIES_LIST_PDF),
      LAST_UPDATED: COMMON_COPY.METH_2_0_RELEASE_DATE,
    },
    HOW_TO_COMMUNITIES_ES: {
      SIZE: 761.8, // KB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_2_0_COMMUNITIES_LIST_ES_PDF),
      LAST_UPDATED: COMMON_COPY.METH_2_0_RELEASE_DATE,
    },
    INSTRUCTIONS: {
      SIZE: 228.4, // KB // Todo: Update when actual file is uploaded
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_2_0_INSTRUCT_PDF),
      LAST_UPDATED: COMMON_COPY.METH_2_0_RELEASE_DATE,
    },
    INSTRUCTIONS_ES: {
      SIZE: 173.6, // KB // Todo: Update when actual file is uploaded
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_2_0_INSTRUCT_ES_PDF),
      LAST_UPDATED: COMMON_COPY.METH_2_0_RELEASE_DATE,
    },
    COMP_CHART: {
      SIZE: 33.1, // KB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_2_0_TOOL_COMP_PDF),
      LAST_UPDATED: COMMON_COPY.METH_2_0_RELEASE_DATE,
    },
    M_23_09_ES: {
      SIZE: 120.5, // KB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_2_0_M_23_09_SIGNED_PDF),
      LAST_UPDATED: COMMON_COPY.METH_2_0_RELEASE_DATE,
    },
  },
  BETA: {
    COMMUNITIES_LIST_XLS: {
      SIZE: 23.7, // MB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_BETA_COMMUNITIES_LIST_XLS, VERSIONS.BETA),
      LAST_UPDATED: new Date('10/27/2022').getTime(),
    },
    COMMUNITIES_LIST_CSV: {
      SIZE: 26.8, // MB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_BETA_COMMUNITIES_LIST_CSV, VERSIONS.BETA),
      LAST_UPDATED: new Date('10/27/2022').getTime(),
    },
    SHAPE_FILE: {
      SIZE: 351.4, // MB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_BETA_SHAPE_FILE_ZIP, VERSIONS.BETA),
      LAST_UPDATED: new Date('10/27/2022').getTime(),
    },
    TSD: {
      SIZE: 2.4, // MB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_TSD_PDF, VERSIONS.BETA),
      LAST_UPDATED: new Date('10/27/2022').getTime(),
    },
    TSD_ES: {
      SIZE: 4.8, // MB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_TSD_ES_PDF, VERSIONS.BETA),
      LAST_UPDATED: new Date('10/27/2022').getTime(),
    },
    HOW_TO_COMMUNITIES: {
      SIZE: 658.3, // KB
      URL: getDownloadFileUrl(process.env.GATSBY_FILE_DL_PATH_HOW_TO_COMMUNITIES_PDF, VERSIONS.BETA),
      LAST_UPDATED: new Date('10/27/2022').getTime(),
    },
  },
};

// If this is not a function, it will cause a circular dependency
export const getDownloadIconAltTag = () => defineMessages({
  ALT_TAG: {
    id: 'downloads.page.download.icon.alt.tag',
    defaultMessage: 'The icon used to indicate that the file is downloadable',
    description: 'Navigate to the Downloads page, this is the icon used to indicate that the file is downloadable',
  },
});

export {RELEASE_2_0} from './releaseNotes';

export const DOWNLOAD_LINKS = {
  TITLE: <FormattedMessage
    id={'download.page.files.section.title'}
    defaultMessage={`Version {version} file formats`}
    description={'Navigate to the download page. This is first download file link'}
    values={{
      version: VERSION_NUMBER,
    }}
  />,
  TEXT: <FormattedMessage
    id={'downloads.page.files.section.text'}
    defaultMessage={'The dataset used in the {version} version of the tool, along with a codebook, and information about how to use the list of communities (.pdf) are available for download:'}
    description={'Navigate to the Downloads page, this will be the page description1 text'}
    values={{
      version: VERSION_NUMBER,
    }}
  />,
  LINKS: [
    <FormattedMessage
      id={'download.page.download.file.1'}
      key={'download.page.download.file.1'}
      defaultMessage={`
        <link1>Communities list data</link1> (.xlsx {cldXlsFileSize})
        `}
      description={'Navigate to the download page. This is first download file link'}
      values={{
        link1: COMMON_COPY.downloadLink(DOWNLOAD_FILES.NARWAL.COMMUNITIES_LIST_XLS.URL),
        cldXlsFileSize: <FormattedNumber
          value={DOWNLOAD_FILES.NARWAL.COMMUNITIES_LIST_XLS.SIZE}
          style="unit"
          unit="megabyte"
          unitDisplay="narrow"
        />,
      }}
    />,
    <FormattedMessage
      id={'download.page.download.file.2'}
      key={'download.page.download.file.2'}
      defaultMessage={`<link2>Communities list data</link2> (.csv {cldCsvFileSize})`}
      description={'Navigate to the download page. This is second download file link'}
      values={{
        link2: COMMON_COPY.downloadLink(DOWNLOAD_FILES.NARWAL.COMMUNITIES_LIST_CSV.URL),
        cldCsvFileSize: <FormattedNumber
          value={DOWNLOAD_FILES.NARWAL.COMMUNITIES_LIST_CSV.SIZE}
          style="unit"
          unit="megabyte"
          unitDisplay="narrow"
        />,
      }}
    />,
    <FormattedMessage
      id={'download.page.download.file.3'}
      key={'download.page.download.file.3'}
      defaultMessage={`<link3>Shapefile</link3> (Codebook included with shapefile {shapeFileSize} unzipped)`}
      description={'Navigate to the download page. This is third download file link'}
      values={{
        link3: COMMON_COPY.downloadLink(DOWNLOAD_FILES.NARWAL.SHAPE_FILE.URL),
        shapeFileSize: <FormattedNumber
          value={DOWNLOAD_FILES.NARWAL.SHAPE_FILE.SIZE}
          style="unit"
          unit="megabyte"
          unitDisplay="narrow"
        />,
      }}
    />,
    <FormattedMessage
      id={'download.page.download.file.4'}
      key={'download.page.download.file.4'}
      defaultMessage={`<link4>Technical support document</link4> (.pdf {tsdFileSize})`}
      description={'Navigate to the download page. This is fourth download file link'}
      values={{
        link4: COMMON_COPY.linkFn(DOWNLOAD_FILES.NARWAL.TSD.URL, false, true),
        link4es: COMMON_COPY.linkFn(DOWNLOAD_FILES.NARWAL.TSD_ES.URL, false, true),
        tsdFileSize: <FormattedNumber
          value={DOWNLOAD_FILES.NARWAL.TSD.SIZE}
          style="unit"
          unit="kilobyte"
          unitDisplay="narrow"
        />,
      }}
    />,

  ],
};
