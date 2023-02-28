import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
// import {topicColumn, topicData} from '../../../mockData.js';

const TopicsDisplay = ({handleComponentChange}) => {
  // add in other eventual props to use...
  // const { topics } = props;

  // eventual list to generate...
  // const topicsList = topics.map(topic => {
  //   return (
  //     <tr key=topic.name className="hover">
  //       <th>topics.name</th>
  //       <td>topics.replicationFactor</td>
  //       <td>topics.partitionsNumber</td>
  //       <td>topics.messagesNumber</td>
  //       <td>
  //         <button name=topic.name className="btn btn-ghost btn-sm" onClick={handlePartitionsComponentChange}>Partitions</button>
  //       </td>
  //       <td>
  //         <button name=topic.name className="btn btn-ghost btn-sm" onCLick={handleMessagesComponentChange}>Messages</button>
  //       </td>
  //     </tr>
  //   );
  // });

  // two hardcoded values are used as example, remove hardcoded example and update/render list instead when data available
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Replication Factor</th>
            <th>Number of Partitions</th>
            <th>Number of Messages</th>
            <th></th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr className="hover">
            <th>Topic 1</th>
            <td>1</td>
            <td>1</td>
            <td>100</td>
            <td>
              <button
                name="Topic 1"
                className="btn btn-ghost btn-sm"
                onClick={handleComponentChange}
              >
                Partitions
              </button>
            </td>
            <td>
              <button
                name="Topic 1"
                className="btn btn-ghost btn-sm"
                onClick={handleComponentChange}
              >
                Messages
              </button>
            </td>
          </tr>

          <tr className="hover">
            <th>Topic 2</th>
            <td>1</td>
            <td>5</td>
            <td>500</td>
            <td>
              <button
                name="Topic 2"
                className="btn btn-ghost btn-sm"
                onClick={handleComponentChange}
              >
                Partitions
              </button>
            </td>
            <td>
              <button
                name="Topic 2"
                className="btn btn-ghost btn-sm"
                onClick={handleComponentChange}
              >
                Messages
              </button>
            </td>
          </tr>

          {/* {topicsList} */}
        </tbody>
      </table>
    </div>
  );
};

export default TopicsDisplay;
