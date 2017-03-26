import React, { Component, PropTypes } from 'react';
import {Form, Input, Button, Checkbox, Icon, Select, Row, Col} from 'antd';
import {Link} from 'dva/router';

const [FormItem,Option] = [Form.Item, Select.Option];
const Search = Form.create()(({form, searchs, onSearch, onShowItem}) => {
  const {getFieldProps, getFieldsValue} = form;

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(getFieldsValue());
  };

  return (
    <div className="reset-bg-white">
      <Form inline onSubmit={handleSubmit}>
        <Row type="flex" align="middle" justify="space-between">
          <Col span={6} style={{textAlign: 'right', marginBottom: '24px'}}>
            <FormItem label="姓名">
              <Input {...getFieldProps("name")} {...{"style": {"width": 200}, "placeholder": "员工姓名"}}/>
            </FormItem>
          </Col>
          <Col span={6} style={{textAlign: 'right', marginBottom: '24px'}}>
            <FormItem label="手机号">
              <Input {...getFieldProps("mobile")} {...{"style": {"width": 200}, "placeholder": "员工手机"}}/>
            </FormItem>
          </Col>
          <Col span={6} style={{textAlign: 'right', marginBottom: '24px'}}>
            <FormItem label="工号">
              <Input {...getFieldProps("code")} {...{"style": {"width": 200}, "placeholder": "员工工号"}}/>
            </FormItem>
          </Col>
          <Col span={6} style={{textAlign: 'right', marginBottom: '24px'}}>
            <FormItem label="员工状态">
              <Select showSearch optionFilterProp="children" {...getFieldProps("state", {initialValue: '100'})} {...{
                "style": {"width": 200, "textAlign": "left"},
                "placeholder": "员工状态"
              }}>

                <Option value="">全部</Option>

                <Option value="100">在职</Option>

                <Option value="-100">离职</Option>

              </Select>
            </FormItem>
          </Col>
          <Col span={6} style={{textAlign: 'right', marginBottom: '24px'}}>
            <FormItem label="员工类型">
              <Select size="large" placeholder="全部" style={{width: 200, textAlign: "left"}}
                      {...getFieldProps("work_type", {initialValue: '10'})}
                      >

                <Option value="">全部</Option>

                <Option value="10">全职</Option>

                <Option value="20">兼职</Option>

              </Select>
            </FormItem>
          </Col>
          <Col span={24} style={{textAlign: 'right'}}>
            <FormItem >
              <Button htmlType="submit" style={{
                marginRight: 20,
                marginLeft: 20,
                backgroundColor: 'rgb(88,226,194)',
                borderColor: 'rgb(88,226,194)',
                color: '#fff'}}>查询
              </Button>
              <Button ><Link to="/team/employee/list/add">添加</Link></Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
});
module.exports = Search;
