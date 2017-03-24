import React, { Component, PropTypes } from 'react';
import { Form, Row, Col, Tabs, Icon, Table, Pagination, Select } from 'antd';
import EditComponent from './edit';
import style from './style.less';
import { RelateType, AreaState } from '../exports'

class listComponent extends Component {

  constructor(props) {
    super();

    //监听状态
    this.state = {
      cityCode: props.cityCode, //当前城市编号
      cityName: props.cityName, //当前城市名称
      vendorId: props.vendorId, //所属服务商ID
      supplyVendorId: '',       //供应商ID
      supplyVendorList: props.supplyVendorList,    //供应商列表
      directAreaList: props.directAreaList,        //直营区域列表
      franchiseAreaList: props.franchiseAreaList,  //加盟区域列表
    }

    //私有
    this.private = {
      createArea: props.createArea,                 //创建父区域
      createSubArea: props.createSubArea,           //创建子区域
      onChangeAreaPage: props.onChangeAreaPage,     //加载列表分页数据
      onChangeAreaStatus: props.onChangeAreaStatus, //切换直营加盟列表
      onClickAreaDetail: props.onClickAreaDetail,    //加载区域详情
    }
  }

  //监听state变化
  componentWillReceiveProps = (nextProps) => {
    //监听状态
    this.setState({
      cityCode: nextProps.cityCode, //当前城市编号
      cityName: nextProps.cityName, //当前城市名称
      vendorId: nextProps.vendorId, //所属服务商ID
      supplyVendorList: nextProps.supplyVendorList,    //供应商列表
      directAreaList: nextProps.directAreaList,        //直营区域列表
      franchiseAreaList: nextProps.franchiseAreaList,  //加盟区域列表
    });
  }

  //切换area区域列表
  onChangeTabMenu = (key) => {
    const { onChangeAreaStatus } = this.private;
    onChangeAreaStatus(key);
  }

  //切换加盟商
  onChangeAreaListVendor = (value) => {
    //当前加盟列表选中的加盟商
    this.setState({ supplyVendorId: value });
    const { onChangeAreaPage } = this.private;
    const { vendorId, cityCode } = this.state;

    //刷新加盟区域列表的数据
    onChangeAreaPage(value, vendorId, cityCode, 1);
  }

  //创建父级区域
  createAreaWithValue = (values) => {
    const { createArea } = this.private;
    const { vendorId } = this.state;
    const { areaName, cityCode } = values;
    createArea(vendorId, areaName, cityCode);
  }

  //创建子区域
  createSubAreaWithValue = (values) => {
    const { createSubArea } = this.private;
    const { vendorId } = this.state;
    const { areaName, cityCode, parentId } = values;
    createSubArea(vendorId, parentId, areaName, cityCode);
  }

  //处理列表区域数据
  getProcessAreaList = (areaList, isShowCreate, parent = []) => {
    //递归
    const { getProcessAreaList } = this;

    //判断数据是否为空
    if (!areaList) {
      return [];
    }
    if (areaList.length === 0) {
      return [];
    }

    const result = [];
    areaList.forEach((value, key) => {
      const record = {
        id: value.id,
        key: value.id,
        name: value.name,
        state: AreaState.description(value.state),
        parentId: parent.id,
        parentName: parent.name,
      }

      //如果是父级，并且显示创建按钮，则添加 “添加子区域” 数据
      if (value.is_sub_area === false && isShowCreate === true) {
        record.children = [{
          id: value.id,
          key: `sub-${value.id}`,
          name: '添加子区域',
          parentId: value.id,
          parentName: value.name,
        }];
      }

      //如果有子类，则递归一次获取数据，插入到children数组中
      if (value.is_sub_area === false) {
        //递归处理子区域数据，合并到现有数据中
        const subArea = getProcessAreaList(value.sub_areas, isShowCreate, value);

        //判断 '添加子区域' 按钮是否存在，不存在则不进行合并
        if (record.children) {
          record.children = record.children.concat(subArea);
        } else {
          record.children = subArea;
        }
      }

      //处理数据的结果
      result.push(record);
    });

    return result;
  }

