import ConsumersDisplay from './consumersDisplay';
import { useLocation } from 'react-router-dom';

const Consumers = () => {

  const {state} = useLocation();
  const {clusterName} = state;

  return (
    <div className="wrapper">
      <div className="consumers-heading" data-testid="consumer-1">
        <h3>Consumers</h3>
        <input type="text" placeholder="Search" />
      </div>
      <div className="consumers-display">
        <ConsumersDisplay
        clusterName = {clusterName}
        />
      </div>
    </div>
  );
};

export default Consumers;
