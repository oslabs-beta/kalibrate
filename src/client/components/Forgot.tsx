import {Container, Box, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../theme';

const Forgot = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Container
      maxWidth="xs"
      sx={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingX: '30px',
          paddingY: '15px',
          outline: '1px solid' + colors.info[300],
          borderRadius: '5px',
          alignItems: 'center',
          width: '100%',
          backgroundColor: colors.background[500],
        }}
      >
        <Typography>Bye</Typography>
      </Box>
    </Container>
  );
};

export default Forgot;
