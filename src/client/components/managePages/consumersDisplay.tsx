import {useState} from 'react';
import {Box, Paper} from '@mui/material';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {ConsumerDisplayProps} from '../../types';

const ConsumersDisplay = (props: ConsumerDisplayProps) => {
  const {groupData} = props;
  const fields = [
    'id',
    'memberName',
    'numOfMembers',
    'subscribedTopics',
    'protocolType',
    'recordsLag',
    'status',
  ];
  const headers = [
    'GroupId',
    'Member Name',
    'Number of Members',
    'Topics Subscribed',
    'Protocol Type',
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
    console.log('group', group);
    return {
      id: group.groupId,
      memberName: group.members.length ? group.members[0].memberId.slice(20) : 'N/A',
      numOfMembers: group.members.length,
      subscribedTopics: 6,
      protocolType: group.protocolType,
      recordsLag: 0,
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
