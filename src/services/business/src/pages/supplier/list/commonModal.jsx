/**
 * Created by dave 17/1/2
 * 公共弹出对话框组件
 */
import React, {Component, PropTypes} from 'react';
import {Select, Row, Col, Button, Modal, Form} from 'antd';
import data from '../../../../../../assets/citys/city.json';
const city = data.data;


export default class CommonModal extends Component{
  constructor(){
    super()
    this.state={
      visible:false
    }
  }
  showModal=()=> {
    this.setState({
      visible: true,
    });
  }
  handleOk=()=> {
    this.setState({
      visible: false,
    });
  }
  handleCancel=(e)=> {
    this.setState({
      visible: false,
    });
  }
  render(){
    return (
      <div>
        <Row>
          <Col sm={12}>
            <Modal title="添加新成员" visible={this.state.visible}
                   onOk={this.handleOk} onCancel={this.handleCancel}
                   style={{top: '35%'}}
            >

            </Modal>
          </Col>
        </Row>
      </div>
    )
  }
}
