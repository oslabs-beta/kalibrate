import ThroughputLineGraph from './ThroughputGraph';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import {TrafficAndHealthProps} from '../../types';

const TrafficAndHealthGraphs = (props: TrafficAndHealthProps) => {
  const {timeSeriesData, topicDatasets, setTopicDatasets, groupDatasets, setGroupDatasets} = props;

  return timeSeriesData.length ? (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
      <Card
        sx={{
          backgroundColor: '#f9fdfe',
          marginRight: '25px',
          marginTop: '25px',
        }}
      >
        <ThroughputLineGraph
          timeSeriesData={timeSeriesData}
          datasets={topicDatasets}
          setDatasets={setTopicDatasets}
          targetData={'topics'}
        />
      </Card>
      <Card
        sx={{
          backgroundColor: '#f9fdfe',
          marginTop: '25px',
        }}
      >
        <ThroughputLineGraph
          timeSeriesData={timeSeriesData}
          datasets={groupDatasets}
          setDatasets={setGroupDatasets}
          targetData={'groups'}
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
