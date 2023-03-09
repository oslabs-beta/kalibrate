import {useState} from 'react';
import {useNavigate, useOutletContext} from 'react-router-dom';
import {Button, Box, Paper, TextField} from '@mui/material';
import {DataGrid, GridToolbar, GridValueGetterParams} from '@mui/x-data-grid';
import {TopicsDisplayProps, TopicsContext} from '../../types';

// Displays topics within Topics component
const TopicsDisplay = ({topicData, connectedCluster}: TopicsDisplayProps) => {
  const {topics} = topicData;
  const {handleComponentChange}: TopicsContext = useOutletContext();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState<number>(10);

  const [newTopicName, setNewTopicName] = useState<string>('');
  const [numPartitions, setNumPartitions] = useState<number>(1);
  const [deleteTopic, setDeleteTopic] = useState<string>('');

  const handleDeleteSubmit = async event => {
    event.preventDefault();

    const newDeleteTopic = {
      deleteTopic
    }

    try {
      const response = await fetch(`/api/${connectedCluster}/topic`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeleteTopic),
      });
      if (!response.ok) throw new Error();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const newTopic = {
      newTopicName,
      numPartitions,
    };
    //send post request to create new topic
    try {
      const response = await fetch(`/api/${connectedCluster}/topic`, {
        body: JSON.stringify(newTopic),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!response.ok) throw new Error();
    } catch (err) {
      console.log(err);
    }
  };

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
      <Box
        component="form"
        onSubmit={handleDeleteSubmit}
        autoComplete="off"
        sx={{
          '& .MuiTextField-root': {m: 1},
          '& button': {m: 1},
        }}
      >
        <TextField
          size="small"
          label="Delete topic"
          value={deleteTopic}
          onChange={event => setDeleteTopic(event.target.value)}
        />
        <Button variant="outlined" size="medium " type="submit">
          Delete
        </Button>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        sx={{
          '& .MuiTextField-root': {m: 1},
          '& button': {m: 1},
        }}
      >
        <TextField
          size="small"
          label="Topic name"
          value={newTopicName}
          onChange={event => setNewTopicName(event.target.value)}
        />

        <TextField
          size="small"
          label="Number of Partitions"
          value={numPartitions}
          onChange={event => setNumPartitions(event.target.value)}
        />

        <Button variant="outlined" size="medium " type="submit">
          Create
        </Button>
      </Box>

      <Box sx={{height: 400, width: '1000'}}>
        <Paper elevation={6}>
          <DataGrid
            autoHeight // sets table height based on number of rows
            rows={topicRows}
            columns={topicColumns}
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
