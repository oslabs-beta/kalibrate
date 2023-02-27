import React from 'react';
import MessagesDisplay from './MessagesDisplay';

// container for displaying message details
const Messages = props => {
  return (
    <div className="wrapper">
      <div className="messages-heading">
        <h3 className="mb-5">Messages</h3>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered input-sm w-full max-w-xs mb-5"
        />
      </div>
      <div className="messages-display">
        <MessagesDisplay />
      </div>
    </div>
  );
}

export default Messages;