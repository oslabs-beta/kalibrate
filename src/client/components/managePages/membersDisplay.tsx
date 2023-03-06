import {useState} from 'react';
import {useParams, useOutletContext, useNavigate} from 'react-router-dom';
import {Box, Paper, Button} from '@mui/material';
import {DataGrid, GridRenderCellParams, GridToolbar, GridValueGetterParams} from '@mui/x-data-grid';

// Display group member data within consumers
const MembersDisplay = () => {
  const {groupData} = useOutletContext();
  const {groupId} = useParams();
  const navigate = useNavigate();

  const memberData = groupData.filter(group => {
    return group.groupId === groupId;
  })[0].members;

  const [pageSize, setPageSize] = useState(10);

  const memberColumns = [
    {field: 'clientId', headername: 'Client ID', flex: 1},
    {field: 'clientHost', headerName: 'Client Host', flex: 1},
    {field: 'memberId', headerName: 'Member ID', flex: 1},
    {
      field: 'topic',
      headerName: 'Topic',
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => (
        <Box>
          <Button
            onClick={e => {
              navigate(`../../topics`, {state: {selectedTopic: params.value}});
            }}
          >
            {params.value}
          </Button>
        </Box>
      ),
    },
  ];

  const memberRows = memberData.map((member, index) => {
    return {
      id: index,
      clientId: member.clientId,
      clientHost: member.clientHost,
      memberId: member.memberId,
      //link to general topic page, with a specific topic filter?
      topic: member.memberAssignment,
    };
  });

  return (
    <div className="display-table" data-testid="consumerDisplay-1">
      <Box sx={{height: 400, width: '1000'}}>
        <Paper elevation={6}>
          <DataGrid
            autoHeight // sets table height based on number of rows
            rows={memberRows}
            columns={memberColumns}
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

export default MembersDisplay;
