import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {EMPLOYEE} from '../../../ActionsName.js';
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
      querys: { org_id:vendor_id }
    });
  }

  onSearch = (values) => {
    this.code = values.code;
    this.mobile = values.mobile;
    this.name = values.name;
    this.state = values.state;
    this.page = 1;
    /*this.type=values.type;*/
    const {dispatch, page} = this;
    Object.assign(this.querys,values);
    dispatch({type: EMPLOYEE.find, payload: {...this.querys,page}});
  }

  onPageChange = (page) => {
    const {dispatch, querys} = this;
    querys.code = this.code
    querys.mobile = this.mobile
    querys.name = this.name
    querys.state = this.state
    if(querys.state ==null){
      querys.state = 100;
    }
    this.page = page;
    dispatch({type: EMPLOYEE.find, payload: {...querys,page}});
  }

  render() {
    const {business_employee, business_publics} = this.props;
    const {list_searchs, list_tables} = business_employee;
    const {page, onSearch, onPageChange} = this;
    const searchProps = {
      onSearch,
      areas: business_publics.areas
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


function mapStateToProps({business_employee,business_publics}) {
  return {business_employee,business_publics};
};

module.exports =  connect(mapStateToProps)(View);
