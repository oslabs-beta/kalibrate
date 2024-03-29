import {SyntheticEvent, useState} from 'react';
import {useNavigate, useOutletContext} from 'react-router-dom';
import {Button, Box, Paper, TextField, Alert} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridValueGetterParams,
  GridRowId,
} from '@mui/x-data-grid';
import {TopicsDisplayProps, TopicsContext} from '../../types';

// Displays topics within Topics component
const TopicsDisplay = ({
  topicData,
  connectedCluster,
  setConnectedClusterData,
  connectedClusterData,
}: TopicsDisplayProps) => {
  const {topics} = topicData;
  const {handleComponentChange}: TopicsContext = useOutletContext();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState<number>(25);

  const [newTopicName, setNewTopicName] = useState<string>('');
  const [numPartitions, setNumPartitions] = useState<number | string>(1);
  const [addPartitions, setAddPartitions] = useState<any>(1);

  const [selectedTopic, setSelectedTopic] = useState<{[k: string]: any}[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);

  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleDeleteSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const deleteTopicArray = [];

    for (let i = 0; i < selectedTopic.length; i++) {
      deleteTopicArray.push(selectedTopic[i].topicName);
    }

    try {
      const response = await fetch(`/api/${connectedCluster}/topic`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deleteTopicArray),
      });

      //assign response of fetch request to updateddata which is the updated list of topics
      const updatedData = await response.json();

      //retain old information while passing in new topics array
      const updatedTopicData = {
        ...connectedClusterData,
        topicData: {
          topics: updatedData.topics,
        },
      };

      setConnectedClusterData(updatedTopicData);
      setSelectedTopic([]);
      setSelectionModel([]);

      if (!response.ok) throw new Error();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    //check if newtopicname contain any spaces
    if (newTopicName.includes(' ')) return setErrorMessage('Spaces are not allowed');

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

        //updateclusterdata with the new data sent back
      });

      //assign response of fetch request to updateddata which is the updated list of topics
      const updatedData = await response.json();

      //retain old information while passing in new topics array
      const updatedTopicData = {
        ...connectedClusterData,
        topicData: {
          topics: updatedData.topics,
        },
      };

      setConnectedClusterData(updatedTopicData);
      setNewTopicName('');
      setNumPartitions(1);

      if (!response.ok) throw new Error();
      if (response.ok) setErrorMessage('');
    } catch (err) {
      console.log(err);
    }
  };

  //handler for creating partitions
  const handleSubmitPartitions = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedTopic.length > 1)
      return setErrorMessage('Only select one topic while adding partitions');

    const totalPartitions = parseInt(addPartitions) + parseInt(selectedTopic[0].numPartitions);
    const selectedTopicName = selectedTopic[0].topicName;

    const updatePartitions = {
      selectedTopicName,
      totalPartitions,
    };

    //send post request to create new topic
    try {
      const response = await fetch(`/api/${connectedCluster}/partitions`, {
        body: JSON.stringify(updatePartitions),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      //updateclusterdata with the new data sent back
      //assign response of fetch request to updateddata which is the updated list of topics
      const updatedData = await response.json();

      //retain old information while passing in new topics array
      const updatedTopicData = {
        ...connectedClusterData,
        topicData: {
          topics: updatedData.topics,
        },
      };

      setConnectedClusterData(updatedTopicData);
      setNumPartitions(1);
      setSelectionModel([]);

      if (!response.ok) throw new Error();
      if (response.ok) setErrorMessage('');
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

  const topicRows = topics
    ? topics.map((topic, index) => {
        return {
          id: index,
          key: index,
          topicName: topic.name,
          offsets: topic.offsets.length,
          numPartitions: topic.partitions.length,
        };
      })
    : [];

  const customToolBar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Box
          component="form"
          onSubmit={handleDeleteSubmit}
          autoComplete="off"
          sx={{
            '& .MuiTextField-root': {m: 1},
            '& button': {m: 1},
          }}
        >
          <Button variant="text" size="small" type="submit">
            <DeleteIcon color="inherit" sx={{fontSize: 18}} />
            Delete
          </Button>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmitPartitions}
          autoComplete="off"
          sx={{
            '& .MuiTextField-root': {m: 1},
            '& button': {m: 1},
          }}
        >
          <Button variant="text" size="small" type="submit">
            <AddIcon color="inherit" sx={{fontSize: 18}} />
            Add Partitions
          </Button>
          <TextField
            variant="outlined"
            size="small"
            value={addPartitions}
            onChange={event => setAddPartitions(event.target.value)}
            inputProps={{
              style: {
                height: 10,
                width: 10,
              },
            }}
          />
        </Box>
      </GridToolbarContainer>
    );
  };

  return (
    <div>
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
          variant="standard"
          size="small"
          label="Topic name"
          value={newTopicName}
          onChange={event => setNewTopicName(event.target.value)}
        />

        <TextField
          variant="standard"
          size="small"
          label="Number of Partitions"
          value={numPartitions}
          onChange={event => setNumPartitions(event.target.value)}
        />

        <Button variant="outlined" size="medium" type="submit">
          Create
        </Button>

        {errorMessage.length ? <Alert severity="error">{errorMessage}</Alert> : null}
      </Box>

      <Box sx={{height: 400, width: '1000'}}>
        <Paper elevation={6} sx={{height: 'calc(100vh - 286px)'}}>
          <DataGrid
            rows={topicRows}
            //@ts-ignore
            columns={topicColumns}
            pageSize={pageSize}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 25]}
            checkboxSelection
            onSelectionModelChange={ids => {
              setSelectionModel(ids);
              const selectedIds = new Set(ids);
              const SelectedRowData = topicRows.filter(row => selectedIds.has(row.id));
              setSelectedTopic(SelectedRowData);
            }}
            selectionModel={selectionModel}
            disableSelectionOnClick
            disableColumnFilter
            components={{
              Toolbar: customToolBar,
            }}
            componentProps={{
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
