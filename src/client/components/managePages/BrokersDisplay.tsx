import {useState} from 'react';
import {Box, Paper} from '@mui/material';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {BrokersDisplayProps} from '../../types';

const BrokersDisplay = ({clusterData}: BrokersDisplayProps) => {
  //default num of rows on a page of data grid
  const [pageSize, setPageSize] = useState<number>(5);
  const {brokers} = clusterData;

  const brokerColumns = [
    {field: 'clusterId', headerName: 'Cluster ID', flex: 1},
    {field: 'nodeId', headerName: 'Node ID', flex: 1},
    {field: 'host', headerName: 'Host', flex: 1},
    {field: 'port', headerName: 'Port', flex: 1},
  ];

  // Takes information from broker array and returns row data
  const brokerRows = brokers.map((broker, index) => {
    return {
      id: index,
      clusterId: clusterData.clusterId,
      nodeId: broker.nodeId,
      host: broker.host,
      port: broker.port,
    };
  });

  return (
    <div className="wrapper">
      <div className="display-table">
        <Box sx={{height: 400, width: '1000'}}>
          <Paper elevation={6}>
            <DataGrid
              autoHeight // sets table height based on number of rows
              rows={brokerRows}
              columns={brokerColumns}
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
