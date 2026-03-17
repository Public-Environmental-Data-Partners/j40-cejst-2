import {useIntl} from 'gatsby-plugin-intl';
import React, {useState} from 'react';

import * as DOWNLOAD_COPY from '../../data/copy/downloads';
import * as styles from './ReleaseUpdate.module.scss';

// @ts-ignore
import expandIcon from '/node_modules/uswds/dist/img/usa-icons/expand_more.svg';
// @ts-ignore
import collapseIcon from '/node_modules/uswds/dist/img/usa-icons/expand_less.svg';

export interface IReleaseUpdateProps {
}

interface IJ40AccordionItem {
  id: string,
  children: React.ReactElement
}

/**
 * This function will create the custom Accordion item. This will be used
 * for the race and age demographic UI elements
 *
 * @param {IJ40AccordionItem} props
 * @return {JSX.Element}
 */
const J40AccordionItem = ({id, children}: IJ40AccordionItem) => {
  const intl = useIntl();
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <>
      <span>
        {intl.formatMessage(DOWNLOAD_COPY.PAGE_INTRO.VIEW)}{' '}
        <a
          className={styles.showHideText ? `usa-link ${styles.showHideText}` : `usa-link`}
          href={'javascript:void(0)'}
          id={`${id}-header`}
          aria-controls={`${id}-panel`}
          // aria-expanded={isExpanded}
          onClick={() => setIsExpanded(!isExpanded)}
          tabIndex={0}
        >
          {intl.formatMessage(DOWNLOAD_COPY.PAGE_INTRO.CHANGE_LOG)}
        </a>
        {isExpanded ?
          <img
            className={styles.showHideIcon}
            src={collapseIcon}
            alt={'collapse icon'}
            onClick={() => setIsExpanded(!isExpanded)}
          /> :
          <img
            className={styles.showHideIcon}
            src={expandIcon}
            alt={'expand icon'}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        }
      </span>

      <section
        id={`${id}-panel`}
        aria-labelledby={`${id}-header`}
        hidden={!isExpanded}
        className={styles.releaseUpdateContainer}
      >{children}
      </section>
    </>
  );
};

const ReleaseUpdate = ({ }: IReleaseUpdateProps) => {
  const release21Notes = (
    <div className={styles.releaseBlock}>
      <div className={styles.releaseHeader}>
        {DOWNLOAD_COPY.RELEASE_2_1.HEADER}
      </div>
      <div className={styles.releaseSectionTitle}>
        {DOWNLOAD_COPY.RELEASE_2_1.NEW_IMPROVED_SECTION}
      </div>
      <div>
        <ul>
          {DOWNLOAD_COPY.RELEASE_2_1.NEW_IMPROVED_CONTENT.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div className={styles.releaseNote}>
        {DOWNLOAD_COPY.RELEASE_2_1.NOTE}
      </div>
    </div>
  );

  const release20Notes = (
    <div className={styles.releaseBlock}>
      <div className={styles.releaseHeader}>
        {DOWNLOAD_COPY.RELEASE_2_0.HEADER}
      </div>
      <div className={styles.releaseSectionTitle}>
        {DOWNLOAD_COPY.RELEASE_2_0.NEW_IMPROVED_SECTION}
      </div>
      <div>
        <ul>
          {DOWNLOAD_COPY.RELEASE_2_0.NEW_IMPROVED_CONTENT.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div className={styles.releaseSectionTitle}>
        {DOWNLOAD_COPY.RELEASE_2_0.TECHNICAL_FIXES_SECTION}
      </div>
      <div>
        <ul>
          {DOWNLOAD_COPY.RELEASE_2_0.TECHNICAL_FIXES_CONTENT.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div className={styles.releaseSectionTitle}>
        {DOWNLOAD_COPY.RELEASE_2_0.UI_SECTION}
      </div>
      <div>
        <ul>
          {DOWNLOAD_COPY.RELEASE_2_0.UI_CONTENT.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className={styles.releaseUpdateComponent}>
      <J40AccordionItem id={'releaseUpdate'}>
        <div>
          {release21Notes}
          {release20Notes}
        </div>
      </J40AccordionItem>
    </div>
  );
};

export default ReleaseUpdate;
