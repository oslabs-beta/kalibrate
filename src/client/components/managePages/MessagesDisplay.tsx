import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Button, Grid, Pagination} from '@mui/material';
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
import {messageColumn, messageData} from '../../../../demo/mockData.js';

const MessagesDisplay = () => {
  // add in other eventual props to use...
  // const { messages } = props;

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

  const [pageSize, setPageSize] = useState<number>(5);

  // Fetch messages on mount
  useEffect(() => {
    fetchTopicMessages();
  }, []);

  // Fetch messages
  // todo: should also add handler for refresh button
  const fetchTopicMessages = async () => {
    try {
      const response = await fetch('/api/fulfilled/messages'); // replace route param with given topic prop
      if (!response.ok) throw new Error();

      const data = await response.json();
      console.log(data); // asign to state and render
    } catch (err) {
      console.log(err);
    }
  };

  // hardcoded value used as example, remove hardcoded example and update/render list instead when data available
  return (
    <div className="wrapper">
      {/* <div className="message-table">
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
      </div> */}
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
