import React, {useState, useEffect} from 'react';
import {useOutletContext} from 'react-router-dom';
import {Box, Paper} from '@mui/material';
import {Button, Grid, Pagination} from '@mui/material';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {partitionData, partitionColumn} from '../../../../demo/mockData';
import {partitions} from './types';
const PartitionsDisplay = ({data}) => {
  const context = useOutletContext();
  const partitions = context.partitions[0];
  console.log('Here is the context data in partition display', partitions);

  const rows = partitions.map((partition: partitions, index: number) => {
    return {
      id: index,
      partId: partition.partitionId,
      leader: partition.leader,
      isr: partition.isr,
      replicas: partition.replicas,
      offlineReplicas: partition.offlineReplicas,
      error: partition.partitionErrorCode,
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
