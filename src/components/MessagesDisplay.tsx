import React from 'react';

const MessagesDisplay = () => {
  // add in other eventual props to use...
  // const { messages } = props;

  // eventual list to generate...
  // const messagesList = messages.map(message => {
  //   return (
  //     <tr className="hover">
  //       <th>partition.key</th>
  //       <td>partition.value</td>
  //       <td>partition.offset</td>
  //       <td>partition.partition</td>
  //     </tr>
  //   );
  // });

  // hardcoded value used as example, remove hardcoded example and update/render list instead when data available
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th>Offset</th>
            <th>Partition</th>
          </tr>
        </thead>

        <tbody>
          <tr className="hover">
            <th>myKey</th>
            <td>myVal</td>
            <td>100</td>
            <td>0</td>
          </tr>

          {/* {messagesList} */}
        </tbody>
      </table>
    </div>
  );
};

export default MessagesDisplay;
