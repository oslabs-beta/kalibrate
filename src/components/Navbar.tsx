import { Links, Outlet } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      <nav>
        <ul style={{width: '100vw', display: 'flex', flexDirection: 'row', listStyle: 'none'}}>
          <li>
            <span>Kalibrate</span>
          </li>
          <li>
            <span>Dashboard</span>
          </li>
          <li>Manage</li>
          <li>Monitor</li>
          <li>Test</li>
          <li>Alerts</li>
          <li>Settings</li>
        </ul>
      </nav>
    </div>
  );
};
export default Navbar;
