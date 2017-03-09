import React, {Component, PropTypes} from 'react';
import {Button, Table, Pagination, Popconfirm } from 'antd';
import { Link } from 'dva/router';
const {stateTransform, numberDateToStr, utcToDate} = window.tempAppTool;

const List = ({ data, _meta, page, loading, onPageChange}) => {
  // 表格的列

  const columns = [
    {
      "title": "商家名称",
      "dataIndex": "seller.name",
      "key": "seller.name",
      render: (text, record) => (
        <Link style={{color:'rgb(88,226,194)'}} to={"/business/sign/list/detail?contract_id=" + record.id}>{text}</Link>
      )
    }, {
      "title": "最新修改时间",
      "dataIndex": "updated_at",
      "key": "updated_at",
      render: (text) => {
        const _date = utcToDate(text);
        _date.time.length = 2;
        return `${_date.date.join('-')}  ${_date.time.join(':')}`;
      }
    }, {
      "title": "签约时间",
      "dataIndex": "created_at",
      "key": "created_at",
      render: (text) => {
        const _date = utcToDate(text);
        _date.time.length = 2;
        return `${_date.date.join('-')}  ${_date.time.join(':')}`;
      }
    },

    {
      "title": "解约时间",
      "dataIndex": "unsigned_at",
      "key": "unsigned_at",
      render: (text,record) => {

        if(record.state == 100){
          return '--'
        }else{
          const _date = utcToDate(text);
          _date.time.length = 2;
          return `${_date.date.join('-')}  ${_date.time.join(':')}`;
        }

      }
    },
    {
      "title": "状态",
      "dataIndex": "state",
      "key": "state",
      render: (text) => {
        return stateTransform('sign_state',text);
      }
    },
    {
      "title": "操作",
      "dataIndex": null,
      "key": null,
      render: (text, record) => {
        return (
          <p>
            {record.state ==100 ?
              <Link  to={"/business/sign/list/edit?contract_id=" + record.id}>编辑</Link>
              :'--'}
          </p>
        )
      }
    }
  ];
  // 分页信息
  const pagination = {
    total: _meta.result_count || 0,
    current: page,
    pageSize: 10,
    onChange: onPageChange,

};
// 总条数
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
