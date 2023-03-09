import {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {connectedClusterData} from './types';
import Connect from './components/Connect';
import Manage from './components/Manage';
import Consumers from './components/managePages/consumers';
import ConsumersDisplay from './components/managePages/consumersDisplay';
import MembersDisplay from './components/managePages/membersDisplay';
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
import Login from './components/Login';
import Signup from './components/Signup';
import Settings from './components/accountPages/Settings';
import NotFound from './components/NotFound';
import './stylesheets/style.css';
import {ColorModeContext, useMode} from './theme';
import {ThemeProvider, CssBaseline} from '@mui/material';
function App() {
  const [theme, colorMode] = useMode();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedCluster, setConnectedCluster] = useState<string>('');
  const [sessionClusters, setSessionClusters] = useState<string[]>([]);

  const defaultClusterData = {
    clusterData: {
      brokers: [],
    },
    topicData: {
      topics: [],
    },
    groupData: [],
  };
  const [connectedClusterData, setConnectedClusterData] =
    useState<connectedClusterData>(defaultClusterData);

  const {clusterData, topicData, groupData} = connectedClusterData;

  //resets session when user logs out
  const logout = (): void => {
    setIsConnected(false);
    setConnectedCluster('');
    setSessionClusters([]);
    setConnectedClusterData(defaultClusterData);
    console.log('YOURE LOGGED OUT', isConnected); //SUCCESS LOGOUT BUT isConnected still true
  };

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
          setConnectedClusterData(data);
        })
        .catch(err => console.log(`Error from app loading cluster data: ${err}`));
    }
  }, [connectedCluster]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>
          <BrowserRouter>
            <nav>
              <Navbar isConnected={isConnected} logout={logout} />
            </nav>

            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
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
                      setConnectedCluster={setConnectedCluster}
                      sessionClusters={sessionClusters}
                      setSessionClusters={setSessionClusters}
                      setIsConnected={setIsConnected}
                      isConnected={isConnected}
                    />
                  }
                />
              </Route>
              <Route path="login" element={<Login />}></Route>
              <Route path="signup" element={<Signup />}></Route>
              <Route path="settings" element={<Settings />}></Route>
              <Route path=":clusterName" element={<Manage />}>
                <Route
                  index
                  element={
                    <div className="overview">
                      <Overview data={connectedClusterData} connectedCluster={connectedCluster} />
                    </div>
                  }
                />
                <Route
                  path="brokers"
                  element={
                    <Brokers clusterData={clusterData} connectedCluster={connectedCluster} />
                  }
                />
                <Route
                  path="consumers"
                  element={<Consumers connectedCluster={connectedCluster} groupData={groupData} />}
                >
                  <Route index element={<ConsumersDisplay groupData={groupData} />} />
                  <Route path=":groupId/members" element={<MembersDisplay />} />
                </Route>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
