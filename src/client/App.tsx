import {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {connectedClusterData} from '../client/components/managePages/types';
import Connect from './components/Connect';
import Manage from './components/Manage';
import Consumers from './components/managePages/consumers';
import Navbar from './components/Navbar';
import Brokers from './components/managePages/Brokers';
import Overview from './components/Overview';
import Dashboard from './components/Dashboard';
import Topics from './components/managePages/Topics';
import Lag from './components/monitorPages/Lag';
import Throughput from './components/monitorPages/Throughput';
import Produce from './components/testPages/Produce';
import Consume from './components/testPages/Consume';
import PartitionsDisplay from './components/managePages/PartitionsDisplay';
import MessagesDisplay from './components/managePages/MessagesDisplay';
import TopicsDisplay from './components/managePages/TopicsDisplay';
import './stylesheets/style.css';

function App() {
  //declare clientId state so other components could access for link & routing
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedCluster, setConnectedCluster] = useState<string>('');
  const [sessionClusters, setSessionClusters] = useState([]);
  const [connectedClusterData, setConnectedClusterData] = useState<connectedClusterData>({});

  const {clusterData, topicData, groupData} = connectedClusterData;

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
          console.log('Fetched data', data);
          setConnectedClusterData(data);
        })
        .catch(err => console.log(`from app loading cluster data: ${err}`));
    }
  }, [connectedCluster]);

  // log fetched data for dev purposes, remove before push to prod
  console.log('Connected cluster data:', connectedClusterData);

  return (
    <BrowserRouter>
      <nav>
        <Navbar isConnected={isConnected} />
      </nav>

      <Routes>
        <Route
          path="/"
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
              <div className="overview">
                <Overview
                  data={connectedClusterData}
                  connectedCluster={connectedCluster}
                  sessionClusters={sessionClusters}
                />
              </div>
            }
          />
          <Route
            path="brokers"
            element={<Brokers clusterData={clusterData} connectedCluster={connectedCluster} />}
          />
          <Route
            path="consumers"
            element={<Consumers groupData={groupData} connectedCluster={connectedCluster} />}
          />
          <Route path="topics" element={<Topics connectedCluster={connectedCluster} />}>
            <Route index element={<TopicsDisplay topicData={topicData} />} />
            <Route path=":topic/partitions" element={<PartitionsDisplay />} />
            <Route path=":topic/messages" element={<MessagesDisplay />} />
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
