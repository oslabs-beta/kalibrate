import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
// import {topicColumn, topicData} from '../../../mockData.js';
import {TopicsDisplayProps} from './types';

const TopicsDisplay = (props: TopicsDisplayProps) => {
  const {handleComponentChange, topics} = props;

  // eventual list to generate...
  const topicsList = topics.map(topic => {
    return (
      <tr key={topic.name} className="hover">
        <th>{topic.name}</th>
        <td>{topic.partitions.length}</td>
        <td>{Math.max(...topic.offsets.map(offset => Number(offset.high)))}</td>
        <td>
          <button
            name={topic.name}
            className="btn btn-ghost btn-sm"
            onClick={handleComponentChange}
          >
            Partitions
          </button>
        </td>
        <td>
          <button
            name={topic.name}
            className="btn btn-ghost btn-sm"
            onClick={handleComponentChange}
          >
            Messages
          </button>
        </td>
      </tr>
    );
  });

  // two hardcoded values are used as example, remove hardcoded example and update/render list instead when data available
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Partitions</th>
            <th>Offset</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>{topicsList}</tbody>
      </table>
    </div>
  );
};

export default TopicsDisplay;
