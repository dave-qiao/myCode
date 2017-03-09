import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {AREA} from '../../../ActionsName.js';
import Search from './Search';
import List from './List';


class View extends Component {
  constructor(props) {
    super();
    const {dispatch} = props;
    const {vendor_id} = window.currentAppAccountInfo;
    Object.assign(this, {
      dispatch,
      page: 1,
      querys: { vendor_id }
    });
  }

  onSearch = (values) => {
    console.log('area_values',values)

    this.page = 1;
    const {dispatch, page} = this;
    // 将获取到的值添加到query值里面去
    // this.name = values.name;
    // this.state = values.state;
    Object.assign(this.querys,values);
    dispatch({type: AREA.find, payload: {...this.querys,page}});
  }

  onPageChange = (page) => {
    const {dispatch, querys} = this;
    this.page = page;
    // querys.name = this.name;
    // querys.state =  this.state;
    if(querys.state ==null){
      querys.state = 100;
    }
    dispatch({type: AREA.find, payload: {...querys,page}});
  }

  render() {
    const {business_area, business_public} = this.props;
    const {list_searchs, list_tables} = business_area;
    const {page, onSearch, onPageChange} = this;
    const searchProps = {
      onSearch,
      areas: business_public.areas
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




function mapStateToProps({business_area,business_public}) {
  return {business_area,business_public};
};

module.exports =  connect(mapStateToProps)(View);
