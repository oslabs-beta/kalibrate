import React, {useState} from 'react';
import {
  Container,
  Box,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  OutlinedInput,
  Typography,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import {UserMenuProps, PasswordStateTypes} from '../../types';

const defaultForm = {
  newEmail: '',
  oldPass: '',
  newPass: '',
  confirmPass: '',
};

const AccountTab = (props: UserMenuProps) => {
  const {logout} = props;
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<PasswordStateTypes>({
    old: false,
    confirm: false,
  });
  const [formChanges, setFormChanges] = useState<{[k: string]: string}>({...defaultForm});
  const [inputOldPass, setInputOldPass] = useState<boolean>(false);
  const [inputMatching, setInputMatching] = useState<boolean>(false);
  const [accountInput, setAccountInput] = useState<string>('');

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    pass: string
  ) => {
    setInputOldPass(false);
    setInputMatching(false);
    setFormChanges({...formChanges, [pass]: e.target.value});
  };

  const handleFormClear = () => {
    setFormChanges({...defaultForm});
    setInputMatching(false);
    setInputOldPass(false);
  };

  const handleFormSave = async () => {
    const {newEmail, oldPass, newPass, confirmPass} = formChanges;
    if (!oldPass) {
      setInputOldPass(true);
      return;
    }

    if (newPass !== confirmPass) {
      setInputMatching(true);
      return;
    }

    const updateInfo = {
      newEmail,
      oldPass,
      newPass,
    };

    // start loading button
    setLoadingSave(true);
    const response = await fetch('/api/settings/account', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateInfo),
    });

    setLoadingSave(false);
    if (response.ok) handleFormClear();
  };

  //logic to create visible password forms
  const handleShowPassword = (pass: string) => {
    let oldVal = showPassword[pass];
    setShowPassword({
      ...showPassword,
      [pass]: !oldVal,
    });
  };

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const titleCase = (string: string): string => {
    return string.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  };

  //password text field components
  const FormPassword = (pass: string) => {
    const passKey =
      pass === 'old' || pass === 'new' || pass === 'confirm' ? pass + 'Pass' : 'newEmail';
    const show = pass === 'new' || pass === 'confirm' ? 'confirm' : pass;

    return (
      <FormControl sx={{m: 1, width: '25ch'}}>
        <InputLabel size="small" sx={{width: '100%'}}>
          {titleCase(pass)} Password
        </InputLabel>
        <OutlinedInput
          size="small"
          type={showPassword[show] ? 'text' : 'password'}
          label="Old Password"
          value={formChanges[passKey]}
          onChange={e => handleFormChange(e, passKey)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibilty"
                onClick={e => handleShowPassword(show)}
                onMouseDown={e => handleMouseDownPassword(e)}
                edge="end"
              >
                {showPassword[show] ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        ></OutlinedInput>
      </FormControl>
    );
  };

  return (
    <Container>
      <Box sx={{marginBottom: '30px'}}>
        <Typography variant="h6">Enter your password to make changes</Typography>
        {FormPassword('old')}
        {inputOldPass ? <div>MUST ENTER PASSWORD</div> : <div></div>}
      </Box>

      <Box sx={{marginBottom: '30px'}}>
        <Typography variant="h6">Change Account Email</Typography>
        <TextField
          size="small"
          label="Update Email"
          value={formChanges['newEmail']}
          onChange={e => handleFormChange(e, 'newEmail')}
        />
      </Box>

      <Box className="settings" sx={{marginBottom: '30px'}}>
        <Typography variant="h6">Change Password</Typography>
        {FormPassword('new')}
        {FormPassword('confirm')}
        {inputMatching ? <div>MUST BE MATCHING</div> : <div></div>}
      </Box>
      <Box className="submit-buttons">
        <LoadingButton
          onClick={handleFormSave}
          loading={loadingSave}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          sx={{width: '50%'}}
        >
          SAVE
        </LoadingButton>
        <Button size="small" onClick={handleFormClear} sx={{width: '50%'}}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default AccountTab;
