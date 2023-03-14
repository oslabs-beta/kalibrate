import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Paper, Button} from '@mui/material';
import {DataGrid, GridToolbar, GridValueGetterParams} from '@mui/x-data-grid';
import {ConsumerDisplayProps} from '../../types';

const ConsumersDisplay = (props: ConsumerDisplayProps) => {
  let {groupData} = props;
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  //  Create column headers & "members" button functionality
  const consumerColumns = [
    {field: 'groupId', headerName: 'Group ID', flex: 1},
    {field: 'state', headerName: 'State', flex: 1},
    {field: 'errorCode', headerName: 'Error Code', flex: 1},
    {field: 'protocol', headerName: 'Protocol', flex: 1},
    {field: 'numberOfMembers', headerName: 'Number Of Members', flex: 1},
    {
      field: 'seeMembers',
      headerName: 'See Members',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => (
        <Box>
          <Button
            onClick={e => {
              const groupId = params.row.groupId;
              navigate(`${groupId}/members`);
            }}
          >
            Members
          </Button>
        </Box>
      ),
    },
  ];

  // Create table rows, setting group data to an array if it's undefined
  if (!groupData) groupData = [];
  const consumerRows = groupData.map((group, index) => {
    return {
      id: index,
      groupId: group.groupId,
      state: group.state,
      errorCode: group.errorCode,
      protocol: group.protocol ? group.protocol : 'N/A',
      numberOfMembers: group.members.length,
    };
  });

  return (
    <div className="display-table" data-testid="consumerDisplay-1">
      <Box sx={{height: 400, width: '1000'}}>
        <Paper elevation={6}>
          <DataGrid
            autoHeight // sets table height based on number of rows
            rows={consumerRows}
            // @ts-ignore
            columns={consumerColumns}
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
