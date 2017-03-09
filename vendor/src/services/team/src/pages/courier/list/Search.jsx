import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Input, Button, Checkbox, Icon, Select } from 'antd';
import { Link } from 'dva/router';
import style from '../style/courier.less';
const [FormItem,Option] = [Form.Item, Select.Option];


const Search = Form.create()(({ form, searchs, onSearch, onShowItem, areas, data, _meta }) => {
  //datas为 所有骑士的附属信息,上个开发人员把数据 拆开来传的需注意  其他都是按照正常传进来一组数据 按需去取
  const datas = { _meta };
  //从form中拿到 以下的回调函数
  const { getFieldProps, getFieldsValue } = form;
  function handleSubmit(e) {
    e.preventDefault();
    onSearch(getFieldsValue())
  };
  const itemLayout = { "labelCol": { "span": 6 }, "wrapperCol": { "span": 14 } };

  return (

    <Form horizontal className="ant-advanced-search-form" onSubmit={handleSubmit} key="all">
      {/*<Row type="flex" justify="space-between" align="bottom">*/}
      <div className={style.courierOverFlow}>
        <div className={`${style.navLeftBorder} ${style.courierRightTitle}`}>
          所有骑士&nbsp;({datas._meta.result_count ? datas._meta.result_count : '0'})
        </div>
        <FormItem label="" {...itemLayout} className={style.courierRightTitleBt}>
          <Button type="primary"><Link to="/team/courier/list/add">添加成员</Link></Button>
        </FormItem>
      </div>
      <div className={style.navBottomBorder} style={{ marginBottom: '16px' }}></div>
      <Row gutter={24}>
        <Col sm={8}>
          <FormItem label="姓名" {...itemLayout} >
            <Input {...getFieldProps("name")} {...{ "placeholder": "骑士姓名" }}/>
          </FormItem>
          <FormItem label="手机号" {...itemLayout} >
            <Input {...getFieldProps("mobile")} {...{ "placeholder": "骑士手机号" }}/>
          </FormItem>
          <FormItem label="员工状态"  {...itemLayout} >
            <Select showSearch
                    optionFilterProp="children" {...getFieldProps("work_state", { initialValue: '100' })} {...{ "placeholder": "骑士状态" }}>

              <Option value="">全部</Option>

              <Option value="100">在职</Option>

              <Option value="-100">离职</Option>

            </Select>
          </FormItem>

        </Col>
        <Col sm={8}>
          <FormItem label="员工类型"  {...itemLayout} >
            <Select showSearch
                    optionFilterProp="children" {...getFieldProps("work_type", { initialValue: '' })} {...{ "placeholder": "选择是否全职" }}>

              <Option value="">全部</Option>

              <Option value="10">全职</Option>

              <Option value="20">兼职</Option>

            </Select>
          </FormItem>

          <FormItem label="工号" {...itemLayout} >
            <Input {...getFieldProps("code")} {...{ "placeholder": "骑士工号" }}/>
          </FormItem>
          <FormItem label="" {...itemLayout}>
            <Button htmlType="submit">查询</Button>
          </FormItem>
        </Col>
        <Col sm={8}>
          <FormItem label="在岗状态"  {...itemLayout} >
            <Select showSearch
                    optionFilterProp="children" {...getFieldProps("work_state", { initialValue: '' })} {...{ "placeholder": "骑士状态" }}>

              <Option value="">全部</Option>

              <Option value="100">在岗</Option>

              <Option value="-100">离岗</Option>

            </Select>
          </FormItem>
          <FormItem label="审核状态" {...itemLayout} >
            <Select showSearch
                    optionFilterProp="children" {...getFieldProps("verify_state")} {...{ "placeholder": "审核状态" }}>
              <Option value="">全部</Option>
              <Option value="0">待提交</Option>
              <Option value="1">待审核</Option>
              <Option value="100">通过</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
});

module.exports = Search;
