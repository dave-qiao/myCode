import React, {Component, PropTypes} from 'react';
import { Form, Row, Col, Menu, Input, Tabs, Button, Badge, Popover, Icon, Checkbox, Table, Select, Pagination, Popconfirm } from 'antd';

import {connect} from 'dva';
import {CONTROL_PANEL} from '../../ActionsName.js';
import HeadSearch from './HeadSearch';
import LeftCourier from './leftCourier';
import RightShipment from './rightShipment';
import ReassignModal from './reassignModal';
const cityDict = appGlobalInfos.city;
class View extends Component {

  constructor(props) {
    super();
    this.dispatch = props.dispatch;
    // 从全局变量中获取相关的信息
    let [accountInfo, userInfo, vendorInfo] = [window.currentAppAccountInfo, window.currentAppUserInfo,window.currentAppVendorInfo];
    this.userInfo = userInfo; //服务商基本信息
    this.accountInfo = accountInfo;//账号信息
    const {vendor_id, account_id} = accountInfo;
    const {city_code} = userInfo;
    const {city_name} = vendorInfo;
    this.city_name = city_name;
    this.account_id = account_id;//账号ID
// 设置内部state
    this.state = {
      selectedRowKeys: [],//行选择符
      curr_courier: {},//当前的骑士
      courier_id:''//骑士的ID
    };
    // 初始化的开关在componentWillReceiveProps用到
    this.initQuery = true;
    /*当前的page*/
    this.page = 1;
// 查询的参数
    this.querys = {
      shipments: {
        state: '1',
        city_code, vendor_id,
      },
      couriers: {
        state: '100',
        vendor_id,
      },
      stats: {
        city_code, vendor_id
      }
    };
  }

  componentWillReceiveProps = (props) => {
    //只做初始化
    if( this.initQuery ) {
      //获取morn的区域ID
      const {default_area_id} = props.tms_control_panel;
      if(default_area_id) {
        this.updateArea_id(default_area_id);
        this.initQuery = false;
      };
    };
  }
// 更新区域ID
  updateArea_id = (area_id) => {
    let querys = this.querys;
    /*['shipments','couriers','stats'].forEach(item => { querys[item].area_id = area_id });*/
    //从列表中移除 'couriers' 的区域请求参数，如果骑士列表需要筛选区域，则需要重新添加该参数
    ['shipments', 'stats'].forEach(item => { querys[item].area_id = area_id }); // Created by dave 17/1/19
  }

  componentDidMount = () => {

  }
// 查询函数
  handleSearch = (values) => {
    Object.assign(this.querys.shipments,values);
    // 执行查询运单的操作
    this.shipmentsQuery();
  }
  // 查询运单函数
  shipmentsQuery = () => {

    const {page} = this;
    let {shipments} = this.querys;

    if(shipments.courier_id === 'all') {
      delete shipments.courier_id;
    };
    this.state.courier_id = shipments.courier_id
    this.shipmentsStatsQuery();
    shipments.is_master = false;
    // 触发action
    this.dispatch({type: CONTROL_PANEL.shipments.query, payload: {...shipments,page}});
  }
// 骑士查询
  couriersQuery = () => {
    this.dispatch({type: CONTROL_PANEL.couriers.query, payload: this.querys.couriers});
  }
// 运单的分状态查询
  shipmentsStatsQuery = () => {
    let params = this.querys.stats;
    if(this.state.courier_id){
      params.courier_id = this.state.courier_id;
    }else{
      delete  params.courier_id;
    }
    this.dispatch({type: CONTROL_PANEL.shipments.stats, payload: this.querys.stats});
  }

