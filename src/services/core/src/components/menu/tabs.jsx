// 通用菜单栏目
//
// 菜单的 props.tabs 设置格式如下
// const tabs = [
//   {
//     name: '菜单A',
//     key: '模块名称A',
//   }, {
//     name: '菜单B',
//     key: '模块名称B',
//   } ...
// ]

import React, {Component, PropTypes} from 'react';
import {Router, Route, Link, hashHistory} from 'react-router';
import {Button} from 'antd';
import style from '../style.less';

class View extends Component {

  constructor(props) {
    super();
    const {loadStateWithProps} = this;
    loadStateWithProps(props);

    console.log('constructor this.state', this.state);
  }

  componentWillReceiveProps = (nextProps) => {
    const {loadStateWithProps} = this;
    loadStateWithProps(nextProps);

    console.log('componentWillReceiveProps this.state', this.state);
  }

  //加载state
  loadStateWithProps = (props) => {
    this.state = {
      loader: props.loader,             //加载模块的地址
      modules: props.modules,           //模块列表
      activeModule: props.activeModule, //当前选中模块
    }
  }

  //渲染菜单按钮
  renderTabs = () => {
    const {modules, activeModule, loader} = this.state;
    const {renderLoaderLink} = this;
    const render = [];

    //遍历tabs
    modules.forEach((module, index) => {
      //判断当前激活菜单，添加激活菜单样式
      const activeStyle = (activeModule === module.key) ? style.tabActive : '';

      //tab菜单生成
      render.push(
        <span className={`${style.tab} ${activeStyle}`} key={module.name}>

            <Link to={{pathname: `${loader}/${module.key}`}}>{module.name}</Link>

        </span>,
      );
    });
    return render;
  }

  //渲染模块
  render() {
    const {renderTabs} = this;
    return (
      <div className="bd-header">
        <div className={style.menuTabs}>
          {/* 渲染菜单按钮 */}
          {renderTabs()}
        </div>
      </div>
    );
  }
}

export default View;
