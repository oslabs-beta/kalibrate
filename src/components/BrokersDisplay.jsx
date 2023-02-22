import React from 'react';

const BrokersDisplay = props => {
  // eventual props to use...
  // const { brokers } = props;

  // eventual list to generate...
  // const brokersList = brokers.map(broker => {
  //   return (
  //     <tr className="hover">
  //       <th>broker.id</th>
  //       <td>broker.host</td>
  //       <td>broker.port</td>
  //     </tr>
  //   );
  // });

  // hardcoded values are used as example, remove hardcoded example and render list instead when data available
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Node ID</th>
            <th>Host</th>
            <th>Port</th>
          </tr>
        </thead>

        <tbody>
          <tr className="hover">
            <th>0</th>
            <td>localhost</td>
            <td>9091</td>
          </tr>

          {/* {brokersList} */}
        </tbody>
      </table>
    </div>
  );
};

export default BrokersDisplay;
