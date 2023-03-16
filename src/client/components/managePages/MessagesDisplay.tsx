import {useState, useEffect} from 'react';
import {useOutletContext} from 'react-router-dom';
import {Box, Paper, Button, Alert, CircularProgress} from '@mui/material';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {message, TopicsContext} from '../../types';

const MessagesDisplay = () => {
  const {selectedTopic, connectedCluster}: TopicsContext = useOutletContext();
  const [pageSize, setPageSize] = useState<number>(100);
  const [messages, setMessages] = useState<message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Fetches all messages for a given topic and update state
  const fetchTopicMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${connectedCluster}/${selectedTopic}`);

      if (!response.ok) throw new Error();

      const messages = await response.json();
      setMessages(messages);
      setIsLoading(false);
    } catch (err) {
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
    const convertedTimestamp = new Date(Number(message.timestamp)).toLocaleString();

    return {
      id: index,
      key: message.key,
      value: message.value,
      partition: message.partition,
      offset: message.offset,
      timestamp: convertedTimestamp, // converted from UTC string
    };
  });

  // Generate messages data grid with generates columns and rows
  const messageTable = (
    <Box sx={{height: '70vh'}}>
      <Paper elevation={6} sx={{height: 'calc(100vh - 261px)'}}>
        <DataGrid
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

  // loading wheel
  const loadingWheel = () => {
    return (
      <div style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
        <CircularProgress size="70px" />
      </div>
    );
  };

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
        {isLoading ? loadingWheel() : isError ? errorAlert : messageTable}
      </div>
    </div>
  );
};

export default MessagesDisplay;
