import {useState} from 'react';
import {useOutletContext} from 'react-router-dom';
import {Box, Paper} from '@mui/material';
import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {partitions, TopicsContext} from '../../types';

// Displays partitions within Topics component
const PartitionsDisplay = () => {
  const {topicPartitions}: TopicsContext = useOutletContext();
  const [pageSize, setPageSize] = useState<number>(25);

  const partitionColumns = [
    {field: 'partId', headerName: 'Partition ID', flex: 1},
    {field: 'leader', headerName: 'Leader', flex: 1},
    {field: 'isr', headerName: 'In-Sync Replicas', flex: 1},
    {field: 'replicas', headerName: 'Replicas', flex: 1},
    {field: 'offlineReplicas', headerName: 'Offline Replicas', flex: 1},
    {field: 'error', headerName: 'Error Code', flex: 1},
  ];

  const partitionRows = topicPartitions.map((partition: partitions, index: number) => {
    return {
      id: index,
      key: index,
      partId: partition.partitionId,
      leader: partition.leader,
      isr: partition.isr,
      replicas: partition.replicas,
      offlineReplicas: partition.offlineReplicas,
      error: partition.partitionErrorCode,
    };
  });

  return (
    <div className="wrapper">
      <div className="partition-table">
        <Box sx={{height: 400, width: '1000'}}>
          <Paper elevation={6} sx={{height: 'calc(100vh - 225px)'}}>
            <DataGrid
              rows={partitionRows}
              columns={partitionColumns}
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
