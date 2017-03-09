import React, {Component, PropTypes} from 'react';
import {Form,Row,Col,Input ,Button, Checkbox, Icon, Popover, Select , Popconfirm, message } from 'antd';
const [FormItem,Option] = [Form.Item, Select.Option];
const {dateFormat} = window.tempAppTool;

class HeadSearch extends Component {

  constructor(props) {
    super();
    // 将区域名称存放到页面的内部state中
    this.state = { area_name: '' };

  }
  componentWillReceiveProps = (nextProps) =>{
    const {flag} = this;
    let _that = this;
    // 默认的区域id
    let default_area_id1 = '';
    // 默认的区域名称
    let default_area_name1 = '';

    if(flag){
      default_area_id1 = nextProps.default_area_id;
      default_area_name1 = nextProps.default_area_name;
    }

  }
  // 提交函数
  handleSubmit = (e) => {

      e.preventDefault();
      const {handleSearch, form} = this.props;
      const {getFieldsValue} = form;
      let params = getFieldsValue();
      //只需要把form的值传过去就可以，其他的交给父级去处理和保存，相当于部分更新
      handleSearch(getFieldsValue());
  }

  // 更新区域的函数
  handleAreaChange = (value) => {
    const {areaChange, areas_data} = this.props;
    //向上传area_id
    console.log(value,'arrea_id------');
    areaChange(value);
    //更新本地的区域名称
    let area_name = '';
    for(let area of areas_data) {
      if(area.id === value) {
        area_name = area.name;
        break;
      };
    };
    this.setState({ area_name });
    if(area_name.length !== 0) {
      message.success(`已切换区域为${area_name}。`);
    };

  };

  // 伸缩的div
  toggleStyle = () => {
      var div = document.getElementById("toggleDiv")
      var button = document.getElementById("button")
      var Icon = document.getElementById("Icon")
     if(div.style.left == '-190px'){
         div.style.left='0px'
         button.innerHTML = '收起'
         div.style.transition = 'left 1s'
     }else if(div.style.left == '0px'){
        div.style.left='-190px'
        button.innerHTML = '切换'
     }
  }

  render() {
//   从props里面获取信息
    const {form, areas_data=[], default_area_id, default_area_name, city_name, Allrefresh, default_couriers,stateChange} = this.props;
    // 从form里面获取信息
    const {getFieldProps} = form;
    // 从this里面获取信息
    const {handleSubmit, handleAreaChange, toggleStyle} = this;
    // 从this.state里面获取信息
    const {area_name} = this.state;


    //取当前时间
    let _date = dateFormat();
    _date.shift();
    //取当前默认区域
    const currDate = _date.join('-');
    // 文字说明
    const tms_guide = (
       <div>
        <p> 当前系统采用纯抢单模式：<br/> 1.商户下单后，系统推送给取货地址周围3km骑士，<br/>2.根据骑士当前位置等综合条件同时推送订单给多位骑士，进行抢单；</p>
        <p> 注：区域负责人可以查看到骑士申请改派的订单进行改派。 </p>
      </div>
    );
    // 文字说明
    const tms_guide2 = (
       <div>
        <p> 当前系统采用纯抢单模式：<br/> 商户下单后，系统推送给取货地址周围3km骑士，根据骑士当前位置等综合条件同时推送订单给多位骑士，进行抢单；</p>
         <p>商家下单后，所有订单都只在期望送达时间当天营业时间内推送</p>
         <p> 注：区域负责人可以查看到骑士申请改派的订单进行改派。</p>
      </div>
    );
    return (
      <Form inline onSubmit={handleSubmit} style={{height:'42px',boxSizing:'border-box', padding: '5px 0'}}>
       <Row>
         <Col span={1}>
           <div id="toggleDiv"  style={{width:'168px',height:'35px',position:'absolute',left:'-190px',top:'3px',zIndex:'22',background:'#fff',padding:'5px'}}>
             <Select showSearch optionFilterProp="children" onChange={handleAreaChange} placeholder={default_area_name} defaultValue={default_area_id}  style={{ width: 150 }} >
                {
                  areas_data.map((item,index) =>{
                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                  })
                }
             </Select>
             <Button id="button" className="toggle-button" onClick={toggleStyle}>
               切换
             </Button>
           </div>
         </Col>
         <Col span={5}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flexEnd',
              lineHeight:'38px'
            }}>
              <div>
                {city_name}&nbsp;
              </div>
              <div>
                {area_name || default_area_name}&nbsp;
              </div>
              <div>
                {currDate}
                &nbsp;  &nbsp;
                <Popover content={tms_guide2} title="调度规则说明：">
                  <Icon type="question-circle-o" />
                </Popover>
              </div>
            </div>

         </Col>
         <Col span={15} style={{paddingLeft:'10px'}}>
           <FormItem label="骑士">
             <Select placeholder="请输入骑士姓名/骑士手机" showSearch  optionFilterProp="children" {...getFieldProps("courier_id")}
             filterOption={(inputValue, option) => {
               const {children} = option.props;
               const _test = Array.isArray(children) ? children[0] : children;
               if(_test.indexOf(inputValue) !== -1) {
                 return true;
               };
             }}
              {...{"style":{"width":190}}}>
               <Option value="all">全部</Option>
               {default_couriers.map( (item, index) => {
                 return (<Option key={`courier_id_${item.id}`} value={ item.id }>{ `${item.name}(${item.mobile})` } </Option>)
               })}
             </Select>
           </FormItem>
          <Button id="primary" type="primary" htmlType="submit">查询</Button>

         </Col>
         <Col span={3} className="reflex">
          <Button icon="retweet" className="reflex-button" onClick={() => {Allrefresh()}}>刷新</Button>
         </Col>
       </Row>
      </Form>
    );
  }
}


 HeadSearch = Form.create()(HeadSearch);
 module.exports = HeadSearch;
