import React, {useState} from 'react';
import TopicsDisplay from './TopicsDisplay';
import PartitionsDisplay from '../PartitionsDisplay';
import MessagesDisplay from '../MessagesDisplay';

// appropriate props from fetch should be passed down to the appropriate displays
// todo: needs to be integrated with React Router
const Topics = props => {
  const [activeTopicsComponent, setActiveTopicsComponent] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handlePartitionsComponentChange = e => {
    setActiveTopicsComponent('Partitions');
    setSelectedTopic(e.target.name);
  };

  const handleMessagesComponentChange = e => {
    setActiveTopicsComponent('Messages');
    setSelectedTopic(e.target.name);
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
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <a>Topics</a>
            </li>
            {topicsBreadcrumb}
          </ul>
        </div>

        <input
          type="text"
          placeholder="Search"
          className="input input-bordered input-sm w-full max-w-xs mb-5"
        />
      </div>
      <div className="topics-display">{topicsComponent}</div>
    </div>
  );
};

export default Topics;
