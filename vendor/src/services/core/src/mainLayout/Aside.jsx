import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {Menu, Icon} from 'antd';
const SubMenu = Menu.SubMenu;

const renderMenu = (AsideData) => {
  return AsideData.map((_item, _index) => {
    const _subItems = _item.subItems.map((_subItem, _subIndex) => {
      if (_subItem.hasThird) {
        // 三级菜单
        const _thirdItems = _subItem.thirdItems.map((_thirdItem, _thirdIndex) => {
          return (
            <Menu.Item key={_index + "_" + _subIndex + '_' + _thirdIndex}>
              <a href={_thirdItem.a_path}>{_thirdItem.title}</a>
            </Menu.Item>
          )
        })
        return (
          <SubMenu key={_index + "_" + _subIndex} title={< span >  < b className = "title-text" > { _subItem.title } </b> </span >}>
            {_thirdItems}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={_index + "_" + _subIndex}>
            <a href={_subItem.a_path}>{_subItem.title}</a>
          </Menu.Item>
        );
      }
    });

    //判断是否有二级菜单，如果没有二级菜单，返回一级菜单带连接
      return (
        <SubMenu key={_index} title={< span > <Icon type={_item.icon}/> < b className = "title-text" > { _item.title } </b> </span >}>
          {_subItems}
        </SubMenu>
      );
  });
};

const Prat_aside = React.createClass({
  getInitialState() {
    return {collapse: true, mode: 'vertical'};
  },
  onCollapseChange() {
    this.setState({
      collapse: !this.state.collapse,
      mode: !this.state.collapse
        ? 'vertical'
        : 'inline'
    })
  },
  render() {

    const [collapse, mode, onCollapseChange] = [this.state.collapse, this.state.mode, this.onCollapseChange];
    let {AsideData, asideKeys} = this.props;

    if(window.currentAppUserInfo && !window.currentAppUserInfo.is_owner) {
      const _len = AsideData.length;
      if(AsideData[_len - 1].subItems[0].title === '商户资料') {
        AsideData[_len - 1].subItems.shift();
      };
    };
    return (
      <aside className={collapse
        ? "layout-aside layout-aside-collapse"
        : "layout-aside"}>
        <div className="layout-logo">嗷嗷管家</div>
        <Menu mode={mode} theme="dark"  defaultSelectedKeys={asideKeys}>
          {renderMenu(AsideData)}
        </Menu>

      </aside>
    );
  }
});

export default Prat_aside;
