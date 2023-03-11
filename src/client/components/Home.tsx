import {Link} from 'react-router-dom';

const Home = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Under construction... Home Splash Page</h1>
      <h2>
        <Link to="dashboard">Use the app</Link>
      </h2>
    </div>
  );
};

export default Home;
