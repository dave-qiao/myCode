/**
 * Created by dave 17/1/10
 */
import React, {Component, PropTypes} from 'react';
import {Link} from 'dva/router';
import style from '../style/manage.less';

class Tabs extends Component {
  //根据传进来不同的值获取不同类型的数据  从而渲染同一个模板
  typeChange = () => {
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
    return (
      <div>
        <div className={style.reset}>
          <Link to="/business/manage/retail/shop">
            <span className={`${style.tabs}`}
                  onClick={this.typeChange.bind(this, '商家信息')}>商家信息</span>
          </Link>
          <Link to="/business/manage/retail/signed">
            <span className={`${style.tabs} ${style.marginLeft16}`}
                  onClick={this.typeChange.bind(this, '签约信息')}>签约信息</span>
          </Link>
          <Link to="/business/manage/retail/orderDispatchRules">
            <span className={`${style.tabs} ${style.marginLeft16}`}
                  onClick={this.typeChange.bind(this, '订单分单规则')}>订单分单规则</span>
          </Link>
          <Link to="/business/manage/retail/knightDispatchRules">
            <span className={`${style.tabsActive} ${style.marginLeft16}`}
                  onClick={this.typeChange.bind(this, '骑士分单规则 ')}>骑士分单规则</span>
          </Link>
        </div>
      </div>
    )
  }
}
export default Tabs;
