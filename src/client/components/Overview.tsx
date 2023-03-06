import {ImageList, Box, ImageListItem} from '@mui/material';
import {OverviewProps} from '../types';

// Display high-level cluster data (below navbar, right of dashboard)
const Overview = (props: OverviewProps) => {
  const {connectedCluster, data} = props;

  return (
    <Box
      sx={{
        width: '100%',
        height: '140px',
        color: 'inherit',
        '& > .MuiBox-root > .MuiBox-root': {
          p: 1,
          borderRadius: 2,
          fontSize: '2rem',
          fontWeight: '500',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: '#253237',
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
          bgcolor="#c2dfe3"
          sx={{
            gridArea: 'cluster',
          }}
        >
          ClusterName: <br />
          {connectedCluster}
        </Box>
        <Box
          bgcolor="#c2dfe3"
          sx={{
            gridArea: 'topic',
          }}
        >
          Topics Count: <br />
          {data.topicData.topics.length}
        </Box>
        <Box
          bgcolor="#e0fbfc"
          sx={{
            gridArea: 'partitions',
          }}
        >
          Partitions: <br />
          {data.topicData.topics[0].partitions.length}
        </Box>
        <Box
          bgcolor="#c2dfe3"
          sx={{
            gridArea: 'offset',
          }}
        >
          Offsets: <br />
          {data.topicData.topics[0].offsets.length}
        </Box>
        <Box
          bgcolor="#e0fbfc"
          sx={{
            gridArea: 'brokers',
          }}
        >
          Brokers Count: <br />
          {data.clusterData.brokers.length}
        </Box>
        <Box
          bgcolor="#c2dfe3"
          sx={{
            gridArea: 'consumer',
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
