import GroupThroughput from './GroupThroughput';
import TopicThroughput from './TopicThroughput';
import Replicas from './Replicas';

const Graphs = props => {
  const {timeSeriesData, connectedCluster} = props;

  return (
    // <div>
    //   <div id="container1">
    //     <canvas>
    //       <GroupThroughput timeSeriesData={timeSeriesData} connectedCluster={connectedCluster} />
    //     </canvas>
    //   </div>
    //   <div id="container2">
    //     <canvas>
    //       <TopicThroughput timeSeriesData={timeSeriesData} connectedCluster={connectedCluster} />
    //     </canvas>
    //   </div>
    //   <div id="container3">
    //     <canvas>
    <Replicas timeSeriesData={timeSeriesData} connectedCluster={connectedCluster} />
    //     </canvas>
    //   </div>
    // </div>
  );
};

export default Graphs;
