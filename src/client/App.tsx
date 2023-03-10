import {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {connectedClusterData, OffsetCollection} from './types';
import ConnectionContainer from './components/ConnectionContainer';
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
import Home from './components/Home';
import NotFound from './components/NotFound';
import Protected from './components/Protected';
import Redirect from './components/Redirect';
import './stylesheets/style.css';
import {GroupTopic, newPollType, storedClient} from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [storedClients, setStoredClients] = useState<storedClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [connectedClient, setConnectedClient] = useState<string>('');
  const [isConnectionLoading, setIsConnectionLoading] = useState<boolean>(false); // for client connection
  const [isConnectionError, setIsConnectionError] = useState<boolean>(false); // for client connection
  const [timeSeriesData, setTimeSeriesData] = useState<object[]>([]);
  const [pollInterval, setPollInterval] = useState<number>(5); // poll interval in seconds
  const [connectedClusterData, setConnectedClusterData] = useState<connectedClusterData>({
    clusterData: {
      brokers: [],
    },
    topicData: {
      topics: [],
    },
    groupData: [],
  });

  const {clusterData, topicData, groupData} = connectedClusterData;

  // verify session on mount and set client-side authentication
  useEffect(() => {
    fetch('/api/session').then(res => {
      if (res.ok) setIsAuthenticated(true);
    });
  }, []);

  // when connectedCluster changes, query kafka for cluster info and update state
  useEffect(() => {
    // only runs if a cluster has been connected to the app
    let interval: ReturnType<typeof setInterval> | undefined;
    if (connectedClient.length) {
      setIsConnectionLoading(true);
      fetch(`api/data/${connectedClient}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          setConnectedClusterData(data);
          setIsConnectionLoading(false);
          //set interval for polling
          interval = setInterval(poll, pollInterval * 1000);
        })
        .catch(err => {
          setIsConnectionError(true);
          setIsConnectionLoading(false);
        });

      // remove interval on unmount
      return () => clearInterval(interval);
    }
  }, [connectedClient]);

  // long poll to connected kafka instance for data
  // since we have to get data from kafka with KJS I'm not sure websockets do anything but add an intermediate step
  // possible todo: modularize poll into a different file
  const poll = () => {
    fetch(`api/data/${connectedClient}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        const newPoll: newPollType = {};
        newPoll.time = Date.now();
        setConnectedClusterData(data);

        // process data from connected cluster into more graph-ready form:
        // can be further processed if we want, maybe in the graph component

        // percent of groups by status
        let stable = 0,
          empty = 0;
        for (const el of data.groupData) {
          if (el.state === 'Stable') stable++;
          if (el.state === 'Empty') empty++;
        }
        newPoll.groupStatus = {
          total: data.groupData.length,
          stable,
          empty,
          other: data.groupData.length - stable - empty,
        };

        // count of offsets by topic
        newPoll.topicOffsets = {};
        for (const t of data.topicData.topics) {
          newPoll.topicOffsets[t.name] = t.offsets.reduce((acc: number, curr: OffsetCollection) => {
            return acc + Number(curr.offset);
          }, 0);
        }

        // count of offsets by group
        newPoll.groupOffsets = {};
        for (const g in data.groupOffsets) {
          const groupName = g;
          let sum = 0;
          data.groupOffsets[g].forEach((el: GroupTopic) => {
            el.partitions.forEach(p => {
              sum += Number(p.offset);
            });
          });
          newPoll.groupOffsets[groupName] = sum;
        }

        // add timeseriesdata to state so we can drill it/use it for graphing
        const newTimeSeriesData = timeSeriesData;
        newTimeSeriesData.push(newPoll);
        // to help while figuring out graphs: this is the snapshot of graphable data, added to every <interval> seconds
        console.log('graphable data: ', timeSeriesData);
        setTimeSeriesData(newTimeSeriesData);
      })
      .catch(err => console.log(`Error polling data: ${err}`));
  };

  // dashboard + client are protected routes, login + signup redirect to dashboard if authenticated
  return (
    <BrowserRouter>
      <nav>
        <Navbar isConnected={!!storedClients.length} />
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="login"
          element={
            <Redirect isAuthenticated={isAuthenticated}>
              <Login setIsAuthenticated={setIsAuthenticated} />
            </Redirect>
          }
        ></Route>

        <Route
          path="signup"
          element={
            <Redirect isAuthenticated={isAuthenticated}>
              <Signup setIsAuthenticated={setIsAuthenticated} />
            </Redirect>
          }
        ></Route>

        <Route
          path="dashboard"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <Dashboard
                connectedClient={connectedClient}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                storedClients={storedClients}
                isLoading={isConnectionLoading}
              />
            </Protected>
          }
        >
          <Route
            index
            element={
              <ConnectionContainer
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                connectedClient={connectedClient}
                setConnectedClient={setConnectedClient}
                storedClients={storedClients}
                setStoredClients={setStoredClients}
                isConnectionLoading={isConnectionLoading}
                isConnectionError={isConnectionError}
              />
            }
          />
        </Route>

        <Route
          path="client/:clientId"
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <Manage />
            </Protected>
          }
        >
          <Route
            index
            element={
              <div className="overview">
                <Overview data={connectedClusterData} connectedCluster={connectedClient} />
              </div>
            }
          />
          <Route
            path="brokers"
            element={<Brokers clusterData={clusterData} connectedCluster={connectedClient} />}
          />
          <Route
            path="consumers"
            element={<Consumers connectedCluster={connectedClient} groupData={groupData} />}
          >
            <Route index element={<ConsumersDisplay groupData={groupData} />} />
            <Route path=":groupId/members" element={<MembersDisplay />} />
          </Route>

          <Route path="topics" element={<Topics connectedCluster={connectedClient} />}>
            <Route index element={<TopicsDisplay topicData={topicData} />} />
            <Route path=":topic/partitions" element={<PartitionsDisplay />} />
            <Route path=":topic/messages" element={<MessagesDisplay />} />
          </Route>

          <Route path="lag" element={<Lag />} />
          <Route path="throughput" element={<Throughput />} />
          <Route path="consume" element={<Consume />} />
          <Route path="produce" element={<Produce />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
