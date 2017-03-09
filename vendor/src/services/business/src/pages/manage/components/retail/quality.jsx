/**
 * Created by dave 17/01/07
 * 资质认证组件
 */
import React, {Component, PropTypes} from 'react';
import style from '../../style/manage.less';
import {Row, Col} from 'antd';
class Quality extends Component {
  render() {
    return (
      <div className={style.retail}>
        <div className="bd-content">
          <h4 className={style.navLeftBorder}>资质认证</h4>
          <div className={style.navBottomBorder}></div>
          <div className={style.quality}>
            <Row type="flex" justify="space-around">
              <Col>
                <h2>为保证其信息安全,隐藏其资质认证的信息!</h2>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}
export default Quality;
