import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Row, Col, Tree, Icon, Modal, Form, Select, Input, message } from 'antd';
import { COURIER } from '../../../ActionsName.js';
import Search from './Search';
import List from './List';
import TeamCity from './teamCity';
import { Courier } from './courierModel';
import Authstr from './authstrSearch';
import TeamSearch from './teamSearch';
import style from '../style/courier.less';
import { getCityNameByCode } from '../../../../../../utils/authHelper';

const [FormItem,Option,TreeNode] = [Form.Item, Select.Option, Tree.TreeNode];

class View extends Component {
  constructor(props) {
    super();
    const { dispatch, business_courier } = props;
    const { vendor_id } = window.currentAppAccountInfo;
    Object.assign(this, {
      dispatch,
      page: 1,
      querys: { vendor_id },
      info: []
    });
  };

  //搜索查询通过form表单拿到所有查询数据
  onSearch = (values) => {
    this.page = 1;

    const { dispatch, page } = this;
    Object.assign(this.querys, values);
    dispatch({ type: COURIER.find, payload: { ...this.querys, page } });
  };

  //分页切换
  onPageChange = (page) => {
    const { dispatch, querys } = this;
    const verify_state = 1;
    const { business_courier } = this.props;
    const { city } = business_courier;
    const city_code = city;
    this.page = page;
    const tabs = sessionStorage.getItem('tabs');
    switch (tabs) {
      case '所有骑士':
        dispatch({ type: 'business_courier/querys', payload: { ...querys, city_code, page } });
        break;
      case '待审核骑士':
        dispatch({ type: 'business_courier/querys', payload: { ...querys, city_code, page, verify_state } });
        break;
      default:
        const team_id = tabs;
        dispatch({ type: 'business_courier/querys', payload: { ...querys, city_code, page, team_id }});
        break;
    }
  }
    ;

    //选中左侧树形导航(骑士导航)从而加载不同数据及组件

    onSelect = (info)=> {
      let team_id = info[0];
      /*const { dispatch } =this;*/
      const _accountInfo = window.getStorageItem('accountInfo') || '{}';
      const { vendor_id } = JSON.parse(_accountInfo);
      const { business_courier, dispatch } = this.props;
      // 解构一层数据
      const { city } = business_courier;
      const city_code = city;
      //待审核骑士状态枚举值 为 1
      const verify_state = 1;
      if (info == '所有骑士') {
        let listType = '所有骑士';
        sessionStorage.setItem('tabs', listType);
        dispatch({ type: 'business_courier/tabChange', payload: { info } });
        dispatch({ type: 'business_courier/querys', payload: { vendor_id, city_code } });
        dispatch({ type: 'business_courier/changeListType', payload: { listType } });
      } else if (info == '待审核骑士') {
        //枚举值 为了区分是否页面初始化是请求的 待审核骑士 (为了复用table数据模板 所以 以此为区分)
        const typeState = 'unInit';
        let listType = '待审核骑士';//待审核
        sessionStorage.setItem('tabs', listType);
        dispatch({ type: 'business_courier/tabChange', payload: { info } });
        dispatch({ type: 'business_courier/querys', payload: { vendor_id, verify_state, city_code } });
        dispatch({ type: 'business_courier/changeListType', payload: { listType } });
      } else if (info == '所有团队' || info.length == 0) {
        message.success('请选择左侧团队或者骑士中的一项');
      } else {
        let listType = info[0];
        if (info.length != 0) {
          sessionStorage.setItem('tabs', listType);
          dispatch({ type: 'business_courier/teamChange', payload: { info, listType } });
          dispatch({ type: 'business_courier/querys', payload: { vendor_id, team_id, city_code } });
          dispatch({ type: 'business_courier/changeListType', payload: { listType } });
        }
      }
    };

    //城市更改回调
    cityChange = (value)=> {
      const { dispatch } =this;
      const city_code = value;
      const { vendor_id } = window.currentAppAccountInfo;
      dispatch({ type: 'business_courier/cityChange', payload: { city_code } });

      // 根据城市的不同 获取不同团队数据
      dispatch({
        type: 'business_courier/getTeam',
        payload: {
          vendor_id,
          city_code,
        }
      });

      // 根据城市的不同 获取不同待审核骑士数据
      dispatch({
        type: 'readyCourier',
        payload: {
          vendor_id,
          verify_state: 1,
          city_code,
        }
      });

      // 根据城市的不同获取所有骑士的数据
      dispatch({
        type: 'getAllCourierNUmber',
        payload: {
          vendor_id,
          city_code,
        }
      });

    };

    //确认框展示
    showModal = ()=> {
      const { dispatch } =this;
      let visibles = true;
      dispatch({ type: 'business_courier/checkBox', payload: { visibles } });
    };

    //确认框Ok事件
    handleOk = ()=> {
      const { dispatch } =this;
      const { getFieldProps, validateFields, getFieldsValue } = this.props.form;
      let values = getFieldsValue();
      const name = values.name;
      const city_code = this.props.business_courier.city;
      const { vendor_id } = window.currentAppAccountInfo;
      if (name != '') {
        let visibles = false;
        dispatch({ type: 'business_courier/checkBox', payload: { visibles } });
        dispatch({ type: 'business_courier/addTeam', payload: { vendor_id, name, city_code } })
      }
    };

    handleSubmit = (value)=> {

    };
    //确认框cancel事件
    handleCancel = (e)=> {
      const { dispatch } =this;
      let visibles = false;
      dispatch({ type: 'business_courier/checkBox', payload: { visibles } });
    };

