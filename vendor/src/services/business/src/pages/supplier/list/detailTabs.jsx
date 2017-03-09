/**
 *  Created by dave
 *  供应商信息模块头部tab
 */
import React, { Component, PropTypes } from 'react';
import { Link } from 'dva/router';
import { Button, Switch, Row, Col, Popconfirm, message, Alert } from 'antd';


class SupplierDetailTab extends Component {
  constructor(props) {
    super(props)
    const { supplierDetail } = this.props;

    this.state = {
      checked: true,
    }
  }

  confirm = ()=> {
    const { supplierDetail } = this.props;

    if (supplierDetail.business_state==-100) {
      this.props.openBusiness();
    } else {
      this.props.closeBusiness();
    }
  };

  cancel = ()=> {
    /*message.error('操作无效');*/
  };

  render() {
    const { supplierDetail, biz_info_id } = this.props;
    return (
      <div>
        <Row type="flex" align={'middle'} justify={'space-between'}>
          <Col sm={12}>
            <Button type="primary"><Link to={"/business/supplier/list/suppliers?id=" + biz_info_id}>供应商信息</Link></Button>
            <Button style={{ margin: '0 20px' }}><Link to={"/business/supplier/list/regionalList?id="+ biz_info_id}>区域列表</Link></Button>
          </Col>
          <Col sm={12} style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-block' }}>{supplierDetail.business_state==100 ?
              <Alert message="已开启业务" type="success" showIcon/> :
              <Alert message="当前未开启业务" type="warning" showIcon/>}&nbsp;&nbsp;
            </div>
            <div style={{ display: 'inline-block' }}>
              <Popconfirm title={supplierDetail.business_state==100?"你确定关闭这项业务吗?" : '你确定开启这项业务吗?'} onConfirm={this.confirm}
                          onCancel={this.cancel} okText="确定" cancelText="取消">
                <a href="#"><Switch checked={supplierDetail.business_state==100?true:false} checkedChildren={'开'} unCheckedChildren={'关'}/></a>
              </Popconfirm>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
module.exports = SupplierDetailTab;