  //获取table的设置
  getTableColumnsDefine = (isShowCreate = true) => {
    const { onClickAreaDetail } = this.private;
    const { cityCode, cityName } = this.state;
    const { createSubAreaWithValue } = this;
    return [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      parentId: '',
      parentName: '',
      width: '60%',
      render: (text, row, index) => {
        if (text !== '添加子区域') {
          //判断是否是子区域
          if (row.children) {
            //计算子区域数量（判断是否显示添加按钮，如果显示按钮，数量要减一）
            const subAreaCount = isShowCreate ? row.children.length - 1 : row.children.length;
            return (subAreaCount === 0) ? text : `${text} (${subAreaCount})`;
          }
          return text;
        }

          //判断是否显示添加子区域按钮
        let children = ''
        if (isShowCreate === true) {
          children = (
            <EditComponent onOk={createSubAreaWithValue} cityCode={cityCode} cityName={cityName} parentName={row.parentName} parentId={row.parentId} type="subArea">
              <a> <Icon type="plus" style={{ fontWeight: 'bold' }} /> &nbsp;&nbsp; 添加子区域 </a>
            </EditComponent>
            );
        }

        return {
          children,
          props: {
            colSpan: 3,
          },
        };
      },
    }, {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: '15%',
      render: (text, row, index) => {
        return (row.name !== '添加子区域') ? text : { children: '', props: { colSpan: 0 } };
      },
    }, {
      title: '操作',
      dataIndex: 'key',
      key: 'key',
      width: '15%',
      render: (text, row, index) => {
        if (row.name !== '添加子区域') {
          return (
            <span onClick={() => { onClickAreaDetail(row.id) }} className={style.link}>详情</span>
          );
        }
        return { children: '', props: { colSpan: 0 } };
      },
    }];
  }

  //渲染区域列表组件
  renderAreaComponent = (areaList, relateType) => {
    const { renderTitleComponent, renderAreaTableComponent, renderAreaVendorSelectComponent } = this;
    const { getProcessAreaList } = this;

    //处理数据格式 (这部分数据需要clone后处理，否则process后会导致源数据格式错误)
    // TODO: 以后开发要注意，所有模块初始化private中的变量修改为assign赋值
    const processList = Object.assign({}, areaList);

    //直营
    if (relateType === RelateType.directType) {
      //直营数据，显示创建按钮.
      processList.data = getProcessAreaList(processList.data, true);
      return (
        <div>
          {renderTitleComponent(true)}
          {renderAreaTableComponent(processList, relateType)}
        </div>
      );
    }

    //加盟数据，不现实创建按钮
    processList.data = getProcessAreaList(processList.data, false);

    //加盟区域列表
    return (
      <div>
        {renderTitleComponent(false)}
        {renderAreaVendorSelectComponent()}
        {renderAreaTableComponent(processList, relateType, false)}
      </div>
    );
  }

  //渲染标题
  renderTitleComponent = (isShowCreate = true) => {
    const { createAreaWithValue } = this;
    const { cityCode, cityName } = this.state;
    let editComponent = '';
    if (isShowCreate) {
      editComponent = (
        <EditComponent onOk={createAreaWithValue} cityCode={cityCode} cityName={cityName} type="parentArea">
          <a><Icon style={{ fontSize: '16px', color: '#58e2c2', fontWeight: 'bold' }} type="plus" /></a>
        </EditComponent>
      );
    }
    return (
      <Form horizontal className="main-form" style={{ padding: '0px 0px 0px 30px' }}>
        <Row className="form-divider-header" style={{ marginBottom: '10px' }}>
          <Col span={20}>区域列表</Col>
          <Col span={4} style={{ textAlign: 'right' }}>{editComponent}</Col>
        </Row>
      </Form>
    );
  }

  //渲染列表表格
  renderAreaTableComponent = (areaList, relateType, isShowCreate) => {
    const { getTableColumnsDefine } = this;
    const { onChangeAreaPage } = this.private;
    const { vendorId, cityCode, supplyVendorId } = this.state;

    //数据行的样式
    function rowClassName(record, index) {
      if (record.name !== '添加子区域') {
        return '';
      }
      return style.createSubAreaRow;
    }

    //列表的分页配置
    const pagination = {
      current: areaList.page,
      pageSize: areaList.size,
      total: areaList.total,
      size: 'small',
      showTotal: () => {
        return `共 ${areaList.total} 条`
      },
      onChange: (current) => {
        //分页的回调
        // 直营回调
        if (relateType === RelateType.directType) {
          onChangeAreaPage(vendorId, '', cityCode, current);
        }
        //加盟回调
        if (relateType === RelateType.franchiseType) {
          onChangeAreaPage(supplyVendorId, vendorId, cityCode, current);
        }
      },
    };

    return (
      <Table
        size="middle"
        pagination={pagination}
        rowClassName={rowClassName}
        columns={getTableColumnsDefine(isShowCreate)}
        dataSource={areaList.data}
      />
    );
  }

  //渲染加盟区域列表的加盟商选择
  renderAreaVendorSelectComponent = () => {
    const { onChangeAreaListVendor } = this;
    const { supplyVendorList } = this.state;

    const list = [];
    //判断加盟商列表数据是否为空
    if (supplyVendorList && supplyVendorList.length) {
      //渲染选项
      supplyVendorList.forEach((vendor, key) => {
        list.push(<Select.Option key={vendor.id} value={vendor.id} title={vendor.name}>{vendor.name}</Select.Option>);
      })
    }

    return (
      <Form.Item label="" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} style={{ marginBottom: '10px', width: '100%' }}>
        <Select showSearch style={{ width: '100%' }} placeholder="请选择加盟商" notFoundContent="暂无数据" onSelect={onChangeAreaListVendor} allowClear>
          {list}
        </Select>
      </Form.Item>
    );
  }

  render() {
    const { renderAreaComponent } = this;
    const { onChangeAreaStatus } = this.private;
    const { directAreaList, franchiseAreaList } = this.state;

    return (
      <div className={style.listComponent}>
        <Tabs defaultActiveKey={RelateType.directType} onChange={onChangeAreaStatus} animated="false">
          <Tabs.TabPane tab="直营区域" key={RelateType.directType}>
            {renderAreaComponent(directAreaList, RelateType.directType)}
          </Tabs.TabPane>
          <Tabs.TabPane tab="加盟区域" key={RelateType.franchiseType}>
            {renderAreaComponent(franchiseAreaList, RelateType.franchiseType)}
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

module.exports = Form.create()(listComponent);
