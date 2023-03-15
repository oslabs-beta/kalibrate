import GroupThroughput from './GroupThroughput';
import TopicThroughput from './TopicThroughput';
import Replicas from './Replicas';
import CircularProgress from '@mui/material/CircularProgress';
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
    <div style={{display: 'flex', justifyContent: 'center', marginTop: '250px'}}>
      <CircularProgress size="75px" />
    </div>
  );
};

export default TrafficAndHealthGraphs;
