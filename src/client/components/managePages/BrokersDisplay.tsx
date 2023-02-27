import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Button, Grid, Pagination} from '@mui/material';
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
import {brokerColumn, brokerData} from '../../../../demo/mockData.js';

const BrokersDisplay = () => {
  // eventual props to use...
  // const { brokers } = props;

  // eventual list to generate...
  // const brokersList = brokers.map(broker => {
  //   return (
  //     <tr className="hover">
  //       <th>broker.id</th>
  //       <td>broker.host</td>
  //       <td>broker.port</td>
  //     </tr>
  //   );
  // });
  //default num of rows on a page
  const [pageSize, setPageSize] = useState<number>(5);

  // hardcoded values are used as example, remove hardcoded example and render list instead when data available
  return (
    <div className="wrapper">
      <div className="display-table">
        <Box sx={{height: 400, width: '1000'}}>
          <Paper elevation={6}>
            <DataGrid
              //better alt for autoHeight? DataGrid inherits height of parent, even if have data
              autoHeight
              rows={brokerData}
              columns={brokerColumn}
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

export default BrokersDisplay;
/*//old
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Node ID</th>
            <th>Host</th>
            <th>Port</th>
          </tr>
        </thead>

        <tbody>
          <tr className="hover">
            <th>0</th>
            <td>localhost</td>
            <td>9091</td>
          </tr>

          {/* {brokersList}
        </tbody>
      </table>
    </div>*/
