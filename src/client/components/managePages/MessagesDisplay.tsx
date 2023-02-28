import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Button, Grid, Pagination} from '@mui/material';
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
import {messageColumn, messageData} from '../../../../demo/mockData.js';

const MessagesDisplay = props => {
  // add in other eventual props to use...

  // eventual list to generate...
  // const messagesList = messages.map(message => {
  //   return (
  //     <tr className="hover">
  //       <th>partition.key</th>
  //       <td>partition.value</td>
  //       <td>partition.offset</td>
  //       <td>partition.partition</td>
  //     </tr>
  //   );
  // });
  //GET  PROPERTIES
  // const {messages} = props;
  // const rows = messages.map(message => {
  //   return {
  //     key: message.key,
  //     val: message.val,
  //     offset: message.offset,
  //     high: message.high,
  //     low: message.low,
  //   };
  // });

  const [pageSize, setPageSize] = useState<number>(5);
  // hardcoded value used as example, remove hardcoded example and update/render list instead when data available
  return (
    <div className="wrapper">
      <div className="message-table">
        <Box sx={{height: 400, width: '1000'}}>
          <Paper elevation={6}>
            <DataGrid
              //better alt for autoHeight? DataGrid inherits height of parent, even if have data
              autoHeight
              rows={messageData}
              columns={messageColumn}
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
    </div>
  );
};

export default MessagesDisplay;

/*
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th>Offset</th>
            <th>Partition</th>
          </tr>
        </thead>

        <tbody>
          <tr className="hover">
            <th>myKey</th>
            <td>myVal</td>
            <td>100</td>
            <td>0</td>
          </tr>

          {messagesList}
          </tbody>
          </table>
        </div>
*/
