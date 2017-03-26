/**
 * Created by dave 17/01/06
 * 基本信息模板
 */
import React, {Component, PropTypes} from 'react';
import style from '../../style/manage.less';
import {Form, Row, Col} from 'antd';
const FormItem = Form.Item;

class Basicinfo extends Component {
  constructor(props) {
    super(props)
    //正式
    /*this.state = {
     data: props
     }*/
    //mock
    this.state = {
      title: '基本信息1',
      data: [
        {
          noun: '商户号',
          value: '111',
        }, {
          noun: '审核状态',
          value: '222'
        }, {
          noun: '注册日期',
          value: '333'
        }, {
          noun: '商家名称',
          value: '444'
        }, {
          noun: '所属城市',
          value: '555'
        }, {
          noun: '联系人',
          value: '666'
        }, {
          noun: '商家类型',
          value: '777'
        }, {
          noun: '商户状态',
          value: '888'
        }, {
          noun: '注册手机',
          value: '999'
        },
      ]
    }
  }

  render() {
    return (
      <div className={style.retail}>
        <div className="bd-content">
          <h4 className={style.navLeftBorder}>{this.props.basicInfoTitle}</h4>
          <div className={style.navBottomBorder}></div>
          <Form>
            <Row>
              {
                this.props.basicInfoData.map(function (item, index) {
                  return (
                    <Col sm={12} key={index}>
                      <FormItem label={`${item.noun}:`} {...{
                        "labelCol": {"span": 6},
                        "wrapperCol": {"span": 8}
                      }} key={index}>
                        <span key={index}>{item.value}</span>
                      </FormItem>
                    </Col>
                  )
                })
              }
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}
export default Basicinfo;
