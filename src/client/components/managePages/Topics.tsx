import React, {useEffect, useState} from 'react';
import {Routes, Route, useNavigate, Outlet} from 'react-router-dom';
import TopicsDisplay from './TopicsDisplay';
import PartitionsDisplay from './PartitionsDisplay';
import MessagesDisplay from './MessagesDisplay';
import {topicColumn} from '../../../../demo/mockData';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {DataGrid, GridColDef, GridRowsProp, GridToolbar} from '@mui/x-data-grid';
import {Box, Breadcrumbs, Paper, Link, Typography, Toolbar} from '@mui/material';
import {TopicsProps, clickHandler} from './types';

// appropriate props from fetch should be passed down to the appropriate displays
// todo: needs to be integrated with React Router
const Topics = ({topics}: TopicsProps) => {
  const navigate = useNavigate();
  const [activeTopicsComponent, setActiveTopicsComponent] = useState('Topics');
  const [selectedTopic, setSelectedTopic] = useState('');

  //    setSelectedTopic((e.target as HTMLButtonElement).name);
  const handleComponentChange = e => {
    const topicName = e.target.name;
    const topicComponent = e.target.innerText;
    setActiveTopicsComponent(topicComponent);
    setSelectedTopic(topicName);
  };

  const hi = () => {
    // let activeComponent;
    console.log('Determining active compoenent');
    switch (activeTopicsComponent) {
      case 'Partitions':
        console.log('PARTITIONS ACITVE');
        return <PartitionsDisplay topic={selectedTopic} />;
      case 'Messages':
        console.log('MESSGES ACTIVE');
        return <MessagesDisplay topic={selectedTopic} />;
      case 'Topics':
        console.log('TOPICS ACTIVE');
        return (
          <TopicsDisplay
            topics={topics}
            selectedTopic={selectedTopic}
            topicComponent={activeTopicsComponent}
            handleComponentChange={handleComponentChange}
          />
        );
      default:
        return <div>um</div>;
    }
  };
  return (
    <div className="wrapper">
      <div className="topics-heading">
        <Typography variant="h6">Topics List</Typography>
        <Box m={2}>
          <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
            <Typography>Topics</Typography>
            {/* <Typography>Dynamic Topic Name</Typography> */}
            {selectedTopic && <div>{selectedTopic}</div>}
            {activeTopicsComponent && <div>{activeTopicsComponent}</div>}
          </Breadcrumbs>
        </Box>
      </div>
      <div className="topics-display">
        <Toolbar />
        <TopicsDisplay
          topics={topics}
          selectedTopic={selectedTopic}
          topicComponent={activeTopicsComponent}
          handleComponentChange={handleComponentChange}
        />
        <Outlet />
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
