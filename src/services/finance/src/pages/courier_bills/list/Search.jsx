import React, {Component, PropTypes} from 'react';
import { Form, Input, Button, Checkbox,DatePicker, Icon, Select } from 'antd';
import { Link } from 'dva/router';

const [FormItem,Option] = [Form.Item,Select.Option];

const Search = Form.create()(({form, searchProps}) => {

  const { getFieldProps, getFieldsValue } = form;

  const {searchs, onSearch, onShowItem} = searchProps;
  let _time = null;

  function handleSubmit(e) {
    e.preventDefault();
    let _data = getFieldsValue();
     console.log(_data.time)
     _data.time = _data.time.toLocaleString().substr(0,10).replace('/','-').replace('/','-');
     console.log(_data.time)
     onSearch(_data)
  };

  return (
    <Form inline onSubmit={handleSubmit}>

      <FormItem label="日期" >
       <DatePicker {...getFieldProps("time")} />
    </FormItem>

      <FormItem label="骑士名称" >
        <Input {...getFieldProps("name")} {...{"style":{"width":120},"placeholder":"请输入骑士名称"}}/>
      </FormItem>

      <FormItem label="对账状态" >
        <Select {...getFieldProps('state')} {...{"style":{"width":120},"placeholder":"状态"}}>

          <Option key="state_1" value="100">已对账</Option>

          <Option key="state_2" value="-100">未对账</Option>

        </Select>
      </FormItem>


      <FormItem >
        <Button type="primary" htmlType="submit" >查询</Button>
      </FormItem>

      <FormItem >
        <Button htmlType="submit" >导出</Button>
      </FormItem>

    </Form>
  );
});

module.exports =  Search;
