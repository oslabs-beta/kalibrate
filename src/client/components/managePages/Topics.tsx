import React, {useState} from 'react';
import {Link, Outlet, useNavigate} from 'react-router-dom';
import {TopicsProps, clickHandler} from './types';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {Box, Breadcrumbs, Typography} from '@mui/material';

// appropriate props from fetch should be passed down to the appropriate displays
// todo: needs to be integrated with React Router
const Topics = ({topics}: TopicsProps) => {
  const navigate = useNavigate();
  const [activeTopicsComponent, setActiveTopicsComponent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  //    setSelectedTopic((e.target as HTMLButtonElement).name);
  const handleComponentChange = (e, topicName = 'hoi') => {
    // const topicName = e.target.name;
    console.log('this burront reitoe', topicName);
    const topicComponent = e.target.innerText;
    setActiveTopicsComponent(topicComponent);
    setSelectedTopic(topicName);
  };

  return (
    <div className="wrapper">
      <div className="topics-heading">
        <Typography variant="h6">Topics List</Typography>
        <Box m={2}>
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
            <Typography className="topicCrumb">Topics</Typography>
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
            handleComponentChange,
          }}
        />
      </div>
    </div>
  );
};

export default Topics;
