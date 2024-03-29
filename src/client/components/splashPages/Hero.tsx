import {Link} from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../../theme';

const Hero = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <>
      <CssBaseline />
      <Container id='hero' maxWidth="md" sx={{minWidth: 'sm'}}>
        <Box
          id="hero"
          sx={{
            marginTop: '100px',
            paddingTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            color: colors.primary[900]
          }}
        >
          <h1 style={{fontSize: '3rem', margin: '0', lineHeight: 'normal'}}>
            Interact with your Kafka clusters for free using Kalibrate's web-based GUI
          </h1>
          <h3 style={{color: colors.info[100], margin: '0', }}>
            Kalibrate is an open-source developer tool for seamlessly managing and monitoring Kafka cluster health. Powered by KafkaJS in a Node.js environment.
          </h3>

          <Button component={Link} to='dashboard' variant="contained" sx={{borderRadius: '9999px', width: '200px', height: '2.75rem', backgroundColor: '#E29578', '&:hover': {backgroundColor: '#eab5a0'}, fontWeight: 'bold', fontSize: '.9rem'}}>
            Connect to Kafka
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Hero;
