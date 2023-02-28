import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Button, Grid, Pagination} from '@mui/material';
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
//REMEMBER TO CHANGE BETWEEN MOCK DATA (producersData) AND REAL KAFKA DATA (rows)
import {producerColumn, producerData} from '../../../../demo/mockData.js';

const ProducersDisplay = props => {
  const producers = props.data.groups;
  console.log('Mapping producers...', producers);
  let rows;
  if (producers) {
    rows = producers.map((producer, index) => {
      return {
        id: index,
        topicId: producer.topicId,
        topicName: producer.topicName,
        topicRole: producer.topicRole,
      };
    });
  }

  const [pageSize, setPageSize] = useState<number>(5);
  return (
    <div className="wrapper">
      <div className="display-table">
        <Box sx={{height: 400, width: '1000'}}>
          <Paper elevation={6}>
            <DataGrid
              //better alt for autoHeight? DataGrid inherits height of parent, even if have data
              autoHeight
              // rows={producerData}
              rows={rows}
              columns={producerColumn}
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
    </div>
  );
};

export default ProducersDisplay;
// placeholder for eventual props

// once backdata data shape received, maybe refactor to loop like:
// const displayElements = [];
// for (const el of props.producerData) {
//   displayElements.push(<td>producerData[el]</td>)
// }
// const {producers} = props;
// const rows = producers.map(producer => {
//   return {
//     id: producer.id,
//     topicName: producer.name,
//     topicRole: producer.role,
//   };
// });
