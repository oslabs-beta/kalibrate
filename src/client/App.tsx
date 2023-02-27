import Connect from './components/Connect';
import Manage from './components/Manage';
import Consumers from './components/managePages/consumers';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Producers from './components/managePages/Producers';
import Brokers from './components/managePages/Brokers';
import {useState, useEffect} from 'react';
import Overview from './components/Overview';
import Dashboard from './components/Dashboard';
import Topics from './components/managePages/Topics';
import Lag from './components/monitorPages/Lag';
import Throughput from './components/monitorPages/Throughput';
import Produce from './components/testPages/Produce';
import Consume from './components/testPages/Consume';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  //declare clientId state so other components could access for link & routing
  const [connectedCluster, setConnectedCluster] = useState('');
  const [sessionClusters, setSessionClusters] = useState([]);
  const [connectedClusterData, setConnectedClusterData] = useState({
    clusterData: {brokers: []},
    topicData: {topics: []},
    groupList: [],
    groupData: {groups: []},
  });
  const [isConnected, setIsConnected] = useState(false);

  // when connectedCluster changes, query kafka for cluster info and update state
  useEffect(() => {
    // only runs if a cluster has been connected to the app
    if (connectedCluster.length) {
      fetch('api/get-data', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setConnectedClusterData(data);
        })
        .catch(err => console.log(`from app loading cluster data: ${err}`));
    }
  }, [connectedCluster]);

  console.log('Received Data:', connectedClusterData);

  const {clusterData, topicData, groupList, groupData} = connectedClusterData;

  return (
    <BrowserRouter>
      <Navbar isConnected={isConnected} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="connect"
          element={
            <Connect
              connectedCluster={connectedCluster}
              setConnectedCluster={setConnectedCluster}
              sessionClusters={sessionClusters}
              setSessionClusters={setSessionClusters}
              setIsConnected={setIsConnected}
            />
          }
        />
        <Route
          path="dashboard"
          element={
            <Dashboard
              connectedCluster={connectedCluster}
              setConnectedCluster={setConnectedCluster}
              sessionClusters={sessionClusters}
            />
          }
        />
        <Route path=":clusterName" element={<Manage connectedCluster={connectedCluster} />}>
          <Route index element={<Overview data={connectedClusterData} />} />
          <Route path="brokers" element={<Brokers data={clusterData.brokers} />} />
          <Route path="producers" element={<Producers data={groupData.groups} />} />
          <Route path="consumers" element={<Consumers data={groupData.groups} />} />
          <Route path="topics" element={<Topics data={topicData.topics} />} />
          <Route path="lag" element={<Lag />} />
          <Route path="throughput" element={<Throughput />} />
          <Route path="consume" element={<Consume />} />
          <Route path="Produce" element={<Produce />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
