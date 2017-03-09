import React from 'react';
import {Form, Input, InputNumber, Button, Row, Col, Radio, Select, DatePicker} from 'antd';
import {connect} from 'dva';
import {COMPASS} from '../../ActionsName.js';
import Charts from './Charts';
import Stats from './Stats';
import Search from './Search';
const [FormItem,
  ] = [Form.Item];


let View = (topProps) => {
  const {statictics_monito,dispatch} = topProps;
  const {areas, stats_data, couriers_data, shipments_data, imports_data} = statictics_monito
  const searchProps = {
    areas,
    onSearch(fieldsValue) {
      dispatch({type:'', payload: fieldsValue});
    }
  };

  const statsProps = {
    stats_data
  };
  const chartsProps = {
    couriers_data, shipments_data, imports_data
  };
  return (
    <div className="con-body">
      <div className="bd-header"></div>
      <div className="bd-content">
        <Row>
          <Search {...searchProps}/>
          <Stats {...statsProps}/>
          <Charts {...chartsProps} />
        </Row>
      </div>
    </div>
  );
};

function mapStateToProps({statictics_monito}) {
  return {statictics_monito};
};

module.exports =  connect(mapStateToProps)(View);
