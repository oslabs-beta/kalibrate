import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Button, Grid, Pagination} from '@mui/material';
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
// import {messageColumn, messageData} from '../../../../demo/mockData.js';
import {MessageDisplayProps, message} from './types';

const MessagesDisplay = ({topic}: MessageDisplayProps) => {
  // State
  const [pageSize, setPageSize] = useState<number>(5);
  const [messages, setMessages] = useState<message[]>([]); // see type file for message structure

  // Fetch messages and update state on mount
  useEffect(() => {
    fetchTopicMessages();
  }, []);

  // Fetches all messages for a given topic and sets the state of messages
  // todo: this func can also be used in a handler function for a refresh button
  // todo: render a loading wheel since it takes a while
  const fetchTopicMessages = async () => {
    try {
      const response = await fetch(`/api/${topic}/messages`); // replace the route param with topic prop
      if (!response.ok) throw new Error();

      const messages = await response.json();
      setMessages(messages);
    } catch (err) {
      console.log(err);
    }
  };

  // rendering list of messages as a test...
  // todo: replace with MUI table
  // todo: will likely need to incorporate pagination since there can be too many messages to load in one go
  const testList = messages.map(message => {
    return (
      <p
        key={message.key}
      >{`${message.topic} - ${message.partition} - ${message.timestamp} - ${message.offset} - ${message.key} - ${message.value}`}</p>
    );
  });

  // hardcoded value used as example, remove hardcoded example and update/render list instead when data available
  return (
    <div className="wrapper">
      {testList}
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
