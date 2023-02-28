import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {Button, Grid, Pagination} from '@mui/material';
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
import {partitionData, partitionColumn} from '../../../../demo/mockData';

const PartitionsDisplay = props => {
  // add in other eventual props to use..

  // eventual list to generate...
  // const partitionsList = partitions.map(partition => {
  //   return (
  //     <tr key=partition.id className="hover">
  //       <th>partition.id</th>
  //       <td>partition.leader</td>
  //       <td>partition.offset</td>
  //       <td>partition.high</td>
  //       <td>partition.low</td>
  //     </tr>
  //   );
  // });
  //GETPROPS
  const {partitions} = props;
  const rows = partitionData.map((partition, index) => {
    return {
      id: index,
      partId: partition.id,
      leader: partition.leader,
      offset: partition.offset,
      high: partition.high,
      low: partition.low,
    };
  });
  const [pageSize, setPageSize] = useState<number>(5);
  // hardcoded value used as example, remove hardcoded example and update/render list instead when data available
  return (
    <div className="wrapper">
      <div className="partition-table">
        <Box sx={{height: 400, width: '1000'}}>
          <Paper elevation={6}>
            <DataGrid
              //better alt for autoHeight? DataGrid inherits height of parent, even if have data
              autoHeight
              rows={rows}
              columns={partitionColumn}
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

export default PartitionsDisplay;
/*
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Partition ID</th>
            <th>Leader</th>
            <th>Offset</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>

        <tbody>
          <tr className="hover">
            <th>0</th>
            <td>0</td>
            <td>100</td>
            <td>50</td>
            <td>150</td>
          </tr>

    {partitionsList}
          </tbody>
          </table>
        </div>*/
