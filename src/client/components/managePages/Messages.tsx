import React from 'react';
import MessagesDisplay from './MessagesDisplay';
import {Typography} from '@mui/material';
// container for displaying message details
const Messages = props => {
  return (
    <div className="wrapper">
      <div className="messages-heading">
        <Typography variant="h6">Messages List</Typography>
      </div>
      <div className="messages-display">
        <MessagesDisplay msgProp={props} />
      </div>
    </div>
  );
};

export default Messages;
