import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {DETAIL} from '../../../ActionsName.js';
import Search from './Search';
import List from './List';
import { message, Button } from 'antd';



class View extends Component {
  constructor(props) {
    super();
    const {dispatch} = props;
    const {vendor_id} = window.currentAppAccountInfo;
    const {city_code} = window.currentAppUserInfo;
    Object.assign(this, {
      dispatch,
      page: 1,
      querys: {vendor_id }
    });
  }

  onSearch = (values) => {

    if( values.date_range ) {
      let time1 = '';
      let time2 = '';
      // 计算得来的31天数据相差的毫秒数用来判断的 之后还要转回具体的时间
      let dayCount = '';
      time1 = Date.parse(values.date_range[0]);
      time2 = Date.parse(values.date_range[1]);
      dayCount = (Math.abs(time2 - time1))/1000/60/60/24;
      if(dayCount > 31){
        message.error('日期区间错误，只能查31天的数据')
        return;
      }else{
        values.start_date = values.date_range[0].replace(/-/g,'');
        values.end_date = values.date_range[1].replace(/-/g,'');
        delete values.date_range;
      }
    };
    this.page = 1;
    const {dispatch, page} = this;
    // 聪明的做法
    Object.assign(this.querys,values);
    dispatch({type: DETAIL.find, payload: {...this.querys,page}});
  }

  onPageChange = (page) => {
    const {dispatch, querys} = this;
    this.page = page;
    dispatch({type: DETAIL.find, payload: {...querys,page}});
  }

  render() {
    const {statictics_shipments_detail,business_public} = this.props;
    const {couriers,sellers} = business_public;
    const { list_tables, areas } = statictics_shipments_detail;
    const {page, onSearch, onPageChange} = this;
    const searchProps = {
      areas,
      couriers,
      sellers,
      onSearch
    };
    const tableProps = {
      ...list_tables,
      onPageChange,
      page,
    };

    return (
      <div className="con-body main-list">
        <div className="bd-header">
          <Search {...searchProps} />
        </div>
        <div className="bd-content">
          <List {...tableProps}/>
        </div>
      </div>
    );
  }

};


function mapStateToProps({statictics_shipments_detail, business_public}) {

  return {statictics_shipments_detail, business_public};
};

module.exports =  connect(mapStateToProps)(View);
