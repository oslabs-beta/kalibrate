import Consumers from './consumers';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {useState, SyntheticEvent, MouseEvent} from 'react';

interface LinkTabProps {
  label?: string;
  href?: string;
}
function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}
const Navbar = () => {
  const [value, setValue] = useState();
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{width: '100vw'}}>
      <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
        {/* paths will need to be checked */}
        <LinkTab label="Dashboard" href="/dashboard" />
        <LinkTab label="Manage" href="/manage" />
        <LinkTab label="Monitor" href="/monitor" />
        <LinkTab label="Test" href="/test" />
        <LinkTab label="Alerts" href="/alerts" />
        <LinkTab label="Settings" href="/settings" />
      </Tabs>
    </Box>
  );
};
export default Navbar;
