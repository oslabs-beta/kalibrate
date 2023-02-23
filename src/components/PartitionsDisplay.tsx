import React from 'react';

const PartitionsDisplay = () => {
  // add in other eventual props to use...
  // const { partitions } = props;

  // eventual list to generate...
  // const partitionsList = partitions.map(partition => {
  //   return (
  //     <tr key=partition.id className="hover">
  //       <th>partition.id</th>
  //       <td>partition.leader</td>
  //       <td>partition.offset</td>
  //       <td>partition.high</td>
  //       <td>partition.low</td>
  //     </tr>
  //   );
  // });

  // hardcoded value used as example, remove hardcoded example and update/render list instead when data available
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Partition ID</th>
            <th>Leader</th>
            <th>Offset</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>

        <tbody>
          <tr className="hover">
            <th>0</th>
            <td>0</td>
            <td>100</td>
            <td>50</td>
            <td>150</td>
          </tr>

          {/* {partitionsList} */}
        </tbody>
      </table>
    </div>
  );
};

export default PartitionsDisplay;
