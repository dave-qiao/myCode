import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';

class Views extends Component {
  constructor(props) {
    super();
  }

  componentDidMount=() => {
  }

  render() {
    return (
      <div>
        <div className="bd-header">商家信息</div>
        <div className="bd-content">商家信息详情</div>
      </div>
    );
  }
}

export default Views;
