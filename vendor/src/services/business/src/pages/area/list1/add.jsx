import React, {Component, PropTypes} from 'react';
import {Form, Input, InputNumber, Button, Row, Col, Radio, DatePicker, message} from 'antd';
import {connect} from 'dva';
import { Link } from 'dva/router';
import {AREA} from '../../../ActionsName.js';

const [FormItem, RadioGroup, RangePicker] = [Form.Item, Radio.Group, DatePicker.RangePicker];
const citesDict = window.appGlobalInfos.city;
class MainForm extends React.Component {

  constructor(props) {
    super();
    this.ownOverlays = [];
    let {city_code,city_name} = window.currentAppVendorInfo;
    const {vendor_id} = window.currentAppAccountInfo;
    if(typeof city_name === 'undefined' || city_name === '') {
      try {
        city_name = citesDict.data[citesDict.index.indexOf(city_code)].name;
      } catch (e) {
        const _len = citesDict.data;
        city_name = '';
        for(let i = 0; i < _len; i++) {
          if(citesDict.data[i]._id === city_code) {
            city_name = citesDict.data[i].name;
          };
        };
      } finally {
        if(city_name.length === 0) {
          console.error('该城市无法找到，默认北京市');
          city_name = '北京市';
        };
      };
      window.currentAppVendorInfo.city_name = city_name;
    };

    Object.assign(this,{city_code, vendor_id, city_name});
  }

  componentDidMount() {
    const {city_name} = this;
    this.myMap = new BMap.Map('map');
    this.myMap.centerAndZoom(city_name, 15);
    this.myMap.enableScrollWheelZoom(true);
    this.myGeo = new BMap.Geocoder();
    this.drawingManager = new BMapLib.DrawingManager(this.myMap, {
        isOpen: false,
        drawingType: BMAP_DRAWING_POLYGON,
        enableDrawingTool: false,
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            offset: new BMap.Size(5, 5),
            drawingModes: [BMAP_DRAWING_POLYGON]
        },
        polygonOptions: {strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5},
    });
    const {drawingManager, ownOverlays, bindMenu} = this;
    drawingManager.addEventListener("overlaycomplete", function (e) {
        drawingManager.close();
        e.overlay.tempIndex = ownOverlays.length;
        e.overlay.enableEditing();
        bindMenu(e.overlay);
        ownOverlays.push(e.overlay);
    });
  }

  componentWillUnmount() {
    const {myMap} = this;
    myMap.clearOverlays();
  }

  bindMenu = (currOverlay) => {
    const {removeArea} = this;
    let markerMenu = new BMap.ContextMenu();
    markerMenu.addItem(new BMap.MenuItem('删除', function (e) {
      removeArea(currOverlay);
    }));
    currOverlay.addContextMenu(markerMenu);
  }

  positioning = (e) => {
    const {validateFields, getFieldValue} = this.props.form;
    const {city_name} = this;
    const {myMap, myGeo} = this;
    const _address = getFieldValue('address');
    let topThis = this;
    if (typeof topThis.position_point !== 'undefined') {
      myMap.removeOverlay(topThis.position_point);
    };
    myGeo.getPoint(city_name + _address, function(point){
		if (point) {
        topThis.position_point = new BMap.Marker(point);
  			myMap.centerAndZoom(point, 16);
  			myMap.addOverlay(topThis.position_point);
  		}else{
  			message.info("您选择地址没有解析到结果,请重新输入!");
  		}
  	}, city_name);
  }

  addArea = (e) => {
    const {drawingManager} = this;
    drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
    drawingManager.open();
  }

  removeArea = (currOverlay) => {
    const {ownOverlays, myMap} = this;
    const _index = currOverlay.tempIndex;
    ownOverlays.splice(_index,1);
    myMap.removeOverlay(currOverlay);
    ownOverlays.forEach( (item,index) => {
      item.tempIndex = index;
    });

  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {didSubmit, form} = this.props;
    const {ownOverlays} = this;
    const {city_code, vendor_id} = this;
    const {getFieldsValue,validateFields} = this.props.form;
    validateFields((err,value) => {
      if (err) {
        return ;
      } else {
        let values = form.getFieldsValue();
        const regions = ownOverlays.map( item1 => {
          return item1.ia.map( item2 => {
            return [item2.lng,item2.lat];
          });
        });
        didSubmit({ ...values, regions, city_code, vendor_id });
      };
    });

  }

  render() {
    const {business_area, business_public, form} = this.props;
    let {city_name, city_code} = this;
    const {getFieldProps, getFieldsValue} = form;
    const itemLayout = {"labelCol":{"span":4},"wrapperCol":{"span":12}};
    return (
      <Form horizontal onSubmit={this.handleSubmit} className="main-form">
        <h3 className="form-divider-header">基本信息</h3>
        <Row type="flex" justify="center" align="top">
          <Col sm={10}>
              <FormItem label="区域名称" {...itemLayout}>
                <Input {...getFieldProps("name", {
                  validate: [
                    { rules: [ { required: true, message: '请输入区域名称'}, ], trigger: 'onBlur', }
                  ]
                })}/>
              </FormItem>

              <FormItem label="负责人" {...itemLayout}>
                <Input {...getFieldProps("master", {
                  validate: [
                    { rules: [ { required: true, message: '请输入负责人'}, ], trigger: 'onBlur', }
                  ]
                })} />
              </FormItem>

              <FormItem label="联系电话" {...itemLayout}>
                <Input {...getFieldProps("mobile",{
                  rules: [
                    {
                      required: true,
                      trigger: 'onBlur',
                      validator: (rule, value, callback) => {
                        if(!value) { callback('请填写手机号'); return ; };
                        if (!(/^1[34578]\d{9}$/.test(value))) { callback('手机格式不对'); return ; }
                        callback();
                      },
                    }
                  ],
                })} />
              </FormItem>
          </Col>
          <Col sm={10}></Col>
        </Row>
        <h3 className="form-divider-header">配送区域</h3>
        <Row type="flex" justify="center" align="top">
          <Col sm={10}>
          <FormItem {...{"labelCol":{"span":0},"wrapperCol":{"span":22}}}>
            <Input addonBefore={city_name}  {...getFieldProps("address")} />
          </FormItem>
          </Col>
          <Col sm={10}>
            <Button onClick={() => this.positioning()} style={{marginRight:'10px'}}>定位</Button>
            <Button onClick={() => this.addArea()}>画区域</Button>
          </Col>
        </Row>
        <Row  type="flex" justify="center" align="top">
          <div id="map" style={{margin:'10px',width:'80%',boxSizing:'border-box',height:'500px'}}></div>
        </Row>
        <Row  type="flex" justify="center" align="top">
          <Button ><Link to="/business/area/list">取消</Link></Button>
          <Button type="primary" htmlType="submit">确定</Button>
        </Row>
      </Form>
    )
  }
};

MainForm = Form.create()(MainForm);



let View = ({business_area, business_public, dispatch}) => {
  const formProps = {
    business_area,
    business_public,
    didSubmit(values) {
      dispatch({
        type: AREA.creates,
        payload: values
      })
    }
  }

  return (
    <div className="con-body">
      <div className="bd-header"></div>
      <div className="bd-content">
        <MainForm {...formProps}/>
      </div>
    </div>
  );
};

function mapStateToProps({business_area,business_public}) {
  return {business_area,business_public};
};

module.exports =  connect(mapStateToProps)(View);
