/**
 * Created by dave 17/01/06
 * 直营项目一级组件 搜索框+Table数据
 */
import React, { Component, PropTypes } from 'react';
import { Table, Form, Select, Row, Col, Modal, InputNumber, Checkbox, TreeSelect, Radio, Button } from 'antd';
import { Link } from 'dva';
const [FormItem, Option, TreeNode] = [Form.Item, Select.Option, TreeSelect.TreeNode];


class OrderRulesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // tableType 0为订单分单规则的数据，1为骑士分单规则的数据
      tableType: 0,
      ruleRecord: {},
      editOrderRule: {
        area_info: {
          id: '',
          name: '',
        },
        rule_class: '',
        priority: '',
        supply_vendor_list: [{ id: '', name: '' }],
        sub_area_list: [],
      },
      columns: [
        {
          title: '优先级',
          dataIndex: 'priority',
        }, {
          title: '规则类型',
          dataIndex: 'rule_class',
          render: (text, record)=> {
            return (
              <span>{text == 'VendorAppointRule' ? '指定服务商' : '--'}</span>
            )
          },
        }, {
          title: '适用区域',
          dataIndex: 'region',
          render: function (text, record) {
            return (
              <span>{record.sub_area_list.length > 0 ? record.sub_area_list.map(function (item, index) {
                return (
                  <span key={index}>{item.name}、</span>
                )
              }) : record.area_info.name}</span>
            )
          }
        }, {
          title: '规则有效期',
          dataIndex: 'expired_at',
          render: (text, record)=> {
            return (
              <span>{'永久' || text}</span>
            )
          },
        }, {
          title: '规则参数',
          dataIndex: 'supply_vendor_list',
          render: (text, record)=> {
            return (
              <span>服务商({record.supply_vendor_list.length})</span>
            )
          },
        }, {
          title: '操作',
          dataIndex: '',
          render: (text, record, index)=> {
            return (
              <p>
                  <span style={{ color: '#58e2c2', cursor: 'pointer' }}
                        onClick={this.showModal.bind(this, record)}>
                  {`编辑   `}
                  </span>

                <span style={{ color: '#58e2c2', cursor: 'pointer' }} onClick={this.delete.bind(this, record, index)}>
                    {`   删除`}
                  </span>
              </p>
            )
          }
        }
      ],
      pagination: {
        total: this.props.orderRuleListDetail ? this.props.orderRuleListDetail._meta.result_count : 0,
        showTotal: (total) => {
          return `总共 ${total} 条`;
        },
        onShowSizeChange: (current, pageSize) => {
          this.props.onShowSizeChange(current, pageSize);
        },
        onChange: (current) => {
          this.props.onPageChange(current);
        },
      }
    }
  }

  //删除列表信息
  delete(record, index) {
    const { dispatch } = this.props;
    const rule_id = record.id;
    const state = 'order';
    this.props.delete(state, rule_id);
    dispatch({
      type: 'deleteOrderRuleE',
      payload: { rule_id },
    })
  }

  //对话框展示
  showModal = (record)=> {
    this.setState({
      visible: true,
      editOrderRule: record,
    });

    // 获取此规则详情进行编辑
    this.props.edit(record);
    const { dispatch, city_code } = this.props;
    const area_id = record.area_id;

    // 获取服务商列表
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);
    dispatch({
      type: 'getServiceProviderE',
      payload: { vendor_id, city_code, area_id },
    });

  };

  //对话框确认
  handleOk = (index, record)=> {
    const self = this;
    let { form, dispatch }=this.props;
    const { resetFields } = form;
    const rule_id = this.state.editOrderRule.id;
    form.validateFields((err, value) => {
      if (err) {
        return;
      } else {
        let values = form.getFieldsValue();

        // 多选区域设置规则
        if (values.area_id.length > 0) {
          const numbers = values.area_id.indexOf(this.state.editOrderRule.area_id);
          const sub_areas_values = [];
          for (var i = 0; i < values.area_id.length; i++) {
            if (values.area_id[i].indexOf(this.state.editOrderRule.area_id) == -1) {
              sub_areas_values.push(values.area_id[i]);
            }
          }

          values.sub_area_list = sub_areas_values;
          values.area_id = this.state.editOrderRule.area_id;
        }

        const _accountInfo = window.getStorageItem('accountInfo') || '{}';
        const { vendor_id } = JSON.parse(_accountInfo);
        const seller_id = sessionStorage.getItem('sellerId');
        const contract_id = sessionStorage.getItem('contractId');
        values.seller_id = seller_id;
        values.contract_id = contract_id;
        values.rule_class = 10;
        dispatch({
          type: 'editOrderRuleE',
          payload: { values, rule_id },
        })
        self.setState({
          visible: false,
        });
        resetFields();
      }
      ;
    });

  };

  //对话框取消
  handleCancel = (e)=> {
    this.setState({
      visible: false,
    });
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const { orderRuleListDetail, serviceProvider, serviceMessage, treeList } = this.props;
    const { getFieldProps, validateFields } = this.props.form;
    const data = orderRuleListDetail.data || [];
    const editOrderRule = this.state.editOrderRule;
    const supply_vendor_list_value = [];
    let sub_area_list_value = [];
    const sub_area_list_value_init = [];

    // 将区域数据整合 父级及子集放如同一数组

    sub_area_list_value.push({ id: editOrderRule.area_info.id, name: editOrderRule.area_info.name });
    for (var i = 0; i < editOrderRule.sub_area_list.length; i++) {
      sub_area_list_value.push(editOrderRule.sub_area_list[i].id);
      sub_area_list_value_init.push(editOrderRule.sub_area_list[i].id);
    }

    if (editOrderRule.supply_vendor_list.length > -1) {
      for (var i = 0; i < editOrderRule.supply_vendor_list.length; i++) {
        supply_vendor_list_value.push(editOrderRule.supply_vendor_list[i].name);
      }
    }

    return (
      <div>
        <Table columns={this.state.columns} dataSource={data} pagination={this.state.pagination}/>
        <Modal title="编辑分单规则" visible={this.state.visible}
               onOk={this.handleOk} onCancel={this.handleCancel}
               style={{ top: '10%' }}
        >
          <Form>
            <Row>
              <Col sm={24}>
                <FormItem label="规则类型:" {...{ "labelCol": { "span": 8 }, "wrapperCol": { "span": 9 } }}>
                  <span>{editOrderRule.rule_class == 'VendorAppointRule' ? '指定服务商' : ''}</span>
                </FormItem>
              </Col>
              <Col sm={24}>
                <FormItem label="适用区域:" {...{ "labelCol": { "span": 8 }, "wrapperCol": { "span": 9 } }}>
                  {editOrderRule.sub_area_list.length < 0 ?
                    <TreeSelect
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder={sub_area_list_value}
                      treeDefaultExpandAll
                      treeCheckable
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
                      <TreeNode value={editOrderRule.area_info.id} title={editOrderRule.area_info.name}
                                key={editOrderRule.area_info.id}>
                        {
                        {
                          /*editOrderRule.sub_area_list.map(function (item, index) {
                           return (
                           <TreeNode value={item.id} title={item.name} key={item.id}/>
                           )
                           })*/
                        }
                        }
                      </TreeNode>
                    </TreeSelect> :
                    <Select
                      showSearch
                      multiple
                      style={{ width: '100%' }}
                      placeholder="请选择服区域"
                      optionFilterProp="children"
                      {...getFieldProps("area_id", {
                        validate: [
                          { rules: [{ type: 'array', required: true, message: '请选择服务区域' },], }
                        ],
                        initialValue:sub_area_list_value_init.length>0?sub_area_list_value_init:editOrderRule.area_info.id,
                      })}
                    >
                      {
                        treeList.map(function (item, index) {
                          return (
                            <Option value={item.id} key={item.id}>{item.name}</Option>
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
                <FormItem label="规则参数:" {...{ "labelCol": { "span": 8 }, "wrapperCol": { "span": 9 } }}>
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder={'请选择服务商'}
                    optionFilterProp="children"
                    defaultValue={supply_vendor_list_value}
                    {...getFieldProps("supply_vendor_id", {
                      validate: [
                        { rules: [{ required: true, message: '请选择服务商' },], trigger: 'onChange', },
                      ],
                      initialValue: supply_vendor_list_value,

                    })}
                  >
                    {/*<Option key='-1' value={serviceMessage.id}>{serviceMessage.name}</Option>*/}
                    {
                      serviceProvider.data.map(function (item, index) {
                        return (
                          <Option key={index} value={item.id}>{item.name}</Option>
                        )
                      })
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col sm={24}>
                <FormItem label="优先级:" {...{ "labelCol": { "span": 8 }, "wrapperCol": { "span": 9 } }}>
                  <InputNumber size="large" min={1} max={100} defaultValue={0}
                               {...getFieldProps("priority", {
                                 initialValue: editOrderRule.priority,
                               })}/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}
module.exports = Form.create()(OrderRulesList);

