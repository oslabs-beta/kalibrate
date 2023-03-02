import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Button, Grid, Pagination} from '@mui/material';
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
//consumer dummy column/data imported
// import {consumerColumn, consumerData} from '../../../../demo/mockData.js';
import {ConsumerProps} from './types';

const ConsumersDisplay = (props: ConsumerProps) => {
  const {groupData} = props;
  const fields = ['id', 'members', 'numOfMembers', 'subscribedTopics', 'recordsLag', 'status'];
  const headers = [
    'GroupId',
    'Members',
    'Number of Members',
    'Topics Subscribed',
    'Records Lag',
    'Status',
  ];

  const [pageSize, setPageSize] = useState(10);

  // create array of objects
  const consumerCol = headers.map((header, i) => {
    return {
      field: fields[i],
      headerName: header,
      width: 250,
    };
  });

  const consumerD = groupData.map(group => {
    return {
      id: group.groupId,
      members: group.members.length ? group.members : 'N/A',
      numOfMembers: group.members.length,
      subscribedTopics: 6,
      recordsLag: 1,
      status: group.state,
    };
  });

  return (
    <div className="display-table" data-testid="consumerDisplay-1">
      <Box sx={{height: 400, width: '1000'}}>
        <Paper elevation={6}>
          <DataGrid
            autoHeight
            rows={consumerD}
            columns={consumerCol}
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

export default ConsumersDisplay;

/*attempts at pagination with custom footer
  function CustomPagination() {
    return <Pagination color="primary" count={5} page={1} />;
  }
          <Button onClick={updateConnectionStatus}>
            {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </Button>
*/
/*
//used to track status connection >:D
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {blue, pink} from '@mui/material/colors';
  //demo state for status connection; ideally would take in a connection status as props
  type connectionType = 'connected' | 'disconnected';
  const [connectionStatus, setConnectionStatus] = useState<connectionType | null>('disconnected');
  // useEffect(() => {
  //   console.log('updated!', connectionStatus);
  // }, [connectionStatus]);
  function CustomFooterStatusComponent(props: {connectionStatus: connectionType}) {
    return (
      <Box>
        <FiberManualRecordIcon
          fontSize="small"
          sx={{mr: 1, color: connectionStatus === 'connected' ? 'pink' : 'blue'}}
        />
        Status {props.connectionStatus}
        <Pagination pageSize={5} rowsPerPageOptions={[5, 10, 25]}></Pagination>
        </Box>
        );
      }
      //does not update
      const updateConnectionStatus = (): void => {
        console.log('connection clicked', connectionStatus);
        switch (connectionStatus) {
          case 'connected':
            setConnectionStatus('disconnected');
          case 'disconnected':
            setConnectionStatus('connected');
        }
      };
*/
