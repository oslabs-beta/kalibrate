import {useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {Box, Breadcrumbs, Typography} from '@mui/material';
import {clickHandler, partitions} from './types';

const Topics = () => {
  const navigate = useNavigate();
  const [activeTopicsComponent, setActiveTopicsComponent] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [topicPartitions, setTopicPartitions] = useState<partitions[]>([]);

  const handleComponentChange: clickHandler = (e, topic, partitions) => {
    const topicComponent = (e.target as HTMLButtonElement).innerText;

    setActiveTopicsComponent(topicComponent);
    setSelectedTopic(topic);
    if (partitions) setTopicPartitions(partitions);
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
            selectedTopic: selectedTopic,
            topicPartitions: topicPartitions,
            handleComponentChange,
          }}
        />
      </div>
    </div>
  );
};

export default Topics;
