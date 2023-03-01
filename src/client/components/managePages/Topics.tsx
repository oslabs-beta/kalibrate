import {useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {Box, Breadcrumbs, Typography} from '@mui/material';
import {clickHandler} from './types';

const Topics = () => {
  const navigate = useNavigate();
  const [activeTopicsComponent, setActiveTopicsComponent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedPartitions, setPartitions] = useState([]);

  const handleComponentChange: clickHandler = (e, topicName = '', array = []) => {
    const topicComponent = (e.target as HTMLButtonElement).innerText;

    setActiveTopicsComponent(topicComponent);
    setSelectedTopic(topicName);
    setPartitions(array);
  };

  return (
    <div className="wrapper">
      <div className="topics-heading">
        <Typography variant="h6">Topics List</Typography>
        <Box m={2}>
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
            <Typography className="topicCrumb" onClick={() => navigate(-1)}>
              Topics
            </Typography>
            {selectedTopic && <div>{selectedTopic}</div>}
            {activeTopicsComponent && <div>{activeTopicsComponent}</div>}
          </Breadcrumbs>
        </Box>
      </div>
      <div className="topics-display">
        <Outlet
          context={{
            active: [activeTopicsComponent, setActiveTopicsComponent],
            select: [selectedTopic, setSelectedTopic],
            partitions: [selectedPartitions, setPartitions],
            handleComponentChange,
          }}
        />
      </div>
    </div>
  );
};

export default Topics;
