import Box from '@mui/material/Box';
import {DataGrid, GridColDef, GridRowsProp} from '@mui/x-data-grid';

const columns: GridColDef[] = [
  {field: 'id', headerName: 'Consumer ID', width: 500},
  {field: 'numOfTopics', headerName: 'Topics Subscribed', width: 150},
  {field: 'recordsLagMax', headerName: 'Records Lag (Max)', width: 150},
  {field: 'status', headerName: 'Status', width: 100},
];

//with real data, will need to map
const row = [
  {id: '1234567890', numOfTopics: '21', recordsLagMax: '4324', status: 'hoi'},
  {id: '0987654321', numOfTopics: '43', recordsLagMax: '8114', status: 'ioh'},
  {id: '12345670', numOfTopics: '21', recordsLagMax: '4324', status: 'hoi'},
  {id: '09854321', numOfTopics: '43', recordsLagMax: '8114', status: 'ioh'},
  {id: '1234567', numOfTopics: '21', recordsLagMax: '4324', status: 'hoi'},
  {id: '0987654321', numOfTopics: '43', recordsLagMax: '8114', status: 'ioh'},
  {id: '544567890', numOfTopics: '21', recordsLagMax: '4324', status: 'hoi'},
  {id: '0987654321', numOfTopics: '43', recordsLagMax: '8114', status: 'ioh'},
];
const ConsumersDisplay = () => {
  return (
    <Box sx={{height: 400, width: '90vw'}}>
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};
export default ConsumersDisplay;
