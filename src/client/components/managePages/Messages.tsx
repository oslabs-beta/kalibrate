import React, {useEffect, useState} from 'react';
import MessagesDisplay from './MessagesDisplay';
import {Typography} from '@mui/material';

// container for displaying message details
// note: is this component no longer being used? if so we should delete the file
const Messages = props => {
  return (
    <div className="wrapper">
      <div className="messages-heading">
        <Typography variant="h6">Messages List</Typography>
      </div>
      <div className="messages-display">
        <MessagesDisplay />
      </div>
    </div>
  );
};

export default Messages;
