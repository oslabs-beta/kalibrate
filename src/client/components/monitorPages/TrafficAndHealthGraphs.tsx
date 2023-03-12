import GroupThroughput from './GroupThroughput';
import TopicThroughput from './TopicThroughput';
import Replicas from './Replicas';
import Offsets from './OffsetCharts';

const TrafficAndHealthGraphs = props => {
  const {timeSeriesData, connectedCluster} = props;

  return (
    <div className="lineGraphGrid">
      <div className="throughputContainer">
        <TopicThroughput timeSeriesData={timeSeriesData} connectedCluster={connectedCluster} />
        <GroupThroughput timeSeriesData={timeSeriesData} connectedCluster={connectedCluster} />
      </div>
      <div className="replicaContainer">
        <Replicas timeSeriesData={timeSeriesData} connectedCluster={connectedCluster} />
      </div>
      {/* <Offsets timeSeriesData={timeSeriesData} connectedCluster={connectedCluster} /> */}
    </div>
  );
};

export default TrafficAndHealthGraphs;