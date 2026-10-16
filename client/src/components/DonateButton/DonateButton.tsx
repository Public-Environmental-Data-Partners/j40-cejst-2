import React from 'react';
import {useIntl} from 'gatsby-plugin-intl';
import {Button} from '@trussworks/react-uswds';

import * as styles from './DonateButton.module.scss';
import * as EXPLORE_COPY from '../../data/copy/explore';

// @ts-ignore
import launchIcon from '/node_modules/uswds/dist/img/usa-icons/launch.svg';

export interface IDonateButtonProps {
  href: string,
}

const DonateButton = ({href}: IDonateButtonProps) => {
  const intl = useIntl();

  return (
    <a href={href} target='_blank' rel="noreferrer">
      <Button
        type="button"
        className={styles.donateButtonContainer}>
        {intl.formatMessage(EXPLORE_COPY.PAGE_INTRO.DONATE_BUTTON)}
        <img
          className={styles.launchIcon}
          src={launchIcon}
          alt={'launch icon'}
        />
      </Button>
    </a>
  );
};

export default DonateButton;
