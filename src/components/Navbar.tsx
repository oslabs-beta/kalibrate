import Consumers from './Consumers';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {useState, SyntheticEvent} from 'react';
import {red} from '@mui/material/colors';
import {useNavigate, Link} from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box
      position="fixed"
      sx={{zIndex: theme => theme.zIndex.drawer + 1, width: '100vw', bgcolor: 'grey'}}
    >
      <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
        {/* paths will need to be checked */}
        <Link to="/dashboard" style={{textDecoration: 'none', color: 'inherit'}}>
          <Tab label="Dashboard" />
        </Link>
        <Link to="/cluster-name" style={{textDecoration: 'none', color: 'inherit'}}>
          <Tab label="Manage" />
        </Link>
        <Tab label="Monitor" />
        <Tab label="Test" />
        <Tab label="Alerts" />
        <Tab label="Settings" />
      </Tabs>
    </Box>
  );
};
export default Navbar;
