import ReactDOM from 'react-dom';
import React from 'react';
//Part
import Part_aside from './Aside';
import AsideData from './AsideData';
import Breadcrumb from './Breadcrumb';
import Layout_header from './header';
const page_name = {
  edit: '编辑',
  add: '添加',
  detail: '详情',
  check: '审核',
  module: '详情模块',
  suppliers: '供应商信息',
  regionalList: '区域列表',
}

class MainLayout extends React.Component {

  constructor(props) {
    super();
  }

  //合并面包屑显示名称和链接
  combineBreadcrumbPath(names, links) {
    return names.map((name, index) => {
      return {
        name,
        link: `/#${links.slice(0, index + 2).join('/')}`,
      };
    });
  }

  render() {
    const {children} = this.props;
    const {history, location} = children.props;
    const {pathname} = location;
    const {combineBreadcrumbPath} = this;
    let [breadData, asideKeys] = [[], []];

    //拼凑路径 对比路径 (应该有更好的，暂时先凑活吧)
    const _pathArr = pathname.split('/');
    _pathArr[0] = '/#';
    let _last_page = null;
    if (_pathArr.length === 5) {
      _last_page = page_name[_pathArr.pop()];
    }
    //判断module路径的路由
    if (_pathArr[_pathArr.length - 1] === 'module' && _pathArr.length === 4) {
      _last_page = page_name[_pathArr.pop()];
    }
    const _pathname = _pathArr.join('/');
    let _stop = false;
    //对比 并取出面包屑导航内容
    for (const lv0 of AsideData) {
      if (_stop) {
        break;
      }
      for (const lv1 of lv0.subItems) {
        if (lv1.hasThird) {
          for (const lv2 of lv1.thirdItems) {
            if (lv2.a_path === _pathname) {
              lv0.active = true;
              lv1.active = true;
              lv2.active = true;
              _stop = true;
              const [lv0Index, lv1Index, lv2Index] = [AsideData.indexOf(lv0), lv0.subItems.indexOf(lv1), lv1.thirdItems.indexOf(lv2)];
              asideKeys.push(`${lv0Index}`, `${lv0Index}_${lv1Index}`, `${lv0Index}_${lv1Index}_${lv2Index}`);
              breadData.push(lv0.title, lv1.title, lv2.title);
              break;
            }
          }
        } else if (lv1.a_path === _pathname) {
          lv0.active = true;
          lv1.active = true;
          _stop = true;
          const [lv0Index, lv1Index] = [AsideData.indexOf(lv0), lv0.subItems.indexOf(lv1)];
          asideKeys.push(`${lv0Index}`, `${lv0Index}_${lv1Index}`);
          breadData.push(lv0.title, lv1.title);
          break;
        }
      }
    }
    if (_last_page) {
      breadData.push(_last_page);
    }

    //整合面包屑数据
    breadData = combineBreadcrumbPath(breadData, pathname.split('/'));

    //侧边栏高亮使用
    const AsideProps = {AsideData, asideKeys};
    return (
      <div className="layout-wrapper">
        <Part_aside {...AsideProps} />
        <Layout_header />
        <div className="layout-container">
          <Breadcrumb data={breadData}/>
          {this.props.children}
        </div>
        <div className="layout-footer">

        </div>
      </div>
    );
  }
}

export default MainLayout;
