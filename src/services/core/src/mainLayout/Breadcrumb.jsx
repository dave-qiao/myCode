
import React, { Component, PropTypes } from 'react';
import { Breadcrumb, Icon } from 'antd';

class BreadcrumbComponent extends React.Component {
  render() {
    const _data = this.props.data.map((item, index) => {
      return <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
      //TODO:暂时屏蔽面包屑可点击
      // return <Breadcrumb.Item key={index}><a href={item.link}>{item.name}</a></Breadcrumb.Item>
    });

    return (
      <div className="con-breadcrumb">
        <Breadcrumb separator=">">
          <Breadcrumb.Item key="/"><Icon type="home" /></Breadcrumb.Item>
          {_data}
        </Breadcrumb>
      </div>
    );
  }
}

export default BreadcrumbComponent;
