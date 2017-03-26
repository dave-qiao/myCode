/**
 * Created by dave 17/01/06
 * 商家信息
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import Basicinfo from '../retail/basicInfo';
import ShopMessage from '../retail/shopMessage';
import Quality from '../retail/quality';
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

  render() {
    const { manageRetail }=this.props;
    const { basicInfoData, shopList }=manageRetail;
    const basicInfoTitle = this.state.basicInfoTitle;
    const basicInfoProps = {
      basicInfoData,
      basicInfoTitle
    }

    const shopProps = {
      shopList
    }

    return (
      <div className="con-body main-list">
        <div className={style.reset}>
          <Link to="/business/manage/affiliates/info">
            <span className={`${style.tabsActive}`}>商家信息</span>
          </Link>
          <Link to="/business/manage/affiliates/knigh">
            <span className={`${style.tabs} ${style.marginLeft16}`}>骑士分单规则</span>
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

function mapStateToProps({ manageRetail }) {
  return { manageRetail }
}
module.exports = connect(mapStateToProps)(Shop);
