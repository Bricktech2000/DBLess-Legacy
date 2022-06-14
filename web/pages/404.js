import React, { Component } from 'react';
import { useRouter } from 'next/router';

const Error404 = () => {
  const router = useRouter();
  process.browser && router.replace('/');

  return null;
};

export default Error404;
