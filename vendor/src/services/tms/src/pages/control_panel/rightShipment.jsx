import React from 'react';
import {Row,Col,Button,Table, Radio } from 'antd';
import { Link } from 'dva/router';

const [RadioButton,RadioGroup] = [Radio.Button,Radio.Group];
// 从全局变量中获取
const {stateTransform, utcToDate} = window.tempAppTool;

/*按钮TAB的配置*/
const radioArr = [
  {
    "txt": "待分配",
    "field": "pending_assign",
    "val": "8",
    "overtime": true
  },
  {
    "txt": "已接单",
    "field": "accepted",
    "val": "1",
    "overtime": true
  }, {
    "txt": "已取货",
    "field": "pickup",
    "val": "2",
    "overtime": true
  }, {
    "txt": "未完成",
    "field": "unfinished",
    "val": "3",
    "overtime": true
  }, {
    "txt": "异常",
    "field": "error",
    "val": "4",
    "overtime": false
  }, {
    "txt": "已送达",
    "field": "done",
    "val": "5",
    "overtime": false
  }, {
    "txt": "已取消",
    "field": "closed",
    "val": "6",
    "overtime": false
  }, {
    "txt": "全部",
    "field": "total",
    "val": "7",
    "overtime": false
  }
];

// 订单状态  根据此状态判断其是否可以改派 / 指派
const orderState = {
  state: '',
}

class RightShipment extends React.Component {
  constructor(props) {
    super(props);
    // 表格的列数据
    const { selectState } = this.props;

    this.columns = [
      {
        title: '状态',
        key: 'delivery_state',
        dataIndex: 'delivery_state',
        render: (text,record) => {
          return stateTransform('delivery_state',text);
        }
      }, {
        title: '期望时间',
        key: 'shipping_time',
        dataIndex: 'shipping_time',
        render: (text,record) => {
          const _date = utcToDate(text);
          _date.time.length = 2;
          return `${_date.time.join(':')}`;
        }
      }, {
        title: '商家名称',
        key: 'seller.name',
        dataIndex: 'seller.name'
      }, {
        title: '顾客地址',
        key: 'consignee_address',
        dataIndex: 'consignee_address',
        width: '260px',
        render: (text,record) => {
          const _txt = text + record.consignee_address_detail;
          return (<a style={{'color':'#666'}} title={_txt}>{_txt}</a>);
        }
      }, {
        title: '骑士',
        key: 'courier_name',
        dataIndex: 'courier_name',
        render: (text,record) => {
          return record.courier ? record.courier.name : '';
        }
      }, {
        title: '操作',
        key: 'operate',
        dataIndex: 'operate',
        render: (text, record) => (
          <Link to={"/tms/control_panel/detail?id=" + record.id}>详情</Link>
        )
      }
    ];
    this.getCurrentSelectTab = this.getCurrentSelectTab.bind(this);
  }

  getCurrentSelectTab(e) {
    const { stateChange } = this.props;
    stateChange('shipments',e.target.value)

    window.sessionStorage && sessionStorage.setItem('TAB_VALUE', JSON.stringify(e.target.value));

    const antRadioButtonList = document.querySelectorAll(".ant-radio-button-wrapper > .ant-radio-button");
    let selectTabIndex;
    //获取当前点击的index值
    for (let i in antRadioButtonList) {
      const _className = antRadioButtonList[i].className;
      if (_className && _className.indexOf('ant-radio-button-focused') !== -1) {
        selectTabIndex = i;
        break;
      }
    }
    //存储key值
    selectTabIndex && window.sessionStorage && sessionStorage.setItem('SELECT_TAB_INDEX', JSON.stringify(selectTabIndex));
  }

  componentDidMount() {
    //判断当前是否有tab key，有则模拟点击
    // const areaInfo = window.sessionStorage && JSON.parse(sessionStorage.getItem('AREAINFO'))
    const selectTabIndex = window.sessionStorage && JSON.parse(sessionStorage.getItem('SELECT_TAB_INDEX'));
    const unmountKey = window.sessionStorage && JSON.parse(sessionStorage.getItem('COMPONENT_UNMOUNT'));
    if (unmountKey && selectTabIndex) {
      const antRadioButtonList = document.querySelectorAll(".ant-radio-button-wrapper > .ant-radio-button")
      antRadioButtonList[selectTabIndex].click();
    } 
  }

  componentWillUnmount() {
    //组件卸载 key 
    window.sessionStorage && sessionStorage.setItem('COMPONENT_UNMOUNT', JSON.stringify(1));
    //卸载组件时，删除记录的状态  ！！！浏览器刷新非组件卸载
    // window.sessionStorage && sessionStorage.removeItem('SELECT_TAB_INDEX');
    // window.sessionStorage && sessionStorage.removeItem('AREAINFO');
  }

  render() {
    const columns = this.columns;
    // 从props里面获取信息
    const {onPageChange, page, shipments, stateChange, handleSelect, shipments_stats, selectedRowKeys, saveOrderState} = this.props;
    // 表格参数
    const tableProps = {

      rowSelection: {
        type: 'checkbox',
        selectedRowKeys,//选择行
        // 根据props来判断按钮是否可用
        // delivery_state 根据此状态进行改派判定按钮 ||record.delivery_state == 10
        getCheckboxProps(record) {
          let _result = { disabled: true };
          if(record) {
            if (record.state === 50) {
              _result.disabled = false;
              if(record.state === 50){
                orderState.state = 50; // 保存骑士已接单的状态
                /*this.props.saveOrderState(orderState.state);*/
              }else if(record.delivery_state == 10){
                orderState.state = 10; // 保存订单待分配的状态
                /*this.props.saveOrderState(orderState.state);*/
              }
            };
          };
          return _result;
        },
        onChange: handleSelect,
      },
      // 分页参数配置参考ant-design
      pagination: {
        total: shipments._meta.result_count || 0,//数据的总条数
        current: page,
        pageSize: 10,
        onChange: onPageChange
      },
      columns,
      rowKey:(record) => record.id,
      size:"middle",
      dataSource: shipments.data,
      rowClassName: (record, index) => {//根据条件给行添加一个类
        let _className = '';
        if(record.reassign_record) {
          if (record.reassign_record.state === 50) {
            _className = 'aoao-reassign';
          };
        };
        return _className;
      }
    }

    return (
      <Col span={19} className="right-shipment">
        <Row style={{ height: '40px', }}>
          <RadioGroup style={{width:'100%',marginLeft:'0px'}} defaultValue='1' onChange={(e) => {this.getCurrentSelectTab(e)}} >
            {
              radioArr.map((item,index) =>{

                let _stats = item.field === 'unfinished' ?
                (shipments_stats.total - shipments_stats.done - shipments_stats.closed - shipments_stats.error)
                : shipments_stats[item.field];

                return <RadioButton key={item.txt} value={item.val}>{item.txt}({_stats || 0})</RadioButton>
                
                {/* 超时用  return <RadioButton key={item.txt} style={ item.overtime ? { "height":'60px',"verticalAlign":"top" } : {  "height":'60px',"verticalAlign":"top","lineHeight":"60px" }} value={item.val}>{item.txt}({_stats || 0}){ item.overtime && <br/> }{ item.overtime && "超时" }</RadioButton>*/}
              })
            }
          </RadioGroup>
        </Row>
        <Row style={{ height: 'calc(100% - 40px)', overflowY: 'auto', border:'1px solid #e9e9e9', borderLeft:'none', padding:'10px' }}>
          <Table {...tableProps} />
        </Row>
      </Col>
    );
  }

};


module.exports = RightShipment;
