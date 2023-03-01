import React, {useState} from 'react';
import {Link, Outlet, useNavigate} from 'react-router-dom';
import {TopicsProps, clickHandler} from './types';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {Box, Breadcrumbs, Typography} from '@mui/material';

// appropriate props from fetch should be passed down to the appropriate displays
// todo: needs to be integrated with React Router
const Topics = ({data}: TopicsProps) => {
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
