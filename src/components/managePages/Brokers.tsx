import BrokersDisplay from './BrokersDisplay';


// appropriate props should be passed down to brokers display
const Brokers = props => {

  return (
    <div className="wrapper">
      <div className="brokers-heading">
        <h3 className="mb-5">Brokers</h3>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered input-sm w-full max-w-xs mb-5"
        />
      </div>
      <div className="brokers-display">
        <BrokersDisplay />
      </div>
    </div>
  );
};

export default Brokers;
