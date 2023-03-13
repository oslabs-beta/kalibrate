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
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import {PasswordStateTypes} from '../../types';

const defaultForm = {
  newEmail: '',
  oldPass: '',
  newPass: '',
  confirmPass: '',
};

const AccountTab = () => {
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<PasswordStateTypes>({
    old: false,
    confirm: false,
  });
  const [formChanges, setFormChanges] = useState<{[k: string]: string}>({...defaultForm});
  const [inputOldPass, setInputOldPass] = useState<boolean>(false);
  const [inputMatching, setInputMatching] = useState<boolean>(false);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    pass: string
  ) => {
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
        <InputLabel sx={{top: '-7px', width: '100%'}}>{titleCase(pass)} Password</InputLabel>
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
      <Box>
        <h6>Enter Password to make changes</h6>
        {FormPassword('old')}
        {inputOldPass ? <div>MUST ENTER PASSWORD</div> : <div></div>}
      </Box>

      <Box>
        <h6>Change Account Email</h6>
        <TextField
          size="small"
          label="Update Email"
          value={formChanges['newEmail']}
          onChange={e => handleFormChange(e, 'newEmail')}
        />
      </Box>

      <Box className="settings">
        <h6>Change Password</h6>
        {FormPassword('new')}
        {FormPassword('confirm')}
        {inputMatching ? <div>MUST BE MATCHING</div> : <div></div>}
      </Box>

      <Box>
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

      <hr />

      <Box className="settings">
        <h2>DELETE DATA</h2>
        <Button className="delete">DELETE CLUSTERS</Button>
        <Button className="delete">DELETE ACCOUNT</Button>
      </Box>
    </Container>
  );
};

export default AccountTab;
