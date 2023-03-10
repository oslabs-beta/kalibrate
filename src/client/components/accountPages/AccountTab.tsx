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
import {Visibility, VisibilityOff} from '@mui/icons-material';
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
  newEmail: '',
  oldPass: '',
  newPass: '',
  confirmPass: '',
};

const AccountTab = () => {
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<PasswordStateTypes>({
    old: false,
    new: false,
    confirm: false,
  });
  const [formChanges, setFormChanges] = useState<FormStateTypes>({...defaultForm});

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    pass: string
  ) => {
    const passKey =
      pass === 'old' || pass === 'new' || pass === 'confirm' ? pass + 'Pass' : 'newEmail';

    //check new Name
    //check newpas and confirm pass are matching, will verity structure in back
    setFormChanges({...formChanges, [passKey]: e.target.value});
    console.log(formChanges);
  };
  //logic to cancel changes made (clears form)
  const handleFormCancel = () => {
    setFormChanges({...defaultForm});
  };

  //logic to save user changes
  //will confirm here
  //pass obj {newEmail, oldPass, newPass} to backend
  const handleFormSave = async () => {
    const {newEmail, oldPass, newPass, confirmPass} = formChanges;
    //make sure confirm and new match
    if (newPass !== confirmPass) {
      return <div>NOT MATCHING CONFIRM AND NEW</div>;
    }
    //check input structure
    const updateInfo = {
      newEmail,
      oldPass,
      newPass,
    };
    //start loading button
    await handleLoading();
    //ADD SAVE FUNCTIONALITY
    await setTimeout(() => setLoadingSave(false), 2000);
    // const response = await fetch('/api/settings/account', {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(updateInfo),
    // });
    // if (response) {
    // }
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
  //password text field components
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
        <h6>Change Account Email</h6>
        <TextField
          label="Update Email"
          value={formChanges['email']}
          onChange={e => handleFormChange(e, 'email')}
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
