import {Typography} from '@mui/material';
import crow from './assets/crow2.png';

const NotFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img src={crow} alt="kalibrate crow" width="200px" height="200px" />

      <div style={{marginLeft: '30px'}}>
        <Typography variant="h2" sx={{marginBottom: '15px'}}>
          Oops...
        </Typography>

        <Typography variant="h4">Looks like you've gone off-kourse</Typography>
      </div>
    </div>
  );
};

export default NotFound;
