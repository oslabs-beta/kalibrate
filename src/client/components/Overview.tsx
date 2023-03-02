import {ImageList, Box, ImageListItem} from '@mui/material';
import {OverviewProps} from '../types';

const Overview = (props: OverviewProps) => {
  const {connectedCluster, data} = props;

  return (
    <ImageList sx={{width: 700, height: 550, margin: 'auto', marginTop: '20px'}} variant="woven" cols={3} gap={25}>
      <ImageListItem>
        <Box
          bgcolor="#c2dfe3"
          sx={{p: 8, borderRadius: 1, borderColor: '#253237', border: 1, textAlign: 'center'}}
        >
          ClusterName: <br />
          <br />
          {connectedCluster}
        </Box>
      </ImageListItem>

      <ImageListItem>
        <Box
          bgcolor="#e0fbfc"
          sx={{p: 4, borderRadius: 1, borderColor: '#253237', border: 1, textAlign: 'center'}}
        >
          Brokers Count: <br />
          <br />
          {data.clusterData.brokers.length}
        </Box>
      </ImageListItem>

      <ImageListItem>
        <Box
          bgcolor="#c2dfe3"
          sx={{p: 4, borderRadius: 1, borderColor: '#253237', border: 1, textAlign: 'center'}}
        >
          Topics Count: <br />
          <br />
          {data.topicData.topics.length}
        </Box>
      </ImageListItem>

      <ImageListItem>
        <Box
          bgcolor="#c2dfe3"
          sx={{p: 8, borderRadius: 1, borderColor: '#253237', border: 1, textAlign: 'center'}}
        >
          Offsets: <br />
          <br />
          {data.topicData.topics[0].offsets.length}
        </Box>
      </ImageListItem>

      <ImageListItem>
        <Box
          bgcolor="#e0fbfc"
          sx={{p: 8, borderRadius: 1, borderColor: '#253237', border: 1, textAlign: 'center'}}
        >
          Partitions: <br />
          <br />
          {data.topicData.topics[0].partitions.length}
        </Box>
      </ImageListItem>

      <ImageListItem>
        <Box
          bgcolor="#c2dfe3"
          sx={{p: 4, borderRadius: 1, borderColor: '#253237', border: 1, textAlign: 'center'}}
        >
          Consumer Groups: <br />
          <br />
          {data.groupList.length}
        </Box>
      </ImageListItem>
    </ImageList>
  );
};

export default Overview;
