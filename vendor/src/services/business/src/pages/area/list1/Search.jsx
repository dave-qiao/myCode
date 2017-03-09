import React, {Component, PropTypes} from 'react';
import { Form, Input, Button, Checkbox, Icon, Select } from 'antd';
import { Link } from 'dva/router';

const [FormItem,Option] = [Form.Item,Select.Option];

class Search extends Component {
  constructor(props) {
    super();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {vendor_id} = this;
    const {form, onSearch} = this.props;
    const values = form.getFieldsValue();
    onSearch(values);
  };


  render() {
    const { getFieldProps } = this.props.form;
    return (
      <Form inline onSubmit={this.handleSubmit}>
        <FormItem label="区域名称" >
          <Input {...getFieldProps("name")} placeholder="区域名称"/>
        </FormItem>
        <FormItem label="状态" >
          <Select  showSearch  optionFilterProp="children" {...getFieldProps("state",{initialValue:'100'})} {...{"style":{"width":120},"placeholder":"状态"}}>
            <Option key="state_0" value="">全部</Option>

            <Option key="state_1" value="100">启用</Option>

            <Option key="state_2" value="-100">禁用</Option>
          </Select>
        </FormItem>

        <FormItem >
          <Button  htmlType="submit" type="primary">查询</Button>
          <Button ><Link to="/business/area/list/add">添加</Link></Button>
        </FormItem>

      </Form>
    );
  }

}


module.exports =  Form.create()(Search);
