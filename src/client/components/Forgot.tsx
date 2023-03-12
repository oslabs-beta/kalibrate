import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router';
import {Link} from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  InputLabel,
  IconButton,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {SignupProps} from '../types';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../theme';

const Forgot = () => {
  const navigate = useNavigate();
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
