import {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {connectedClusterData, OffsetCollection} from './types';
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
import NotFound from './components/NotFound';
import './stylesheets/style.css';
import {GroupTopic, newPollType, topics} from './types';

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedCluster, setConnectedCluster] = useState<string>('');
  const [sessionClusters, setSessionClusters] = useState<string[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<object[]>([]);
  const [currentPollInterval, setCurrentPollInterval] = useState<typeof setInterval | undefined>(
    undefined
  );
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

  // when connectedCluster changes, query kafka for cluster info and update state
  useEffect(() => {
    console.log('useEffect start');
    console.log(currentPollInterval);
    // if we remove this if block, it will poll for all connected clusters, but this is potentially very slow
    // currently polling for one cluster at once
    if (currentPollInterval) {
      console.log('clearing interval: ', currentPollInterval);
      clearInterval(currentPollInterval);
    }
    // only runs if a cluster has been connected to the app
    console.log(connectedCluster);
    if (connectedCluster.length) {
      fetch(`api/data/${connectedCluster}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          setConnectedClusterData(data);
          //set interval for polling
          const interval: ReturnType<typeof setInterval> = setInterval(poll, pollInterval * 1000);
          console.log('setting interval: ', interval);
          setCurrentPollInterval(interval);
        })
        .catch(err => console.log(`Error from app loading cluster data: ${err}`));

      // remove interval on unmount
      return () => clearInterval(currentPollInterval);
    }
  }, [connectedCluster]);

  // long poll to connected kafka instance for data
  // since we have to get data from kafka with KJS I'm not sure websockets do anything but add an intermediate step
  // possible todo: modularize poll into a different file
  const poll = () => {
    fetch(`api/data/${connectedCluster}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        const newPoll: newPollType = {
          cluster: connectedCluster,
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
            element={<Brokers clusterData={clusterData} connectedCluster={connectedCluster} />}
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
  );
}

export default App;
