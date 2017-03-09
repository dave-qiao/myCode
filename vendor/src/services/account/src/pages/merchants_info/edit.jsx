import React, {Component, PropTypes} from 'react';
import {Form, Input, Icon, Button, Row, Col, Upload, Select, message} from 'antd';
const [FormItem, Option, Dragger] = [Form.Item, Select.Option, Upload.Dragger]
const cities = window.appGlobalInfos.city;

class EditView extends React.Component {

  constructor(props) {
    super()
    this.form = props.form;
    this.vendor_id = window.currentAppVendorInfo.id;
  }


  handleSubmit = (e) => {
    e.preventDefault();
    const {didSubmit, form, details} = this.props;
    let stop_flag = false;
    let msgs = { txt: '', arr: { "1": '身份证正面', "3": '手持身份证照', "5": '营业执照', } };
    form.validateFieldsAndScroll((err,value) => {
      if (err) {
        stop_flag = true;
        return ;
      };
    });
    if(stop_flag) {
      //验证拦截
      return;
    };

    if(!details.apply_info.images){
      message.info(`请上传身份证正面照！`);
      return;
    }
    if (details.apply_info.images) {
      ['5','3','1'].forEach(item => {
        const _type1 = typeof details.apply_info.images[item];
        let _type2 = '';
        if (_type1 !== 'undefined') {
          _type2 = typeof details.apply_info.images[item].thumb_medium;
        };
        if (_type1 === 'undefined' || _type2 === 'undefined') {
          stop_flag = true;
          msgs.txt = msgs.arr[item];
        };
      });

    } else {
      msgs.txt = msgs.arr['1'];
    }
    if(stop_flag) {
      if (msgs.txt.length !== 0) {
        message.info(`请上传${msgs.txt}`);
      };
      return;
    };
    let values = form.getFieldsValue();

    didSubmit(values);
  }

  getUploadStyle = (path) => {
    const _path = path ? path.thumb_medium : '';
    return {style: {
      background: `url(${_path}) center center no-repeat`,
      backgroundSize: 'contain',
    }};
  }

