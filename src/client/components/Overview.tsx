import {ImageList, Box, ImageListItem} from '@mui/material';
import {OverviewProps} from './managePages/types';

const Overview = (props: OverviewProps) => {
  const {connectedCluster, data} = props;

  return (
    <ImageList sx={{width: 700, height: 450, margin: 'auto'}} variant="woven" cols={3} gap={25}>
      <ImageListItem>
        <Box sx={{p: 2, border: 1}}>Cluster Name: {connectedCluster}</Box>
      </ImageListItem>

      <ImageListItem>
        <Box sx={{p: 2, border: 1}}>Brokers Count: {data.clusterData.brokers.length}</Box>
      </ImageListItem>

      <ImageListItem>
        <Box sx={{p: 2, border: 1}}>Brokers Count: {data.topicData.topics.length}</Box>
      </ImageListItem>

      {/* <ImageListItem>
        <Box sx={{p: 2, border: 1}}>Offsets: {data.topicData.topics[0].offsets.length}</Box>
      </ImageListItem>

      <ImageListItem>
        <Box sx={{p: 2, border: 1}}>Partitions: {data.topicData.topics[0].partitions.length}</Box>
      </ImageListItem>

      <ImageListItem>
        <Box sx={{p: 2, border: 1}}>Consumer Groups: {data.groupList.length}</Box>
      </ImageListItem> */}
    </ImageList>
  );
};

export default Overview;
