//TODO: 未开发
import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {WALLET} from '../../ActionsName.js';
import Info from './Info';
import List from './List';

const View = (topProps) => {
  const {business_seller_wallet, dispatch} = topProps;
  const {details, trans_logs} = business_seller_wallet;

  const searchProps = {
    details,
    onSearch(fieldsValue) {
      dispatch({type: WALLET.find, payload: fieldsValue});
    }
  };
  const tableProps = {
    pagination: false,
  };

  return (
    <div className="con-body main-list">
      <div className="bd-header">
        <Info {...searchProps} />
      </div>
      <div className="bd-content">
      </div>
    </div>
  );
};
// <List {...list_tables} {...tableProps}/>

function mapStateToProps({business_seller_wallet}) {
  return {business_seller_wallet};
};

module.exports =  connect(mapStateToProps)(View);
