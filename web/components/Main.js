import React, { Component, useEffect, useState, useRef } from 'react';
import { TextField, Button, Tooltip, IconButton } from '@material-ui/core';
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

const CustomButtonOutlined = withStyles({
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

const CustomButtonContained = withStyles({
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

const CustomIconButton = withStyles({
  root: {
    '&': {
      color: 'var(--gray1)',
    },
    '&:hover': {
      color: 'var(--gray2)',
    },
  },
})(IconButton);

const Main = () => {
  const [localStorageToken, setLocalStorageToken] = useState(null);

  useEffect(() => {
    localStorageToken = localStorage.getItem('token');
    setLocalStorageToken(localStorageToken);
  }, []);

  useEffect(() => {
    if (localStorageToken === null) localStorage.removeItem('token');
    else localStorage.setItem('token', localStorageToken);
  }, [localStorageToken]);

  // https://github.com/mui/material-ui/issues/7247
  // https://stackoverflow.com/questions/29791721/how-get-data-from-material-ui-textfield-dropdownmenu-components
  const nameInputRef = useRef();
  const userInputRef = useRef();
  const masterInputRef = useRef();
  const [state, setState] = useState({
    token: null,
    name: '',
    user: '',
    master: '',
  });

  useEffect(() => {
    nameInputRef.current.focus();
  }, [nameInputRef]);

  useEffect(() => {
    if (window.location.hash !== '') {
      try {
        state.token = Buffer.from(
          window.location.hash.substring(1),
          'base64'
        ).toString();
        setState({
          ...state,
          token: state.token,
        });
      } catch (e) {
        console.log(e);
      }
      // https://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-url-with-javascript-without-page-r
      history.replaceState(null, null, ' ');
    } else {
      if (state.token === null)
        setState({
          ...state,
          token: localStorageToken,
        });
    }
  }, []);

  const run = async () => {
    ['name', 'user', 'master'].forEach((key) =>
      setState((state) => {
        return { ...state, [key]: '' };
      })
    );
    nameInputRef.current.focus();

    // z85 spec:
    // https://rfc.zeromq.org/spec/32/
    // https://github.com/zeromq/rfc/blob/master/src/spec_32.c

    const encode = (bytes) => {
      var out = '';
      const table =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#';
      var value = 0;
      for (var i = 0; i < bytes.length; i++) {
        // make 32-bit integer
        value = value * 256 + bytes[i];
        if (i % 4 == 3) {
          // convert to printable characters using Z85
          var divisor = Math.pow(85, 4);
          while (divisor) {
            out += table[Math.floor((value / divisor) % 85)];
            divisor = Math.floor(divisor / 85);
          }
          value = 0;
        }
      }
      return out;
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#examples
    const join = async (...args) => {
      const xor = (a, b) => a.map((x, i) => x ^ b[i]);

      return (
        await Promise.all(
          args
            .map((arg) => new TextEncoder().encode(arg))
            .map((data) => crypto.subtle.digest('SHA-1', data))
        )
      )
        .map((arr) => new Uint8Array(arr))
        .reduce(xor, new Uint8Array(20));
    };

    const digest = Array.from(
      new Uint8Array(
        await crypto.subtle.digest(
          'SHA-256',
          await join(state.name, state.user, state.master, state.token)
        )
      )
    );
    // .map((b) => b.toString(16).padStart(2, '0'))
    // .join('')
    const password = encode(digest);

    navigator.clipboard.writeText(password);
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
          rel="noreferrer"
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
                setState({
                  ...state,
                  token: (await e.target.files[0].text()).trim(),
                })
              }
            />
            <CustomButtonOutlined
              variant="outlined"
              size="large"
              component="span"
              fullWidth
            >
              Upload Token
            </CustomButtonOutlined>
          </label>
        ) : (
          <div className={styles.tokenButtons}>
            <CustomButtonOutlined
              variant="outlined"
              size="large"
              fullWidth
              disabled
            >
              Token Loaded
            </CustomButtonOutlined>
            <Tooltip title="Copy URL with Token Hash" arrow>
              <CustomIconButton
                variant="outlined"
                size="small"
                fullWidth
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.href}#${Buffer.from(
                      state.token
                    ).toString('base64')}`
                  )
                }
              >
                <i className={'fa-1x fas fa-link'}></i>
              </CustomIconButton>
            </Tooltip>
            {localStorageToken === null ? (
              <Tooltip title="Save to Local Storage" arrow>
                <CustomIconButton
                  variant="outlined"
                  size="medium"
                  fullWidth
                  onClick={() => setLocalStorageToken(state.token)}
                >
                  <i className={'fa-1x far fa-bookmark'}></i>
                </CustomIconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Delete from Local Storage" arrow>
                <CustomIconButton
                  variant="contained"
                  size="medium"
                  fullWidth
                  onClick={() => setLocalStorageToken(null)}
                >
                  <i className={'fa-1x fas fa-bookmark'}></i>
                </CustomIconButton>
              </Tooltip>
            )}
          </div>
        )}
        <CustomTextField
          label="Service"
          variant="outlined"
          fullWidth
          inputRef={nameInputRef}
          value={state.name}
          onChange={(e) =>
            setState({ ...state, name: e.target.value.toLowerCase() })
          }
        />
        <CustomTextField
          label="Username"
          variant="outlined"
          fullWidth
          inputRef={userInputRef}
          value={state.user}
          onChange={(e) =>
            setState({ ...state, user: e.target.value.toLowerCase() })
          }
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
        <CustomButtonContained
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          onClick={run}
        >
          Copy to Clipboard
        </CustomButtonContained>
      </div>
    </main>
  );
};

export default Main;
