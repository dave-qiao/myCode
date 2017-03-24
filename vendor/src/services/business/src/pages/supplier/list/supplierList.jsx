/**
 * Created by dave 17/1/2
 * 供应商信息列表
 */
import React, { Component } from 'react';
import { Table, Pagination } from 'antd'
import { Link } from 'dva/router';
import { getCityNameByCode } from '../../../../../../utils/authHelper.js'

export default class SupList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        total: this.props.supplierList._meta.result_count || 0,
        current: 1,
        pageSize: 1,
      },
      columns: [
        {
          "title": "城市",
          "dataIndex": "service_city_code",
          render: (text, record) => {
            const text2 = getCityNameByCode(record.service_city_code[0]);
            return (
              <span key={text}>{text2}</span>
            )
          }
        }, {
          "title": "商户号",
          "dataIndex": "expresses_paper_no",
          render: (text, record)=> {
            return (
              <span>{record.supply_vendor ? record.supply_vendor.org_no : ''}</span>
            )
          }
        }, {
          "title": "供应商名称",
          "dataIndex": "name",
          "key": "mobile"
        }, {
          "title": "合作状态",
          "dataIndex": "state",
          render: (text, record) => {
            return (
              <span>{text == 100 ? '合作' : '未合作'}</span>
            )
          }
        }, {
          "title": "是否开始业务",
          "dataIndex": "business_state",
          "key": "id",
          render: (text) => {
            return (
              <span>{text == 100 ? '开启' : '关闭'}</span>
            );
          }
        },
        {
          "title": "负责人",
          "dataIndex": "legal_name",
          render: (text, record)=> {
            return (
              <span>{record.supply_vendor ? record.supply_vendor.account_name : ''}</span>
            )
          }
        },
        {
          "title": "联系电话",
          "dataIndex": "company_contact_mobile",
          "key": "company_contact_mobile",
          render: (text, record)=> {
            return (
              <span>{record.supply_vendor ? record.supply_vendor.mobile : ''}</span>
            )
          }
        }, {
          "title": "合作区域数",
          "dataIndex": "biz_area_count",
          "key": "created_at",
        }, {
          "title": "操作",
          "dataIndex": 's',
          render: (text, record) => {
            return (
              <p>
                <Link style={{
                  color: 'rgb(88,226,194)'
                }} to={"/business/supplier/list/suppliers?id=" + record.id} onClick={this.saveId.bind(this, record)}>供应商信息</Link>
                <span>{`   `}</span>
                <Link style={{
                  color: 'rgb(88,226,194)'
                }} to={"/business/supplier/list/regionalList?id=" + record.supply_vendor_id}
                      onClick={this.saveId.bind(this, record)}>区域列表</Link>
              </p>
            )
          }
        }
      ],
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { supplierList, city_code } = nextProps;
    this.setState({
      pagination: {
        total: supplierList._meta.result_count || 0,
        current: 1,
        pageSize: 10,
      },
      city_code: city_code,
    })
  }

  onPageChange = (page) => {
    const userInfo = window.getStorageItem('userInfo') || '{}';
    const total = this.state.pagination.total;
    this.setState({
      pagination: {
        total:total,
        current: page,
        pageSize: 10,
      },
    });

    const { dispatch, city_code } = this.props;
    const _accountInfo = window.getStorageItem('accountInfo') || '{}';
    const { vendor_id } = JSON.parse(_accountInfo);

    this.page = page;
    const limit = 10;
    dispatch({
      type: 'getSupplierListE',
      payload: { vendor_id, city_code, page, limit },
    });
  };

  // 保存供应商Id
  saveId = (record) => {
    const { dispatch } = this.props;
    const biz_info_id = record.id;
    const supply_vendor_id = record.supply_vendor_id;
    const city_code = record.service_city_code[0];
    this.props.saveId(biz_info_id, supply_vendor_id, city_code);
    console.log(city_code,'saveId')
  };

  render() {
    const { supplierList } = this.props;
    return (
      <div>
        <Table columns={this.state.columns} dataSource={supplierList.data} pagination={false}></Table>
        <Pagination
          className="ant-table-pagination"
          {...this.state.pagination}
          showTotal={total1 => `共 ${total1} 条`}
          onChange={this.onPageChange}
        />
      </div>
    )
  }
}
