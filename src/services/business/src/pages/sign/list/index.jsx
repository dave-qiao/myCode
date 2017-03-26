import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {SIGN} from '../../../ActionsName.js';
import Search from './Search';
import List from './List';
import View_detail from './detail';

class View extends Component {
  constructor(props) {
    super();
    // 从props里面获取信息
    const {dispatch} = props;
    // 将全局获取的服务商ID
    const {vendor_id} = window.currentAppAccountInfo;
    this.seller_id = undefined;//商家ID
    this.state = undefined;//商家状态

    Object.assign(this, {
      dispatch,
      page: 1,
      querys: {vendor_id}
    });
  }
// 搜索函数
  onSearch = (values) => {

    const {dispatch,querys, page} = this;
    this.seller_id = values.seller_id;
    this.state = values.state;
    this.page = 1;
    Object.assign(querys,values);
    // 触发action
    dispatch({type: SIGN.find, payload: {...querys,page}});
  }
// 分页函数
  onPageChange = (page) => {
    const {dispatch, querys} = this;
    this.page = page;
    querys.seller_id = this.seller_id;
    querys.state =  this.state;
    // 默认查询状态是签约
    if(querys.state ==null){
      querys.state = 100; // 分页函数
    }
    // 触发action
    dispatch({type: SIGN.find, payload: {...querys,page}});


  }

  render() {
    // 从props里面获取信息
    const {business_sign, business_public} = this.props;
    // 从model获取details信息
    const {list_tables,list_searchs} = business_sign;
    // 从this里面获取信息
    const {page, onSearch, onPageChange} = this;
    // 搜索组件的参数 要通过props传递到子组件中
    const searchProps = {
      list_searchs,
      onSearch,
      sellers: business_public.sellers
    };
    // 列表组件的参数 要通过props传递到子组件中
    const tableProps = {
      ...list_tables,//列表数据
      onPageChange,//分页函数
      page, //当前页数
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

// 链接model
function mapStateToProps({business_sign,business_public}) {
  return {business_sign,business_public};
};

module.exports =  connect(mapStateToProps)(View);
