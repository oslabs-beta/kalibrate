import Connect from './components/Connect';
import Manage from './components/Manage';
import Consumers from './components/managePages/consumers';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Producers from './components/managePages/Producers';
import Brokers from './components/managePages/Brokers';
import {useState} from 'react';
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
  const [connectedCluster, setConnectedCluster] = useState('cluster-1');

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="connect" element={<Connect setConnectedCluster={setConnectedCluster} />} />
        <Route path="dashboard" element={<Dashboard clientId={connectedCluster} />} />
        <Route path=":clusterName" element={<Manage clientId={connectedCluster} />}>
          <Route index element={<Overview />} />
          <Route path="brokers" element={<Brokers />} />
          <Route path="producers" element={<Producers />} />
          <Route path="consumers" element={<Consumers />} />
          <Route path="topics" element={<Topics />} />
          <Route path="lag" element = {<Lag />} />
          <Route path="throughput" element = {<Throughput />} />
          <Route path="consume" element = {<Consume />} />
          <Route path="Produce" element = {<Produce />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
