//TODO: 未开发
import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {COURIER,COURIER_BILLS_LIST} from '../../../ActionsName.js';
import Search from './Search';
import List from './List';

const View = (topProps) => {
  const {business_courier_bills, dispatch} = topProps;
  const {list_searchs, list_tables} = business_courier_bills;

  const searchProps = {

    onSearch(getFieldsValue) {
      dispatch({type: COURIER_BILLS_LIST.find, payload: getFieldsValue });
    },

  };
  const tableProps = {
    pagination: false,
  };

  return (
    <div className="con-body main-list">
      <div className="bd-header">
        <Search searchProps={searchProps} />
      </div>
      <div className="bd-content">
        <List {...list_tables} {...tableProps}/>
      </div>
    </div>
  );
};


function mapStateToProps({business_courier_bills}) {
  return {business_courier_bills};
};


module.exports =  connect(mapStateToProps)(View);
