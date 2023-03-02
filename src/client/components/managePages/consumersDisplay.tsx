import {useState} from 'react';
import {Box, Paper} from '@mui/material';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {ConsumerDisplayProps} from '../../types';

const ConsumersDisplay = (props: ConsumerDisplayProps) => {
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
            autoHeight // sets table height based on number of rows
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
