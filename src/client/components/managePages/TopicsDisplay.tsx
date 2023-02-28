import React, {useState} from 'react';
import {Button, Box, Paper} from '@mui/material';
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
import {topicData} from '../../../../demo/mockData';
import {TopicsDisplayProps} from './types';
import {Link, Outlet, useNavigate} from 'react-router-dom';
import PartitionsDisplay from './PartitionsDisplay';

const TopicsDisplay = (props: TopicsDisplayProps) => {
  const {handleComponentChange, topics} = props;
  const navigate = useNavigate();

  const topicColumn = [
    {field: 'topicName', headername: 'Name', width: 225},
    {field: 'replication', headerName: 'Replication Factor', width: 50},
    {field: 'numPartitions', headerName: 'Num of Paritions', width: 50},
    {field: 'numMessages', headerName: 'Num of Messages', width: 50},
    {
      field: 'linkToPart',
      headerName: 'See Partitions',
      width: 110,
      renderCell: () => (
        <Box>
          <Button
            onClick={e => {
              handleComponentChange(e);
              navigate('topic2/partitions');
            }}
          >
            Partitions
          </Button>
        </Box>
      ),
    },
    {
      field: 'linkToMsg',
      headerName: 'See Messages',
      width: 110,
      renderCell: () => (
        <Box>
          <Button
            onClick={e => {
              handleComponentChange(e);
              navigate('topic2/messages');
            }}
          >
            Messages
          </Button>
        </Box>
      ),
    },
  ];

  const rows = topicData.map((topic, index) => {
    return {
      id: index,
      topicName: topic.topicName,
      replications: topic.replications,
      numPartitions: topic.numPartitions,
      numMessages: topic.numMessages,
    };
  });
  const [pageSize, setPageSize] = useState<number>(5);
  // two hardcoded values are used as example, remove hardcoded example and update/render list instead when data available
  return (
    <div>
      <Box sx={{height: 400, width: '1000'}}>
        <Paper elevation={6}>
          <DataGrid
            //better alt for autoHeight? DataGrid inherits height of parent, even if have data
            autoHeight
            rows={rows}
            columns={topicColumn}
            pageSize={pageSize}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 25]}
            checkboxSelection
            disableSelectionOnClick
            disableColumnFilter
            components={{
              Toolbar: GridToolbar,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: {debounceMs: 500},
              },
            }}
          />
        </Paper>
      </Box>
      <Outlet />
    </div>
  );
};

export default TopicsDisplay;
// eventual list to generate...
// const topicsList = topics.map(topic => {
//   return (
//     <tr key={topic.name} className="hover">
//       <th>{topic.name}</th>
//       <td>{topic.partitions.length}</td>
//       <td>{Math.max(...topic.offsets.map(offset => Number(offset.high)))}</td>
//       <td>
//         <button
//           name={topic.name}
//           className="btn btn-ghost btn-sm"
//           onClick={handleComponentChange}
//         >
//           Partitions
//         </button>
//       </td>
//       <td>
//         <button
//           name={topic.name}
//           className="btn btn-ghost btn-sm"
//           onClick={handleComponentChange}
//         >
//           Messages
//         </button>
//       </td>
//     </tr>
//   );
// });
