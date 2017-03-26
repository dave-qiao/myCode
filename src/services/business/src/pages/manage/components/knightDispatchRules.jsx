/**
 * Created by dave 17/01/08
 * 订单分单规则
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router'
import {
  Row,
  Col,
  Icon,
  TreeSelect,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  InputNumber,
  message,
  Radio,
} from 'antd';
import style from '../style/manage.less';
import  KnightRulesList from './retail/knightRulesList';
const [FormItem, Option, TreeNode] = [Form.Item, Select.Option, TreeSelect.TreeNode];
const data = {
  area: [],
};

class OrderSingle extends Component {
  constructor(props) {
    super();
    this.state = {
      visible: false,
      columns: [{
        title: <span>服务区域 <span style={{color:'#58e2c2'}}>总计({data.area.length})</span></span>,
        dataIndex: 'name',
        width: '50%',
        render: (text, record) => {
          return (
            <span>{ record.name ? record.name : '' }</span>
          )
        }
      }, {
        title: '分单规则',
        dataIndex: 'is_set_courier_delivery_rule',
        render: (text, record) => {
          return (
            <span>{text == true ? '已设置' : '未设置'}</span>
          )
        },
        filters: [
          { text: '未设置', value: false },
          { text: '已设置', value: true },
        ],
        filterMultiple: false,
        onFilter: (value, record) => {
          return `${record.is_set_courier_delivery_rule}` === value;
        }
      },],
      rightTitle: '',
      areaRecord: [],
      areaValue: [],
      serviceCityList: [],
    }
  }

  // 接受 model 层 props
  componentWillReceiveProps = (nextProps) => {
    const { areaList, serviceCityList } = nextProps.retailSellerInfo;
    const areaValue = areaList;
    if (areaValue.data != data.area) {
      this.setState({
        areaValue: areaValue.data ? areaValue.data : [],
      })
    }
    data.area = areaValue.data;
    this.setState({
      serviceCityList: serviceCityList,
    })
  };

  showModal = ()=> {
    const { dispatch } = this.props;
    const state = 100; //区域状态  100开启 -100禁用
    const verify_state = 100;
    const relate_type = 10; //直营类型 枚举值 10直营 20加盟
    const is_filter_sub_area = false;//是否过滤子区 true 过滤 false 不过滤
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const userInfo = window.getStorageItem('userInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const { name } = JSON.parse(userInfo);
    const { retailSellerInfo }=this.props;
    const { seller_id, city_code, }=retailSellerInfo;
    const supply_vendor_id = vendor_id; //此时供应商id 为服务商自己
    const areaRecord = this.state.areaRecord;
    const parent_area_id = areaRecord.id;
    const is_return_courier_list = true;
    if (this.state.rightTitle != '') {
      dispatch({
        type: 'getAddTeamListE',
        payload: { vendor_id, city_code, is_return_courier_list },
      });
      // 获取添加分单规则时的区域列表（包括子区域）、可选服务商列表
      dispatch({
        type: 'getAreaChildE',
        payload: { state, relate_type, city_code, vendor_id, supply_vendor_id, parent_area_id },
      });
      this.setState({
        visible: true,
      });
    } else {
      message.error('请选择左侧的服务区域')
    }

  };

  // 获取团队列表
  getTeamListOnShow = () => {
    const { dispatch } = this.props;
    const state = 100; //区域状态  100开启 -100禁用
    const verify_state = 100;
    const relate_type = 10; //直营类型 枚举值 10直营 20加盟
    const is_filter_sub_area = false;//是否过滤子区 true 过滤 false 不过滤
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const userInfo = window.getStorageItem('userInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const { name } = JSON.parse(userInfo);
    const { retailSellerInfo }=this.props;
    const { seller_id, city_code, }=retailSellerInfo;
    const supply_vendor_id = vendor_id; //此时供应商id 为服务商自己
    const areaRecord = this.state.areaRecord;
    const parent_area_id = areaRecord.id;
    const is_return_courier_list = true;
    dispatch({
      type: 'getAddTeamListE',
      payload: { vendor_id, city_code, is_return_courier_list },
    });
  }


  handleOk = (e, value)=> {
    const self = this;
    const { form, dispatch, retailSellerInfo } = this.props;
    const { resetFields } = form;
    const { teamList } = retailSellerInfo;
    form.validateFields((err, value) => {
      if (err) {
        return;
      } else {
        let values = form.getFieldsValue();
        if(values.team_list==undefined&&values.teams_id==undefined){
          message.error('请选择团队或者骑士中的一项');
          return;
        }else{
          if(values.team_list == undefined){
            values.team_list=[];
          }
          if(values.teams_id == undefined){
            values.teams_id=[];
          }

        const valuesNot = values;

        // 拿取公用的信息
        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        const { vendor_id } = JSON.parse(_accountInfo);
        const seller_id = sessionStorage.getItem('sellerId');
        const contract_id = sessionStorage.getItem('contractId');
        values.seller_id = seller_id;
        values.contract_id = contract_id;
        values.vendor_id = vendor_id;
        values.rule_class = 10;
        let sub_areas_values = [];

        // 判断区域是父区域 还是子区域
        if (values.area_id.length > 0) {
          const numbers = values.area_id.indexOf(this.state.areaRecord.id);
          for (var i = 0; i < values.area_id.length; i++) {
            if (values.area_id[i].indexOf(this.state.areaRecord.id) == -1) {
              sub_areas_values.push(values.area_id[i]);
            }
          }
        }

        //筛选团队数据
        const teamValue = [];
        const courierValue = [];
        for (var i = 0; i < teamList.data.length; i++) {
          if (values.team_list.indexOf(teamList.data[i].id) > -1) {
            teamValue.push(teamList.data[i].id);
          }

        }


        //筛选骑士数据
        for (var i = 0; i < teamList.data.length; i++) {
          for (var k = 0; k < teamList.data[i].courier_list.length; k++) {
            if (values.team_list.indexOf(teamList.data[i].courier_list[k].id) > -1) {
              courierValue.push(teamList.data[i].courier_list[k].id);
            }
          }
        }
        values.team_list = values.teams_id;
        delete values.teams_id;
        values.courier_list = courierValue;
        values.area_id = this.state.areaRecord.id;
        values.sub_area_list = sub_areas_values;

        dispatch({
          type: 'addKnightRuleE',
          payload: { values },
        })
        self.setState({
          visible: false,
        });
        resetFields();
        }
      }
      ;
    });
  };

  handleCancel = (e)=> {
    const { form } = this.props;
    const { resetFields } = form;
    resetFields();
    this.setState({
      visible: false,
    });
  };

  onRowClick = (record, index) => {
    const { dispatch } = this.props;
    const area_id = record.id;
    const state = 100; // 签约状态
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const userInfo = window.getStorageItem('userInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const seller_id = sessionStorage.getItem('sellerId');
    const contract_id = sessionStorage.getItem('contract_id');
    const limit = 100;
    // 通知model 层 通过区域id 获取此区域的分单规则详情信息
    dispatch({
      type: 'getKnightRuleDetailE',
      payload: { area_id, vendor_id, state, seller_id, contract_id, limit },
    });

    this.setState({
      rightTitle: record.name,
      areaRecord: record,
    });
  };

  typeChange = (name) => {
    switch (name) {
      case  '订单分单规则':
        break;
      case  '骑士分单规则':
        break;
      case  '商家信息':
        break;
      case  '签约信息':
        break;
    }
  };

  onTreeChange = (value) => {
  };

  treeChange = (value) => {

  };

  //分页变化
  onPageChange = (current) => {
    const { dispatch } = this.props;
    const state = 100; // 签约状态
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const userInfo = window.getStorageItem('userInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const seller_id = sessionStorage.getItem('sellerId');
    const contract_id = sessionStorage.getItem('contractId');
    const area_id = this.state.areaRecord.id;
    const page = current;
    const limit = 100;
    // 通知model 层 通过区域id 获取此区域的分单规则详情信息
    /*dispatch({
     type: 'getKnightRuleDetailE',
     payload: { area_id, vendor_id, state, seller_id, contract_id, limit },
     });*/

  };

  //删除订单规则数据
  delete = (state, rule_id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deleteKnightRuleE',
      payload: { rule_id },
    })
  };

  // 获取此规则详情进行编辑
  edit = (record) => {
    const { dispatch } = this.props;
    const rule_id = record.rule_id;
    const editKnightRule = record;
    dispatch({
      type: 'editKnightRuleR',
      payload: { editKnightRule },
    })
  };

  // 区域关键字搜索
  areaSearch = (value) => {
    let searchIndex = 0;
    if (value === '0' || value === '' || value === undefined) {       //枚举 0:全部区域
      this.setState({
        areaValue: data.area,
      })
    } else {
      data.area.forEach(function (item, index) {
        if (item.id == value) {
          searchIndex = index;
          return;
        }
      });

      let areaChangeValue = data.area[searchIndex];
      this.setState({
        areaValue: [areaChangeValue],
      })
    }
  };

  // 城市筛选区域
  cityChange = (value) => {
    const { dispatch } = this.props;
    const limit = 1000;
    const city_code = value;
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const contract_id = sessionStorage.getItem('contractId');
    const state = 100;//区域状态 100启用 -100 禁用
    const relate_type = 10; // 区域类型 10 直营 20 加盟
    const is_filter_sub_area = true; //是否过滤子区
    const is_set_courier_delivery_rule = true; //是否返回设置骑士分单规则状态
    // 区域列表
    dispatch({
      type: 'getAreaE',
      payload: {
        vendor_id,
        city_code,
        state,
        relate_type,
        is_filter_sub_area,
        is_set_courier_delivery_rule,
        contract_id,
        limit
      },
    });
  };

  render() {
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const userInfo = window.getStorageItem('userInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    const { name } = JSON.parse(userInfo);
    const { retailSellerInfo, dispatch }=this.props;
    const { seller_id, contract_id, orderRuleList, knightRuleListDetail, areaList, teamList, serviceProvider, areaChildList, upData, editOrderRule }=retailSellerInfo;
    const relate_type = 10; // 区域类型 10 直营 20 加盟
    const is_filter_sub_area = true; //是否过滤子区
    const is_set_courier_delivery_rule = true; //是否返回设置骑士分单规则状态
    // 结构一层 将区域列表拿出来
    const areaValue = areaList;

    //获取区域列表
    let treeList = this.state.areaRecord.sub_areas ? this.state.areaRecord.sub_areas : [];
    treeList.push({ id: this.state.areaRecord.id, name: this.state.areaRecord.name });

    const orderListProp = {
      knightRuleListDetail,
      dispatch,
      editOrderRule,
      teamList,
      treeList,
    };

    // 获取全部的区域信息
    const seller_name = sessionStorage.getItem('sellerName');

    // 从Form 组件中获取相应的方法
    const { getFieldProps, getFieldsValue } = this.props.form;

    // 判断是否更新列表信息
    if (upData == true) {
      const state = 100; // 签约状态
      const _accountInfo = window.getStorageItem('accountInfo') || '{}';
      const userInfo = window.getStorageItem('userInfo') || '{}';
      const { vendor_id } = JSON.parse(_accountInfo);
      const contract_id = sessionStorage.getItem('contractId');
      const seller_id = sessionStorage.getItem('sellerId');
      const area_id = this.state.areaRecord.id;
      const limit = 1000;

      // 通知model 层 通过区域id 获取此区域的分单规则详情信息
      dispatch({
        type: 'getKnightRuleDetailE',
        payload: { area_id, vendor_id, state, seller_id, contract_id, limit },
      });

      // 区域列表
      dispatch({
        type: 'getAreaE',
        payload: {
          vendor_id,
          state,
          relate_type,
          is_filter_sub_area,
          is_set_courier_delivery_rule,
          contract_id,
          limit
        },
      });

      // 关闭更新开关
      const upDataState = false;
      dispatch({
        type: 'upDataR',
        payload: { upDataState },
      })
    }

    // 表头数据
    const columns = [{
      title: <span>服务区域 <br/><span style={{color:'#58e2c2'}}>总计({data.area.length})</span></span>,
      dataIndex: 'name',
      width: '50%',
      render: (text, record) => {
        return (
          <span>{ record.name ? record.name : '' }</span>
        )
      }
    }, {
      title: '分单规则',
      dataIndex: 'is_set_courier_delivery_rule',
      render: (text, record) => {
        return (
          <span>{text == true ? '已设置' : '未设置'}</span>
        )
      },
      filters: [
        { text: '未设置', value: false },
        { text: '已设置', value: true },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        return `${record.is_set_courier_delivery_rule}` === value;
      }
    },];

    return (
      <div className="con-body main-list">
        <div className={style.reset}>
          <Link to={`/business/manage/retail/shop?id=${seller_id}`}>
            <span className={`${style.tabs}`}
                  onClick={this.typeChange.bind(this, '商家信息')}>商家信息</span>
          </Link>
          <Link to={`/business/manage/retail/signed?id=${contract_id}`}>
            <span className={`${style.tabs} ${style.marginLeft16}`}
                  onClick={this.typeChange.bind(this, '签约信息')}>签约信息</span>
          </Link>
          <Link to={`/business/manage/retail/orderDispatchRules?id=${seller_id}`}>
            <span className={`${style.tabs} ${style.marginLeft16}`}
                  onClick={this.typeChange.bind(this, '订单分单规则')}>订单分单规则</span>
          </Link>
          <Link to={`/business/manage/retail/knightDispatchRules?id=${seller_id}`}>
            <span className={`${style.tabsActive} ${style.marginLeft16}`}
                  onClick={this.typeChange.bind(this, '骑士分单规则')}>骑士分单规则</span>
          </Link>
        </div>
        <div className={style.retail}>
          <Row type="flex" align={'center'}>
            <Col sm={5}>
              <div className='bd-content'>
                <Col sm={4}>
                  <Icon type="solution" style={{ fontSize: 25 }}/>
                </Col>
                <Col sm={19}>
                  &nbsp;&nbsp;<span style={{ fontSize: 16 }}>{seller_name}</span>
                </Col>
              </div>
              <div className={`bd-content ${style.inLine}`}>
                <Select showSearch
                        style={{ width: '90%', marginBottom: 16 }}
                        placeholder="请输入城市"
                        optionFilterProp="children"
                        notFoundContent="暂无数据"
                        defaultValue={''}
                        onChange={this.cityChange}>
                  <Option value="">全部</Option>
                  {
                    this.state.serviceCityList.map((item, index)=> {
                      return (
                        <Option value={item.city_code} key={`${item.city_code}${index}`}>{item.city_name}</Option>
                      )
                    })
                  }
                </Select>
                <Select showSearch
                        allowClear
                        style={{ width: '90%', marginBottom: 16 }}
                        placeholder="请输入搜索内容"
                        optionFilterProp="children"
                        notFoundContent="暂无数据"
                        defaultValue={'0'}
                        onChange={this.areaSearch}>
                  <Option value={'0'}>全部</Option>
                  {
                    data.area.map(function (item, index) {
                      return (
                        <Option value={item.id} key={`search${item.id}`}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
                <Table columns={columns} dataSource={this.state.areaValue}
                       onRowClick={this.onRowClick} pagination={false} scroll={{ y: 600 }}/>
              </div>
            </Col>
            <Col sm={19}>
              <div className={style.rightModuleStyle}>
                <Row>
                  <Col sm={12}>
                    <h4 className={style.navLeftBorder}>
                      分单规则设置{` (${this.state.rightTitle == '' ? '请选择左侧服务区域' : this.state.rightTitle})`}</h4>
                  </Col>
                  <Col sm={12} style={{ textAlign: 'right' }}>
                    <Button type='primary' onClick={this.showModal}>添加分单规则</Button>
                    <Modal title="添加分单规则" visible={this.state.visible}
                           onOk={this.handleOk} onCancel={this.handleCancel}
                           style={{ top: '35%' }}
                    >
                      <Form>
                        <Row>
                          <Col sm={24}>
                            <FormItem label="规则类型:" {...{ "labelCol": { "span": 8 }, "wrapperCol": { "span": 9 } }}>
                              <span>指定服务骑士</span>
                            </FormItem>
                          </Col>
                          <Col sm={24}>
                            <FormItem label="适用区域:" {...{ "labelCol": { "span": 8 }, "wrapperCol": { "span": 9 } }}>
                              {treeList.length < 0 ?
                                <TreeSelect
                                  showSearch
                                  style={{ width: '100%' }}
                                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                  placeholder="请选择服务区域"
                                  allowClear
                                  treeDefaultExpandAll
                                  treeCheckable
                                  onSelect={this.onTreeChange}
                                  {...getFieldProps("area_id", {
                                    validate: [
                                      {
                                        rules: [{
                                          required: true, message: '请选择服务区域', type: 'array',
                                          validator: (rule, value, callback) => {
                                            if (!value) {
                                              callback('请选择服务区域');
                                              return;
                                            }
                                            if (value.length == 0) {
                                              callback('请选择服务区域');
                                            }
                                            callback();
                                          },
                                        },], trigger: 'onChange',
                                      }
                                    ]
                                  })}
                                >
                                  <TreeNode value={this.state.areaRecord.id} title={this.state.areaRecord.name}
                                            key={this.state.areaRecord.id}>
                                    {
                                      treeList.map(function (item, index) {
                                        return (
                                          <TreeNode value={item.id} title={item.name} key={item.id}/>
                                        )
                                      })
                                    }
                                  </TreeNode>
                                </TreeSelect> :
                                <Select
                                  showSearch
                                  multiple
                                  style={{ width: '100%' }}
                                  placeholder="请选择服务区域"
                                  optionFilterProp="children"
                                  {...getFieldProps("area_id", {
                                    validate: [
                                      {
                                        rules: [{ type: 'array', required: true, message: '请选择服务区域' },],
                                        trigger: 'onBlur',
                                      }
                                    ]
                                  })}
                                >
                                  {
                                    treeList.map(function (item, index) {
                                      return (
                                        <Option value={item.id} key={index}>{item.name}</Option>
                                      )
                                    })
                                  }
                                </Select>
                              }
                            </FormItem>
                          </Col>
                          <Col sm={24}>
                            <FormItem label="有效期:" {...{ "labelCol": { "span": 8 }, "wrapperCol": { "span": 9 } }}>
                              <Radio defaultChecked
                                     {...getFieldProps("expired_at", {
                                       initialValue: '2027-12-31 00:00:00',
                                     })}>永久</Radio>
                            </FormItem>
                          </Col>
                          <Col sm={24}>
                            <FormItem label="规则参数:" {...{ "labelCol": { "span": 8 }, "wrapperCol": { "span": 12 } }}>
                              <span style={{color:'orange'}}>以下选项至少选择一项（团队／骑士)</span>
                            </FormItem>
                          </Col>
                          <Col sm={24}>
                            <FormItem label="分配给团队:" {...{ "labelCol": { "span": 8 }, "wrapperCol": { "span": 9 } }}>
                              <Select
                                showSearch
                                multiple
                                style={{ width: '100%' }}
                                placeholder="请选择团队"
                                optionFilterProp="children"
                                {...getFieldProps("teams_id", {
                                  validate: [
                                    {
                                      rules: [{ type: 'array', message: '请选择团队' },],
                                    }
                                  ]
                                })}
                              >
                                {
                                  teamList.data.map(function (item, index) {
                                    return (
                                      <Option value={item.id} key={index}>{item.name}</Option>
                                    )
                                  })
                                }
                              </Select>
                            </FormItem>
                          </Col>
                          <Col sm={24}>
                            <FormItem label="分配给骑士:" {...{ "labelCol": { "span": 8 }, "wrapperCol": { "span": 9 } }}>
                              {/*<Select
                               showSearch
                               style={{ width: '100%' }}
                               placeholder="请选择服务商"
                               optionFilterProp="children"
                               {...getFieldProps("supply_vendor_id", {
                               validate: [
                               { rules: [{ required: true, message: '请选择服务商' },], trigger: 'onBlur', }
                               ]
                               })}
                               >
                               {
                               teamList.data.map(function (item, index) {
                               return (
                               <Option key={index} value={item.id}>{item.name}</Option>
                               )
                               })
                               }
                               </Select>*/}
                              <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="请选择骑士"
                                allowClear
                                treeDefaultExpandAll
                                treeCheckable
                                onSelect={this.onTreeChange}
                                onChange={this.treeChange}
                                {...getFieldProps("team_list", {
                                  validate: [
                                    {
                                      rules: [{
                                        message: '请选择骑士', type: 'array',
                                      },],
                                    }
                                  ]
                                })}
                              >
                                {
                                  teamList.data.map(function (item, index) {
                                    return (
                                      <TreeNode value={item.id} title={item.name}
                                                key={item.id}>
                                        {
                                          item.courier_list.map(function (item, index) {
                                            return (
                                              <TreeNode value={item.id} title={item.name} key={item.id}/>
                                            )
                                          })
                                        }
                                      </TreeNode>
                                    )
                                  })
                                }
                              </TreeSelect>
                            </FormItem>
                          </Col>
                          <Col sm={24}>
                            <FormItem label="优先级:" {...{ "labelCol": { "span": 8 }, "wrapperCol": { "span": 9 } }}>
                              <InputNumber size="large" min={1} max={100} defaultValue={0}
                                           {...getFieldProps("priority", {
                                             initialValue: 1,
                                           })}/>
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </Modal>
                  </Col>
                </Row>
                <div className={style.navBottomBorder}></div>
                <div>
                  <KnightRulesList {...orderListProp}
                                   onPageChange={this.onPageChange}
                                   delete={this.delete}
                                   edit={this.edit}
                                   getTeamListOnShow={this.getTeamListOnShow}/>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

OrderSingle = Form.create()(OrderSingle);

function mapStateToProps({ retailSellerInfo }) {
  return { retailSellerInfo }
}
module.exports = connect(mapStateToProps)(OrderSingle);
