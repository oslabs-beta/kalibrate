import React from 'react';

// display event details in a table
const Events = (props) => {
  // type: array of message objects
  console.log('Messages', props.messages);
  
  return <table>
    <thead>
      <tr>
        <th>Partition ID</th>
        <th>Offset ID</th>
        <th>Name</th>
        <th>Event</th>
        <th>Date</th>
      </tr>
    </thead>
    {props.messages.map(message => {
      <tbody>
        <tr>
          <td>{message.partitionID}</td>
          <td>{message.offsetID}</td>
          <td>{message.event}</td>
          <td>{message.details}</td>
          <td>{message.date}</td>
        </tr>
      </tbody>
    })}
  </table>
}

export default Events;