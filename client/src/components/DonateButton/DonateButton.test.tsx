import React from 'react';
import {render} from '@testing-library/react';
import {LocalizedComponent} from '../../test/testHelpers';
import DonateButton from './DonateButton';

describe('rendering of DonateButton Component', () => {
  const {asFragment} = render(
      <LocalizedComponent>
        <DonateButton href="https://donorbox.org/open-environmental-data-project-donations-2" />
      </LocalizedComponent>,
  );
  it('checks if component renders', () => {
    expect(asFragment()).toMatchSnapshot();
  });
});
