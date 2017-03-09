require('aoao-style-themes/lib/style.css');
import React, { Component, PropTypes } from 'react';
import { Link } from 'dva/router';
import Header from './mainLayout/loginHeader';
import Footer from './mainLayout/loginFooter';
function Login({children}) {
  return (
    <div className="layout-wrapper">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Login;
