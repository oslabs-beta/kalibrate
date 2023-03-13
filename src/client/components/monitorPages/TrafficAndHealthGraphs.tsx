import GroupThroughput from './GroupThroughput';
import TopicThroughput from './TopicThroughput';
import Replicas from './Replicas';
import crow from '../assets/crow2.png';

const TrafficAndHealthGraphs = props => {
  const {
    timeSeriesData,
    connectedCluster,
    topicDatasets,
    setTopicDatasets,
    groupDatasets,
    setGroupDatasets,
    xSeries,
    setXSeries,
  } = props;

  return timeSeriesData.length ? (
    <div className="lineGraphGrid">
      <div className="throughputContainer">
        <TopicThroughput
          timeSeriesData={timeSeriesData}
          connectedCluster={connectedCluster}
          topicDatasets={topicDatasets}
          setTopicDatasets={setTopicDatasets}
          xSeries={xSeries}
          setXSeries={setXSeries}
        />
        <GroupThroughput
          timeSeriesData={timeSeriesData}
          connectedCluster={connectedCluster}
          groupDatasets={groupDatasets}
          setGroupDatasets={setGroupDatasets}
          xSeries={xSeries}
          setXSeries={setXSeries}
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
