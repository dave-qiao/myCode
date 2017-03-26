//模块自动加载
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { TabsMenu } from '../../../../core/src/exports'
import { modules, Shop, Signed, OrderDispatchRules, KnightDispatchRules } from './exports'

class View extends Component {

  constructor(props) {
    super();

    //初始化状态参数
    this.state = {
      activeModule: props.params.activeModule,  //当前加载的模块
      //hideTabsMenu: props.params.hideTabsMenu,  //是否显示tabs菜单
    }

    //初始化私有变量
    this.private = {
      loader: '/business/manage/module',
    };

    //log
  }

  componentWillReceiveProps = (nextProps) => {
    //初始化状态参数
    this.state = {
      activeModule: nextProps.params.activeModule,  //当前加载的模块
      hideTabsMenu: nextProps.params.hideTabsMenu,  //是否显示tabs菜单
    }
    //log
  }

  //判断模块是否存在
  hasModule = (activeModule) => {
    let hasModule = false;
    //遍历模块数组，判断当前模块是否存在于列表
    modules.forEach((module, index) => {
      if (activeModule === module.key) {
        hasModule = true;
      }
    });
    return hasModule;
  }

  //渲染菜单
  renderTabs = () => {
    const { activeModule, hideTabsMenu } = this.state;
    const { loader } = this.private;
    const { hasModule } = this;

    //是否需要隐藏tabs菜单
    if (hideTabsMenu === 'hide' && hideTabsMenu !== undefined) {
      return '';
    }

    //如果模块不存在, 或者隐藏菜单
    if (hasModule(activeModule) === false) {
      return '';
    }

    return (
      <TabsMenu modules={modules} activeModule={activeModule} loader={loader} />
    )
  }

  //渲染功能模块，动态加载 TODO：dymic init with name
  renderModule = () => {
    const { activeModule, activeQuery } = this.state;
    switch (activeModule) {
      case 'Shop':
        return (<Shop />);
      case 'SignInfo':
        return (<Signed />);
      case 'OrderDispatchRules':
        return (<OrderDispatchRules />);
      case 'KnightDispatchRules':
        return (<KnightDispatchRules />);
      default:
        return (
          <div className="bd-content">缺少参数，无法加载模块</div>
        )
    }
  }

  //渲染页面
  render() {
    const { renderModule, renderTabs } = this;
    return (
      <div className="con-body main-list">

        {/* 加载菜单 */}
        {renderTabs()}

        {/* 加载模块 */}
        {renderModule()}

      </div>
    );
  }
}

export default View;
