import React, { Component, useEffect, useState, useRef } from 'react';
import { Tooltip } from '@material-ui/core';
import CustomButtonOutlined from './CustomButtonOutlined';
import CustomButtonContained from './CustomButtonContained';
import CustomIconButton from './CustomIconButton';
import CustomTextFieldOutlined from './CustomTextFieldOutlined';

import styles from './Main.module.css';

import generatePassword from '../lib/generatePassword';

const Main = () => {
  // initialize state

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

  // token persistence

  const [localStorageToken, setLocalStorageToken] = useState(null);

  useEffect(() => {
    localStorageToken = localStorage.getItem('token');
    setLocalStorageToken(localStorageToken);
  }, []);

  useEffect(() => {
    if (localStorageToken === null) localStorage.removeItem('token');
    else localStorage.setItem('token', localStorageToken);
  }, [localStorageToken]);

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

  const installLinkRef = useRef();

  // PWA installation

  useEffect(() => {
    // https://stackoverflow.com/questions/50762626/pwa-beforeinstallprompt-not-called
    // https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');

    // https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
    installLinkRef.current.classList.add(styles.disabled);
    installLinkRef.current.addEventListener('click', (e) => e.preventDefault());
    window.addEventListener('beforeinstallprompt', (installEvent) => {
      installEvent.preventDefault();
      installLinkRef.current.classList.remove(styles.disabled);

      installLinkRef.current.addEventListener('click', async (e) => {
        e.preventDefault();
        installEvent.prompt();

        const { outcome } = await installEvent.userChoice;
        if (outcome === 'accepted')
          installLinkRef.current.classList.add(styles.disabled);
      });
    });
  }, []);

  // UI

  const run = async () => {
    ['name', 'user', 'master'].forEach((key) =>
      setState((state) => {
        return { ...state, [key]: '' };
      })
    );
    nameInputRef.current.focus();

    navigator.clipboard.writeText(
      await generatePassword(state.name, state.user, state.master, state.token)
    );
  };

  useEffect(() => {
    nameInputRef.current.focus();
  }, [nameInputRef]);

  return (
    <main className={styles.Main}>
      <h1>DBLess</h1>
      <p>
        A hash-based, database-less password manager&nbsp;
        <a
          className={styles.link}
          href="https://github.com/Bricktech2000/DBLess"
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
            <CustomButtonOutlined size="large" component="span">
              Upload Token
            </CustomButtonOutlined>
          </label>
        ) : (
          <div className={styles.tokenButtons}>
            <CustomButtonOutlined size="large" disabled>
              Token Loaded
            </CustomButtonOutlined>
            <Tooltip title="Copy URL with Token Hash" arrow>
              <CustomIconButton
                size="small"
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
                  size="medium"
                  onClick={() => setLocalStorageToken(state.token)}
                >
                  <i className={'fa-1x far fa-bookmark'}></i>
                </CustomIconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Delete from Local Storage" arrow>
                <CustomIconButton
                  size="medium"
                  onClick={() => setLocalStorageToken(null)}
                >
                  <i className={'fa-1x fas fa-bookmark'}></i>
                </CustomIconButton>
              </Tooltip>
            )}
          </div>
        )}
        <CustomTextFieldOutlined
          label="Service"
          inputRef={nameInputRef}
          value={state.name}
          onChange={(e) =>
            setState({ ...state, name: e.target.value.toLowerCase() })
          }
        />
        <CustomTextFieldOutlined
          label="Username"
          inputRef={userInputRef}
          value={state.user}
          onChange={(e) =>
            setState({ ...state, user: e.target.value.toLowerCase() })
          }
        />
        <CustomTextFieldOutlined
          label="Master password"
          type="password"
          inputRef={masterInputRef}
          value={state.master}
          onChange={(e) => setState({ ...state, master: e.target.value })}
        />

        {/* https://stackoverflow.com/questions/58699898/submit-a-form-using-enter-key-with-material-ui-core-button-in-react-js */}
        <CustomButtonContained type="submit" size="large" onClick={run}>
          Copy to Clipboard
        </CustomButtonContained>
        <a className={styles.installLink} ref={installLinkRef} href="#">
          <i className={'fa-1x fas fa-mobile-button'}></i>
          Install App
        </a>
      </div>
    </main>
  );
};

export default Main;
