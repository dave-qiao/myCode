import React, {Component, PropTypes} from 'react';
import {Button, Table, Pagination, Popconfirm } from 'antd';
import { Link } from 'dva/router';
const {stateTransform, numberDateToStr, utcToDate} = window.tempAppTool;
let List = ({ data, _meta, page, loading, onPageChange}) => {
  const {city_name} = window.currentAppVendorInfo;
  const columns = [
    {
      "title": "城市",
      "dataIndex": "city_code",
      render: (text, record) => {
        return city_name;
      },
      "key": "city_code222"
    }, {
      "title": "区域",
      "dataIndex": "name",
      "key": "id",
      render: (text, record) => (
        <Link style={{color:'rgb(88,226,194)'}} to={"/business/area/list/detail?id=" + record.id}>{text}</Link>
      )
    }, {
      "title": "负责人",
      "dataIndex": "master",
      "key": "master"
    }, {
      "title": "联系电话",
      "dataIndex": "mobile",
      "key": "mobile"
    }, {
      "title": "状态",
      "dataIndex": "state",
      "key": "state",
      render: (text, record) => {
        return stateTransform('area_state',text);
      }
    },
    {
      "title": "创建时间",
      "dataIndex": "created_at",
      "key": "created_at",
      render: (text) => {
        const _date = utcToDate(text);
        _date.time.length = 2;
        return `${_date.date.join('-')}  ${_date.time.join(':')}`;
      }
    },
    {
      "title": "操作",
      "dataIndex": null,
      "key": null,
      render: (text, record) => {
        return (
          <p>
            <Link style={{color:'rgb(88,226,194)'}} to={"/business/area/list/edit?id=" + record.id}>编辑</Link>
          </p>
        )
      }
    }
  ];

  const pagination = {
    total: _meta.result_count || 0,
    current: page,
    pageSize: 20,
    onChange: onPageChange
  };
  let total1 = _meta.result_count;
  return (
    <div>
    <Table columns={columns} dataSource={data} loading={loading} rowKey={record => record.id} pagination={false}/>
    <Pagination
      className="ant-table-pagination"
      {...pagination}
      showTotal={total1 => `共 ${total1} 条`}
  />
  </div>
  );

};

module.exports =  List;
