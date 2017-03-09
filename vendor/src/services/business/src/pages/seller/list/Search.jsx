import React, {Component, PropTypes} from 'react';
import { Form,Row,Col, Input, Button, Checkbox, Icon, Select } from 'antd';
import { Link } from 'dva/router';

const [FormItem,Option] = [Form.Item,Select.Option];

const Search = Form.create()(({form, searchs, onSearch, onShowItem}) => {
  // 从form里面获取信息
  const { getFieldProps, getFieldsValue } = form;
// 查询函数
  function handleSubmit(e) {
    e.preventDefault();
    let params = getFieldsValue();
    if(params.seller_name === undefined){
      params.seller_name = ''
    }
    if(params.state === undefined){
      params.state = ''
    }
    onSearch(getFieldsValue())
  };
  // 布局配置参数
  const itemLayout = {"labelCol":{"span":4},"wrapperCol":{"span":14}};

  return (
    <Form horizontal className="ant-advanced-search-form" onSubmit={handleSubmit}>
      <Row gutter={24}>
        <Col sm={8}>
          <FormItem label="城市"  {...itemLayout}>
            <Select showSearch  optionFilterProp="children" {...getFieldProps("sign_city")} {...{"placeholder":"请选择城市"}}>
              <Option value="">上海市</Option>
              <Option value="0">北京市</Option>
              <Option value="1">深圳市</Option>
            </Select>
          </FormItem>
          <FormItem label="商户状态"   {...itemLayout}>
            <Select showSearch  optionFilterProp="children" {...getFieldProps("state",{initialValue:'100'})} {...{"placeholder":"商户状态"}}>
              <Option value="">全部</Option>
              <Option value="100">正常</Option>
              <Option value="-100">冻结</Option>
            </Select>
          </FormItem>


        </Col>
        <Col sm={8}>
          <FormItem label="商户号"  {...itemLayout}>
            <Input  {...getFieldProps("code")} {...{"placeholder":"请输入商户号"}}/>
          </FormItem>
          <FormItem label="签约状态"  {...itemLayout}>
            <Select showSearch  optionFilterProp="children" {...getFieldProps("sign_state")} {...{"placeholder":"请选择签约状态"}}>
              <Option value="100">签约</Option>
              <Option value="-100">未签约</Option>
            </Select>
          </FormItem>
          <FormItem  label="" {...itemLayout} >
            <Button htmlType="submit" style={{ marginRight: 20, marginLeft: 20 ,backgroundColor:'rgb(88,226,194)',
              borderColor:'rgb(88,226,194)',color:'#fff'}}>查询</Button>
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="商户名称"   {...itemLayout}>
            <Input {...getFieldProps("name")} {...{"placeholder":"请输入商户名称"}}/>
          </FormItem>
          <FormItem label="审核状态"  {...itemLayout}>
            <Select showSearch  optionFilterProp="children" {...getFieldProps("verify_state")} {...{"placeholder":"审核状态"}}>
              <Option value="">全部</Option>
              <Option value="0">待提交</Option>
              <Option value="1">待审核</Option>
              <Option value="100">通过</Option>
              <Option value="-100">驳回</Option>
            </Select>
          </FormItem>
        </Col>
        </Row>
    </Form>
  );
});

module.exports =  Search;
