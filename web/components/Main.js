import React, { Component } from 'react';

import styles from './Main.module.css';

const Main = () => {
  return (
    <main className={styles.Main}>
      <h1>DBLess Password Manager</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <i className={'fa-1x fas fa-qrcode'}></i>
    </main>
  );
};

export default Main;