  //更新操作
  Allrefresh = () => {
    this.shipmentsQuery();
    this.couriersQuery();
    this.shipmentsStatsQuery();
  }
  //更新各个查询的area_id
  areaChange = (area_id) => {
    console.log(area_id,'area_idarea_idarea_idarea_id------2')
    this.updateArea_id(area_id);
    this.shipmentsQuery();
    this.couriersQuery();
    this.shipmentsStatsQuery();
  }
  //切换订单状态(shipments,state)或者在职状态(couriers,state)  END
  stateChange = (type, value) => {
    this.querys[type].state = value;
    if(type === 'shipments') {
      this.shipmentsQuery();
    } else {
      this.couriersQuery();
    };
  }
  //弹窗显示，存储骑士名称变化   END
  showModal = (record) => {
    this.setState({ curr_courier: record });
    this.dispatch({type: CONTROL_PANEL.modalVisible, payload: {visible: true}});
  }
  //选中或取消之后加入到变量存储中 END
  handleSelect = (selectedRowKeys) => {
    this.setState({selectedRowKeys});
  }
  //单纯的取消后弹窗消失 END
  onCancel = () => {
    this.dispatch({type: CONTROL_PANEL.modalVisible, payload: {visible: false}});
  }
  //取存储的选中shipments和couriers
  onOk = (reason) => {
    const {selectedRowKeys, curr_courier} = this.state;
    const {couriers, shipments} = this.querys;
    const {account_id} = this;
    const reassigns = { reason, selectedRowKeys, curr_courier };
    //改派的同时需要更新 couriers, shipments
    this.dispatch({
      type: CONTROL_PANEL.couriers.reassign,
      payload: { reassigns, couriers, shipments, account_id}
    });
    //清掉缓存
    this.setState({
      selectedRowKeys: [],
      curr_courier: {},
    });
  }
  //翻页
  onPageChange = (page) => {
    this.page = page;
    this.shipmentsQuery();
  }
  render() {
    // 从props里面获取信息
    const {tms_control_panel, dispatch, business_public} = this.props;
    const default_couriers = business_public.couriers || [];
    const {areas, default_area_id, default_area_name, couriers, shipments, visible, shipments_stats } = tms_control_panel;
    const { onPageChange, page, city_name, Allrefresh, handleSearch,  areaChange,  stateChange,  showModal,  handleSelect,  onCancel, onOk, userInfo} = this;
    const {selectedRowKeys, curr_courier} = this.state;
    //行的长度
    const selectedLen = selectedRowKeys.length;
    let areas_data = areas.data|| [];
    // 头部子组件的参数
    const headSerachProp = {
      areas_data,//区域列表
      default_couriers,//默认的骑士
      Allrefresh,//刷新函数
      default_area_id,//默认的区域ID
      default_area_name,//默认的区域名字
      city_name,//城市名字
      areaChange,//切换区域的函数
      handleSearch//头部的搜索函数
    };
    // 左侧骑士组件的参数
    const couriersProps = {
      couriers,//骑士的姓名
      stateChange,//  //切换订单状态(shipments,state)或者在职状态(couriers,state)  END
      selectedLen,//已选择的行的长度
      showModal//显示弹框函数
    };

    // 右侧运单列表组件的参数
    const shipmentProps = {
      shipments,//运单
      page,//当前页
      onPageChange,
      shipments_stats,//运单的状态
      selectedRowKeys,
      stateChange,
      handleSelect
    };
    // 关于改派的参数
    const reassignProps = {
      visible,//弹出框的状态
      curr_courier,//当前的骑士
      onCancel,//取消操作的函数
      selectedLen,//行的长度
      onOk   //确定操作的函数
    };

    return (
      <div className="con-body main-tms_control_panel">
        <div className="bd-header">
          <HeadSearch {...headSerachProp}/>
        </div>
        <div className="bd-content" style={{ height: 'calc(100% - 42px)' }}>
          <LeftCourier {...couriersProps} />
          <RightShipment {...shipmentProps} />
        </div>
        <ReassignModal {...reassignProps}/>
      </div>
    );
  }

}

function mapStateToProps({tms_control_panel,business_public}) {
  return {tms_control_panel, business_public};
};

module.exports = connect(mapStateToProps)(View);
