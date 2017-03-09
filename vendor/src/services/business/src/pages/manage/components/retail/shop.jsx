/**
 * Created by dave 17/01/06
 * 商家信息
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import Basicinfo from './basicInfo';
import ShopMessage from './shopMessage';
import Quality from './quality';
import Tabs from '../tabs';
import style from '../../style/manage.less';

class Shop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      basicInfoData: props.basicInfoData, //基本信息组件数据
      shopMessageData: props.shopMessageData, //店铺信息组件数据
      basicInfoTitle: '基本信息',
      shopMessageTitle: '店铺信息',
      // 基本信息表头
      shopMessageTbody: [{
        title: '店铺ID',
        dataIndex: 'city',
      }, {
        title: '店铺名称',
        dataIndex: 'partner',
      }, {
        title: '联系人',
        dataIndex: 'projectName',
      }, {
        title: '联系电话',
        dataIndex: 'contactPerson',
      }, {
        title: '店铺地址',
        dataIndex: 'mobilPhone',
      }, {
        title: '创建时间',
        dataIndex: 'state',
      }],
      //分页信息

    };
  }

  onShowSizeChange(current, pageSize) {

  }

  onChange(current) {

  }

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
  }

  render() {
    const { retailSellerInfo }=this.props;
    const { basicInfoData, shopList, seller_id, contract_id }=retailSellerInfo;
    const basicInfoTitle = this.state.basicInfoTitle;
    const basicInfoProps = {
      basicInfoData,
      basicInfoTitle
    };
    const shopProps = {
      shopList
    };
    return (
      <div className="con-body main-list">
        <div className={style.reset}>
          <Link to={`/business/manage/retail/shop?id=${seller_id}`}>
            <span className={`${style.tabsActive}`}
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
            <span className={`${style.tabs} ${style.marginLeft16}`}
                  onClick={this.typeChange.bind(this, '骑士分单规则')}>骑士分单规则</span>
          </Link>
        </div>
        <Basicinfo {...basicInfoProps}/>
        <ShopMessage
          {...shopProps}
          onShowSizeChange={this.onShowSizeChange}
          onChange={this.onChange}/>
        <Quality/>
      </div>
    )
  }
}

function mapStateToProps({ business_public, retailSellerInfo }) {
  return { business_public, retailSellerInfo }
}
module.exports = connect(mapStateToProps)(Shop);
