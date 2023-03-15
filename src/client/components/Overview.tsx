import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {OverviewProps} from '../types';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../theme';
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

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
    for (const key in timeSeriesData[0].groupOffsets) {
      offsetTotal += timeSeriesData[0].groupOffsets[key];
    }
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
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: 1,
          gridTemplateRows: 'repeat(2, 140px)',
          gridTemplateAreas: `"cluster cluster brokers brokers topics topics partitions partitions offsets offsets"
            "graph1 graph1 graph1 graph1 graph1 graph2 graph2 graph2 graph2 graph2"`,
        }}
      >
        <Card
          sx={{
            gridArea: 'graph1',
            height: '350px',
            backgroundColor: '#f9fdfe',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {
            // conditional rendering based on whether login attempt is in progress
            timeSeriesData.length >= 1 ? (
              <div className="groupDoughnutChart" style={{height: '350px'}}>
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
              <CircularProgress size="75px" />
            )
          }
        </Card>

        <Card
          sx={{
            gridArea: 'graph2',
            backgroundColor: '#f9fdfe',
          }}
        >
          <CardContent>
            <Typography>tk</Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            gridArea: 'cluster',
            backgroundColor: '#f9fdfe',
          }}
        >
          <CardContent>
            <Typography variant="h5">Cluster Name</Typography>
            <Typography variant="h6" align="center" sx={{marginTop: '15px'}}>
              {connectedCluster}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            gridArea: 'brokers',
            backgroundColor: '#f9fdfe',
          }}
        >
          <CardContent>
            <Typography variant="h5">Brokers</Typography>
            <Typography variant="h6" align="center" sx={{marginTop: '15px'}}>
              {data.clusterData.brokers.length}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            gridArea: 'topics',
            backgroundColor: '#f9fdfe',
          }}
        >
          <CardContent>
            <Typography variant="h5">Topics</Typography>
            <Typography variant="h6" align="center" sx={{marginTop: '15px'}}>
              {data.topicData.topics ? data.topicData.topics.length : 0}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            gridArea: 'offsets',
            backgroundColor: '#f9fdfe',
          }}
        >
          <CardContent>
            <Typography variant="h5">Offsets</Typography>
            <Typography variant="h6" align="center" sx={{marginTop: '15px'}}>
              {offsetTotal}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            gridArea: 'partitions',
            backgroundColor: '#f9fdfe',
          }}
        >
          <CardContent>
            <Typography variant="h5">Partitions</Typography>
            <Typography variant="h6" align="center" sx={{marginTop: '15px'}}>
              {data.topicData.topics
                ? data.topicData.topics.reduce((acc, el) => {
                    return acc + el.partitions.length;
                  }, 0)
                : 0}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Overview;
