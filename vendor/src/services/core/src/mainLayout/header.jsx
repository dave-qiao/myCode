import React, { Component, PropTypes } from 'react';
import { Row, Col, Menu, Dropdown, Button, Popover, Icon } from 'antd';
import AraleQRCode from 'arale-qrcode';
import { connect } from 'dva';
class Layout_header extends Component {
  constructor() {
    super();
    this.qrcodeState = false;
  }

  // Created by dave 2017/2/22 解决登出后 window上的账户数据
  onClick = () => {
    //暂时只是清除本地存储 需要发送请求
    window.localStorage.clear();
    window.sessionStorage.clear();
    // 清除window 上的账户数据
    window.currentAppVendorInfo = null;
    window.currentAppUserInfo = null;
    window.location.href = '/#/login';
  };

  render() {
    const { business_public } = this.props;
    let qrcodeState = this.qrcodeState;
    const menu = (
        <Menu onClick={this.onClick}>
          <Menu.Item key="1">退出</Menu.Item>
        </Menu>
    );
    let qrnode = null;
    if (business_public.apk_url) {
      qrnode = new AraleQRCode({
        text: business_public.apk_url,
        size: 140,
      });
    }

    if (document.querySelector('#aoao-app-qrcode') && qrnode) {
      const con_qrcode = document.querySelector('#aoao-app-qrcode');
      con_qrcode.innerHTML = null;
    }

    function showQrcode(state) {
      if (state && !qrcodeState) {
        const coe_qrcode = document.querySelector('#aoao-app-qrcode');
        qrnode.innerHTML = '';
        coe_qrcode.appendChild(qrnode);
        qrcodeState = true;
      }
    }
    const content = (<div id="aoao-app-qrcode" />);

    /*const {name} = window.currentAppUserInfo;*/  // Fix by dave 2017/2/22

    // Created by dave 2017/2/22   (start)
    const userInfo = window.getStorageItem('userInfo');
    const { name } = JSON.parse(userInfo);
    // Created by dave (end)

    return (
      <div className="layout-header">
        <Row type="flex" justify="end">
          <Col span={10} />
          <Col span={14} className="user-box">
            <Popover content={content} onVisibleChange={showQrcode} placement="bottomRight">
              <Button icon="qrcode" >骑士APP</Button>
            </Popover>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" style={{ color: 'rgb(88,226,194)', marginLeft:'10px' }}>
                <Icon type="user" />{name}<Icon type="caret-down" />
              </a>
            </Dropdown>
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ business_public }) {
  return { business_public };
}

module.exports = connect(mapStateToProps)(Layout_header);
