import React, { Component, useEffect, useState, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/styles';

import styles from './Main.module.css';

// https://mui.com/material-ui/react-text-field/
// https://mui.com/material-ui/customization/theming/
// https://dtuto.com/questions/4662/how-to-change-the-border-color-of-material-ui-lt-textfield-gt
const CustomTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'var(--gray2)',
    },
    '& label': {
      color: 'var(--gray1)',
    },
    '& input': {
      color: 'var(--gray2)',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'var(--gray1)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--gray3)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--gray2)',
      },
    },
  },
})(TextField);

const CustomButton = withStyles({
  root: {
    '&': {
      borderColor: 'var(--gray1)',
      color: 'var(--gray1)',
    },
    '&:hover': {
      borderColor: 'var(--gray3)',
    },
    '&.Mui-disabled': {
      borderColor: '#666',
      color: '#666',
    },
  },
})(Button);

const CustomSubmitButton = withStyles({
  root: {
    '&': {
      backgroundColor: 'var(--gray1)',
      color: '#000',
    },
    '&:hover': {
      backgroundColor: 'var(--gray2)',
    },
  },
})(Button);

const Main = () => {
  useEffect(() => {
    if (window.location.hash !== '') {
      try {
        setState({ ...state, token: atob(window.location.hash.substring(1)) });
      } catch (e) {
        console.log('b64 decode error');
      }
      // https://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-url-with-javascript-without-page-r
      history.replaceState(null, null, ' ');
    }
  }, []);

  // https://github.com/mui/material-ui/issues/7247
  const serviceInputRef = useRef();
  const usernameInputRef = useRef();
  const masterInputRef = useRef();
  const [state, setState] = useState({
    token: null,
    service: '',
    username: '',
    master: '',
  });

  useEffect(() => {
    serviceInputRef.current.focus();
  }, [serviceInputRef]);

  const copyMasterPassword = () => {
    ['service', 'username', 'master'].forEach((key) =>
      setState((state) => {
        return { ...state, [key]: '' };
      })
    );
    serviceInputRef.current.focus();

    console.log(state);
  };

  return (
    <main className={styles.Main}>
      <h1>DBLess Password Manager</h1>
      <p>
        A hash-based, database-less password manager&nbsp;
        <a
          className={styles.link}
          href="https://github.com/Bricktech2000/DBLess-Password-Manager"
          target="_blank"
        >
          <i className={'fa-1x fab fa-github'}></i>
        </a>
      </p>
      <div className={styles.container}>
        {/* https://stackoverflow.com/questions/40589302/how-to-enable-file-upload-on-reacts-material-ui-simple-input */}
        {state.token === null ? (
          <label htmlFor="button-file">
            <input
              type="file"
              style={{ display: 'none' }}
              id="button-file"
              onChange={async (e) =>
                setState({ ...state, token: await e.target.files[0].text() })
              }
            />
            <CustomButton
              variant="outlined"
              size="large"
              component="span"
              fullWidth
            >
              Upload Token
            </CustomButton>
          </label>
        ) : (
          <CustomButton variant="outlined" size="large" fullWidth disabled>
            Token Loaded
          </CustomButton>
        )}
        <CustomTextField
          label="Service"
          variant="outlined"
          fullWidth
          inputRef={serviceInputRef}
          value={state.service}
          onChange={(e) => setState({ ...state, service: e.target.value })}
        />
        <CustomTextField
          label="Username"
          variant="outlined"
          fullWidth
          inputRef={usernameInputRef}
          value={state.username}
          onChange={(e) => setState({ ...state, username: e.target.value })}
        />
        <CustomTextField
          label="Master password"
          type="password"
          variant="outlined"
          fullWidth
          inputRef={masterInputRef}
          value={state.master}
          onChange={(e) => setState({ ...state, master: e.target.value })}
        />

        {/* https://stackoverflow.com/questions/58699898/submit-a-form-using-enter-key-with-material-ui-core-button-in-react-js */}
        <CustomSubmitButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          onClick={copyMasterPassword}
        >
          Copy to Clipboard
        </CustomSubmitButton>
      </div>
    </main>
  );
};

export default Main;
