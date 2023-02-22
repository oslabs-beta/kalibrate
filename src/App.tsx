import Connect from './components/Connect';
import Dashboard from './components/Dashboard';
import Consumers from './components/Consumers';
import Navbar from './components/Navbar';
import Events from './components/Events';
import Home from './components/Home';
import {useState} from 'react';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  const [clientId, setClientId] = useState('');

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="connect" element={<Connect clientId={clientId} setClientId={setClientId} />} />
        <Route path="cluster-name" element={<Dashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="brokers" />
          <Route path="producers" />
          <Route path="consumers" element ={<Consumers/>} />
          <Route path="topics" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
