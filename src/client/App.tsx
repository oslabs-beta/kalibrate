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
import TopicThroughput from './components/monitorPages/TopicThroughput';
import Throughput from './components/monitorPages/Throughput';
import Offsets from './components/monitorPages/Offsets';
import Produce from './components/testPages/Produce';
import Consume from './components/testPages/Consume';
import PartitionsDisplay from './components/managePages/PartitionsDisplay';
import MessagesDisplay from './components/managePages/MessagesDisplay';
import TopicsDisplay from './components/managePages/TopicsDisplay';
import Login from './components/Login';
import Signup from './components/Signup';
import Forgot from './components/Forgot';
import Home from './components/Home';
import Settings from './components/accountPages/Settings';
import NotFound from './components/NotFound';
import Protected from './components/Protected';
import Redirect from './components/Redirect';
import './stylesheets/style.css';
import {ColorModeContext, useMode} from './theme';
import {ThemeProvider, CssBaseline, Snackbar, Alert} from '@mui/material';
import {GroupTopic, newPollType, storedClient, topics} from './types';
import {not} from 'ip';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [storedClients, setStoredClients] = useState<storedClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [connectedClient, setConnectedClient] = useState<string>('');
  const [isConnectionLoading, setIsConnectionLoading] = useState<boolean>(false); // for client connection
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false); // for client deletion
  const [isConnectionError, setIsConnectionError] = useState<string>(''); // for client connection
  const [theme, colorMode] = useMode();
  const [timeSeriesData, setTimeSeriesData] = useState<newPollType[]>([]);
  const [currentPollInterval, setCurrentPollInterval] = useState<number | undefined>(
    undefined // useInterval return object
  );
  const [pollInterval, setPollInterval] = useState<number>(5); // poll interval in seconds

  // State for alert notifications
  const [alerts, setAlerts] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessages, setSnackbarMessages] = useState<string[]>([]);
  const [isAlertEnabled, setIsAlertEnabled] = useState<{[key: string]: boolean}>({
    consumerGroupStatus: false,
  });

  // State for client data
  const defaultClusterData = {
    clusterData: {
      brokers: [],
    },
    topicData: {
      topics: [],
    },
    groupData: [],
    groupList: [],
  };
  const [connectedClusterData, setConnectedClusterData] = useState<connectedClusterData>({
    ...defaultClusterData,
  });

  // setConnectedClusterData({...connectedClusterData, topicData, groupData})
  const {clusterData, topicData, groupData} = connectedClusterData;

  //resets session when user logs out
  const logout = (): void => {
    setIsAuthenticated(false);
    setSelectedClient('');
    setConnectedClient('');
    setStoredClients([]);
    setConnectedClusterData({
      ...defaultClusterData,
    });
  };

  // when user authenticated, fetch stored clients
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/connection')
        .then(response => {
          if (!response.ok) throw new Error();

          return response.json();
        })
        .then(storedClients => setStoredClients(storedClients))
        .catch(err => console.log('err:', err));
    }
  }, [isAuthenticated]);

  // when connectedCluster changes, query kafka for cluster info and update state
  useEffect(() => {
    // polling for all clusters is slow - poll for only active cluster
    // take this out to poll for all clusters
    if (currentPollInterval) clearInterval(currentPollInterval);
    // only runs if a cluster has been connected to the app
    if (connectedClient.length) {
      setIsConnectionError('');
      setIsConnectionLoading(true);
      fetch(`/api/data/${connectedClient}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => {
          setConnectedClusterData(data);
          setIsConnectionLoading(false);

          //set interval for polling
          const interval: number = window.setInterval(poll, pollInterval * 1000);
          setCurrentPollInterval(interval);
        })
        .catch(err => {
          setIsConnectionError('Failed to connected to client');
          setConnectedClient('');
          setConnectedClusterData(defaultClusterData);
          setIsConnectionLoading(false);
        });

      // remove interval on unmount
      return () => {
        clearInterval(currentPollInterval);
      };
    }
  }, [connectedClient]);

  // long poll to connected kafka instance for data
  // since we have to get data from kafka with KJS I'm not sure websockets do anything but add an intermediate step
  // possible todo: modularize poll into a different file
  const poll = () => {
    fetch(`/api/data/${connectedClient}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        const newPoll: newPollType = {
          cluster: connectedClient,
        };
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
        if (data.topicData.topics.length) {
          for (const t of data.topicData.topics) {
            newPoll.topicOffsets[t.name] = t.offsets.reduce(
              (acc: number, curr: OffsetCollection) => {
                return acc + Number(curr.offset);
              },
              0
            );
          }
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
        addTimeSeries(newPoll);
        // add timeseriesdata to state so we can drill it/use it for graphing
        // limit to 50 columns for performance, for now
        //const newTimeSeriesData = timeSeriesData;
        //newTimeSeriesData.push(newPoll);
        //if (newTimeSeriesData.length > 50) newTimeSeriesData.shift();
        // to help while figuring out graphs: this is the snapshot of graphable data, added to every <interval> seconds
      })
      .catch(err => console.log(`Error polling data: ${err}`));
  };

  const addTimeSeries = (newPoll: newPollType) => {
    // if consumer group status alerts are enabled, check notification and notify if applicable
    if (isAlertEnabled.consumerGroupStatus) {
      // check whether group status has changed since last poll
      const newGroup = newPoll.groupStatus;
      const previousPollData = timeSeriesData.at(-1); // time series data doesn't need to be passed as arg because its a ref
      const previousGroup = previousPollData ? previousPollData.groupStatus : undefined;
      let notifyChange = false;

      for (const status in newGroup) {
        if (previousGroup === undefined) break;
        if (newGroup[status] !== previousGroup[status]) {
          notifyChange = true;
          break;
        }
      }

      // notify if there has been a change
      if (notifyChange) {
        // enable snackbar alert
        setSnackbarOpen(true);
        setSnackbarMessages(snackbarMessages => {
          return [...snackbarMessages, 'A change in consumer group statuses has occured'];
        });

        // update alert state for navbar
        setAlerts(alerts => {
          return [
            ...alerts,
            `${new Date().toLocaleString()} - A change in consumer group statuses has occured`,
          ];
        });
      }
    }

    // update time series data state
    const newTimeSeriesData = timeSeriesData; // mutating to be also get state updates in the poll
    if (newTimeSeriesData.length >= 50) newTimeSeriesData.shift();
    newTimeSeriesData.push(newPoll);

    setTimeSeriesData(newTimeSeriesData);
  };

  // displays newer messages by shifting the message out of the list
  const handleSnackbarClose = (event: any, reason: string) => {
    console.log('snack bar closing handler invoked');
    if (reason === 'clickaway') return; // overide default behavior to close on any click

    setSnackbarMessages(snackbarMessages.slice(1));
    setSnackbarOpen(false);
  };

  // dashboard + client are protected routes, login + signup redirect to dashboard if authenticated
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>
          <BrowserRouter>
            <nav>
              <Navbar
                isAuthenticated={isAuthenticated}
                isConnected={!!storedClients.length}
                logout={logout}
                alerts={alerts}
                setAlerts={setAlerts}
              />
            </nav>

            <Snackbar
              key={Date.now()}
              open={snackbarOpen}
              autoHideDuration={4000}
              onClose={handleSnackbarClose}
              anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            >
              <Alert severity="info">{snackbarMessages[0]}</Alert>
            </Snackbar>

            <Routes>
              <Route path="/" element={<Home />} />

              <Route
                path="login"
                element={
                  <Redirect
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={setIsAuthenticated}
                  >
                    <Login setIsAuthenticated={setIsAuthenticated} />
                  </Redirect>
                }
              ></Route>

              <Route
                path="signup"
                element={
                  <Redirect
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={setIsAuthenticated}
                  >
                    <Signup setIsAuthenticated={setIsAuthenticated} />
                  </Redirect>
                }
              ></Route>

              <Route
                path="settings"
                element={
                  <Protected
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={setIsAuthenticated}
                  >
                    <Settings
                      isAlertEnabled={isAlertEnabled}
                      setIsAlertEnabled={setIsAlertEnabled}
                    />
                  </Protected>
                }
              ></Route>
              <Route path="forgot" element={<Forgot />}></Route>
              <Route
                path="dashboard"
                element={
                  <Protected
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={setIsAuthenticated}
                  >
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
                      setIsConnectionError={setIsConnectionError}
                      isDeleteLoading={isDeleteLoading}
                      setIsDeleteLoading={setIsDeleteLoading}
                    />
                  }
                />
              </Route>

              <Route
                path="client/:clientId"
                element={
                  <Protected
                    isAuthenticated={isAuthenticated}
                    setIsAuthenticated={setIsAuthenticated}
                  >
                    <Manage connectedCluster={connectedClient} />
                  </Protected>
                }
              >
                <Route
                  index
                  element={
                    <div className="overview">
                      <Overview
                        data={connectedClusterData}
                        connectedCluster={connectedClient}
                        timeSeriesData={timeSeriesData}
                      />
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
                  <Route
                    index
                    element={
                      <TopicsDisplay
                        connectedCluster={connectedClient}
                        topicData={topicData}
                        setConnectedClusterData={setConnectedClusterData}
                        connectedClusterData={connectedClusterData}
                      />
                    }
                  />
                  <Route path=":topic/partitions" element={<PartitionsDisplay />} />
                  <Route path=":topic/messages" element={<MessagesDisplay />} />
                </Route>
                <Route
                  path="lag"
                  element={
                    <TopicThroughput
                      timeSeriesData={timeSeriesData}
                      connectedCluster={connectedClient}
                    />
                  }
                />
                <Route path="throughput" element={<Throughput />} />
                <Route path="offsets" element={<Offsets timeSeriesData={timeSeriesData} />} />
                <Route path="consume" element={<Consume />} />
                <Route path="produce" element={<Produce />} />
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
