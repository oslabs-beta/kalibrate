import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import TopicsDisplay from './TopicsDisplay';
import PartitionsDisplay from './PartitionsDisplay';
import MessagesDisplay from './MessagesDisplay';
import {topicColumn} from '../../../../demo/mockData';
import {Box, Breadcrumbs, Link, Typography} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// appropriate props from fetch should be passed down to the appropriate displays
// todo: needs to be integrated with React Router
const Topics = props => {
  const [activeTopicsComponent, setActiveTopicsComponent] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleComponentChange = e => {
    const topicName = e.target.name;
    const topicComponent = e.target.innerHTML;
    setActiveTopicsComponent(topicComponent);
    setSelectedTopic(topicName);
  };

  let activeComponent;
  switch (activeComponent) {
    case 'Partitions':
      activeComponent = <PartitionsDisplay topic={selectedTopic} />;
      break;
    case 'Messages':
      activeComponent = <MessagesDisplay topic={selectedTopic} />;
      break;
    default:
      activeComponent = (
        <TopicsDisplay data={props.data} handleComponentChange={handleComponentChange} />
      );
  }

  return (
    <div className="wrapper">
      <div className="topics-heading">
        <Typography variant="h6">Topics List</Typography>
        <Box m={2}>
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
            <Typography>Topics</Typography>
            <Typography>Dynamic Topic Name</Typography>
            {activeTopicsComponent && <div>{activeTopicsComponent}</div>}
          </Breadcrumbs>
        </Box>
      </div>
      <div className="topics-display">
        {activeComponent}
        <Outlet context={partitionData} />
      </div>
    </div>
  );
};

export default Topics;
{
  /* <div className="text-sm breadcrumbs">
<ul>
  <li></li>
  {topicsBreadcrumb}
</ul> */
}
{
  /* <div className="topics-display">{topicsComponent}</div> */
}

// const topicsBreadcrumb = activeTopicsComponent ? (
//   <>
//     <li>{selectedTopic}</li>
//     <li>{activeTopicsComponent}</li>
//   </>
// ) : null;
