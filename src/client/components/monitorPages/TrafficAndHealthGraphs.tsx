import GroupThroughput from './GroupThroughput';
import TopicThroughput from './TopicThroughput';
import Replicas from './Replicas';
import crow from '../assets/crow2.png';
import {TrafficAndHealthProps} from '../../types';

const TrafficAndHealthGraphs = (props: TrafficAndHealthProps) => {
  const {
    timeSeriesData,
    connectedCluster,
    topicDatasets,
    setTopicDatasets,
    groupDatasets,
    setGroupDatasets,
  } = props;

  return timeSeriesData.length ? (
    <div className="lineGraphGrid">
      <div className="throughputContainer">
        <TopicThroughput
          timeSeriesData={timeSeriesData}
          topicDatasets={topicDatasets}
          setTopicDatasets={setTopicDatasets}
        />
        <GroupThroughput
          timeSeriesData={timeSeriesData}
          groupDatasets={groupDatasets}
          setGroupDatasets={setGroupDatasets}
        />
      </div>
      <div className="replicaContainer">
        <Replicas timeSeriesData={timeSeriesData} connectedCluster={connectedCluster} />
      </div>
    </div>
  ) : (
    <img className="rotocrow rotation bigger" src={crow}></img>
  );
};

export default TrafficAndHealthGraphs;
