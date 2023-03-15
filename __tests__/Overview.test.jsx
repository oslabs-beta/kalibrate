import React from 'react';
import {MemoryRouter, Route, Routes, Outlet} from 'react-router-dom';
import {setupServer} from 'msw/node';
import {render, screen, fireEvent} from '@testing-library/react';
import Overview from '../src/client/components/Overview';

describe('Overview Component', () => {
  const mockTimeSeries = {
    cluster: 'testCluster',
    time: 0,
    groupStatus: {
      empty: 1,
      stable: 4,
      preparingRebalance: 1,
      other: 2,
    },
    topicOffsets: {topic1: 10, topic2: 20},
    groupOffsets: {group1: 30, group2: 40},
    topicThroughputs: {topic1: 1, topic2: 2},
    groupThroughputs: {group1: 0.5, group2: 1.5},
    topicReplicaStatus: {topic1: 100, topic2: 66},
  };

  const mockClusterData = {
    clusterData: {
      clusterId: 'testCluster',
      controllers: 5,
      brokers: ['broker1', 'broker2'],
    },
    topicData: {topics: []},
    groupData: [],
  };

  const mockConnectedCluster = 'testCluster';

  render(
    //<Route>
    <Overview
      connectedCluster={mockConnectedCluster}
      timeSeriesData={[mockTimeSeries]}
      data={mockClusterData}
    />
    //</Route>
  );

  it('renders cards with their contents', async () => {
    expect(await screen.findByText(/Cluster Name:/)).toBeVisible();
    expect(await screen.findByText(new RegExp(mockConnectedCluster, 'i'))).toBeVisible();

    expect(await screen.findByText(/Topics:/)).toBeVisible();
    expect(
      await screen.findAllByText(new RegExp(String(mockClusterData.topicData.topics.length, 'i')))
        .length
    ).toBeTruthy;

    expect(await screen.findByText(/Offsets at connection:/)).toBeVisible();
    expect(await screen.findByText(/100/)).toBeVisible();
    expect(await screen.findByText(/Partitions:/)).toBeVisible();
    expect(await screen.findByText(/Brokers:/)).toBeVisible();

    const doughnut = document.getElementsByClassName('groupDoughnutChart');
    expect(doughnut.length).toEqual(1);
  });
});
