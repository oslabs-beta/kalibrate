import Box from '@mui/material/Box';
import {useState, useEffect} from 'react';
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

  const [donutVars, setDonutVars] = useState<number[]>([0, 0, 0]);

  // on connection to a new cluster
  useEffect(() => {
    if (timeSeriesData >= 1) {
      // empty, stable, other are the dount chart data -- in that order
      // get last element of array in case status has changed since connection to cluster
      setDonutVars([
        timeSeriesData.at(-1).groupStatus.empty,
        timeSeriesData.at(-1).groupStatus.stable,
        timeSeriesData.at(-1).groupStatus.other,
      ]);
    }

    // console.log('time series data', timeSeriesData[0].groupStatus.empty);
    //initialize data for doughnut chart
  }, [timeSeriesData.at(-1)]);
  //input data and styling for doughnut graph

  const chartData = {
    labels: ['Empty', 'Stable', 'Other'],
    datasets: [
      {
        label: '# of Groups',
        data: donutVars,
        backgroundColor: [
          'rgba(10,157,252,0.53)',
          'rgba(37, 150, 190,0.2)',
          'rgba(56,89,252,0.75)',
        ],
        borderColor: ['rgba(10,157,252,1)', 'rgba(37, 150, 190,1)', 'rgba(57,57,252,0.75)'],
        borderWidth: 1,
      },
    ],
  };

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
          Topics Count: <br />
          {data.topicData.topics ? data.topicData.topics.length : 0}
        </Box>
        <Box
          sx={{
            gridArea: 'offset',
            backgroundColor: colors.secondary[300],
          }}
        >
          Offsets: <br />
          {data.topicData.topics ? data.topicData.topics[0].offsets.length : 0}
        </Box>
        <Box
          sx={{
            gridArea: 'brokers',
            backgroundColor: colors.secondary[500],
          }}
        >
          Brokers Count: <br />
          {data.clusterData.brokers.length}
        </Box>
        <Box
          sx={{
            gridArea: 'consumer',
            backgroundColor: colors.secondary[300],
          }}
        >
          Partitions: <br />
          {data.topicData.topics ? data.topicData.topics[0].partitions.length : 0}
        </Box>
      </Box>
    </Box>
  );
};

export default Overview;
