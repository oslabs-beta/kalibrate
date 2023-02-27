import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Button, Grid, Pagination} from '@mui/material';
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
//consumer dummy column/data imported
import {consumerColumn, consumerData} from '../../../../demo/mockData.js';
//TODO: create fetch request to the back to get cosumer info.
//ssl true
//sasl:

const ConsumersDisplay = props => {
  const consumers = props.data.groups;
  console.log('Mapping consumers...', consumers);
  let rows;
  if (consumers) {
    rows = consumers.map((consumer, index) => {
      return {
        id: index,
        consumerId: consumer.consumerId,
        numOfTopics: consumer.numOfTopics,
        recordsLagMax: consumer.recordsLagMax,
        connectionStatus: consumer.connectionStatus,
      };
    });
  }
  const [pageSize, setPageSize] = useState<number>(5);
  return (
    <div className="display-table" data-testid="consumerDisplay-1">
      <Box sx={{height: 400, width: '1000'}}>
        <Paper elevation={6}>
          <DataGrid
            //better alt for autoHeight? DataGrid inherits height of parent, even if have data
            autoHeight
            // rows={consumerData}
            rows={rows}
            columns={consumerColumn}
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
