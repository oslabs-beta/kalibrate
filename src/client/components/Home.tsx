import {useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <Button
        variant='contained'
        onClick={() => navigate('/connect')}
        sx={{height: '10rem', width: '30rem', borderRadius: 8, fontSize: '1.3rem'}}
      >
        Connect to a Cluster
      </Button>
    </Box>
  );
};

export default Home;
