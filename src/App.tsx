import Connect from './components/Connect';
import Manage from './components/Manage';
import Consumers from './components/Consumers';
import Navbar from './components/Navbar';
import Events from './components/Messages';
import Home from './components/Home';
import Producers from './components/Producers';
import Brokers from './components/Brokers';
import {useState, useEffect} from 'react';
import Overview from './components/Overview';
import Dashboard from './components/Dashboard';
import Topics from './components/Topics';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  //declare clientId state so other components could access for link & routing
  const [connectedCluster, setConnectedCluster] = useState('');
  const [connectedClusterData, setConnectedClusterData] = useState({
    cluster: {brokers: []},
    admin: {topics: []},
  });

  // when connectedCluster changes, query kafka for cluster info and update state
  useEffect(() => {
    const newData = {cluster: {brokers: []}, admin: {topics: []}};
    fetch('api/cluster-info', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        newData.cluster = data;
      })
      .catch(err => console.log(`from dashboard loading cluster data: ${err}`));

    fetch('api/stable-data', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        newData.admin = data;
      })
      .catch(err => console.log(`from dashboard loading other admin data: ${err}`));
    setConnectedClusterData(newData);
  }, [connectedCluster]);

  console.log(connectedClusterData);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="connect" element={<Connect setConnectedCluster={setConnectedCluster} />} />
        <Route
          path="dashboard"
          element={
            <Dashboard
              clientId={connectedCluster}
              setConnectedClusterData={setConnectedClusterData}
            />
          }
        />
        <Route path="cluster-name" element={<Manage clientId={connectedCluster} />}>
          <Route index element={<Overview data={connectedClusterData} />} />
          <Route path="brokers" element={<Brokers data={connectedClusterData.cluster.brokers} />} />
          <Route path="producers" element={<Producers />} />
          <Route path="consumers" element={<Consumers />} />
          <Route path="topics" element={<Topics data={connectedClusterData.admin.topics} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
