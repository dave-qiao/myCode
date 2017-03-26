/**
 *  Created by dave
 *  区域列表
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import RegionalTabs from './regionalTabs';
import Search from './regionaldetail';
import RegionAlDetailList from './regionalDetailList';
class RegionalList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'regional'
    }
  }

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
      payload: supplierDetail,
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
      payload: supplierDetail,
    })
  };

  onChange = (value)=> {
    const { dispatch } = this.props;
    const city_code = value;
    dispatch({
      type: 'changeCityCodeR',
      payload: { city_code },
    })

  };

  // 根据条件查询区域合作列表
  areaSearch = ()=> {
    const { supplierModel, dispatch } = this.props;
    const { city_code } = supplierModel;
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const supply_vendor_id = sessionStorage.getItem('supply_vendor_id');
    const limit = 10;
    const page = 1;
    dispatch({
      type: 'getAreaStateE',
      payload: { vendor_id, supply_vendor_id, city_code, page, limit, },
    })
  };

  // 增加区域合作
  addArea = () => {
    let { supplierModel, dispatch }=this.props;
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const { city_code } = supplierModel;
    const is_filter_sub_area = true;
    const state = 100;
    const limit = 500;
    dispatch({
      type: 'getAddAreaE',
      payload: { vendor_id, city_code, is_filter_sub_area, state, limit },
    })
  };

  //分页
  pageChange = (page) => {
    const { supplierModel, dispatch } = this.props;
    const { city_code, supply_vendor_id } = supplierModel;
    const limit = 10;
    dispatch({
      type: 'getAreaStateE',
      payload: { supply_vendor_id, city_code, page, limit, },
    })
  };

  // 提交增加的区域信息
  addSubmit = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'submitAddE',
      payload: { values },
    })
  };

  // 编辑信息
  edit = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'editAreaE',
      payload: { values },
    })
  };

  // 根据不同的城市获取相应的区域列表
  addAreaCityChange = (value) => {
    const { dispatch } = this.props;
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const city_code = value;
    const is_filter_sub_area = true;
    const state = 100;
    const limit = 500;
    dispatch({
      type: 'getAddAreaE',
      payload: { vendor_id, city_code, is_filter_sub_area, state, limit },
    })

  };

  render() {
    const { supplierModel, dispatch } = this.props;
    const { biz_info_id, areaList, addAreaList, supplierDetail, serviceCityList, city_code  } = supplierModel;
    let propsData = {
      biz_info_id,
      areaList,
      dispatch,
      addAreaList,
      supplierDetail,
      serviceCityList,
      city_code,
    };
    return (
      <div className="con-body main-list">
        <div className="bd-header">
          <RegionalTabs {...propsData} closeBusiness={this.closeBusiness} openBusiness={this.openBusiness}/>
        </div>
        <div className="bd-content">
          <Search {...propsData} areaSearch={this.areaSearch} add={this.addArea} onChange={this.onChange}
                  addSubmit={this.addSubmit}
                  addAreaCityChange={this.addAreaCityChange}
          />
          <div style={{ height: 16 }}></div>
          <RegionAlDetailList {...propsData} page={this.pageChange} edit={this.edit}/>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ supplierModel }) {
  return { supplierModel }
}
module.exports = connect(mapStateToProps)(RegionalList);
