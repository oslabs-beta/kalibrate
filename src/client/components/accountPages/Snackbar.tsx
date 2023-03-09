import React, {ReactEventHandler, useState} from 'react';
import {Button, useTheme, Snackbar, Stack, Fade} from '@mui/material';
import Slide, {SlideProps} from '@mui/material/Slide';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {LoadingButton} from '@mui/lab';
import {CloseIcon, Visibility, VisibilityOff} from '@mui/icons-material';

type SchnaxProps = {
  message: string;
};
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}
const Schnax = (props: SchnaxProps) => {
  const {message} = props;
  const [open, setOpen] = useState<boolean>(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{width: '100%'}}>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        TransitionComponent={SlideTransition}
        message={message}
        key={'slide'}
      >
        <Alert onClose={handleCloseAlert} severity="success" sx={{width: '50%'}}>
          SAVE SUCCESSFUL
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default Schnax;
