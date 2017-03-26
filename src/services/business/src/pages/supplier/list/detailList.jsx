/**
 *  Created by dave
 *  供应商信息模块
 */
import React, { Component, PropTypes } from 'react';
import { Link } from 'dva/router';
import { Button, Switch, Row, Col, Form, Input, Icon, Select, TreeSelect } from 'antd';
import style from '../style/supplier.less';
import { getCityNameByCode } from '../../../../../../utils/authHelper.js';
import data from '../../../../../../assets/citys/city.json';
const [FormItem, Option, TreeNode] = [Form.Item, Select.Option, TreeSelect.TreeNode];
const city = data.data;

class SupplierDetailList extends React.Component {
  constructor() {
    super()
  }

  handleSubmit = (e)=> {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        /*const values = form.getFieldsValue()*/
        this.props.edit(values);
      }
    });
  }

  render() {
    const { supplierDetail } = this.props;
    const { getFieldProps }=this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <div className="bd-content">
          <div className={style.courierAll}>
            <h4 className={style.navLeftBorder}>基本信息</h4>
            <div className={style.navBottomBorder}></div>
            <Row>
              <Col sm={12}>
                <FormItem label="供应商名称:" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="供应商名称" disabled {...getFieldProps('name', {
                    initialValue: supplierDetail.name,
                    rules: [{ required: true, message: '请输入供应商名称' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="加盟商" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="加盟商" disabled {...getFieldProps('vendor_name', {
                    initialValue: supplierDetail.vendor_name,
                    rules: [{ required: true, message: '请输入加盟商' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="公司全称:" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="公司全称" disabled {...getFieldProps('full_name', {
                    initialValue: supplierDetail.full_name,
                    rules: [{ required: true, message: '请输入公司全称' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="申请加盟城市" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Select placeholder="申请加盟城市" disabled {...getFieldProps('service_city_code', {
                    initialValue: supplierDetail.service_city_code,
                    rules: [{ required: true, message: '请输入申请加盟城市' }],
                  })}>
                    {
                      city.map(function (item, index) {
                        return (
                          <Option key={item._id} value={item._id}>{item.name}</Option>
                        )
                      })
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="公司成立时间" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="公司成立时间" disabled {...getFieldProps('company_created_at', {
                    initialValue: supplierDetail.company_created_at,
                    rules: [{ required: true, message: '请输入公司成立时间' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="公司注册地址" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="公司注册地址" disabled {...getFieldProps('company_register_address', {
                    initialValue: supplierDetail.company_register_address,
                    rules: [{ required: true, message: '请输入公司注册地址' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="公司注册城市" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Select placeholder="公司注册城市" disabled {...getFieldProps('company_created_city_code', {
                    initialValue: supplierDetail.company_created_city_code,
                    rules: [{ required: true, message: '请输入公司注册城市' }],
                  })}>
                    {
                      city.map(function (item, index) {
                        return (
                          <Option key={item._id} value={item._id}>{item.name}</Option>
                        )
                      })
                    }
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="公司办公地址" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="公司办公地址" disabled {...getFieldProps('company_address', {
                    initialValue: supplierDetail.company_address,
                    rules: [{ required: true, message: '请输入公司办公地址' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="公司类型" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="公司类型" disabled {...getFieldProps('company_type', {
                    initialValue: supplierDetail.company_type,
                    rules: [{ required: true, message: '请输入公司类型' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="注册资金(单位:万元)" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="注册资金(单位:万元)" disabled {...getFieldProps('register_money', {
                    initialValue: supplierDetail.register_money,
                    rules: [{ required: true, message: '请输入注册资金' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="公司主营业务" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="公司主营业务" disabled {...getFieldProps('company_business', {
                    initialValue: supplierDetail.company_business,
                    rules: [{ required: true, message: '请输入公司主营业务' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="公司传真号码" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="公司传真号码" disabled {...getFieldProps('company_fax', {
                    initialValue: supplierDetail.company_fax,
                    rules: [{ required: true, message: '请输入公司传真号码' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="公司固话" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="公司固话" disabled {...getFieldProps('company_tel', {
                    initialValue: supplierDetail.company_tel,
                    rules: [{ required: true, message: '请输入公司固话' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="紧急联系人电话" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="紧急联系人电话" disabled {...getFieldProps('company_contact_mobile', {
                    initialValue: supplierDetail.company_contact_mobile,
                    rules: [{ required: true, message: '请输入紧急联系人电话' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="紧急联系人" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="紧急联系人" disabled {...getFieldProps('company_contact_name', {
                    initialValue: supplierDetail.company_contact_name,
                    rules: [{ required: true, message: '请输入紧急联系人' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="备注" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="备注" disabled {...getFieldProps('note', {
                    initialValue: supplierDetail.note,
                    rules: [{ required: true, message: '请输入备注信息' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="公司网址" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="公司网址" disabled {...getFieldProps('company_site', {
                    initialValue: supplierDetail.company_site,
                    rules: [{ required: true, message: '请输入公司网址' }],
                  })}/>
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>

        <div className="bd-content">
          <div className={style.courierAll}>
            <h4 className={style.navLeftBorder}>调研信息</h4>
            <div className={style.navBottomBorder}></div>
            <Row>
              <Col sm={12}>
                <FormItem label="可支配流动资金(单位:万元):" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="可支配流动资金(单位:万元)" disabled {...getFieldProps('working_cash', {
                    initialValue: supplierDetail.working_cash,
                    rules: [{ required: true, message: '请输入可支配流动资金' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="年收入(单位:万元)" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="年收入(单位:万元)" disabled {...getFieldProps('year_income', {
                    initialValue: supplierDetail.year_income,
                    rules: [{ required: true, message: '请输入年收入' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="预计投入(单位:万元)" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="预计投入(单位:万元)" disabled {...getFieldProps('invested', {
                    initialValue: supplierDetail.invested,
                    rules: [{ required: true, message: '请输入预计投入' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="从业时长(单位:月)" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="从业时长(单位:月)" disabled {...getFieldProps('operate_time', {
                    initialValue: supplierDetail.operate_time,
                    rules: [{ required: true, message: '请输入从业时长' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="现有骑手人数(单位:人)" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="现有骑手人数(单位:人)" disabled {...getFieldProps('courier_count', {
                    initialValue: supplierDetail.courier_count,
                    rules: [{ required: true, message: '请输入现有骑手人数' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="骑手商业意外险" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Select placeholder="骑手商业意外险" disabled {...getFieldProps('accident_insurance', {
                    initialValue: supplierDetail.accident_insurance,
                    rules: [{ required: true, message: '请输入骑手商业意外险', type: 'boolean' }],
                  })}>
                    <Option value={false}>无</Option>
                    <Option value={true}>有</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="现有管理人员人数" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="现有管理人员人数" disabled {...getFieldProps('manager_count', {
                    initialValue: supplierDetail.manager_count,
                    rules: [{ required: true, message: '请输入现有管理人员人数' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="团队规模(单位:人)" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="现有管理人员人数" disabled {...getFieldProps('team_count', {
                    initialValue: supplierDetail.team_count,
                    rules: [{ required: true, message: '请输入现有管理人员人数' }],
                  })}/>
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>

        <div className="bd-content">
          <div className={style.courierAll}>
            <h4 className={style.navLeftBorder}>资质审核</h4>
            <div className={style.navBottomBorder}></div>
            <Row>
              <Col sm={12}>
                <FormItem label="营业执照编号:" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="营业执照编号" disabled {...getFieldProps('company_business_no', {
                    initialValue: supplierDetail.company_business_no,
                    rules: [{ required: true, message: '请输入营业执照编号' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="统一社会信用编号" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="统一社会信用编号" disabled {...getFieldProps('credit_no', {
                    initialValue: supplierDetail.credit_no,
                    rules: [{ required: true, message: '请输入统一社会信用编号' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="企业法人" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="企业法人" disabled {...getFieldProps('legal_name', {
                    initialValue: supplierDetail.legal_name,
                    rules: [{ required: true, message: '请输入企业法人' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="企业法人身份证号" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="企业法人身份证号" disabled {...getFieldProps('legal_passport', {
                    initialValue: supplierDetail.legal_passport,
                    rules: [{ required: true, message: '请输入企业法人身份证号' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="企业法人手机号" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="企业法人手机号" disabled {...getFieldProps('legal_mobile', {
                    initialValue: supplierDetail.legal_mobile,
                    rules: [{ required: true, message: '请输入企业法人手机号' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="企业法人邮箱" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="企业法人邮箱" disabled {...getFieldProps('legal_email', {
                    initialValue: supplierDetail.legal_email,
                    rules: [{ required: true, message: '请输入企业法人邮箱' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="三证合一证件失效日期" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="三证合一证件失效日期" disabled {...getFieldProps('integrate_paper_expire_date', {
                    initialValue: supplierDetail.integrate_paper_expire_date,
                    rules: [{ required: true, message: '请输入三证合一证件失效日期' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="食品流通许可证证件失效日期" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="食品流通许可证证件失效日期" disabled {...getFieldProps('food_paper_expire_date', {
                    initialValue: supplierDetail.food_paper_expire_date,
                    rules: [{ required: true, message: '请输入食品流通许可证证件失效日期' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="食品流通许可证编号" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="食品流通许可证编号" disabled {...getFieldProps('food_paper_no', {
                    initialValue: supplierDetail.food_paper_no,
                    rules: [{ required: true, message: '请输入食品流通许可证编号' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="快递经营许可证证件失效日期" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="快递经营许可证证件失效日期" disabled {...getFieldProps('expresses_paper_expire_date', {
                    initialValue: supplierDetail.expresses_paper_expire_date,
                    rules: [{ required: true, message: '请输入快递经营许可证证件失效日期' }],
                  })}/>
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label="快递经营许可证编号" {...{ "labelCol": { "span": 6 }, "wrapperCol": { "span": 12 } }}>
                  <Input placeholder="快递经营许可证编号" disabled {...getFieldProps('expresses_paper_no', {
                    initialValue: supplierDetail.expresses_paper_no,
                    rules: [{ required: true, message: '请输入快递经营许可证编号' }],
                  })}/>
                </FormItem>
              </Col>
              <div>
                <Row>
                  <Col sm={24}>
                    <FormItem label="营业执照" {...{ "labelCol": { "span": 2 }, "wrapperCol": { "span": '' } }}>
                      <img src={supplierDetail.company_business_assets[0] || ''} className={style.supplierImg}
                           alt="无上传图片"/>
                      <img src={supplierDetail.company_business_assets[1] || ''} className={style.supplierMrImg}
                           alt="无上传图片"/>
                      <img src={supplierDetail.company_business_assets[2] || ''} className={style.supplierMrImg}
                           alt="无上传图片"/>
                    </FormItem>
                  </Col>
                  <Col sm={24}>
                    <FormItem label="三证合一" {...{ "labelCol": { "span": 2 }, "wrapperCol": { "span": '' } }}>
                      <img src={supplierDetail.integrate_paper_assets[0] || ''} className={style.supplierImg}
                           alt="无上传图片"/>
                    </FormItem>
                  </Col>
                  <Col sm={24}>
                    <FormItem label="法人身份证件照" {...{ "labelCol": { "span": 2 }, "wrapperCol": { "span": '' } }}>
                      <Row>
                        <img src={supplierDetail.legal_passport_assets[0] || ''} className={style.supplierImg}
                             alt="无上传图片"/>
                        <img src={supplierDetail.legal_passport_assets[1] || ''} className={style.supplierMrImg}
                             alt="无上传图片"/>
                        <img src={supplierDetail.legal_passport_assets[2] || ''} className={style.supplierMrImg}
                             alt="无上传图片"/>
                      </Row>
                    </FormItem>
                  </Col>
                  <Col sm={24}>
                    <FormItem label="食品流通许可证" {...{ "labelCol": { "span": 2 }, "wrapperCol": { "span": '' } }}>
                      <img src={supplierDetail.food_paper_assets[0] || ''} className={style.supplierImg} alt="无上传图片"/>
                    </FormItem>
                  </Col>
                  <Col sm={24}>
                    <FormItem label="快递经营许可证" {...{ "labelCol": { "span": 2 }, "wrapperCol": { "span": '' } }}>
                      <img src={supplierDetail.expresses_paper_assets[0] || ''} className={style.supplierImg}
                           alt="无上传图片"/>
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </Row>
          </div>
        </div>
        <Row type="flex" justify={'center'}>
          <Col sm={5}>
            <FormItem>
              <Button><Link to="business/supplier/list">返回</Link></Button>
              {/*<Button type="primary" htmlType="submit">确定</Button>*/}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
SupplierDetailList.propTypes = {
  form: PropTypes.object,
};
module.exports = Form.create()(SupplierDetailList);
