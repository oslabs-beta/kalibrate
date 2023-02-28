import Connect from './components/Connect';
import Manage from './components/Manage';
import Consumers from './components/managePages/consumers';
import Navbar from './components/Navbar';
import Home from './components/Home';
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
import PartitionsDisplay from './components/managePages/PartitionsDisplay';
import MessagesDisplay from './components/managePages/MessagesDisplay';
import TopicsDisplay from './components/managePages/TopicsDisplay';

function App() {
  //declare clientId state so other components could access for link & routing
  const [isConnected, setIsConnected] = useState(false);
  const [connectedCluster, setConnectedCluster] = useState('');
  const [sessionClusters, setSessionClusters] = useState([]);
  const [connectedClusterData, setConnectedClusterData] = useState({
    clusterData: {brokers: []},
    topicData: {topics: []},
    groupList: [],
    groupData: {groups: []},
  });

  // when connectedCluster changes, query kafka for cluster info and update state
  useEffect(() => {
    // only runs if a cluster has been connected to the app
    if (connectedCluster.length) {
      fetch('api/data', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log('(APP) fetched all data', data);
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
              isConnected={isConnected}
            />
          }
        >
          <Route
            index
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
        </Route>
        <Route path=":clusterName" element={<Manage connectedCluster={connectedCluster} />}>
          <Route
            index
            element={
              <Overview
                data={connectedClusterData}
                connectedCluster={connectedCluster}
                sessionClusters={sessionClusters}
              />
            }
          />
          <Route path="brokers" element={<Brokers data={clusterData} />} />
          <Route path="consumers" element={<Consumers data={groupData} />} />
          <Route path="topics" element={<Topics data={topicData} />}>
            <Route path={`:topicName/partitions`} element={<PartitionsDisplay />} />
            <Route path={':topicName/messages'} element={<MessagesDisplay topic={'topicname'} />} />
          </Route>
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
/*TODO:
- as of 1st attempt brokers: data is not drilled properly unless all of connectedClusterData is passe through.
- props for groupData does not specify producers or consumers
*/
