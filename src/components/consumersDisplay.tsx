import React from 'react';
import Box from '@mui/material/Box';
import {DataGrid, GridColDef, GridRowsProp, GridPagination} from '@mui/x-data-grid';

//create fetch request to the back to get cosumer info.
//ssl true
//sasl:
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
  {id: '09888854321', numOfTopics: '43', recordsLagMax: '8114', status: 'ioh'},
];
const ConsumersDisplay = () => {
  return (
    <div data-testid="consumerDisplay-1">
      <Box sx={{height: 400, width: '1000'}}>
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
};
export default ConsumersDisplay;
