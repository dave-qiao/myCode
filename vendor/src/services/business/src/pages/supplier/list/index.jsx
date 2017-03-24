/**
 *  Created by dave
 *  业务中心供应商管理列表
 */
import React, { Component, PropTypes } from 'react';
import { Select, BUtton, Row, Col, Input } from 'antd';
import { connect } from 'dva';
import SupplierDetail from './detail';
import RegionalList from './regionalList';
import SupList from './supplierList';
import Search from './search';
class Supplier extends Component {
  constructor(props) {
    super()
    this.state = {
      VendorSupplierList:[],
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const { VendorSupplierList } = nextProps.supplierModel;
    this.setState({
      VendorSupplierList: VendorSupplierList,
    })
  };

  // 保存供应商Id
  saveIds = (biz_info_id, supply_vendor_id, city_code) => {
    sessionStorage.setItem('biz_info_id', biz_info_id);
    sessionStorage.setItem('supply_vendor_id', supply_vendor_id);
    const { dispatch } = this.props;
    dispatch({
      type: 'saveIdR',
      payload: { biz_info_id },
    });

    dispatch({
      type: 'changeCityCodeR',
      payload: { city_code },
    })
  };

  // 添加供应商获取可用供应商列表
  addSupplier = () => {
    const { dispatch, supplierModel } = this.props;
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const userInfo = window.getStorageItem('userInfo') || '{}';
    const { city_code } = supplierModel;
    const state = 100;
    const verify_state = 100;
    dispatch({
      type: 'getVendorSupplierE',
      payload: { city_code, state, verify_state },
    })
  };

  // 提交添加供应商信息
  addSubmit = (values) => {
    const { dispatch, supplierModel } = this.props;
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const { city_code } = supplierModel;
    values.vendor_id = vendor_id;
    dispatch({
      type: 'addSupplierE',
      payload: { values, city_code },
    })
  };

  // 根据条件查询供应商列表
  supplierSearch = ()=> {
    let { supplierModel, dispatch }=this.props;
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const { city_code } = supplierModel;
    const page = 1;
    const limit = 10;
    dispatch({
      type: 'getSupplierListE',
      payload: { vendor_id, city_code, page, limit},
    })
  };

  // 根据条件查询区域合作列表
  areaSearch = ()=> {
    let { supplierModel, dispatch }=this.props;
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const { city_code } = supplierModel;
    const supply_vendor_id = window.sessionStorage.getItem('supply_vendor_id');
    const page = 1;
    const limit = 10;
    dispatch({
      type: 'getSupplierListE',
      payload: { vendor_id, city_code, page, limit},
    })
  };


  render() {
    let { supplierModel, dispatch }=this.props;
    let { city_code, visible, supplierList, VendorSupplierList, serviceCityList }=supplierModel;
    const searchProps = {
      city_code,
      visible,
      dispatch,
      supplierList,
      VendorSupplierList,
      serviceCityList,
    };
    const suplistProps = {
      city_code,
      visible,
      dispatch,
      supplierList,
      serviceCityList,
    };
    return (
      <div className="con-body main-list">
        <div className="bd-header">
          <Search {...searchProps} add={this.addSupplier} addSubmit={this.addSubmit}
                  supplierSearch={this.supplierSearch}
                  areaSearch={this.areaSearch}
          />
        </div>
        <div className="bd-content">
          <SupList {...suplistProps} saveId={this.saveIds}/>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ supplierModel }) {
  return { supplierModel }
}
module.exports = connect(mapStateToProps)(Supplier);
