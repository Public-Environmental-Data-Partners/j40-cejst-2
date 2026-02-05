import React from 'react';
import AreaDetail from './AreaDetail';
import SidePanelInfo from './SidePanelInfo';
import type {LayerFilters} from './LayerFilter';

interface IMapInfoPanelProps {
  className: string;
  featureProperties: {[key: string]: string | number} | undefined;
  hash: string[];
  /** Current LayerFilter state; passed to AreaDetail when a tract is selected. */
  layerFilters?: LayerFilters;
}

const MapInfoPanel = ({
  className,
  featureProperties,
  hash,
  layerFilters,
}: IMapInfoPanelProps) => {
  return (
    <div className={className}>
      {/*
      The tertiary conditional statement below will control the side panel state. Currently
      there are two states, namely showing the AreaDetail or SidePanelInfo. When a feature
      is selected, show the AreaDetail. When not selected show SidePanelInfo
       */}
      {(featureProperties) ?
          <AreaDetail
            properties={featureProperties}
            hash={hash}
            layerFilters={layerFilters}
          /> :
          <SidePanelInfo />
      }
    </div>
  );
};

export default MapInfoPanel;
