/**
 * Created by dave 17/01/10
 * 直营项目组件
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import data from '../../../../../assets/citys/city.json';
import { modules, Tabs, OneLevelList, Affiliates } from './exports';
import { Button, Form, Row, Col, Select, Table, Dropdown, Menu, Icon } from 'antd';
import { getCityNameByCode } from '../../../../../../src/utils/authHelper.js';
import { stateTransform } from  '../../../../../../src/utils/newUtils.js'
const [FormItem, Option]=[Form.Item, Select.Option];
const city = data.data;

class View extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          title: '城市',
          dataIndex: 'city_code',
          render: function (text, record) {
            return (
              <span>{getCityNameByCode(text)}</span>
            )
          }
        }, {
          title: '商户号',
          dataIndex: 'seller_no',
        }, {
          title: '项目名称',
          dataIndex: 'name',
        }, {
          title: '总加盟商',
          dataIndex: 'vendor',
          render: function(text, record) {
            return (
              <span>{record.vendor.name}</span>
            )
          }
        }, {
          title: '联系人',
          dataIndex: 'legal_name',
          render: function (text, record) {
            return (
              <span>{record.biz_profile.legal_name}</span>
            )
          }
        }, {
          title: '联系电话',
          dataIndex: 'mobile',
        }, {
          title: '审核状态',
          dataIndex: 'verify_state',
          render: function (text, record) {
            return (
              <span>{stateTransform('verify_state', text)}</span>
            )
          }
        }, {
          title: '操作',
          dataIndex: 'operate',
          render: (text, record)=> {
            return (
              <span>
                <Link to={`/business/manage/retail/shop?id=${record.id}`}
                      onClick={this.saveId.bind(this, record)}>{modules[0].name}</Link>
                &nbsp;&nbsp;
                <Dropdown overlay={
                  <Menu>
                    <Menu.Item key="0">
                      <Link to={`/business/manage/retail/signed?id=${record.contract_id}`}
                            onClick={this.saveId.bind(this, record)}>{modules[1].name}</Link>
                    </Menu.Item>
                    <Menu.Item key="1">
                      <Link to={`/business/manage/retail/orderDispatchRules?id=${record.id}`}
                            onClick={this.saveId.bind(this, record)}>{modules[2].name}</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                      <Link to={`/business/manage/retail/knightDispatchRules?id=${record.id}`}
                            onClick={this.saveId.bind(this, record)}>{modules[3].name}</Link>
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
      pagination: {
        total: this.props.manageRetail.retailList._meta.result_count || 0,
        showTotal: (total) => {
          return `总共 ${total} 条`;
        },
        onShowSizeChange: (current, pageSize) => {
          this.props.onShowSizeChange(current, pageSize);
        },
        onChange: (current) => {
          const { dispatch, manageRetail } = this.props;
          const city_code = manageRetail.city_code;
          const contract_type = 10; // 直营类型
          const page = current;
          dispatch({
            type: 'init',
            payload: { city_code, contract_type, page }
          })
        },
      }
    }
  };

  //接受父级更改的状态
  componentWillReceiveProps = (nextProps) => {
    const { manageRetail } = nextProps;
    const { retailList } = manageRetail;
    this.setState({
      pagination: {
        total:retailList._meta.result_count,
      }
    });
  };

  //保存骑士id、 签约id
  saveId = (record) => {
    const { dispatch } = this.props;
    const sellerId = record.id;
    const contractId = record.contract_id;
    const sellerName = record.name;
    const sellerMessage = record;

    sessionStorage.setItem('sellerId',sellerId);
    sessionStorage.setItem('contractId',contractId);
    sessionStorage.setItem('sellerName',sellerName);
    dispatch({
      type: 'saveSellerId',
      payload: { sellerId, contractId, sellerMessage },
    })
  };

  //保存签约id
  saveSignedId = () => {
    const { dispatch } = this.props;
    const contract_id = record.contract_id;
    dispatch({
      type: '',
      payload: { contract_id },
    })
  };

  //条件查询(城市)
  onSearch = () => {
    const { dispatch, manageRetail } = this.props;
    const { city_code } = manageRetail;
    const contract_type = 10; // 直营类型
    // 通知model 获取数据
    dispatch({
      type: 'init',
      payload: { city_code, contract_type },
    })
  };

  //城市更改
  cityChange = (value) => {
    const { dispatch } = this.props;
    const city_codes = value;
    dispatch({
      type: 'cityChange',
      payload: { city_codes },
    })
  };

  render() {
    const { city_code, retailList, serviceCityList }= this.props.manageRetail;

    return (
      <div className="con-body main-list">
        <div className="bd-header">
          <Button type='primary'>
            <Link to="/business/manage/retail">直营项目</Link>
          </Button>
          <Button>
            <Link to="/business/manage/affiliate">加盟项目</Link>
          </Button>
        </div>
        <div>
          <div className="bd-content">
            <Form onSubmit={this.handleSubmit} key="RetailOneLevel">
              <Row type="flex">
                <Col sm={4}>
                  <FormItem label="城市" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": '' } }}>
                    <Select showSearch
                            placeholder="请选择城市"
                            optionFilterProp="children"
                            style={{ width: "70%" }}
                            defaultValue={getCityNameByCode(city_code)}
                            onChange={this.cityChange}>
                      {
                        serviceCityList.map(function (item, index) {
                          return (<Option key={item.city_code} value={item.city_code}>{item.city_name}</Option>)
                        })
                      }
                    </Select>
                    {/*{...getFieldProps('supplierName', {
                     initialValue: formData.userName,
                     rules: [{required: true, message: '请输入供应商名称'}],
                     })}*/}
                  </FormItem>
                </Col>
                <Col sm={5}>
                  <Button type="primary" onClick={this.onSearch}>查询</Button>
                </Col>
              </Row>
            </Form>
          </div>
          <div className="bd-content">
            <Table columns={this.state.columns} dataSource={retailList.data} pagination={this.state.pagination}/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ business_public, manageRetail }) {
  return { business_public, manageRetail }
}
module.exports = connect(mapStateToProps)(View);