  render() {
    const {getFieldProps, validateFields, getFieldsValue} = this.form;
    const {details, areas, handleUpload, cancel_Edit} = this.props;
    const {biz_profile = {}} = details;
    const uploadProps = {
      name: 'file',
      showUploadList: false,
      action: '/upload.do',
    };
    const {handleSubmit, getUploadStyle} = this;
    let apply_info_images = {images: {'1':{},'3':{},'5':{}}};
    if(details.apply_info.images) {
      Object.assign(apply_info_images,details.apply_info.images);
    };


    let _city_name = '';

    // 获取城市代码并且转码
    const citys = window.appGlobalInfos.city;
    let n = citys.index.indexOf(details.city_code);
    if(n!=-1){
      _city_name = citys.data[n].name;

    }else{
      _city_name = '无该城市';
    }
    return (
      <Form horizontal onSubmit={handleSubmit} className="main-form">
        <h3 className="form-divider-header" style={{width:'99%',margin: '0px'}}>基本信息</h3>
        <Row type="flex" justify="center" align="top">
          <Col sm={10}>
              <FormItem label="商户类型" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
                服务商
              </FormItem>

              <FormItem label="城市" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
                {/*<Select {...getFieldProps("city_code",{initialValue: details.city_code})}>*/}
                {/*{cities.data.map( (item, index) => {*/}
                  {/*return (<Option key={index} value={item._id}>{item.name}</Option>);*/}
                {/*})}*/}
                {/*</Select>*/}
                {_city_name}
              </FormItem>

              <FormItem label="法人姓名" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
                <Input {...getFieldProps("owner_name", { initialValue: biz_profile.legal_name,
                  validate: [
                    { rules: [ { required: true, max: 10, message: '请填写法人姓名, 且内容长度不超过10个字符'}, ], trigger: 'onBlur', }
                  ]
                 })} />
              </FormItem>
          </Col>
          <Col sm={10}>
            <FormItem label="商户号" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
              {details.vendor_no}
            </FormItem>
            <FormItem label="商户名称" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
              <Input {...getFieldProps("name", { initialValue: details.name,
                validate: [
                  { rules: [ { required: true, max: 30, message: '请填写商户名称, 且内容长度不超过30个字符'}, ], trigger: 'onBlur', }
                ]
               })} />
            </FormItem>

          </Col>
        </Row>
        <h3 className="form-divider-header">认证资料</h3>
        <Row  type="flex" justify="center">
          <Col sm={16}>
            <FormItem label="法人身份证号" {...{"labelCol":{"span":4},"wrapperCol":{"span":8}}}>
               <Input {...getFieldProps("id_card_sn", { initialValue: biz_profile.id_card_sn,
                 rules: [
                  {
                    required: true,
                    trigger: 'onBlur',
                    validator: (rule, value, callback) => {
                      if(!value) { callback('请填写法人身份证'); return ; };
                      if (!(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value))) { callback('请输入正确的身份证号'); return ; }
                      callback();
                    },
                  }
                ],
                })} placeholder="法人身份证号" />
            </FormItem>
          </Col>
        </Row>
        <Row  type="flex" justify="center">
          <Col sm={22} className="check-img-list">
            <FormItem label="身份证正面"></FormItem>
          </Col>
          <Col sm={11} className="check-img-list">
            <FormItem  {...{"wrapperCol":{"span":22}}}>
                <div className="img-con" {...getUploadStyle(apply_info_images['1'])}>
                  <Dragger {...uploadProps} beforeUpload={(file) => { handleUpload({ asset_type: 1, file }); return false; }}>
                    <Icon type="plus" />
                  </Dragger>
                </div>
            </FormItem>
          </Col>
          <Col sm={11} className="check-img-list">
            <FormItem  {...{"wrapperCol":{"span":22}}}>
              <img src="/images/example_id_card2.jpg" {...{alt:"图片加载失败"}}/>
            </FormItem>
          </Col>
        </Row>
        <Row  type="flex" justify="center">
          <Col sm={22} className="check-img-list">
            <FormItem label="手持身份证照"></FormItem>
          </Col>
          <Col sm={11} className="check-img-list">
            <FormItem {...{"wrapperCol":{"span":22}}}>
                <div className="img-con" {...getUploadStyle(apply_info_images['3'])}>
                  <Dragger {...uploadProps} beforeUpload={(file) => { handleUpload({ asset_type: 3, file }); return false; }}>
                    <Icon type="plus" />
                  </Dragger>
                </div>
            </FormItem>
          </Col>
          <Col sm={11} className="check-img-list">
            <FormItem {...{"wrapperCol":{"span":22}}}>
              <img src="/images/example_id_card1.jpg" {...{ alt:"图片加载失败"}}/>
            </FormItem>
          </Col>
        </Row>
        <Row  type="flex" justify="center">
          <Col sm={22} className="check-img-list">
            <FormItem label="营业执照"></FormItem>
          </Col>
          <Col sm={11} className="check-img-list">
            <FormItem {...{"wrapperCol":{"span":22}}}>
                <div className="img-con" {...getUploadStyle(apply_info_images['5'])}>
                  <Dragger {...uploadProps} beforeUpload={(file) => { handleUpload({ asset_type: 5, file }); return false; }}>
                    <Icon type="plus" />
                  </Dragger>
                </div>
            </FormItem>
          </Col>
          <Col sm={11} className="check-img-list">
            <FormItem {...{"wrapperCol":{"span":22}}}>
              <img src="/images/example_license.jpg" {...{ alt:"图片加载失败"}}/>
            </FormItem>
          </Col>
        </Row>
        <Row  type="flex" justify="center">
          <Button onClick={() => {cancel_Edit()}}>取消</Button>
          <Button type="primary" htmlType="submit">保存</Button>
        </Row>
      </Form>
    );

  }
};


module.exports =  Form.create()(EditView);
