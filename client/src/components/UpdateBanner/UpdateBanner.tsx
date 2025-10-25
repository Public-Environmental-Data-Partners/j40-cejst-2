import React from 'react';

import {Alert} from '@trussworks/react-uswds';
import * as COMMON_COPY from '../../data/copy/common';
import * as styles from './UpdateBanner.module.scss';
import Language from '../Language';

export const cutoffDate = new Date(2025, 0, 19); // 2025-01-19

const UpdateBanner = () => {
  const currentDate = new Date();

  // show large version before cutoff date
  const showLarge = currentDate < cutoffDate;

  if (showLarge) {
    return (
      <div className={styles.updateBanner}>
        <Alert
          type={'info'}
          headingLevel={'h1'}
          heading={COMMON_COPY.UPDATE_BANNER_HEADING_LARGE}
          className={styles.updateBannerAlert}
        >
          {COMMON_COPY.UPDATE_BANNER_CONTENT_LARGE}
        </Alert>
      </div>
    );
  } else {
    return (
      <div className={styles.updateBannerContainer}>
        <div className={styles.updateBanner}>
          <div className={styles.updateBannerContent}>
            <span className={styles.updateBannerText}>
              {COMMON_COPY.UPDATE_BANNER_CONTENT_SMALL}
            </span>
            <Language isDesktop={true} />
          </div>
        </div>
      </div>
    );
  }
};

export default UpdateBanner;
