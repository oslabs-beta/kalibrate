import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {render, screen, fireEvent} from '@testing-library/react';
import Manage from '../src/client/components/Manage';

describe('Manage component (navigation sidebar', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Manage connectedCluster={'testCluster'} />} />
        </Routes>
      </BrowserRouter>
    );
  });

  it('Displays correct number of buttons when trays closed', async () => {
    const buttons = await screen.findAllByRole('button');
    expect(buttons.length).toEqual(4);
  });

  it('Opens the "Manage" dropdown when clicked', async () => {
    const manageButton = await screen.findByText(/Manage/);
    expect(manageButton).toBeVisible();
    fireEvent.click(manageButton);
    expect(await screen.findByText('Brokers')).toBeVisible();
    expect(await screen.findByText('Topics')).toBeVisible();
    expect(await screen.findByText('Consumers')).toBeVisible();
  });
  screen.debug();

  it('Opens the "Monitor" dropdown when clicked', async () => {
    const monitorButton = await screen.findByText(/Monitor/);
    expect(monitorButton).toBeVisible();
    fireEvent.click(monitorButton);
    expect(await screen.findByText('Traffic and Health')).toBeVisible();
    expect(await screen.findByText('Offsets')).toBeVisible();
  });
});
