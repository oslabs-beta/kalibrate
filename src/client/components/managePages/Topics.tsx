import React, {useState} from 'react';
import {Link, Outlet, useNavigate} from 'react-router-dom';
import {TopicsProps, clickHandler} from './types';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {Box, Typography} from '@mui/material';
import Breadcrumb from './Breadcrumbs';

// appropriate props from fetch should be passed down to the appropriate displays
// todo: needs to be integrated with React Router
const Topics = ({connectedCluster}) => {
  const navigate = useNavigate();
  const [activeTopicsComponent, setActiveTopicsComponent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedPartitions, setPartitions] = useState([]);

  //    setSelectedTopic((e.target as HTMLButtonElement).name);
  const handleComponentChange = (e, topicName = 'hoi', array = []) => {
    // console.log('this burront reitoe', topicName);
    // console.log('thi sis parotitosn', array);
    const topicComponent = e.target.innerText;
    setActiveTopicsComponent(topicComponent);
    setSelectedTopic(topicName);
    setPartitions(array);
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