    render()
    {
      const { getFieldProps, validateFields, getFieldsValue } = this.props.form;
      // 搜索模块容器  通过不同的状态 加载不同的搜索模块
      const content = [];
      // 数据列表类型(团队、骑士)
      const listType = this.props.business_courier.listType;
      // form 表单样式
      const itemLayout = { "labelCol": { "span": 6 }, "wrapperCol": { "span": 14 } };
      // 从父级prop 获取action中的值
      const { business_courier, business_publics, dispatch } = this.props;
      // 解构一层数据
      const {
        list_searchs, list_tables, tabs, visible, city, teamListDetail,
        readyListTables, courierNumber, visibleCourier, outsideCourier,
        serviceCityList
      } = business_courier;

      //分页 函数及数据
      const { page, onSearch, onPageChange } = this;
      //传给搜索子组件的数据
      const searchProps = {
        teamListDetail,
        tabs,
        city,
        visible,
        visibleCourier,
        onSearch,
        ...list_tables,
        readyListTables,
        outsideCourier,
        areas: business_publics.areas
      };
      // 传给列表的数据
      const tableProps = {
        ...list_tables,
        onPageChange,
        page,
        listType,
        dispatch,
        tabs,
        city,
      };

      const teamCityListProps = {
        serviceCityList,
      };

      //团队列表
      let TreeList = business_courier.teamList.data;
      //判断Tree组件默认选中的key
      const defaultSelect = [tabs || '所有骑士'];
      //根据不同的选择加载相应的组件
      if (tabs == '所有骑士') {
        content.push('所有骑士');
      }
      if (tabs == '待审核骑士') {
        content.push(<Authstr {...searchProps} key="all-4"/>);
      }
      if (tabs !== '所有骑士' && tabs !== '待审核骑士') {
        content.push(<TeamSearch {...searchProps} key="all-5"/>);
      }
      return (
        <div className="con-body main-list">
          <Row>
            <div className={style.courierAll}>
              <Col sm={5}>
                <div className="bd-content" style={{ marginRight: 16, marginTop: 0 }}>
                  <TeamCity cityChange={this.cityChange} {...teamCityListProps}/>
                </div>
                {/*新的*/}
                <div>
                  <div className={style.courierBlockTop}>
                    <Row>
                      <Col sm={12}>
                        <h4 className={style.navLeftBorder}>团队</h4>
                      </Col>
                      <Col sm={12} style={{ textAlign: 'right' }}>
                        <b style={{ color: '#58e2c2' }} onClick={this.showModal}><Icon type="plus"
                                                                                       style={{
                                                                                         fontSize: 16,
                                                                                         fontWeight: 'bold'
                                                                                       }}/></b>
                        <Modal title="添加新团队" visible={visible}
                               onOk={this.handleOk} onCancel={this.handleCancel}
                               style={{ top: '35%' }}
                        >
                          <Row>
                            <Col sm={24}>
                              <Form onSubmit={this.handleOk}>
                                <FormItem label="城市" {...itemLayout}>
                                  <div>{getCityNameByCode(city)}</div>
                                </FormItem>
                                <FormItem label="团队名称" {...itemLayout}>
                                  <Input placeholder="请输入团队名称" {...getFieldProps("name", {
                                    validate: [
                                      { rules: [{ required: true, message: '请输入团队名称' },], trigger: 'onBlur', }
                                    ]
                                  })}/>
                                </FormItem>
                              </Form>
                            </Col>
                          </Row>
                        </Modal>
                      </Col>
                    </Row>
                    <div className={style.navBottomBorder} style={{ marginBottom: 0 }}></div>
                  </div>
                  <Tree className={style.courierBlockTree} onSelect={this.onSelect} defaultSelectedKeys={defaultSelect}
                        defaultExpandAll={true}>
                    <TreeNode title={`所有团队  (${TreeList.length})`} key="所有团队" className={style.courierBlockBottom}>
                      {
                        TreeList.map(function (item, index) {
                          return (
                            <TreeNode title={`${item.name} (${item.courier_count})`} key={item.id}></TreeNode>
                          )
                        })
                      }
                    </TreeNode>
                    <div style={{ height: '16px', background: '#f7f7f7' }}></div>
                    <div className={style.courierBlockTop} style={{ margin: 0 }}>
                      <h4 className={style.navLeftBorder}><b>骑士</b></h4>
                    </div>
                    <div style={{ padding: '0 16px' }}>
                      <div className={style.navBottomBorder}></div>
                    </div>
                    <TreeNode title={`所有骑士  (${courierNumber ? courierNumber : 0})`} key="所有骑士"></TreeNode>
                    <TreeNode
                      title={`待审核骑士  (${readyListTables._meta.result_count ? readyListTables._meta.result_count : 0})`}
                      key="待审核骑士"></TreeNode>
                  </Tree>
                </div>
              </Col>
              <Col sm={19} style={{ background: '#ffffff', paddingBottom: 50, marginBottom: 16 }}>
                <div className={style.courierRightModel}>
                  {content.length == 0 || content[0] == '所有骑士' ? <div>
                    <div className="bd-header" key="all-1">
                      <Search {...searchProps} key="all-2"/>
                    </div>
                  </div> : content}
                  <div style={{ padding: '0 16px 16px 16px' }}>
                    <List {...tableProps} key="all-3"/>
                  </div>
                </div>
              </Col>
            </div>
          </Row>
        </div>
      );
    }

  }

  View = Form.create()(View)

//从 model 层取数据
  function

  mapStateToProps({ business_courier, business_publics }) {
    return { business_courier, business_publics };
  }

// 连接Model 层
  module
.
  exports = connect(mapStateToProps)(View);
