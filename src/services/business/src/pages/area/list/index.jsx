import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button, Icon, Table, Select, Pagination, Popconfirm } from 'antd';
import { AreaAction } from '../../../ActionsName';
import { RelateType, AreaState } from './exports'
import style from './components/style.less';

import CityComponent from './components/city';
import ListComponent from './components/list';
import MapEditComponent from './components/map/edit';
import MapDetailComponent from './components/map/detail';
import MapNoneComponent from './components/map/none';

//地图模块状态
const MapComponentStatus = {
  list: 'list',     //列表
  edit: 'edit',     //编辑
  detail: 'detail', //详情
  none: 'none',     //空白
}

//列表模块状态
const ListComponentStatus = {
  direct: RelateType.directType,       //直营
  franchise: RelateType.franchiseType, //加盟
}

class ViewComponent extends Component {

  constructor(props) {
    super();
    const { businessArea } = props;
    const { cityList, directAreaList, franchiseAreaList, areaDetail, areaDraftDetail, supplyVendorList } = businessArea;

    //获取账户信息
    const { vendor_id } = window.currentAppAccountInfo;
    const { city_name, city_code } = window.currentAppUserInfo;

    //私有变量属性
    this.private = {
      vendorId: vendor_id,      //供应商id
      dispatch: props.dispatch, //dispatch函数
    }

    //初始化状态
    this.state = {
      cityCode: city_code ? city_code : 110000,         //当前城市code
      cityName: city_name ? city_name : '北京',         //当前城市名称
      mapComponentStatus: MapComponentStatus.none,      //当前地图模块状态
      listComponentStatus: ListComponentStatus.direct,  //当前列表模块状态

      cityList,           //城市列表
      directAreaList,     //直营区域列表
      franchiseAreaList,  //加盟区域列表
      areaDetail,         //选中的区域详情
      areaDraftDetail,    //选中的区域草稿详情
      supplyVendorList,   //供应商列表
    };
    this.loadAreaList(this.state.cityCode);
  }

  componentWillReceiveProps = (nextProps) => {
    // console.log('index componentWillReceiveProps', nextProps);
    const { businessArea } = nextProps;
    const { cityList, directAreaList, franchiseAreaList, areaDetail, areaDraftDetail, supplyVendorList, createAreaId, publishAreaId } = businessArea;
    const { vendorId, dispatch } = this.private;
    const { cityCode } = this.state;

    //创建区域后的回调操作
    if (businessArea.isCreateAreaCallback === true) {
      //编辑区域详情
      this.setState({ mapComponentStatus: MapComponentStatus.edit });
      dispatch({ type: AreaAction.fetchAreaDraftDetail, payload: createAreaId });

      //获取列表页
      this.loadAreaList(this.state.cityCode);

      //重置callback
      dispatch({ type: AreaAction.resetCreateAreaCallback });
    }

    //更新区域后的回调操作（暂时没有操作）
    if (businessArea.isUpdateAreaCallback === true) {
      dispatch({ type: AreaAction.resetUpdateAreaCallback });
    }

    //发布区域后的回调操作（刷新列表页面，同时加载发布数据的详情）
    if (businessArea.isPublishAreaCallback === true) {
      //浏览区域详情
      this.setState({ mapComponentStatus: MapComponentStatus.detail });
      dispatch({ type: AreaAction.fetchAreaDetail, payload: publishAreaId });

      //获取列表页
      this.loadAreaList(this.state.cityCode);

      //重置callback
      dispatch({ type: AreaAction.resetPublishAreaCallback });
    }

    //设置state
    this.setState({
      cityList,           //城市列表
      supplyVendorList,   //供应商列表
      directAreaList,     //直营区域列表
      franchiseAreaList,  //加盟区域列表
      areaDetail,         //选中的区域详情
      areaDraftDetail,    //选中的区域草稿详情
    });
  }

  //选择城市
  onChangeCity = (cityCode, cityName) => {
    // console.log('选择新城市', cityCode, cityName);
    this.loadAreaList(cityCode);
    this.setState({ cityCode, cityName });
    this.setState({ mapComponentStatus: MapComponentStatus.none });
  };

  //区域列表加载分页
  onChangeAreaPage = (vendorId, supplyVendorId, cityCode, page) => {
    const { dispatch } = this.private;
    const { listComponentStatus } = this.state;

    //获取区域数据列表
    if (listComponentStatus === RelateType.directType) {
      const directPayload = { vendorId, cityCode, relateType: RelateType.directType, areaState: AreaState.all, page };
      dispatch({ type: AreaAction.fetchDirectAreaList, payload: directPayload });
    } else {
      const franchisePayload = { vendorId, supplyVendorId, cityCode, relateType: RelateType.franchiseType, areaState: AreaState.on, page };
      dispatch({ type: AreaAction.fetchFranchiseAreaList, payload: franchisePayload });
    }

    //切换分页时，详情和编辑页面自动切换为无数据
    this.setState({ mapComponentStatus: MapComponentStatus.none });
  }

  //选择区域列表模式
  onChangeAreaStatus = (status) => {
    this.setState({ listComponentStatus: status });
    this.setState({ mapComponentStatus: MapComponentStatus.none });
  }

  //自动保存区域草稿数据
  onAutoSaveAreaDraft = (areaId, areaName, areaState, cityCode, coordinates) => {
    const { dispatch } = this.private;
    const payload = { areaId, areaName, areaState, cityCode, coordinates };
    dispatch({ type: AreaAction.updateArea, payload });
  }

  //发布区域
  onClickAreaPublish = (areaId, areaName, areaState, cityCode, coordinates) => {
    const { dispatch } = this.private;
    const payload = { areaId, areaName, areaState, cityCode, coordinates };
    dispatch({ type: AreaAction.publishArea, payload });
  }

