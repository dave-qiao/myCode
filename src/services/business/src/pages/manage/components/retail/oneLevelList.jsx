/**
 * Created by dave 17/01/06
 * 直营项目一级组件 搜索框+Table数据
 */
import React, {Component, PropTypes} from 'react';
import {Link} from 'dva/router'
import {Form, Select, Row, Col, Input, Button, Table, Menu, Dropdown, Icon} from 'antd';
import {modules, Tabs, OneLevelList, SignInfo} from '../../exports';
import data from '../../../../../../../assets/citys/city.json';
const [FormItem,Option] = [Form.Item,Select.Option];

class RetailOneLevel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pmType: props.pmType,// 默认直营
      columns: [
        {
          title: '城市',
          dataIndex: 'city',
        }, {
          title: '商户号',
          dataIndex: 'partner',
        }, {
          title: '项目名称',
          dataIndex: 'projectName',
        }, {
          title: '联系人',
          dataIndex: 'contactPerson',
        }, {
          title: '联系电话',
          dataIndex: 'mobilPhone',
        }, {
          title: '审核状态',
          dataIndex: 'state',
        }, {
          title: '操作',
          dataIndex: 'operate',
          render: (text, record)=> {
            let pmType = this.state.pmType;
            return (
              <span>
                <Link to={`/business/manage/retail/shop`}>{modules[0].name}</Link>
                &nbsp;&nbsp;
                <Dropdown overlay={
                  <Menu>
                    <Menu.Item key="0">
                      <Link to={{pathname: `/business/manage/retail/signed`}}>{modules[1].name}</Link>
                    </Menu.Item>
                    <Menu.Item key="1">
                      <Link to={{pathname: `/business/manage/retail/orderDispatchRules`}}>{modules[2].name}</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                      <Link to={{pathname: `/business/manage/retail/knightDispatchRules`}}>{modules[3].name}</Link>
                    </Menu.Item>
                  </Menu>
                } trigger={['click']}>
                    <a className="ant-dropdown-link" href="#">
                      更多<Icon type="down"/>
                    </a>
                  </Dropdown>
              </span>
            )
          }
        },
      ],
      dataSource: [
        {
          city: '北京',
          partner: '张三',
          projectName: '嗷嗷',
          contactPerson: '李四',
          mobilPhone: '110',
          state: '审核',
        },
      ],
      pagination: {
        total: 8,
        showTotal: (total) => {
          return `总共 ${total} 条`;
        },
        onShowSizeChange: (current, pageSize) => {
          this.props.onShowSizeChange(current, pageSize);
        },
        onChange: (current) => {
          this.props.onChange(current);
        },
      }
    }
  }

  render() {
    return (
      <div>
        <div className="bd-content">
          <Form onSubmit={this.handleSubmit} key="RetailOneLevel">
            <Row type="flex">
              <Col sm={5}>
                <FormItem label="城市" {...{"labelCol": {"span": 4}, "wrapperCol": {"span": 8}}}>
                  <Select placeholder="请选择城市" style={{width: "60%"}}/>
                  {/*{...getFieldProps('supplierName', {
                   initialValue: formData.userName,
                   rules: [{required: true, message: '请输入供应商名称'}],
                   })}*/}
                  {
                    city.map(function(item, index){
                      return (
                        <Option value={item._id} key={item._id}>{item.name}</Option>
                      )
                    })
                  }
                </FormItem>
              </Col>
              <Col sm={5}>
                <Button type="primary">查询</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="bd-content">
          <Table columns={this.state.columns} dataSource={this.state.dataSource} pagination={this.state.pagination}/>
        </div>
      </div>
    )
  }
}
export default RetailOneLevel;
