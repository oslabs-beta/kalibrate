import Connect from './components/Connect';
import Dashboard from './components/Dashboard';
import Consumers from './components/Consumers';
import Navbar from './components/Navbar';
import Events from './components/Events';
import Home from './components/Home';
import Producers from './components/Producers';
import Brokers from './components/Brokers';
import {useState} from 'react';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  const [connectedCluster, setConnectedCluster] = useState('');

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route
          path="connect"
          element={
            <Connect
              connectedCluster={connectedCluster}
              setConnectedCluster={setConnectedCluster}
            />
          }
        />
        <Route path="cluster-name" element={<Dashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="brokers" element={<Brokers />} />
          <Route path="producers" element={<Producers />} />
          <Route path="consumers" element={<Consumers />} />
          <Route path="topics" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
