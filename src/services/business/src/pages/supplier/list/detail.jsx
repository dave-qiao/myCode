/**
 *  Created by dave
 *  供应商信息模块
 */
import React, { Component, PropTypes } from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { Button, Switch, Row, Col } from 'antd';
import SupplierDetailTab from './detailTabs';
import SupplierDetailList from './detailList';
class SupplierDetail extends Component {
  constructor(props) {
    super(props)
    let { formData }=props.supplierModel;
  }

  // 编辑
  edit = (values) => {
    const { dispatch, supplierModel } = this.props;
    const { supplierDetail }= supplierModel;
    const biz_info_id = supplierDetail.id;
    dispatch({
      type: 'editSupplierDetailE',
      payload: { biz_info_id, values },
    })
  };

  // 关闭业务
  closeBusiness = () => {
    const { dispatch, supplierModel } = this.props;
    const { supplierDetail }= supplierModel;
    const biz_info_id = supplierDetail.id;
    supplierDetail.business_state = -100;
    dispatch({
      type: 'closeBusinessE',
      payload: { biz_info_id },
    })
    dispatch({
      type: 'getSupplierDetailR',
      payload: supplierDetail ,
    })
  };

  // 开启业务
  openBusiness = () => {
    const { dispatch, supplierModel } = this.props;
    const { supplierDetail }= supplierModel;
    const biz_info_id = supplierDetail.id;
    supplierDetail.business_state = 100;
    dispatch({
      type: 'openBusinessE',
      payload: { biz_info_id },
    })
    dispatch({
      type: 'getSupplierDetailR',
      payload: supplierDetail ,
    })
  };

  render() {
    let { supplierDetail, biz_info_id }=this.props.supplierModel;
    const propsData = {
      supplierDetail,
      biz_info_id
    }
    return (
      <div className="con-body main-list">
        <div className="bd-header">
          <SupplierDetailTab {...propsData} closeBusiness={this.closeBusiness} openBusiness={this.openBusiness}/>
        </div>
        <div>
          <SupplierDetailList {...propsData} edit={this.edit}/>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ business_public, supplierModel }) {
  return { business_public, supplierModel }
}

module.exports = connect(mapStateToProps)(SupplierDetail);
