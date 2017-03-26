import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {modules, Tabs, OneLevelList, Affiliates} from './exports';
import {Button} from 'antd';
import Views from './components/sellerInfo';

class View extends Component {
  constructor(props) {
    super();
    this.state = {
      tabs: Tabs[0].name,
      pmType:'direct'
    }
  }

  componentDidMount = () => {
  }

  changeTab = (value) => {
    let pmTypes='direct';
    if(value==Tabs[0].name){
       pmTypes='direct'
    }else{
       pmTypes=''
    }
    this.setState({
      tabs: value,
      pmType: pmTypes
    })
    switch (value) {
      case Tabs[0].name:
        Tabs[0].type = 'primary';
        Tabs[1].type = '';
        break;
      case Tabs[1].name:
        Tabs[1].type = 'primary';
        Tabs[0].type = '';
        break;
    }
  }

  render() {
    let content = [];
    let options = this.state.tabs;
    switch (options) {
      case Tabs[0].name:
        content.push(<OneLevelList key="RetailOneLevel" pmType={this.state.pmType}/>)
        break;
      case Tabs[1].name:
        content.push(<Affiliates key="RetailOneLevel2" pmType={this.state.pmType}/>)
        break;
      /*default:
        content.push(<OneLevelList key="RetailOneLevel3" pmType={this.state.pmType}/>)*/
    }
    return (
      <div className="con-body main-list">
        <div className="bd-header">
          <Button onClick={this.changeTab.bind(this, Tabs[0].name)} type={Tabs[0].type}>
            {Tabs[0].name}
          </Button>
          <Button onClick={this.changeTab.bind(this, Tabs[1].name)} type={Tabs[1].type}>
            {Tabs[1].name}
          </Button>
        </div>
        {/*  (面包屑功能需要调整) */}
        {/*<div className="bd-content">列表 无菜单&nbsp;
         <Link to={{pathname: `/business/manage/module/${modules[0].key}/hide`}}>{modules[0].name}</Link> | &nbsp;
         <Link to={{pathname: `/business/manage/module/${modules[1].key}/hide`}}>{modules[1].name}</Link> | &nbsp;
         <Link to={{ pathname: `/business/manage/module/${modules[2].key}/hide` }}>{modules[2].name}</Link> | &nbsp;
         <Link to={{ pathname: `/business/manage/module/${modules[3].key}/hide` }}>{modules[3].name}</Link>
         </div>*/}
        <div>
          {content}
        </div>
      </div>
    );
  }
}

export default View;
