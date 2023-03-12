import {useState} from 'react';
import GroupThroughput from './GroupThroughput';
import TopicThroughput from './TopicThroughput';
import Replicas from './Replicas';

const TrafficAndHealthGraphs = props => {
  const {timeSeriesData, connectedCluster, topicDatasets, setTopicDatasets, xSeries, setXSeries} =
    props;
  const [isTopicInitialized, setTopicInitialized] = useState<boolean>(false);

  return (
    <div className="lineGraphGrid">
      <div className="throughputContainer">
        <TopicThroughput
          timeSeriesData={timeSeriesData}
          isInitialized={isTopicInitialized}
          setInitialized={setTopicInitialized}
          connectedCluster={connectedCluster}
          topicDatasets={topicDatasets}
          setTopicDatasets={setTopicDatasets}
          xSeries={xSeries}
          setXSeries={setXSeries}
        />
        {/* <GroupThroughput timeSeriesData={timeSeriesData} connectedCluster={connectedCluster} /> */}
      </div>
      <div className="replicaContainer">
        <Replicas timeSeriesData={timeSeriesData} connectedCluster={connectedCluster} />
      </div>
      <div>{isTopicInitialized ? 'INIT' : 'NOT INIT'}</div>
    </div>
  );
};

export default TrafficAndHealthGraphs;
