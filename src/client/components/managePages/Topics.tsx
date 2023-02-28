import React, {useState} from 'react';
import TopicsDisplay from './TopicsDisplay';
import PartitionsDisplay from './PartitionsDisplay';
import MessagesDisplay from './MessagesDisplay';
import {Box, Breadcrumbs, Link, Typography} from '@mui/material';
import {TopicsProps, clickHandler} from './types';

// appropriate props from fetch should be passed down to the appropriate displays
// todo: needs to be integrated with React Router
const Topics = ({topics}: TopicsProps) => {
  const [activeTopicsComponent, setActiveTopicsComponent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  const handlePartitionsComponentChange: clickHandler = e => {
    setActiveTopicsComponent('Partitions');
    setSelectedTopic((e.target as HTMLButtonElement).name);
  };

  const handleMessagesComponentChange: clickHandler = e => {
    setActiveTopicsComponent('Messages');
    setSelectedTopic((e.target as HTMLButtonElement).name);
  };

  let topicsComponent;
  switch (activeTopicsComponent) {
    case 'Partitions':
      topicsComponent = <PartitionsDisplay topic={selectedTopic} />;
      break;
    case 'Messages':
      topicsComponent = <MessagesDisplay topic={selectedTopic} />;
      break;
    default:
      topicsComponent = (
        <TopicsDisplay
          topics={topics}
          handlePartitionsComponentChange={handlePartitionsComponentChange}
          handleMessagesComponentChange={handleMessagesComponentChange}
        />
      );
  }

  const topicsBreadcrumb = activeTopicsComponent ? (
    <>
      <li>{selectedTopic}</li>
      <li>{activeTopicsComponent}</li>
    </>
  ) : null;

  return (
    <div className="wrapper">
      <div className="topics-heading">
        <Typography variant="h6">Topics List</Typography>
        <div className="text-sm breadcrumbs">
          <ul>
            <li></li>
            {topicsBreadcrumb}
          </ul>
        </div>

        {/* <input
          type="text"
          placeholder="Search"
          className="input input-bordered input-sm w-full max-w-xs mb-5"
        /> */}
      </div>
      <div className="topics-display">{topicsComponent}</div>
    </div>
  );
};

export default Topics;
