import React, {Component, PropTypes} from 'react';
import { Form, Row,Col, Input, Button, Checkbox, Icon, Select, DatePicker, Popover } from 'antd';
import { Link } from 'dva/router';

const [FormItem,Option, RangePicker] = [Form.Item,Select.Option , DatePicker.RangePicker];
// const radioArr = [
//   {
//     "txt": "全部",
//     "val": "7"
//   },
//   {
//     "txt": "已创建",
//     "val": "0"
//   }, {
//     "txt": "已取货",
//     "val": "2"
//   }, {
//     "txt": "未完成",
//     "val": "3"
//   }, {
//     "txt": "异常",
//     "val": "4"
//   }, {
//     "txt": "已送达",
//     "val": "5"
//   }, {
//     "txt": "已关闭",
//     "val": "6"
//   }
// ];
const Search = Form.create()((props) => {

  const { getFieldProps, getFieldsValue } = props.form;
  const {onSearch,areas={data:[]},sellers=[],couriers=[]} = props;
  function handleSubmit(e) {
    e.preventDefault();
    onSearch(getFieldsValue())
  };
  const content1 = (
     <div>
      <p> 1.结算方式：为配送费结算方式； </p>
      <p> 2.配送时效：为送达时间与期望送达时间的差值，带括号的为早达时长 </p>
    </div>
  );
  const itemLayout = {"labelCol":{"span":4},"wrapperCol":{"span":14}};

  return (
    <Form horizontal className="ant-advanced-search-form" onSubmit={handleSubmit}>
          <Row gutter={24}>
                      <Col sm={8}>
                        <FormItem label="区域"  {...itemLayout}>
                          <Select showSearch  placeholder="请选择区域" optionFilterProp="children" {...getFieldProps('area_id')} >
                            <Option value=''>全部</Option>
                            {
                              areas.data.map((item,index) =>{
                                return <Option key={'area' + item.id} value={item.id}>{`${item.name}${item.vendor?`(${item.vendor.name})`:''}`}</Option>
                              })
                            }
                          </Select>
                        </FormItem>
                        <FormItem label="联系电话" {...itemLayout} >
                          <Input {...getFieldProps("consignee_mobile")} {...{"placeholder":"请输入顾客电话"}}/>
                        </FormItem>
                        <FormItem label="日期" style={{marginTop:'10px'}} {...itemLayout}>
                          <RangePicker {...getFieldProps("date_range",{getValueFromEvent:(date, dateString) => dateString})} />
                        </FormItem>
                      </Col>
                      <Col sm={8}>
                        <FormItem label="骑士"   {...itemLayout}>
                          <Select showSearch  optionFilterProp="children"   placeholder= "请选择骑士" {...getFieldProps('courier_id')}  >
                            <Option value=''>全部</Option>
                            {
                              couriers.map((item,index) =>{
                                return <Option key={'courier' + item.id} value={item.id}>{item.name}</Option>
                              })
                            }
                          </Select>
                        </FormItem>
                        <FormItem label="订单编号"  {...itemLayout} >
                          <Input {...getFieldProps("org_order_id")} {...{"placeholder":"请输入订单编号"}}/>
                        </FormItem>
                        <FormItem label=""  {...itemLayout} >
                          <Button type="primary" htmlType="submit" style={{ marginRight: 20, marginLeft: 20 }}>查询</Button>
                        </FormItem>

                      </Col>
                      <Col sm={8}>
                        <FormItem label="商家"  {...itemLayout}  >
                          <Select showSearch  optionFilterProp="children"   placeholder= "请选择商家"  {...getFieldProps('seller_id')} >
                            <Option value=''>全部</Option>
                            {
                              sellers.map((item,index) =>{
                                const seller = item.seller || {};
                                return <Option key={'seller' + index + item.seller_id} value={item.seller_id}>{seller.name}</Option>
                              })
                            }
                          </Select>
                        </FormItem>
                        {/* <FormItem label="运单状态"   {...itemLayout} >
                          <Select showSearch  optionFilterProp="children" placeholder= "请选择运单状态"  {...getFieldProps("state", { initialValue: "" })}>
                            <Option key="state_00" value="">全部</Option>
                            <Option key="state_000" value="0">已创建</Option>
                            <Option key="state_0" value="1">待发布</Option>
                            <Option key="state_2" value="20">已发布</Option>
                            <Option key="state_5" value="50">配送中</Option>
                            <Option key="state_6" value="100">已送达</Option>
                            <Option key="state_8" value="-100">已取消</Option>
                            <Option key="state_7" value="-50">异常</Option>
                          </Select>
                        </FormItem> */}
                        <FormItem label="配送状态"   {...itemLayout} >
                          <Select showSearch  optionFilterProp="children" placeholder= "请选择运单配送状态"  {...getFieldProps("delivery_state", { initialValue: "" })}>
                            <Option key="delivery_state_0" value="">全部</Option>
                            <Option key="delivery_state_1" value="5">已创建</Option>
                            <Option key="delivery_state_2" value="10">待分配</Option>
                            <Option key="delivery_state_3" value="15">已分配</Option>
                            <Option key="delivery_state_4" value="20">已接单</Option>
                            <Option key="delivery_state_5" value="22">已到店</Option>
                            <Option key="delivery_state_6" value="24">已取货</Option>
                            <Option key="delivery_state_8" value="-50">异常</Option>
                            <Option key="delivery_state_9" value="100">已送达</Option>
                            <Option key="delivery_state_10" value="-100">已取消</Option>
                          </Select>
                        </FormItem>
                      </Col>
            </Row>
      <p style={{textAlign: 'right', position: 'relative', height: '0'}}>
        <span style={{ display:'inline-block',position: 'absolute', top: '-20px', right: '20px'}} >
          <Popover content={content1} placement="leftBottom" title="订单详情字段提示">
            <Icon type="question-circle-o" />
          </Popover>
        </span>
      </p>
    </Form>
  );
});

module.exports =  Search;
