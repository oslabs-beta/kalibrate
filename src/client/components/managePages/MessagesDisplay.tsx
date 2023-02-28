/*
TODO: 
date conversion
timeout for fetch (15s?) + performance tuning
*/

import {useState, useEffect} from 'react';
import {Box, Paper, CircularProgress, Button, Alert} from '@mui/material';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {MessageDisplayProps, message} from './types';

const MessagesDisplay = ({topic}: MessageDisplayProps) => {
  const [pageSize, setPageSize] = useState<number>(25);
  const [messages, setMessages] = useState<message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Fetches all messages for a given topic and update state
  const fetchTopicMessages = async () => {
    try {
      const response = await fetch(`/api/${topic}/messages`);

      if (!response.ok) throw new Error();

      const messages = await response.json();
      setMessages(messages);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setIsError(true);
    }
  };

  // Get messages on mount
  useEffect(() => {
    fetchTopicMessages();
  }, []);

  // Refresh messages button handler
  const handleMessagesRefresh = async () => {
    setIsLoading(true);
    setIsError(false);
    await fetchTopicMessages();
  };

  // Generate messages column
  const messageColumn = [
    {field: 'key', headerName: 'Key', flex: 1.5},
    {field: 'value', headerName: 'Value', flex: 3.5},
    {field: 'partition', headerName: 'Partition', flex: 0.5},
    {field: 'offset', headerName: 'Offset', flex: 0.5},
    {field: 'timestamp', headerName: 'Timestamp', flex: 1},
  ];

  // Generate messages rows
  const messageRows = messages.map((message, index) => {
    const convertedTimestamp = new Date(message.timestamp); // ???
    console.log(new Date(message.timestamp));
    return {
      id: index,
      key: message.key,
      value: message.value,
      partition: message.partition,
      offset: message.offset,
      timestamp: convertedTimestamp, // convert UTC string
    };
  });

  // Generate messages data grid with generates columns and rows
  const messageTable = (
    <Box sx={{height: 400, width: '1000'}}>
      <Paper elevation={6}>
        <DataGrid
          autoHeight
          getRowHeight={() => 'auto'}
          rows={messageRows}
          columns={messageColumn}
          pageSize={pageSize}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          rowsPerPageOptions={[25, 50, 100]}
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
  );

  // Loading wheel for while data is loading
  const loadingWheel = (
    <Box sx={{display: 'flex', justifyContent: 'center'}}>
      <CircularProgress size="75px" />
    </Box>
  );

  // Button to reload messages
  const refreshButton = (
    <Button variant="contained" onClick={handleMessagesRefresh}>
      Refresh
    </Button>
  );

  // Disabled variant while processing a refresh request
  const disabledRefreshutton = (
    <Button variant="contained" disabled>
      Refresh
    </Button>
  );

  // Error prompt for failed fetches
  const errorAlert = <Alert severity="error">Failed to load messages.</Alert>;

  // Conditionally rendering loading wheel or table w/ refresh button
  return (
    <div className="wrapper">
      <div className="refresh">{isLoading ? disabledRefreshutton : refreshButton}</div>
      <div className="message-table">
        {isLoading ? loadingWheel : isError ? errorAlert : messageTable}
      </div>
    </div>
  );
};

export default MessagesDisplay;
