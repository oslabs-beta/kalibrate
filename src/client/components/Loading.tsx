import {CircularProgress} from '@mui/material';

const Loading = () => {
  return (
    <div style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
      <CircularProgress size="125px" />
    </div>
  );
};

export default Loading;
