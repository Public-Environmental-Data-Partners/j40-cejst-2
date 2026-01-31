import React from 'react';
import {useIntl} from 'gatsby-plugin-intl';
import * as styles from './TractCountSummary.module.scss';
import * as LAYER_FILTER_COPY from '../../data/copy/layerFilter';

export interface TractCountSummaryProps {
  /** Number of tracts matching the current layer filter (X in "X of Y") */
  selectedCount: number;
  /** Total number of census tracts (Y in "X of Y") */
  totalCount: number;
}

/**
 * Displays the disadvantaged tract count summary: "X of Y" where X is the count
 * matching the current layer filter and Y is the total tract count.
 * Positioned at the bottom-right of the map.
 * @return {JSX.Element}
 */
const TractCountSummary = ({selectedCount, totalCount}: TractCountSummaryProps) => {
  const intl = useIntl();
  const selectedFormatted = selectedCount.toLocaleString();
  const totalFormatted = totalCount.toLocaleString();
  const displayText = intl.formatMessage(
      LAYER_FILTER_COPY.LAYER_FILTER.TRACT_COUNT_SUMMARY,
      {selectedCount: selectedFormatted, totalCount: totalFormatted},
  );
  const ariaLabel = intl.formatMessage(
      LAYER_FILTER_COPY.LAYER_FILTER.TRACT_COUNT_ARIA_LABEL,
      {selectedCount: selectedFormatted, totalCount: totalFormatted},
  );

  return (
    <div
      className={styles.tractCountSummary}
      role="status"
      aria-label={ariaLabel}
    >
      {displayText}
    </div>
  );
};

export default TractCountSummary;
