import React, {Component, PropTypes} from 'react';
import {Form, Row, Col,Button} from 'antd';

const {stateTransform} = window.tempAppTool;
const [FormItem,
  ] = [Form.Item];
const detailView = ({details, change_to_Edit, apply_verify}) => {
  const {biz_profile = {}, city_code, verify_state} = details;
  const user_mobile = window.currentAppUserInfo.mobile;
  const cities = window.appGlobalInfos.city;
  let [city_name, apply_info,images, verify_name, verify_note] = ['', {} , {'1':{},'2':{},'3':{}}, '', ''];
  if(city_code){
    city_name = cities.data[cities.index.indexOf(city_code)].name;
  };
  verify_name = stateTransform('verify_state',verify_state);
  if(details.apply_info) {
    Object.assign(images,details.apply_info.images);
    apply_info = details.apply_info;
  };
  if(apply_info.state === -100 && verify_state === 0) {
    verify_name = '驳回';
    verify_note = apply_info.note;
  };
  return (
    <Form horizontal className="main-form">
      <h3 className="form-divider-header" style={{ margin: '0px' }}>基本信息</h3>
      <Row type="flex" justify="center" align="top">
        <Col sm={10}>
            <FormItem label="商户类型" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
              服务商
            </FormItem>

            <FormItem label="城市" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
              {city_name}
            </FormItem>

            <FormItem label="法人姓名" {...{"labelCol":{"span":4},"wrapperCol":{"span":12}}}>
                {biz_profile.legal_name}
            </FormItem>
            <FormItem label="审核状态" {...{"labelCol":{"span":4},"wrapperCol":{"span":15}}}>
              {verify_name}
            </FormItem>
        </Col>
        <Col sm={10}>
            <FormItem label="商户号" {...{"labelCol":{"span":4},"wrapperCol":{"span":12}}}>
                {details.vendor_no}
            </FormItem>
            <FormItem label="商户名称" {...{"labelCol":{"span":4},"wrapperCol":{"span":12}}}>
                {details.name}
            </FormItem>
            <FormItem label="联系电话" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
              {user_mobile}
            </FormItem>
            {
              verify_name === '驳回'
              ? <FormItem label="驳回原因" {...{"labelCol":{"span":4},"wrapperCol":{"span":15}}}>
                {verify_note}
              </FormItem>
              : ''
            }
        </Col>

      </Row>
      {/*<h3 className="form-divider-header">资质认证</h3>*/}
      {/*<Row type="flex" justify="center" align="top">*/}

        {/*<Col sm={10}>*/}
          {/*<FormItem label="法人身份证号" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>*/}
              {/*{biz_profile.id_card_sn}*/}
          {/*</FormItem>*/}
        {/*</Col>*/}
        {/*<Col sm={10}>*/}
        {/*</Col>*/}
      {/*</Row>*/}
      <Row type="flex" justify="center" align="top">
        <Col sm={10} style={{textAlign:'center'}}>
            {
              verify_state === 1 || verify_state === 100
              ? ''
              : <Button onClick={() => {change_to_Edit('-100')}}>编辑</Button>
            }
            {
              verify_state === 0 || verify_state === -100
              ? <Button style={{textAlign:'center', marginLeft:20,width:'100px',backgroundColor:'rgb(88,226,194)',
                borderColor:'rgb(88,226,194)',color:'#fff'}} onClick={() => {apply_verify({id_card_sn: biz_profile.id_card_sn || ''})}}>提交审核</Button>
              : ''
            }
        </Col>
      </Row>
    </Form>
  );

};

module.exports =  detailView;
