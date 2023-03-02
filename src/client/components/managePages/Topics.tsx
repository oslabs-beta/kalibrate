import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {Box, Typography} from '@mui/material';
import Breadcrumb from './Breadcrumbs';
import {clickHandler, partitions, TopicsProps} from '../../types';

const Topics = ({connectedCluster}: TopicsProps) => {
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
        <Typography variant="h4">{`${connectedCluster}`}</Typography>
        <Box m={2}>
          <Breadcrumb topicName={selectedTopic} topicComp={activeTopicsComponent}></Breadcrumb>
        </Box>
      </div>
      <div className="topics-display">
        <Outlet
          // these props are passed to sibling components that are navigated to from here
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
