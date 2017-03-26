/**
 * Created by dave 17/01/07
 * 店铺信息模板
 */
import React, { Component, PropTypes } from 'react';
import style from '../../style/manage.less';
import { Table } from 'antd';
import { dateFormatNew } from '../../../../../../../utils/newUtils';

class ShopMessage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //模块头部标题
      title: '店铺信息',
      //模块表头
      dataColumns: [{
        title: '店铺ID',
        dataIndex: 'id',
      }, {
        title: '店铺名称',
        dataIndex: 'name',
      }, {
        title: '联系人',
        dataIndex: 'linkman',
      }, {
        title: '联系电话',
        dataIndex: 'mobile',
      }, {
        title: '店铺地址',
        dataIndex: 'address',
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        render:function (text, record) {
          return (
            <span>{dateFormatNew(text)}</span>
          )
        },
      }],
      //表格分页设置
      pagination: {
        total: this.props.shopList._meta.result_count,
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
    };
  }

  render() {
    const { shopList }= this.props;
    return (
      <div className={style.retail}>
        <div className="bd-content">
          <h4 className={style.navLeftBorder}>{this.state.title}</h4>
          <div className={style.navBottomBorder}></div>
          <Table columns={this.state.dataColumns} dataSource={shopList.data}
                 pagination={this.state.pagination}/>
        </div>
      </div>
    )
  }
}
export default ShopMessage;
