import GroupThroughput from './GroupThroughput';
import TopicThroughput from './TopicThroughput';
import Replicas from './Replicas';

const Graphs = props => {
  return (
    <div>
      <GroupThroughput />
      <TopicThroughput />
      <Replicas />
    </div>
  );
};

export default Graphs;