  //编辑区域详情
  onClickAreaEdit = (areaId) => {
    const { dispatch } = this.private;
    this.setState({ mapComponentStatus: MapComponentStatus.edit });
    dispatch({ type: AreaAction.resetAreaDraftDetail });
    dispatch({ type: AreaAction.resetAreaDetail });
    dispatch({ type: AreaAction.fetchAreaDraftDetail, payload: areaId });
  }

  //加载区域详情
  onClickAreaDetail = (areaId) => {
    const { dispatch } = this.private;
    this.setState({ mapComponentStatus: MapComponentStatus.detail });
    dispatch({ type: AreaAction.resetAreaDetail });
    dispatch({ type: AreaAction.resetAreaDraftDetail });
    dispatch({ type: AreaAction.fetchAreaDetail, payload: areaId });
  }

  //加载区域列表
  loadAreaList = (cityCode, page = 1) => {
    const { vendorId, dispatch } = this.private;

    //获取区域数据列表
    const directPayload = { vendorId, cityCode, relateType: RelateType.directType, areaState: AreaState.all, page };
    dispatch({ type: AreaAction.fetchDirectAreaList, payload: directPayload });
    //清理加盟区域列表数据
    dispatch({ type: AreaAction.resetFranchiseAreaList });
  }

  //创建父级区域
  createArea = (vendorId, areaName, cityCode) => {
    const { dispatch } = this.private;
    const payload = { vendorId, areaName, cityCode };
    dispatch({ type: AreaAction.createArea, payload });
  }

  //创建子级区域
  createSubArea = (vendorId, parentId, areaName, cityCode) => {
    const { dispatch } = this.private;
    const payload = { vendorId, areaName, cityCode, parentId };
    dispatch({ type: AreaAction.createSubArea, payload });
  }

  //渲染城市选择
  renderCityComponent = () => {
    const { cityCode, cityList } = this.state;
    const { onChangeCity } = this;

    const props = {
      cityCode,     //当前城市code
      cityList,     //当前城市列表
      onChangeCity, //选择城市的事件回调
    }
    return (
      <CityComponent {...props} />
    );
  }

  //渲染区域列表
  renderAreaListComponent = () => {
    const props = {
      cityCode: this.state.cityCode, //当前城市编号
      cityName: this.state.cityName, //当前城市编号
      vendorId: this.private.vendorId, //所属服务商ID
      supplyVendorList: this.state.supplyVendorList,    //供应商列表
      directAreaList: this.state.directAreaList,        //直营区域列表
      franchiseAreaList: this.state.franchiseAreaList,  //加盟区域列表

      createArea: this.createArea,                  //创建父区域
      createSubArea: this.createSubArea,            //创建子区域
      onChangeAreaPage: this.onChangeAreaPage,      //区域列表分页加载
      onChangeAreaStatus: this.onChangeAreaStatus,  //切换直营加盟列表
      onClickAreaDetail: this.onClickAreaDetail,    //加载区域详情
    }
    return (
      <ListComponent {...props} />
    );
  }

  //渲染地图详情
  renderMapDetailComponent = () => {
    const { onClickAreaEdit } = this;
    const { areaDetail, cityCode, cityName } = this.state;

    const { listComponentStatus } = this.state;

    const props = {
      cityCode,
      cityName,
      areaDetail,
      onClickAreaEdit,

      //是否显示编辑按钮，如果是加盟列表数据，则不显示编辑按钮
      isShowEdit: (listComponentStatus === ListComponentStatus.direct),
    }
    return (<MapDetailComponent {...props} />);
  }

  //渲染地图编辑
  renderMapEditComponent = () => {
    const { onClickAreaPublish, onAutoSaveAreaDraft } = this;
    const { areaDraftDetail, cityCode, cityName } = this.state;
    const { vendorId } = this.private;
    const props = {
      vendorId,
      cityCode,
      cityName,
      areaDraftDetail,
      onClickAreaPublish,
      onAutoSaveAreaDraft,
    }
    return (<MapEditComponent {...props} />);
  }

  //渲染地图内容为空
  renderMapNoneComponent = () => {
    return (<MapNoneComponent />);
  }

  //渲染地图列表内容
  renderMapListComponent = () => {
    return (<MapNoneComponent />);
  }

  //渲染地图模块
  renderMapComponent = () => {
    const {
      renderMapListComponent,
      renderMapEditComponent,
      renderMapNoneComponent,
      renderMapDetailComponent,
    } = this;
    const { mapComponentStatus } = this.state;

    //判断地图模块状态，加载相应的地图模块
    switch (mapComponentStatus) {
      case MapComponentStatus.edit:
        return renderMapEditComponent();
      case MapComponentStatus.detail:
        return renderMapDetailComponent();
      case MapComponentStatus.list:
        return renderMapListComponent();
      case MapComponentStatus.none:
        return renderMapNoneComponent();
      default:
        return renderMapNoneComponent();
    }
  }

  render() {
    const {
      renderCityComponent,
      renderAreaListComponent,
      renderMapComponent,
     } = this;

    return (
      <div className={`${style.component} con-body main-list`}>
        <Row gutter={16} className={style.height100} >
          <Col sm={7} className={style.height100} >
            {/* 渲染城市选择 */}
            <div className="bd-content">{renderCityComponent()}</div>
            {/* 渲染列表内容 */}
            <div className="bd-content">{renderAreaListComponent()}</div>
          </Col>
          <Col sm={17} className={style.height100} >
            {/* 渲染地图模块 */}
            <div className="bd-content" style={{ height: '94%' }}>{renderMapComponent()}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps({ businessArea }) {
  return { businessArea };
}

module.exports = connect(mapStateToProps)(ViewComponent);
