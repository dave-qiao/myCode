import React, {Component, PropTypes} from 'react';
import {Form, Button, Row, Col,} from 'antd';
import {connect} from 'dva';
import { Link } from 'dva/router';
const [FormItem] = [Form.Item];
const citesDict = window.appGlobalInfos.city;
const {stateTransform, numberDateToStr, utcToDate} = window.tempAppTool;

class View extends React.Component {

  constructor(props) {
    super();
    this.willInit = true;
    this.center_flag = {
      city: false,
      region: false,
    };
    let {city_code,city_name} = window.currentAppVendorInfo;
    const {vendor_id} = window.currentAppAccountInfo;
    Object.assign(this,{city_code, vendor_id, city_name});
  }

  componentWillReceiveProps(props) {
    const {list_details} = props.business_area;
    const {city_name, city_code} = this;
    //区域定位
    if(list_details.region_find_done && !this.center_flag.region) {
      let {regions} = list_details;
      //城市定位
      if(regions.length === 0) {
        this.myMap.centerAndZoom(city_name, 15);
        this.center_flag.region = true;
      } else {
        const firstPoint = regions[0][0][0];
        const _point = new BMap.Point(firstPoint[0],firstPoint[1]);
        this.myMap.centerAndZoom(_point, 15);
        this.center_flag.region = true;
      };
    };
    if(this.willInit && list_details.regions.length !== 0) {
      let {regions} = list_details;
      const {createPolygon, myMap} = this;
      //关闭初始化
      this.willInit = false;
      //🌹区域，绑定移除按钮
      regions.map( (item1, index) => {
        let currOverlay = createPolygon(item1[0]);
        myMap.addOverlay(currOverlay);
      });
    }


  }


  componentDidMount() {
    //初始化地图
    this.myMap = new BMap.Map('map');
    this.myMap.enableScrollWheelZoom(true);
  }

  componentWillUnmount() {
    const {myMap} = this;
    myMap.clearOverlays();
  }

  //画多边形
  createPolygon = (arr) => {
    return new BMap.Polygon(
      arr.map( item => new BMap.Point(item[0],item[1])),
      {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5}
    );
  }

  render() {
    const {list_details} = this.props.business_area;
    let _created_at = '';

    if(list_details.created_at &&  list_details.created_at.length !== 0) {
      const _date1 = utcToDate(list_details.created_at);
      _date1.time.length = 2;
      _created_at = `${_date1.date.join('-')}  ${_date1.time.join(':')}`;
    };

    return (
      <div className="con-body">
        <div className="bd-header"></div>
        <div className="bd-content">
          <Form horizontal  className="main-form">
            <h3 className="form-divider-header">基本信息</h3>
            <Row>
              <Col sm={12}>
                <FormItem label="区域名称" {...{ labelCol:{span:4}, wrapperCol: {span:12}}}>
                  <p>{list_details.name}</p>
                </FormItem>
                <FormItem label="状态" {...{ labelCol:{span:4}, wrapperCol: {span:12}}}>
                  <p>{stateTransform('area_state',list_details.state)}</p>
                </FormItem>

                <FormItem label="负责人" {...{ labelCol:{span:4}, wrapperCol: {span:12}}}>
                  <p>{list_details.master}</p>
                </FormItem>
                <FormItem label="联系电话" {...{ labelCol:{span:4}, wrapperCol: {span:12}}}>
                  <p>{list_details.mobile}</p>
                </FormItem>
                <FormItem label="创建时间" {...{ labelCol:{span:4}, wrapperCol: {span:12}}}>
                  <p>{_created_at}</p>
                </FormItem>
                {/*<FormItem label="创建人" {...{ labelCol:{span:4}, wrapperCol: {span:12}}}>*/}
                  {/*<p>{list_details.mobile}</p>*/}
                {/*</FormItem>*/}
              </Col>
            </Row>
            <h3 className="form-divider-header">配送区域</h3>
            <Row type="flex" justify="center" align="top">
              <div id="map" style={{margin:'10px',width:'80%',boxSizing:'border-box',height:'500px'}}></div>

              <Col sm={5}>
                <Button ><Link to="/business/area/list">返回</Link></Button>
              </Col>
            </Row>

          </Form>
        </div>
      </div>
    );
  }
};



function mapStateToProps({business_area,business_public}) {
  return {business_area,business_public};
};

module.exports =  connect(mapStateToProps)(View);
