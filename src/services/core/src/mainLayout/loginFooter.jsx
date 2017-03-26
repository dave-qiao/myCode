import React, {Component, PropTypes} from 'react';
import {Breadcrumb} from 'antd';

const Login_footer = React.createClass({
  render() {

    return (
      <div className="login-footer">
        <div className='inner'>
          <ul className='left'>
            <li>
              <h4>产品</h4>
              <a href="//aoaosong.com/index.html#aoao-01">嗷嗷管家</a>
              <a href="//aoaosong.com/index.html#aoao-02">嗷嗷商家</a>
              <a href="//aoaosong.com/index.html#aoao-03">嗷嗷骑士</a>
            </li>
            <li>
              <h4>帮助</h4>
              <a href="//aoaosong.com/help.html">帮助文档</a>
              <a href="//aoaosong.com/help.html">常见问题</a>
              <a href="//aoaosong.com/help.html">视频教程</a>
            </li>
          </ul>
          <div className='right'>
            <p>北京欧客云科技有限公司旗下产品</p>
            <p>由o3cloud提供计算</p>
          </div>
        </div>
      </div>
    );
  }
});

export default Login_footer;
