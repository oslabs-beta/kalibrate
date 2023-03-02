import {useState} from 'react';
import {useNavigate, useOutletContext} from 'react-router-dom';
import {Button, Box, Paper} from '@mui/material';
import {DataGrid, GridToolbar, GridValueGetterParams} from '@mui/x-data-grid';
import {TopicsDisplayProps, TopicsContext} from '../../types';

const TopicsDisplay = ({topicData}: TopicsDisplayProps) => {
  const {topics} = topicData;
  const {handleComponentChange}: TopicsContext = useOutletContext();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState<number>(5);

  const topicColumns = [
    {field: 'topicName', headerName: 'Topic Name', flex: 1},
    {field: 'offsets', headerName: 'Offsets Total', flex: 1},
    {field: 'numPartitions', headerName: 'Partitions Total', flex: 1},
    {
      field: 'linkToPart',
      headerName: 'View Partitions',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => (
        <Box>
          <Button
            onClick={e => {
              const topic = params.row.topicName;
              const partitions = topics[params.row.id].partitions;

              handleComponentChange(e, topic, partitions);
              navigate(`${topic}/partitions`);
            }}
          >
            Partitions
          </Button>
        </Box>
      ),
    },
    {
      field: 'linkToMsg',
      headerName: 'View Messages',
      flex: 1,
      renderCell: (params: GridValueGetterParams) => (
        <Box>
          <Button
            onClick={e => {
              const topic = params.row.topicName;

              handleComponentChange(e, topic);
              navigate(`${topic}/messages`);
            }}
          >
            Messages
          </Button>
        </Box>
      ),
    },
  ];

  const topicRows = topics.map((topic, index) => {
    return {
      id: index,
      topicName: topic.name,
      offsets: topic.offsets.length,
      numPartitions: topic.partitions.length,
    };
  });

  return (
    <div>
      <Box sx={{height: 400, width: '1000'}}>
        <Paper elevation={6}>
          <DataGrid
            autoHeight // sets table height based on number of rows
            rows={topicRows}
            columns={topicColumns} // not sure how to fix this TS error
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

export default TopicsDisplay;
