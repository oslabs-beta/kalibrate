import {useState, useEffect} from 'react';
import {useNavigate, Outlet, Navigate} from 'react-router';
import {Link} from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  InputLabel,
  IconButton,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import {LoadingButton} from '@mui/lab';
import {useTheme} from '@mui/material/styles';
import {tokens} from '../../theme';
import {FormStateTypes, PasswordStateTypes} from '../../types';

export const Forgot = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [email, setEmail] = useState<string>('');
  const [inputEmail, setInputEmail] = useState<boolean>(false);
  const [sentEmail, setSentEmail] = useState<boolean>(false);

  const resetForm = () => {
    setSentEmail(false);
    setInputEmail(false);
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    resetForm();
    setEmail(e.target.value);
  };
  const sendResetEmail = async () => {
    if (!email) {
      setInputEmail(true);
      return;
    }
    try {
      const response = await fetch('/api/password/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
      });
      if (!response.ok) throw new Error();
      resetForm();
    } catch {
      console.log('no email');
    }
  };
  return (
    <Container
      maxWidth="xs"
      sx={{height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}
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
        <h3>Forgot Password?</h3>
        <Box>
          <h6>Enter Account Email</h6>
          <TextField
            size="small"
            sx={{width: '26ch'}}
            label="Email"
            value={email}
            onChange={e => handleFormChange(e)}
          />
          {inputEmail ? <div>MUST ENTER EMAIL</div> : <div></div>}
          {sentEmail ? <div>EMAIL SENT! </div> : <div></div>}
        </Box>
        <Button onClick={() => sendResetEmail()}>SEND EMAIL</Button>
      </Box>
      <Box>
        <Link to="/login">Back to Login</Link>
      </Box>
    </Container>
  );
};

const defaultForm = {
  email: '',
  new: '',
  confirm: '',
};
export const Reset = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formChanges, setFormChanges] = useState<FormStateTypes>({...defaultForm});
  const [inputEmail, setInputEmail] = useState<boolean>(false);
  const [inputMatching, setInputMatching] = useState<boolean>(false);
  const [inputFillForm, setInputFillForm] = useState<boolean>(false);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const resetState = () => {
    setInputEmail(false);
    setInputFillForm(false);
    setInputMatching(false);
    setLoadingSave(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    pass: string
  ) => {
    resetState();
    setFormChanges({...formChanges, [pass]: e.target.value});
    console.log('cleared', formChanges);
  };

  const handleFormClear = () => {
    setFormChanges({...defaultForm});
    resetState();
  };

  const handleFormSave = async () => {
    const {email, confirm} = formChanges;
    const newPass = formChanges.new;
    setLoadingSave(true);
    if (!email) {
      setInputEmail(true);
      setInputFillForm(true);
      return;
    }
    if (!newPass || !confirm) {
      setInputFillForm(true);
      return;
    }
    if (newPass !== confirm) {
      setInputMatching(true);
      return;
    }

    const response = await fetch('/api/password/reset', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, newPass}),
    });
    if (!response.ok) {
      console.log('couldnt update');
      const error = await response.json();
      throw new Error(error.err);
    }
    console.log('update ok');
    handleFormClear();
    navigate('login');
  };
  const handleShowPassword = () => {
    let oldVal = showPassword;
    setShowPassword(!oldVal);
  };
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  const titleCase = (string: string): string => {
    return string.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  };
  const FormPassword = (pass: string) => {
    return (
      <FormControl sx={{m: 1, width: '25ch'}}>
        <InputLabel sx={{top: '-7px', width: '100%'}}>{titleCase(pass)} Password</InputLabel>
        <OutlinedInput
          size="small"
          type={showPassword ? 'text' : 'password'}
          label="Old Password"
          value={formChanges[pass]}
          onChange={e => handleFormChange(e, pass)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibilty"
                onClick={() => handleShowPassword()}
                onMouseDown={e => handleMouseDownPassword(e)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        ></OutlinedInput>
      </FormControl>
    );
  };
  return (
    <Container
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        className="settings"
        sx={{
          paddingX: '30px',
          paddingY: '15px',
          outline: '1px solid' + colors.info[300],
          borderRadius: '5px',
          width: '100%',
          backgroundColor: colors.background[500],
        }}
      >
        <Typography>RESET PASSWORD</Typography>
        <Box>
          <h6>Enter Account Email</h6>
          <TextField
            size="small"
            sx={{width: '26ch'}}
            label="Email"
            value={formChanges['email']}
            onChange={e => handleFormChange(e, 'email')}
          />
          {inputEmail ? <div>MUST ENTER EMAIL</div> : <div></div>}
        </Box>
        <Box className="settings">
          <h6>Enter new password</h6>
          {FormPassword('new')}
          {FormPassword('confirm')}
          {inputMatching ? <div>MUST BE MATCHING</div> : <div></div>}
          {inputFillForm ? <div>PLEASE FILL FIELDS</div> : <div></div>}
        </Box>
        <Box className="submit-buttons">
          <Button variant="outlined" size="small" onClick={handleFormClear}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleFormSave}
            loading={loadingSave}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
          >
            SAVE
          </LoadingButton>
        </Box>
      </Box>
      <Box>
        <Link to="/login">Back to Login</Link>
      </Box>
    </Container>
  );
};
