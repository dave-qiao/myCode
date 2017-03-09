import React, {Component, PropTypes} from 'react';
import {Breadcrumb} from 'antd';

const Login_header = React.createClass({
  render() {

    return (
      <div className="login-header">
        <div className='inner'>
          <div className='left'> <span>工作平台</span> </div>
          <a className='right' href='https://aoaosong.com/'>嗷嗷首页</a>
        </div>
      </div>
    );
  }
});

export default Login_header;
