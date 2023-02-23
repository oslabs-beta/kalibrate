import Connect from './components/Connect';
import Manage from './components/Manage';
import Consumers from './components/Consumers';
import Navbar from './components/Navbar';
import Events from './components/Messages';
import Home from './components/Home';
import Producers from './components/Producers';
import Brokers from './components/Brokers';
import {useState} from 'react';
import Overview from './components/Overview';
import Dashboard from './components/Dashboard';
import Topics from './components/Topics';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  //declare clientId state so other components could access for link & routing
  const [clientId, setClientId] = useState('cluster-1');

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="connect" element={<Connect clientId={clientId} setClientId={setClientId} />} />
        <Route path="dashboard" element={<Dashboard clientId={clientId}/>} />
        <Route path="cluster-name" element={<Manage clientId={clientId}/>}>
          <Route index element={<Overview />} />
          <Route path="brokers" element={<Brokers />} />
          <Route path="producers" element={<Producers />} />
          <Route path="consumers" element={<Consumers />} />
          <Route path="topics" element={<Topics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
