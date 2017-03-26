import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';

class View extends Component {
  constructor(props) {
    super();
  }

  componentDidMount=() => {
  }

  render() {
    return (
      <div>
        <div className="bd-header">签约信息</div>
        <div className="bd-content">签约信息详情</div>
      </div>
    );
  }
}

export default View;
