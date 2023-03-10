import {ImageList, Box, ImageListItem} from '@mui/material';
import {OverviewProps} from '../types';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../theme';

// Display high-level cluster data (below navbar, right of dashboard)
const Overview = (props: OverviewProps) => {
  const {connectedCluster, data} = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
          ClusterName: <br />
          {connectedCluster}
        </Box>
        <Box
          sx={{
            gridArea: 'topic',
            backgroundColor: colors.secondary[300],
          }}
        >
          Topics Count: <br />
          {data.topicData.topics.length}
        </Box>
        <Box
          sx={{
            gridArea: 'partitions',
            backgroundColor: colors.secondary[500],
          }}
        >
          Partitions: <br />
          {data.topicData.topics[0].partitions.length}
        </Box>
        <Box
          sx={{
            gridArea: 'offset',
            backgroundColor: colors.secondary[300],
          }}
        >
          Offsets: <br />
          {data.topicData.topics[0].offsets.length}
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
          Consumer Groups: <br />
          {data.groupList.length}
        </Box>
      </Box>
    </Box>
  );
};

export default Overview;
