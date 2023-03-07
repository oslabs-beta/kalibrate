import React from 'react';
import {render, screen, cleanup} from '@testing-library/react';
import Dashboard from '../src/client/components/Dashboard';

afterEach(cleanup)


const connectedProps = {
    isConnected: true,
    sessionClusters: ['cluster1'],
    setConnectedCluster : () => {}
}

const emptyProps = {
    isConnected: false,
    sessionClusters: [],
    setConnectedCluster : () => {}
}

//test if sidebar renders when a cluster is connected

xit('renders sidebar when cluster is connected', () => {
  const {getByRole} = render(<Dashboard {...connectedProps}/>);
  const sidebar = getByRole('drawer');
  expect(sidebar.isConnected).toBeTruthy();
});

//test if sidebar is hidden when no cluster is connected
xit('hide sidebar when no cluster is connected', () => {
    const {getByRole} = render(<Dashboard {...emptyProps}/>);
    const sidebar = getByRole('drawer');
    expect(!sidebar.).toBeTruthy();
  });

//test if the sidebar is rendering the correct number of clusters connected



//test if the dashboard is rendering the outlet component


