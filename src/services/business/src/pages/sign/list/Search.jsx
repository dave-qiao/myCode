import React, {Component, PropTypes} from 'react';
import { Form, Input, Button, Checkbox, Icon, Select } from 'antd';
import { Link } from 'dva/router';

const [FormItem,Option] = [Form.Item,Select.Option];

const Search = Form.create()(({form, searchs,list_searchs, onSearch, onShowItem,sellers=[]}) => {
// 从form里面获取信息
  const { getFieldProps, getFieldsValue } = form;
  const {state} = list_searchs;
  //提交函数
  function handleSubmit(e) {
    e.preventDefault();
    let params = getFieldsValue();
    onSearch(params);
  };
// 签约状态的切换
  function handleChange(value) {
   console.log(value)
  }
  return (
    <Form inline onSubmit={handleSubmit}>
    <FormItem label="商家名称" >
      <Select showSearch  optionFilterProp="children" {...getFieldProps("seller_id", {initialValue:''})} {...{"style":{"width":120},"placeholder":"请选择商家名称"}}>
        <Option value=''>全部</Option>
        {
          sellers.map((item,index) =>{
            const seller = item.seller || {};
            return <Option key={'seller' + index + item.seller_id} value={item.seller_id}>{seller.name}</Option>
          })
        }
      </Select>

    </FormItem>
  <FormItem label="签约状态" >
    <Select  id="selectId" showSearch optionFilterProp="children" onSelect={handleChange} {...getFieldProps("state",{initialValue:state})}
            {...{"style":{"width":120},"placeholder":"签约状态"}}>
      <Option   value="">全部</Option>
      <Option   value="100">签约</Option>
      <Option   value="-100">解约</Option>
    </Select>
  </FormItem>
      <FormItem >
        <Button htmlType="submit" style={{ marginRight: 20, marginLeft: 20,backgroundColor:'rgb(88,226,194)',
          borderColor:'rgb(88,226,194)',color:'#fff' }}>查询</Button>
      </FormItem>

    </Form>
  );
});

module.exports =  Search;
