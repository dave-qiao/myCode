/**
 * Created by dave 17/01/06
 * 直营项目一级组件 搜索框+Table数据
 */
import React, { Component, PropTypes } from 'react';
import { Table, Form, Select, Row, Col, Modal, InputNumber, Checkbox, TreeSelect, Radio, Button, message } from 'antd';
import { Link } from 'dva';
const [FormItem, Option, TreeNode] = [Form.Item, Select.Option, TreeSelect.TreeNode];

class KnightRulesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // tableType 0为订单分单规则的数据，1为骑士分单规则的数据
      tableType: 0,
      ruleRecord: {},
      courierInitValue: [],
      teamInitValue: [],
      editKnightRule: {
        area_info: {
          id: '',
          name: '',
        },
        rule_class: '',
        priority: '',
        team_list: [],
        courier_list: [],
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
              <span>{text == 'CourierAppointRule' ? '指定骑士' : '--'}</span>
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
              <span>{`${record.team_list.length > 0 ? `团队(${record.team_list.length}) ` : ''} ${record.courier_list.length > 0 ? `  骑士(${record.courier_list.length})` : ''}`}</span>
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
  }

  //对话框展示
  showModal = (record)=> {
    this.setState({
      visible: true,
      editKnightRule: record,
    });

    // 编辑骑士规则时的默认骑士
    const courierInitValue = [];
    const teamInitValue = [];
    for (var k = 0; k < record.courier_list.length; k++) {
      courierInitValue.push(record.courier_list[k].$oid)
    }
    for (var l = 0; l < record.team_list.length; l++) {
      teamInitValue.push(record.team_list[l].$oid)
    }
    this.setState({
      courierInitValue: courierInitValue,
      teamInitValue: teamInitValue,
    })
    // 获取此规则详情进行编辑
    this.props.getTeamListOnShow(record)

  };

  //对话框确认
  handleOk = (index, record)=> {
    const self = this;
    let { form, dispatch, teamList }=this.props;
    const { resetFields } = form;
    const rule_id = this.state.editKnightRule.id;
    form.validateFields((err, value) => {
      if (err) {
        return;
      } else {
        let values = form.getFieldsValue();
        if (values.team_list == undefined && values.teams_id == undefined) {
          message.error('请选择团队或者骑士中的一项');
          return;
        } else {
          if (values.team_list == undefined) {
            values.team_list = [];
          }
          if (values.teams_id == undefined) {
            values.teams_id = [];
          }
          const sub_areas_values = [];

          // 判断区域是父区域 还是子区域
          if (values.area_id.length > 0) {
            const numbers = values.area_id.indexOf(this.state.editKnightRule.area_id);

            for (var i = 0; i < values.area_id.length; i++) {
              if (values.area_id[i].indexOf(this.state.editKnightRule.area_id) == -1) {
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
          values.area_id = this.state.editKnightRule.area_id;
          values.sub_area_list = sub_areas_values;

          /*// 判断规则是为父级设置还是为子级区域设置
           if (values.area_id.length == 1 && values.area_id[0] == this.state.editOrderRule.area_id) {

           //此为全选中子区域列表 设置整个区域以及存在一个子区域为此区域设置规则
           values.area_id = this.state.editOrderRule.area_id;
           if (this.state.editOrderRule.sub_areas_list.length > 0) {
           const sub_areas_values = [];
           for (var i = 0; i < this.state.editOrderRule.sub_areas_list.length; i++) {
           sub_areas_values.push(this.state.editOrderRule.sub_areas_list[i].id)
           }
           values.sub_area_list = sub_areas_values;
           }
           } else {

           // 此为分别为不同的子区域设置规则
           values.sub_area_list = [];
           for (var i = 0; i < values.area_id.length; i++) {
           values.sub_area_list.push(values.area_id[i])
           }
           values.area_id = this.state.editOrderRule.area_id;
           }*/
          const _accountInfo = window.getStorageItem('accountInfo') || '{}';
          const { vendor_id } = JSON.parse(_accountInfo);
          const seller_id = sessionStorage.getItem('sellerId');
          const contract_id = sessionStorage.getItem('contractId');
          /*values.seller_id = seller_id;
           values.contract_id = contract_id;*/
          values.rule_class = 10;
          dispatch({
            type: 'editKnightRuleE',
            payload: { values, rule_id },
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

  //对话框取消
  handleCancel = (e)=> {
    this.setState({
      visible: false,
    });
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const { knightRuleListDetail, teamList, treeList } = this.props;
    const { getFieldProps, validateFields } = this.props.form;
    const data = knightRuleListDetail.data || [];
    const editKnightRule = this.state.editKnightRule;
    const supply_vendor_list_value = [];
    const sub_area_list_value = [];
    const sub_area_list_value_init = [];

    // 将区域数据整合 父级及子集放如同一数组

    sub_area_list_value.push({ id: editKnightRule.area_info.id, name: editKnightRule.area_info.name });
    for (var i = 0; i < editKnightRule.sub_area_list.length; i++) {
      sub_area_list_value.push(editKnightRule.sub_area_list[i].id);
      sub_area_list_value_init.push(editKnightRule.sub_area_list[i].id);
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
                  <span>{editKnightRule.rule_class == 'CourierAppointRule' ? '指定服务骑士' : ''}</span>
                </FormItem>
              </Col>
              <Col sm={24}>
                <FormItem label="适用区域:" {...{ "labelCol": { "span": 8 }, "wrapperCol": { "span": 9 } }}>
                  {editKnightRule.sub_area_list < 0 ?
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
                            },], trigger: 'onChange'
                          }
                        ]
                      })}
                    >
                      <TreeNode value={editKnightRule.area_info.id} title={editKnightRule.area_info.name}
                                key={editKnightRule.area_info.id}>
                        {
                        {
                          /*sub_area_list_value.map(function (item, index) {
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
                      placeholder="请选择服务区域"
                      optionFilterProp="children"
                      {...getFieldProps("area_id", {
                        validate: [
                          { rules: [{ type: 'array', required: true, message: '请选择服务区域' },], trigger: 'onChange', }
                        ],
                        initialValue: sub_area_list_value_init.length > 0 ? sub_area_list_value_init : [`${editKnightRule.area_info.id}`],
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
                  <span style={{ color: 'orange' }}>以下选项至少选择一项（团队／骑士)</span>
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
                      ],
                      initialValue:this.state.teamInitValue,
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
                            required: false, message: '请选择骑士', type: 'array',
                          },], trigger: 'onChange',
                        }
                      ],
                      initialValue: this.state.courierInitValue,
                    })}
                  >
                    {
                      teamList.data.map(function (item, index) {
                        const indexs = index;
                        return (
                          <TreeNode value={item.id} title={item.name}
                                    key={`${item.id}`}>
                            {
                              item.courier_list.map(function (item, index) {
                                return (
                                  <TreeNode value={item.id} title={item.name} key={`${item.id}`}/>
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
                                 initialValue: editKnightRule.priority,
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
module.exports = Form.create()(KnightRulesList);

