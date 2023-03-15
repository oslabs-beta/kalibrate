import GroupThroughput from './GroupThroughput';
import TopicThroughput from './TopicThroughput';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
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
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
      <Card
        sx={{
          backgroundColor: '#f9fdfe',
          marginRight: '25px',
          marginTop: '25px',
        }}
      >
        <TopicThroughput
          timeSeriesData={timeSeriesData}
          topicDatasets={topicDatasets}
          setTopicDatasets={setTopicDatasets}
        />
      </Card>
      <Card
        sx={{
          backgroundColor: '#f9fdfe',
          marginTop: '25px',
        }}
      >
        <GroupThroughput
          timeSeriesData={timeSeriesData}
          groupDatasets={groupDatasets}
          setGroupDatasets={setGroupDatasets}
        />
      </Card>
    </div>
  ) : (
    <div style={{display: 'flex', justifyContent: 'center', marginTop: '250px'}}>
      <CircularProgress size="75px" />
    </div>
  );
};

export default TrafficAndHealthGraphs;
