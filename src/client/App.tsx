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
import NotFound from './components/NotFound';
import './stylesheets/style.css';

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectedCluster, setConnectedCluster] = useState<string>('');
  const [sessionClusters, setSessionClusters] = useState<string[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<object[]>([]);
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
    // only runs if a cluster has been connected to the app
    if (connectedCluster.length) {
      let interval; // for
      fetch('api/data', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          setConnectedClusterData(data);
          //set interval for polling
          // make interval changeable?
          //also rn I don't think you can actually change clusters by clicking between them on the sidebar - don't think it changes to the right k instacne. talk to the session folks
          // add group data fetch to admincontroller
          interval = setInterval(poll, 5000);
        })
        .catch(err => console.log(`Error from app loading cluster data: ${err}`));
      // remove interval on unmount
      // also clear timeseriesdata?
      return () => clearInterval(interval);
    }
  }, [connectedCluster]);

  // repeated poll to connected kafka instance for data
  // since we have to get data from kafka with KJS I'm not sure websockets do anything but add an intermediate step
  // modularize poll into a different file?
  const poll = () => {
    fetch('api/data', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        const newPoll = {};
        newPoll.time = Date.now();
        console.log(Date.now());
        console.log(data);
        setConnectedClusterData(data);
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
        // data.topicData.topics
        newPoll.topicOffsets = {};
        for (const t of data.topicData.topics) {
          const topicName = t.name;
          let sum = 0;
          for (const o of t.offsets) {
            sum += Number(o.offset);
          }
          newPoll.topicOffsets[topicName] = sum;
        }

        // count of offsets by group
        // data.groupOffsets
        newPoll.groupOffsets = {};
        for (const g in data.groupOffsets) {
          const groupName = g;
          let sum = 0;
          data.groupOffsets[g].forEach(el => {
            el.partitions.forEach(p => {
              sum += p.offset;
            });
          });
          newPoll.groupOffsets[groupName] = sum;
        }
        console.log('np ', newPoll);

        // add timeseriesdata to state
        const newTimeSeriesData = timeSeriesData;
        newTimeSeriesData.push(newPoll);
        console.log('tsd: ', newTimeSeriesData);
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
