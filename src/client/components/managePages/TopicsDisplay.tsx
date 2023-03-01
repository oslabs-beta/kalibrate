import React, {useState, useEffect} from 'react';
import {Outlet, useNavigate, useOutletContext} from 'react-router-dom';
import {TopicsDisplayProps} from './types';
import {topicData} from '../../../../demo/mockData';
import {Button, Box, Paper} from '@mui/material';
import {DataGrid, GridToolbar, GridValueGetterParams} from '@mui/x-data-grid';

const TopicsDisplay = ({topics}) => {
  console.log('Here is the data in topics display', topics);
  const context = useOutletContext();

  // console.log('Trying to extra partitions and update state \n');
  // console.log(topicList[0].partitions);

  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState<number>(5);

  const topicColumn = [
    {field: 'topicName', headername: 'Topic Name', width: 200},
    {field: 'offsets', headerName: 'Offsets Total', width: 100},
    {field: 'numPartitions', headerName: 'Partitions Total', width: 100},
    {
      field: 'linkToPart',
      headerName: 'See Partitions',
      width: 110,
      renderCell: (params: GridValueGetterParams) => (
        <Box>
          <Button
            onClick={e => {
              // const topicName = getTopicName(),
              let partitions = topics[params.row.id].partitions;
              context.handleComponentChange(e, params.row.topicName, partitions);
              navigate('partitions');
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
      renderCell: (params: GridValueGetterParams) => (
        <Box>
          <Button
            onClick={e => {
              context.handleComponentChange(e, params.row.topicName);
              navigate('messages');
            }}
          >
            Messages
          </Button>
        </Box>
      ),
    },
  ];

  const rows = topics.map((topic, index) => {
    return {
      id: index,
      topicName: topic.name,
      offsets: topic.offsets.length,
      numPartitions: topic.partitions.length,
      // replications: topic.replications,
      // numMessages: topic.numMessages,
    };
  });

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
    </div>
  );
};

export default TopicsDisplay;
