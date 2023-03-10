import React, {ReactEventHandler, useState} from 'react';
import {
  Container,
  Box,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  useTheme,
  TextField,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  Stack,
} from '@mui/material';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {LoadingButton} from '@mui/lab';
import {CloseIcon, Visibility, VisibilityOff} from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
// import Schnax from './Snackbar';

/* Enter Functionality to ...
-- Enter/Change Profile Name
-- Change password:  enter old and confirm new twice
--  Form Submit

-- Delete stored clusters 
-- Delete Account  
-- Add avatar
.*/
type PasswordStateTypes = {
  [k: string]: boolean;
};

type FormStateTypes = {
  [k: string]: string;
};
const defaultForm = {
  name: '',
  old: '',
  new: '',
  confirm: '',
};

const AccountTab = () => {
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<PasswordStateTypes>({
    old: false,
    new: false,
    confirm: false,
  });
  const [formChanges, setFormChanges] = useState<FormStateTypes>({...defaultForm});

  const handleFormChange = (e, pass) => {
    setFormChanges({...formChanges, [pass]: e.target.value});
  };
  //logic to cancel changes made (clears form)
  const handleFormCancel = () => {
    setFormChanges({...defaultForm});
  };
  //logic to save user changes
  const handleFormSave = async () => {
    //start loading button
    await handleLoading();
    //ADD SAVE FUNCTIONALITY
    await setTimeout(() => setLoadingSave(false), 2000);
    //if successfully saved.
    handleFormCancel();
  };

  //logic to display loading Save button
  const handleLoading = () => {
    setLoadingSave(true);
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
  const FormPassword = (pass: string) => {
    return (
      <FormControl sx={{m: 1, width: '25ch'}}>
        <InputLabel>{titleCase(pass)} Password</InputLabel>
        <OutlinedInput
          type={showPassword[pass] ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibilty"
                onClick={e => handleShowPassword(pass)}
                onMouseDown={e => handleMouseDownPassword(e)}
                edge="end"
              >
                {showPassword[pass] ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Old Password"
          value={formChanges[pass]}
          onChange={e => handleFormChange(e, pass)}
        ></OutlinedInput>
      </FormControl>
    );
  };

  return (
    <Container>
      <Box>
        <h6>Change Profile Name</h6>
        <TextField
          label="Update Name"
          value={formChanges['name']}
          onChange={e => handleFormChange(e, 'name')}
        />
      </Box>
      <Box className="settings">
        <h6>Change Password</h6>
        {FormPassword('old')}
        {FormPassword('new')}
        {FormPassword('confirm')}
      </Box>
      <Box>
        <Button variant="outlined" size="small" onClick={handleFormCancel}>
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
