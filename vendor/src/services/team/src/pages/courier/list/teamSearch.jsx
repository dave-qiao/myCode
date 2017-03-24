/**
 * Created by dave on 16/12/31.
 */
import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Row, Col, Select, Modal } from 'antd';
import { Link } from 'dva/router';
import { connect } from 'dva';
import style from '../style/courier.less';
import { getCityNameByCode } from '../../../../../../utils/authHelper';

const [FormItem,Option] = [Form.Item, Select.Option];
const TeamSearch = Form.create()(({ form, searchs, onSearch, onShowItem, data, tabs, visibleCourier, dispatch, business_courier, outsideCourier }) => {
  let { city, teamListDetail }=business_courier;
  let datas = outsideCourier.outsideCourier || [];                // 可添加的骑士列表
  const accountInfo = window.currentAppAccountInfo;
  const { vendor_id }= accountInfo;
  const { getFieldProps, getFieldsValue, resetFields } = form;
  const itemLayout = { "labelCol": { "span": 6 }, "wrapperCol": { "span": 14 } };
  const searchValue = {
    tabs: '',
  };
  if(searchValue.tabs !== tabs){

  }
  const selectProps = {
    getFieldProps,
    getFieldsValue,
    datas
  };

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(getFieldsValue())
  };

  /*确认框展示*/
  function showModal() {
    let visibleCouriers = true;
    const city_code = city;
    dispatch({ type: 'business_courier/checkBox', payload: { visibleCouriers } });
    let team_id = tabs;
    dispatch({ type: 'business_courier/teamAddMember', payload: { vendor_id, team_id, city_code } });
  }

  /*确认框Ok事件*/
  function handleOk() {
    let visibleCouriers = false;
    let courier_ids = addMember.courier_ids;
    let team_id = sessionStorage.getItem('tabs');
    const outsideCourier = [];
    dispatch({ type: 'business_courier/checkBox', payload: { visibleCouriers } });
    dispatch({ type: 'business_courier/addTeamMemeber', payload: { team_id, courier_ids } });
  }

  const addMember = {
    courier_ids: ''
  }

  function optionChange(value) {
    addMember.courier_ids = value;
  }

  /*确认框cancel事件*/
  function handleCancel(e) {
    let visibleCouriers = false;
    dispatch({ type: 'business_courier/checkBox', payload: { visibleCouriers } });
  }

  return (
    <div className="bd-header">
      <Form horizontal className="ant-advanced-search-form" onSubmit={handleSubmit} key="authstr">
        <Input {...getFieldProps("team_id", {
          initialValue: '',
        })} style={{display:'none'}}/>
        <div className={style.courierOverFlow}>
          <div className={`${style.navLeftBorder} ${style.courierRightTitle}`} key={teamListDetail.name}>
            {teamListDetail.name || '请选择团队或者骑士'}&nbsp;({teamListDetail.courier_count || 0})
          </div>
          <FormItem label="" {...itemLayout} className={style.courierRightTitleBt}>
            <Button type="primary" onClick={showModal}>添加成员</Button>
            <Modal title="添加新成员" visible={visibleCourier}
                   onOk={handleOk} onCancel={handleCancel}
                   style={{ top: '35%' }}
            >
              <Row>
                <Col sm={24}>
                  <FormItem label="城市" {...itemLayout}>
                    <div>{getCityNameByCode(city)}</div>
                  </FormItem>
                  <FormItem label="选择成员" {...itemLayout}>
                    <Selected data={datas} onChanges={optionChange}/>
                  </FormItem>
                </Col>
              </Row>
            </Modal>
          </FormItem>
        </div>
        <div className={style.navBottomBorder} style={{ marginBottom: '16px' }}></div>
        <Row >
          <Col sm={8}>
            <FormItem label="姓名" {...itemLayout} >
              <Input {...getFieldProps("name")} {...{ "placeholder": "骑士姓名" }}/>
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="手机号" {...itemLayout} >
              <Input {...getFieldProps("mobile")} {...{ "placeholder": "骑士手机号" }}/>
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="审核状态" {...itemLayout} >
              <Select showSearch
                      optionFilterProp="children" {...getFieldProps("verify_state",{initialValue:''})} {...{ "placeholder": "审核状态" }}>
                <Option value="">全部</Option>
                <Option value="0">待提交</Option>
                <Option value="1">待审核</Option>
                <Option value="100">通过</Option>
              </Select>
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="在岗状态" {...itemLayout} >
              <Select showSearch
                      optionFilterProp="children" {...getFieldProps("work_state",{initialValue:''})} {...{ "placeholder": "在岗状态" }}>
                <Option value="">全部</Option>
                <Option value="100">在岗</Option>
                <Option value="-100">离岗</Option>
              </Select>
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="" {...itemLayout}>
              <Button htmlType="submit">查询</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
});
class Selected extends Component {
  render() {
    const datas = this.props.data;
    const team_id = sessionStorage.getItem('tabs');
    return (
      <div key={`${team_id}---`}>
        <Select showSearch
                style={{ width: 200 }}
                placeholder="请选择骑士"
                optionFilterProp="children"
                onChange={this.props.onChanges}
                key={team_id}
        >{
          datas.map((item, index)=> {
            return (
              <Option value={item.id} key={`${item.id}${team_id}${index}`}>{item.name}</Option>
            )
          })
        }
        </Select>
      </div>
    )
  }
}
function mapStateToProps({ business_courier }) {
  return { business_courier };
};

module.exports = connect(mapStateToProps)(TeamSearch);
