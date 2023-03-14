import Box from '@mui/material/Box';
import {OverviewProps} from '../types';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../theme';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';
import crow from './assets/crow2.png';

//register chartjs components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Display high-level cluster data (below navbar, right of dashboard)
const Overview = (props: OverviewProps) => {
  const {connectedCluster, data, timeSeriesData} = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  //initialize data for doughnut chart
  let empty;
  let stable;
  let preparingRebalance;
  let other;

  const checkData = () => {
    timeSeriesData.length >= 1 ? (empty = timeSeriesData.at(-1).groupStatus.empty) : (empty = 0);
    timeSeriesData.length >= 1 ? (stable = timeSeriesData.at(-1).groupStatus.stable) : (stable = 0);
    timeSeriesData.length >= 1
      ? (preparingRebalance = timeSeriesData.at(-1).groupStatus.preparingRebalance)
      : (stable = 0);

    timeSeriesData.length >= 1 ? (other = timeSeriesData.at(-1).groupStatus.other) : (other = 0);
  };

  checkData();

  //input data and styling for doughnut graph
  const chartData = {
    labels: ['Empty', 'Stable', 'PreparingRebalance', 'Other'],
    datasets: [
      {
        label: '# of Groups',
        data: [empty, stable, preparingRebalance, other],
        backgroundColor: [
          'rgba(255,221,210,0.5)',
          'rgba(0, 109, 119,0.5)',
          'rgba(131,197,190,0.5)',
          'rgba(237,246,249,0.5)',
        ],
        borderColor: ['rgba(10,157,252,1)', 'rgba(37, 150, 190,1)', 'rgba(57,57,252,0.75)'],
        borderWidth: 1,
      },
    ],
  };

  let offsetTotal = 0;
  if (timeSeriesData[0]) {
    for (const key in timeSeriesData[0].topicOffsets) {
      offsetTotal += timeSeriesData[0].topicOffsets[key];
    }
    console.log('topic offsets only: ', offsetTotal);
    for (const key in timeSeriesData[0].groupOffsets) {
      offsetTotal += timeSeriesData[0].groupOffsets[key];
    }
    console.log('total offsets', offsetTotal);
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '140px',
        color: colors.info[500],
        '& > .MuiBox-root > .MuiBox-root': {
          p: 1,
          borderRadius: 2,
          fontSize: '2rem',
          fontWeight: '500',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 1,
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          gridTemplateRows: 'repeat(3, 140px)',
          gridTemplateAreas: `"cluster cluster topic partitions"
            "cluster cluster offset offset"
            "brokers brokers consumer consumer"`,
        }}
      >
        <Box
          sx={{
            gridArea: 'cluster',
            backgroundColor: colors.secondary[300],
          }}
        >
          {
            // conditional rendering based on whether login attempt is in progress
            timeSeriesData.length >= 1 ? (
              <div className="groupDoughnutChart">
                <Doughnut
                  data={chartData}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: 'Consumer Group Status',
                        align: 'center',
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <img className="rotocrow rotation bigger" src={crow}></img>
            )
          }
        </Box>

        <Box
          sx={{
            gridArea: 'topic',
            backgroundColor: colors.secondary[300],
          }}
        >
          Cluster Name: <br />
          {connectedCluster}
        </Box>

        <Box
          sx={{
            gridArea: 'partitions',
            backgroundColor: colors.secondary[500],
          }}
        >
          Topics: <br />
          {data.topicData.topics ? data.topicData.topics.length : 0}
        </Box>

        <Box
          sx={{
            gridArea: 'offset',
            backgroundColor: colors.secondary[300],
          }}
        >
          Offsets at connection: <br />
          {offsetTotal}
        </Box>

        <Box
          sx={{
            gridArea: 'brokers',
            backgroundColor: colors.secondary[500],
          }}
        >
          Brokers: <br />
          {data.clusterData.brokers.length}
        </Box>

        <Box
          sx={{
            gridArea: 'consumer',
            backgroundColor: colors.secondary[300],
          }}
        >
          Partitions: <br />
          {data.topicData.topics
            ? data.topicData.topics.reduce((acc, el) => {
                return acc + el.partitions.length;
              }, 0)
            : 0}
        </Box>
      </Box>
    </Box>
  );
};

export default Overview;
