import React from 'react';
import jest from 'jest';

import '@testing-library/user-event';
import {render, screen, cleanup} from '@testing-library/react';
import Consumers from '../src/client/components/managePages/consumers';
import ConsumersDisplay from '../src/client/components/managePages/consumersDisplay';

xdescribe('Consumer React', () => {
  it('should render consumer component', () => {
    render(<Consumers />);
    //get components from screen (tree) with specific testId
    const consumerElement = screen.getByTestId('consumer-1');
    expect(consumerElement).toBeInTheDocument();
  });

  //still passed when only render() and no expect()
  it('should render consumersDisplay component', () => {
    render(<ConsumersDisplay />);
    const displayElement = screen.getByTestId('consumerDisplay-1');
    expect(displayElement).toBeInTheDocument();
  });
});
