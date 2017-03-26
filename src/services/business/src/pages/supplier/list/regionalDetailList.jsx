/**
 *  Created by dave
 *  区域模块数据列表
 */
import React, { Component, PropTypes } from 'react';
import { Link } from 'dva/router';
import { Button, Switch, Row, Col, Table, Pagination, Popconfirm, message } from 'antd';
import SupplierDetailTab from './detailTabs';
import style from '../style/supplier.less';
import { getCityNameByCode } from '../../../../../../utils/authHelper.js'

class RegionAlDetailList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: true,
      columns: [
        {
          "title": "合作状态",
          "dataIndex": "service_city_code",
          "key": "service_city_code",

          render: (text, record, index)=> {
            return (
              <div>
                <div>
                  <Popconfirm
                    style={{ width: '200px!important' }}
                    title={record.state == 100 ? `关闭合作后，该区域中的业务订单将不再分配
                    给该服务商您确定要关闭此配送区域的合作关系吗?` : `开启合作后，可以将该区域中的业务订单分配
                    给该服务商，确认现在开启该配送区域的合作关系吗?`}
                    onConfirm={this.confirm.bind(this, record)}
                    onCancel={this.cancel} okText="确认" cancelText="取消">
                    <a href="#"><Switch checked={record.state == 100 ? true : false} checkedChildren={'开'}
                                        unCheckedChildren={'关'}/></a>
                  </Popconfirm>
                </div>
              </div>
            )
          }
        }, {
          "title": "城市",
          "dataIndex": "city_code",
          render: (text, record) => {
            const text2 = getCityNameByCode(record.city_code);
            return (
              <span key={text}>{text2}</span>
            )
          }
        }, {
          "title": "区域名称",
          "dataIndex": "area_name",
          "key": "mobile"
        }, {
          "title": "区域状态",
          "dataIndex": "state",
          render: (text, record) => {
            return (
              <span>{record.area.state == 100 ? '启用' : '禁用'}</span>
            )
          }
        }
      ],
      pagination: {
        total: this.props.areaList._meta.result_count || 0,
        current: 1,
        pageSize: 10
      }
    }
  }

  confirm = (record)=> {
    message.success('操作成功');
    const biz_area_id = record.id;
    let state = '';
    if (record.state > 0) {
      state = -100;
    }
    if (record.state < 1) {
      state = 100;
    }
    const values = {
      biz_area_id: biz_area_id,
      state: state,
    };
    this.props.edit(values)

  };

  cancel = ()=> {

  };

  onPageChange = (page) => {
    this.props.page(page);
    this.setState({
      pagination: {
        total: this.props.areaList._meta.result_count || 0,
        current: page,
        pageSize: 10
      }
    })
  }

  render() {
    const { areaList } = this.props;
    return (
      <div style={{ textAlign: 'center' }}>
        <Table columns={this.state.columns} dataSource={areaList.data} pagination={false}/>
        <Pagination
          className="ant-table-pagination"
          {...this.state.pagination}
          showTotal={total1 => `共 ${areaList._meta.result_count} 条`}
          onChange={this.onPageChange}
        />
      </div>
    )
  }
}
;
module.exports = RegionAlDetailList;
