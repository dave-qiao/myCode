import React, {Component, PropTypes} from 'react';
import {connect} from 'dva';
import {SIGN} from '../../../ActionsName.js';
import {Form, Button,Input,Radio,pagination,message, Row,InputNumber, Col, Icon,Table, Alert,TimePicker,Popover,Modal} from 'antd';

const {utcToDate} = window.tempAppTool;
const confirm = Modal.confirm;
const [FormItem, RadioGroup, InputGroup] = [ Form.Item, Radio.Group, Input.Group];

// ant-design的forItem配置
const Lay_6_16 = {labelCol:{ span: 6},wrapperCol:{ span: 16}};

//定价模式
const PriceMode = {
  stand: 1, //一口价
  level: 2, //阶梯定价
};

// 页面用到的变量字典
const stateNames = {
  // 定价类型
  plan_type: {
    '21': '距离加时间阶梯价',
    '22': '距离阶梯价',
    '23': '时间阶梯价',
  },
  // 定价方式
  price_mode: { '2': '阶梯计价', '1': '一口价' },
  // 定价模型
  biz_mode: { '10': '本地生活圈即时送' },
};

// 数组的结构重新组织
function newArray(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

// 时间选择器只能选择整点半点的操作
function disabledMinutes() {
  return newArray(0, 60).filter(value => value % 30 !== 0);
}

class View_edit extends React.Component {

  constructor(props) {
    super();
    // 获取初始化的model层数据
    const {business_sign} = props;
    const {list_details} = business_sign;
    const defaultPricePlan = list_details.plan_temp;

    // 获取定价模式
    let price_mode = list_details.price_mode;
    let id = list_details.id
   // 获取定价类型
    let plan_type = list_details.plan_type;
    // 获取定价计划
    let price_plan = list_details.price_plan;
    // 获取营业时间
    const biz_time = [];
    list_details.biz_time.map( (item,index) =>{
      biz_time.push(item[index])
    })
    const _price_plan = JSON.stringify(price_plan);

    defaultPricePlan.time_span = list_details.biz_time;

    this.state = {
      price_mode,
      plan_type,
      curr_price_plan: (price_mode === PriceMode.level) ? price_plan : [defaultPricePlan],
      curr_stand_price_plan: (price_mode === PriceMode.stand) ? price_plan : [defaultPricePlan],
    };

    Object.assign(this,{
      flag : true,
      id,
      defaultPricePlan,//基础定价方案
      planHasalter: true, //重置开关
      default_price_plan:price_plan,
      price_plan_guide: (
        <div>
          <p>1. 产品启用后立即生效，该产品为标准产品，商家签约后可根据不同的商家需求进行自定义修改</p>
          <p>2. 时间分段：</p>
          <p>&nbsp;&nbsp;2.1 不能设置营业时间之外的时间</p>
          <p>&nbsp;&nbsp;2.2 时间分段必须覆盖所有营业时间段</p>
          <p>3. 距离分段：</p>
          <p>&nbsp;&nbsp;3.1 距离最大设置不能大于10km</p>
          <p>&nbsp;&nbsp;3.2 后面的距离设置不能小于前面的距离</p>
          <p>4. 价格计算：基准费＋附加费（基准费距离跟随距离分段输入值变化）</p>
          <p>5. 一口价：设置一口价，所有订单配送费均按这一个价格计算</p>
          <p>6. 该定价方案为商家配送费计算规则：</p>
          <p>&nbsp;&nbsp;6.1 时间取值为订单预计送达时间</p>
          <p>&nbsp;&nbsp;6.2 距离取值为发货地址与顾客地址之间行驶距离</p>
        </div>
      ),
      'biz_time0': biz_time[0],  // 营业的开始时间
      'biz_time1': biz_time[1],// 营业的结束时间
      'span_time': biz_time[1], //用来进行分段判断或者是验证此时值的合法性判断
    });

  }

  // 时间周期函数 在state发生变化的时候
  componentWillReceiveProps = (nextProps) =>{

    const {flag,biz_time0,biz_time1,span_time} = this
    const {curr_price_plan}  = this.state;
    let _that = this;
    // 设置flag开关 一次性接收之后不再接收
    if(flag){
      const list_details = nextProps.business_sign.list_details;
      const defaultPricePlan = list_details.plan_temp;
      const { price_plan, biz_time } = list_details
      const price_mode = list_details.price_mode;

      _that.biz_time0  = biz_time[0];
      _that.biz_time1 = biz_time[1];
      _that.span_time = biz_time[1];

      defaultPricePlan.time_span = list_details.biz_time;

      const curr_price_plan = (price_mode === PriceMode.level) ? price_plan : [defaultPricePlan];
      const curr_stand_price_plan = (price_mode === PriceMode.stand) ? price_plan : [defaultPricePlan];

      console.log('componentWillReceiveProps');
      _that.setState({
        price_mode,
        curr_price_plan,
        curr_stand_price_plan,
      }, () => {
        _that.flag = false;
      })
    }

  }

  // 更改定价方案时间的函数
  change_plan_val = (type,poi,val,dis_len) => {
    let _that = this;
    let {curr_price_plan} = this.state;
    let _plan_arr = [];
    let n = curr_price_plan.length/dis_len;
    while (n > 0) {
      _plan_arr.push(curr_price_plan.splice(0,dis_len));
      n --;
    };
    if(type === 'max_distance') {
      _plan_arr.forEach(item => { item[poi[0]][type] = val * 1000});
    } else {
      _plan_arr[poi[0]][poi[1]][type] = val * 100;
    };
    let new_price_plan = [].concat(..._plan_arr);

    console.log('change_plan_val');
    _that.setState({curr_price_plan: new_price_plan}, ()=>{
      //重置标记
      _that.planHasalter = true;
    })
  }

  //设置一口价价格
  pricePlanChange = (val) => {
    const { curr_stand_price_plan } = this.state;
    curr_stand_price_plan[0].base_price = val * 100;
    const _state = {
      curr_stand_price_plan,
    };
    this.setState(_state);
  }

  radioChange = (type, val) => {
    const _state = {};
    _state[type] = val;
    this.setState(_state);
  }

  // 显示定价时间，每次render都会执行
  show_price_plan = () => {
    // 从state里面获取信息
    const { curr_price_plan, price_mode, plan_type } = this.state;
    const { getFieldProps } = this.props.form;
    const { change_plan_val, alter_plan, change_time } = this;

    //判断界面是否选择阶梯定价模式
    if (price_mode !== PriceMode.level) {
      return '';
    }

    const inputProps = { size: 'small', style: { width: '50px' } };

    // 时间插件设置
    const timeProps = {
      disabledMinutes,
      size: 'small',
      hideDisabledOptions: true,
      format: 'HH:mm',
      getValueFromEvent: (date, dateString) => dateString,
      onChange: (date, dateString) => {
        change_time('span_time', dateString);
      },
    };

    // 判断当前有几套定价方案{ [],[] } 默认是长度为1  只有默认的一套定价方案
    const plan_len = curr_price_plan.length;

    // 取出来第一套和最后一套定价方案
    const [first_plan, last_plan] = [curr_price_plan[0], curr_price_plan[plan_len - 1]];

    let first_plan_time_span0 = '';
    let last_plan_time_span1 = '';

    // 如果没有定价方案 不显示
    if(first_plan == undefined){
      return ''
    } else {
      // 取出第一条定价方案
      first_plan_time_span0 = first_plan.time_span[0];
      last_plan_time_span1 = last_plan.time_span[1];
    }
    let [distanceData, pirceData, rowNum, colNum, curr_time] = [[], [{}], 0, 0, first_plan_time_span0];

    // 结束时间：是根据最后一套定价方案的终点值，这个值和curr_time作为表格左上角的第一个值和右下角的最后一个值
    const [end_time, end_dis] = [last_plan_time_span1, last_plan.min_distance];

    curr_price_plan.forEach((item,index) => {
      //判断是否换行 是否换列
      if(curr_time !== item.time_span[0]) {

        // 如果第一个方案的第一个起始时间不等于当前定价方案的起始时间，设为相等
        curr_time = item.time_span[0];
        pirceData.push({});
        colNum = 0;
        rowNum ++;
      } else if (index !== 0) {
        colNum ++ ;
      }
      if(rowNum === 0) {
        //收集第一行的距离个数
        distanceData.push(1);
      };
      // 按行存数据
      pirceData[rowNum][`plan${colNum}`] = {...item, rowNum, colNum};
    });

    const [time_len, dis_len] = [pirceData.length, distanceData.length];

    let columns = [ { title: '时间分段', dataIndex: 'name', key: 'name',} ];

    // 第一列的数据 按时间分段
    columns[0].render = (text, record, index) => {
      // 渲染第一列
      // 第一行的时候变成'--'
      if (index === 0) {
        return '--';
      } else {
        // 获取到第一列的时间 和行号列号（坐标）
        let time_span = '';
        let rowNum = '';
        let colNum = '';
        if(record.plan0){
          time_span = record.plan0.time_span;
          rowNum = record.plan0.rowNum;
          colNum = record.plan0.colNum;
        }

        const alters = {type: 'time', action: 'add', poi: rowNum, dis_len};
        const clicks = {
          plus: {
            type:"plus-circle-o",
            onClick:(e) => {alter_plan(alters)},
          },
          cross: {
            type:"cross-circle-o",
            onClick:(e) => {alter_plan({...alters,action:'remove'})},
          }
        };
        let _result = null;
        //只有一个时间段
        if (time_len === 1) {
          _result = [
            <Icon key='1'  {...clicks.plus}/> ,
            <span key='2'>{time_span[0]}--</span>,
            <TimePicker key='3' {...{disabledMinutes, size: "small", hideDisabledOptions: true, format:"HH:mm"}}
                        {...getFieldProps('one_span_time',{
                          initialValue: time_span[1],
                          getValueFromEvent:(date, dateString) => dateString,
                          onChange:(date, dateString) =>{
                            {/*span_time代表分行的间隔*/}
                            change_time('span_time',dateString);
                          }
                        })} />
          ];
          return (_result);
        };

        //不止一个时间段
        //是最后一个时间段
        if (rowNum === time_len - 1) {

          _result = [
            <Icon key='1' {...clicks.cross}/>,
            <Icon key='2' {...clicks.plus}/> ,
            <span key='3'>{time_span[0]}--</span>,
            <TimePicker key='4' {...timeProps} defaultValue={time_span[1]} />
          ];
        } else {
          _result = [
            <Icon key='1' {...clicks.cross}/> ,
            <span key='2'>{time_span[0]}--{time_span[1]}</span>,
          ];
        }
        return (_result);
      };
    };



       let ex_columns = distanceData.map((item,index) => {
      let _result = { title: '距离分段', dataIndex: `plan${index}`, key: `name_${index}`, };
      // 价格的第一列， 只有基础价
      if(index === 0) {
        _result.colSpan = dis_len;
        _result.render = (text, record, index2) => {

          const {max_distance, base_price, rowNum} = text;
          const alters = {type: 'distance', action: 'add', poi: 0, dis_len};
          const clicks = {
            plus: { type:"plus-circle-o", onClick:(e) => {alter_plan(alters)}, },
            cross: { type:"cross-circle-o", onClick:(e) => {alter_plan({...alters,action:'remove'})}, }
          };
          //距离行
          if (index2 === 0) {
            //只有一个距离, 加号，可编辑
            if (dis_len === 1) {
              return ([
                <Icon key='1' {...clicks.plus}/> ,
                <span key='2'>小于<InputNumber {...inputProps} min={0} max={10} step={1} value={max_distance/1000} onChange={(val) => { change_plan_val('max_distance',[0],val,dis_len) }}/>
                km</span>
              ]);
            };
            //不止一个距离, 减号，不可编辑
            return ([
              <Icon key='1' {...clicks.cross}/> ,
              <span key='2'>小于{max_distance/1000}km</span>
            ]);
          };
          //价格行 基础价
          return ([
            <InputNumber key='1' {...inputProps} min={0} step={0.01} value={base_price/100} onChange={(val) => { change_plan_val('base_price',[rowNum, 0],val,dis_len) }}/>,
            <span key='2'>元／{max_distance/1000}km</span>
          ]);
        };
        //如果只有一个，那么直接就结束了
        return <Table {..._result} pagination={false}/>;
      };
      // 价格的其他列， 基础价 ＋ 附加价
      _result.colSpan = 0;
      _result.render = (text, record, index2) => {
        const {max_distance, min_distance, base_price, ext_price, rowNum, colNum} = text;
        const alters = {type: 'distance', action: 'add', poi: colNum, dis_len};
        const clicks = {
          plus: {
            type:"plus-circle-o",
            onClick:(e) => {alter_plan(alters)},
          },
          cross: {
            type:"cross-circle-o",
            onClick:(e) => {alter_plan({...alters,action:'remove'})},
          }
        };
        //距离行
        if (index2 === 0) {
          //是最后一个 加号，减号，可编辑
          if (min_distance === end_dis) {
            return ([
              <Icon key='1' {...clicks.cross}/> ,
              <Icon key='2' {...clicks.plus}/> ,
              <span key='3'>小于<InputNumber {...inputProps} min={min_distance/1000} max={10} step={1} value={max_distance/1000} onChange={(val) => { change_plan_val('max_distance',[colNum],val,dis_len) }}/>
              km</span>
            ]);
          };
          //不是最后一个, 减号，不可编辑
          return ([
            <Icon key='1' {...clicks.cross}/> ,
            <span key='2'>小于{max_distance/1000}km</span>
          ]);
        };
        return ([
          <InputNumber key='1' {...inputProps} min={0} step={0.01} value={base_price/100} onChange={(val) => { change_plan_val('base_price',[rowNum, colNum],val,dis_len) }}/>,
          <span key='2'>元／{min_distance/1000}km ＋ </span>,
          <InputNumber key='3' {...inputProps} min={0} step={0.01} value={ext_price/100} onChange={(val) => { change_plan_val('ext_price',[rowNum, colNum],val,dis_len)  }}/>,
          <span key='4'>元／1km</span>,
        ]);
      };

      return <Table {..._result} pagination={false}/>;
    });
     if(columns){
       columns = columns.concat(ex_columns);
     }
    let tableProps = {
      dataSource: [pirceData[0],...pirceData],
      columns,
    };
    return <Table {...tableProps} pagination={false}/>;;
  };

  //显示阶梯定价方案
  showPricePlan = () => {
    //判断界面是否选择阶梯定价模式
    if (this.state.price_mode !== PriceMode.level) {
      return '';
    }
    // 从state里面获取信息
    const { curr_price_plan, price_mode, plan_type } = this.state;
    const { getFieldProps } = this.props.form;
    const { change_plan_val, alter_plan, change_time } = this;

    const inputProps = { size: 'small', style: { width: '50px' } };

    // 关于时间插件的参数具体参照ant-design
    const timeProps = {
      disabledMinutes,
      size: 'small',
      hideDisabledOptions: true,
      format: 'HH:mm',
      getValueFromEvent: (date, dateString) => dateString,
      onChange: (date, dateString) => {
        change_time('span_time', dateString);
      },
    };

    // 判断当前有几套定价方案{ [],[] } 默认是长度为1  只有默认的一套定价方案
    const plan_len = curr_price_plan.length;

    // 取出来第一套和最后一套定价方案
    const [first_plan, last_plan] = [curr_price_plan[0], curr_price_plan[plan_len - 1]];

    // distanceData ？？pirceData 价格数据,他的值是如何被赋值进去的 rowNum，colNum 默认的行号和列号 curr_time:？？是根据第一套定价方案的时间段的起始值
    let [distanceData, pirceData, rowNum, colNum, curr_time] = [[], [{}], 0, 0, first_plan.time_span[0]];

    // 结束时间：是根据最后一套定价方案的终点值，这个值和curr_time作为表格左上角的第一个值和右下角的最后一个值
    const [end_time, end_dis] = [last_plan.time_span[1], last_plan.min_distance];

    // 默认的当前生效的定价方案就是第一套
    curr_price_plan.forEach((item, index) => {
      //判断是否换行 是否换列
      if (curr_time !== item.time_span[0]) {
        // 如果第一个方案的第一个起始时间不等于当前定价方案的起始时间，设为相等
        curr_time = item.time_span[0];
        const { max_distance, time_span } = pirceData[rowNum][`plan${colNum}`];
        pirceData.push({});
        colNum = 0;
        rowNum++;
      } else if (index !== 0) {
        colNum++;
      }
      if (rowNum === 0) {
        //收集第一行的距离个数
        distanceData.push(1);
      }
      // 按行存数据
      pirceData[rowNum][`plan${colNum}`] = { ...item, rowNum, colNum };
    });

    const [time_len, dis_len] = [pirceData.length, distanceData.length];
    let columns = [{ title: '时间分段', dataIndex: 'name', key: 'name' }];

    // 第一列的数据 按时间分段
    columns[0].render = (text, record, index) => {
      if (index === 0) {
        return '--';
      } else {
        const { time_span, rowNum, colNum } = record.plan0;
        const alters = { type: 'time', action: 'add', poi: rowNum, dis_len };
        const clicks = {
          plus: {
            type: 'plus-circle-o',
            onClick: (e) => { alter_plan(alters) },
          },
          cross: {
            type: 'cross-circle-o',
            onClick: (e) => { alter_plan({ ...alters, action: 'remove' }) },
          },
        };
        let _result = null;
        //只有一个时间段
        if (time_len === 1) {
          _result = [
            <Icon key="1" {...clicks.plus} />,
            <span key="2">{time_span[0]}--</span>,
            <TimePicker
              key="3" {...{ disabledMinutes, size: 'small', hideDisabledOptions: true, format: 'HH:mm' }}
              {...getFieldProps('one_span_time', {
                initialValue: time_span[1],
                getValueFromEvent: (date, dateString) => dateString,
                onChange: (date, dateString) => {
                  { /*span_time代表分行的间隔*/ }
                  change_time('span_time', dateString);
                },
              })}
            />,
          ];
          return (_result);
        }
        //不止一个时间段
        //是最后一个时间段
        if (rowNum === time_len - 1) {
          _result = [
            <Icon key="1" {...clicks.cross} />,
            <Icon key="2" {...clicks.plus} />,
            <span key="3">{time_span[0]}--</span>,
            <TimePicker key="4" {...timeProps} value={time_span[1]} />,
          ];
        } else {
          _result = [
            <Icon key="1" {...clicks.cross} />,
            <span key="2">{time_span[0]}--{time_span[1]}</span>,
          ];
        }
        return (_result);
      }
    };
    const ex_columns = distanceData.map((item, index) => {
      const _result = { title: '距离分段', dataIndex: `plan${index}`, key: `name_${index}` };
      // 价格的第一列， 只有基础价
      if (index === 0) {
        _result.colSpan = dis_len;
        _result.render = (text, record, index2) => {
          const { max_distance, base_price, rowNum } = text;
          const alters = { type: 'distance', action: 'add', poi: 0, dis_len };
          const clicks = {
            plus: { type: 'plus-circle-o', onClick: (e) => { alter_plan(alters) } },
            cross: { type: 'cross-circle-o', onClick: (e) => { alter_plan({ ...alters, action: 'remove' }) } },
          };
          //距离行
          if (index2 === 0) {
            //只有一个距离, 加号，可编辑
            if (dis_len === 1) {
              return ([
                <Icon key="1" {...clicks.plus} />,
                <span key="2">
                  小于<InputNumber {...inputProps} min={0} max={10} step={1} value={max_distance / 1000} onChange={(val) => { change_plan_val('max_distance', [0], val, dis_len) }}/>km
                </span>,
              ]);
            }
            //不止一个距离, 减号，不可编辑
            return ([
              <Icon key="1" {...clicks.cross} />,
              <span key="2">小于{max_distance / 1000}km</span>,
            ]);
          }
          //价格行 基础价
          return ([
            <InputNumber key="1" {...inputProps} min={0} step={0.01} value={base_price / 100} onChange={(val) => { change_plan_val('base_price', [rowNum, 0], val, dis_len) }} />,
            <span key="2">元／{max_distance / 1000}km</span>,
          ]);
        };
        //如果只有一个，那么直接就结束了
        return _result;
      }
      // 价格的其他列， 基础价 ＋ 附加价
      _result.colSpan = 0;
      _result.render = (text, record, index2) => {
        const { max_distance, min_distance, base_price, ext_price, rowNum, colNum } = text;
        const alters = { type: 'distance', action: 'add', poi: colNum, dis_len };
        const clicks = {
          plus: {
            type: 'plus-circle-o',
            onClick: (e) => { alter_plan(alters) },
          },
          cross: {
            type: 'cross-circle-o',
            onClick: (e) => { alter_plan({ ...alters, action: 'remove' }) },
          },
        };
        //距离行
        if (index2 === 0) {
          //是最后一个 加号，减号，可编辑
          if (min_distance === end_dis) {
            return ([
              <Icon key="1" {...clicks.cross} />,
              <Icon key="2" {...clicks.plus} />,
              <span key="3">
                小于<InputNumber {...inputProps} min={min_distance / 1000} max={10} step={1} value={max_distance / 1000} onChange={(val) => { change_plan_val('max_distance', [colNum], val, dis_len) }} />km
              </span>,
            ]);
          }
          //不是最后一个, 减号，不可编辑
          return ([
            <Icon key="1" {...clicks.cross} />,
            <span key="2">小于{max_distance / 1000}km</span>,
          ]);
        }
        return ([
          <InputNumber key="1" {...inputProps} min={0} step={0.01} value={base_price / 100} onChange={(val) => { change_plan_val('base_price', [rowNum, colNum], val, dis_len) }} />,
          <span key="2">元／{min_distance / 1000}km ＋ </span>,
          <InputNumber key="3" {...inputProps} min={0} step={0.01} value={ext_price / 100} onChange={(val) => { change_plan_val('ext_price', [rowNum, colNum], val, dis_len) }} />,
          <span key="4">元／1km</span>,
        ]);
      };

      return _result;
    });
    columns = columns.concat(ex_columns);
    const tableProps = {
      dataSource: [pirceData[0], ...pirceData],
      columns,
    };
    return (
      <Table {...tableProps} pagination={false} />
    );
  }

  // 暂时定价模式
  show_price_mode = () => {
     const {list_details} = this.props.business_sign;
     let _result = [
       <FormItem key='price_mode' label="定价模式" {...Lay_6_16}> {stateNames.price_mode[list_details.price_mode]} </FormItem>
     ];
     if (list_details.price_mode === 2) {
       _result.push(
         <FormItem key='plan_type' label="定价方案" {...Lay_6_16}> {stateNames.plan_type[list_details.plan_type]} </FormItem>
       )
     };
     return _result;
   };

  // 数据的抓取统一处理
  itemSetProps = (name,obj) => {
    const {list_details} = this.props.business_sign;
    const {getFieldProps} = this.props.form;
    return getFieldProps(name,{initialValue: list_details[name],...obj});
  };

  // 更改营业时间
  change_time = (type, val) => {
    this[type] = val;
  };

  //展示定价类型
  show_price_type = () => {
    const { price_mode, curr_stand_price_plan } = this.state;
    const { radioChange, itemSetProps, pricePlanChange } = this;
    // 一口价模式
    if (price_mode === PriceMode.stand) {
      //一口价的价格
      const standPricePlan = curr_stand_price_plan[0].base_price / 100;
      return ([
        <FormItem key="pricePlanChangeName" label="定价方案" {...Lay_6_16}>
          <InputNumber key="pricePlanChange" min={0} step="0.01" onChange={pricePlanChange} defaultValue={standPricePlan} /> 元／单
        </FormItem>,
        <FormItem key="pricePlanDesc" label="说明" {...Lay_6_16} > 一口价，一律按订单计价，所有订单配送费不分距离、时间如：设置费用5元/单，1单配送费为5元 </FormItem>,
      ]);
    }

    //阶梯定价
    return (
      <FormItem label="定价方案" {...Lay_6_16}>
        <RadioGroup {...itemSetProps('plan_type', { onChange: (e) => { radioChange('plan_type', e.target.value) }, initialValue: 21 })}>
          <Radio value={21}>距离加时间阶梯价</Radio>
        </RadioGroup>
      </FormItem>
    );
  }

  // 重置定价方案
  reset_price_plan = () => {
    console.log('reset_price_plan');
    let _that = this;
    const {defaultPricePlan} = this;
    const {form} = this.props;
    // 获取最新的时间值
    const [biz_time0,biz_time1] = [form.getFieldValue('biz_time0'),form.getFieldValue('biz_time1')];
    let curr_price_plan = [{...defaultPricePlan,time_span: [biz_time0,biz_time1]}];
   // 获取到真实的数据之后重置内部的state中的数据，以便于其他地方能取到最新设置的值
    _that.setState({curr_price_plan: curr_price_plan}, ()=>{

      Object.assign(_that,{
        biz_time0,
        biz_time1,
        span_time: biz_time1
      });
      //重置标记
      _that.planHasalter = false;
    })
  };

  // 点击增加或者移除按钮判断是移除或者根据判断增加一行 （定价方案的动态交互效果）
  alter_plan = ({type,poi,action,dis_len}) => {
    let _that = this;
    // 获取当前的定价方案
    let {curr_price_plan} = this.state;
    // 获取开始营业时间，结束营业时间 和节点时间（用来判断是否换行的数据）
    let {biz_time1, biz_time0, span_time} = this;
    let biz_time1_num = '';
    let biz_time0_num = '';
    let span_time_num = '';

    if(biz_time1){
      biz_time1_num = biz_time1.replace(':','')*1;
    }
    if(biz_time0){
      biz_time0_num = biz_time0.replace(':','')*1;
    }
    if(span_time){
      span_time_num = span_time.replace(':','')*1;
    }

    //验证  距离 | 时间
    if ( type === 'time' && action === 'add') {
      if(biz_time0_num >= biz_time1_num) {
        message.info('营业时间错误，请重新选择');
        return ;
      };
      if(biz_time0_num >= span_time_num || biz_time1_num <= span_time_num) {
        message.info('时间分段错误，请重新选择');
        return;
      };
    };
    // 获取最后一套定价方案
    const last_price_plan = curr_price_plan.pop();
    let err_msg = '';
    if (type === 'distance' && action === 'add') {
      const {max_distance, min_distance} = last_price_plan;
      switch (true) {
        case max_distance === min_distance :
          err_msg = '该距离分段已存在';
          break;
        case max_distance === 10000:
          err_msg = '距离分段已达最大值,无法继续添加';
          break;
      };
    };
    if ( type === 'time' && action === 'add') {
      const {time_span} = last_price_plan;
      switch (true) {
        case time_span[0].replace(':','')*1 >= span_time.replace(':','')*1 :
          err_msg = '该时间分段无效';
          break;
        case span_time === time_span[1]:
          err_msg = '该时间分段已达最大值,无法继续添加';
          break;
      };
    };
    // 将通过验证的最后一套定价方案push到当前定价方案
    curr_price_plan.push(last_price_plan);
    //验证未通过
    if (err_msg.length !== 0) {
      message.info(`${err_msg},请重新选择！`);
      return;
    };
    // 验证通过
    let _plan_arr = [];
    let n = curr_price_plan.length/dis_len;
    while (n > 0) {
      _plan_arr.push(curr_price_plan.splice(0,dis_len));
      n --;
    };
    let _plan_arr_len = _plan_arr.length;
    //添加 需要做更新
    if(action === 'add' && type === 'distance') {
      _plan_arr.forEach(item => {
        let _temp = item.pop();
        const {max_distance} = _temp;
        let _new = JSON.parse(JSON.stringify(_temp));
        _new.min_distance = max_distance;
        item.push(_temp,_new);
      });
    };
    if(action === 'add' && type === 'time') {
      let _temp = _plan_arr.pop();
      let _new = JSON.parse(JSON.stringify(_temp));
      _temp.forEach(item => {item.time_span[1] = span_time;});
      _new.forEach(item => {item.time_span = [span_time,biz_time1];});
      _plan_arr.push(_temp,_new);
    };

    //移除 需要做拼接
    if(action === 'remove' && type === 'distance') {
      _plan_arr.forEach(item => {
        const _del_one = item.splice(poi,1)[0];
        if ( poi === 0) {
          item[0].min_distance = 0;
        } else if ( poi !== dis_len - 1) {
          item[poi].min_distance = _del_one.min_distance;
        };
      });
    };
    if(action === 'remove' && type === 'time') {
      const _del_one = _plan_arr.splice(poi,1);
      const {time_span} = _del_one[0][0];
      if ( poi !== _plan_arr_len - 1) {
        //不是最后一个
        _plan_arr[poi].forEach(item => {
          item.time_span[0] = time_span[0];
        });
      } else {
        //最后一个
        _plan_arr[poi - 1].forEach(item => {
          item.time_span[1] = time_span[1];
        });
      };

    };
    let new_price_plan = [].concat(..._plan_arr);

    console.log('alter_plan');
    _that.setState({curr_price_plan: new_price_plan}, ()=>{
      _that.span_time = biz_time1;
      //重置标记
      _that.planHasalter = true;
    })

  }

  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    //初始化
    const { detail, form, dispatch } = this.props;
    const { curr_price_plan, price_mode, curr_stand_price_plan } = this.state;
    const { span_time } = this;

    //验证表单参数
    const values = form.getFieldsValue();
    let isStop = false;
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        isStop = true;
      }
    });

    //初始化时间参数
    const [biz_time0, biz_time1] = [values.biz_time0, values.biz_time1];

    if (price_mode === PriceMode.stand) {
      //一口价模式
      values.price_plan = [{ base_price: curr_stand_price_plan[0].base_price }];
    } else {
      //分段定价模式逻辑判断
      const last_price_plan = curr_price_plan[curr_price_plan.length - 1];

      //记得验证未保存的当前dis和time
      const justOneSpan = last_price_plan.time_span[0] === biz_time0 ? true : false;

      //分段定价的最后时间
      const endTime = last_price_plan.time_span[1].replace(':', '') * 1;

      //判断定价最后的时间是否大于营业时间
      if (endTime > biz_time1.replace(':', '') * 1) {
        message.info('定价时间分段不能大于营业时间，请重新选择');
        isStop = true;
        return;
      }

      if (biz_time0.replace(':', '') * 1 >= biz_time1.replace(':', '') * 1) {
        message.info('营业时间错误，请重新选择');
        isStop = true;
        return;
      }
      if (justOneSpan) {
        if (values.one_span_time !== biz_time1) {
          message.info('时间分段错误，请重新选择');
          isStop = true;
        }
      } else if (biz_time1 !== span_time) {
        message.info('时间分段错误，请重新选择');
        isStop = true;
      }
      if (last_price_plan.min_distance === last_price_plan.max_distance) {
        message.info('距离分段错误，请重新选择');
        isStop = true;
      }
      if (last_price_plan.max_distance > 10000) {
        message.info('距离分段错误，最大距离不能超过10km，请重新选择');
        isStop = true;
      }

      if (isStop) {
        return;
      }

      //添加price_plan
      values.price_plan = curr_price_plan;
    }

    //营业时间整理
    values.biz_time = [biz_time0, biz_time1];
    delete values.biz_time0;
    delete values.biz_time1;
    delete values.one_span_time;

    // 服务商 分成计算
    values.shipping_fee_vendor_rate = 100 - values.shipping_fee_courier_rate;
    values.tip_fee_vendor_rate = 100 - values.tip_fee_courier_rate;

    dispatch({ type: SIGN.updates, payload: { ...values, contract_id: this.id } });
  }
  // 二次弹框提示
  showConfirm = (e)  => {
    const {handleSubmit} = this;
    confirm({
      title: '小提示',
      content: '本次签约记录修改保存后立即生效，确认保存？',
      onOk() {
        handleSubmit(e)
      },
      onCancel() {},
    });
  }

  render() {
    const {list_details} = this.props.business_sign;
    this.id = list_details.id
    const {getFieldProps} = this.props.form;
    const {show_price_type,itemSetProps,show_price_mode,change_time,handleSubmit,reset_price_plan,showPricePlan,change_plan_val,showConfirm,radioChange} = this;
   // 抓取数据的配置
    const biz_timeProps = {
      common: {
        disabledMinutes,
        hideDisabledOptions: true,
        format:"HH:mm",
      },
      props: (num) => {
        return getFieldProps(`biz_time${num}`,
          {
            initialValue: list_details.biz_time[num],
            getValueFromEvent: (date, dateString) => dateString,

            onChange:(date, dateString) => {

              // 将选的时间分段值添加到相应的this属性里面以备下面比较
              change_time(`'biz_time${num}`,dateString);
              // 重新渲染定价方案
              setTimeout(() => {
                reset_price_plan();
              },100);
            }
          }
        );
      },
    };
   // helper函数 返回签约列表
    function toList() {
      window.location.href = '/#/business/sign/list';
      window.location.reload ();
    }

    let service_name = '默认产品名称';
    if(list_details.service){
      service_name = list_details.service.name
    }

    return (
      <div className="con-body">
      <div className="bd-header">
        <Form horizontal className="main-form" onSubmit={handleSubmit}>
          <h3 className="form-divider-header" style={{ margin: '0px' }}>产品基本信息</h3>
          <Row >
            <Col sm={12}>
              <FormItem label="产品名称" {...Lay_6_16}>
                {service_name}
              </FormItem>
              <FormItem label="营业时间" {...Lay_6_16}>
                <TimePicker {...biz_timeProps.common} { ...biz_timeProps.props(0)}/>
                <span>-</span>
                <TimePicker {...biz_timeProps.common} { ...biz_timeProps.props(1)}/>
              </FormItem>
            </Col>
            <Col sm={12}>
              <FormItem label="业务模式" {...Lay_6_16}>
                {stateNames.biz_mode[list_details.biz_mode]}
              </FormItem>
              <FormItem label="配送时间"  {...Lay_6_16} >
                <InputNumber min={1} max={500} {...itemSetProps('delivery_time')}/>
                <p className="ant-form-split" style={{'display': 'inline-block'}}> 分钟 </p>
                <Popover content='配送时间可自定义：商家订单发布起计算时间，超过配送时间将通知商家，请根据实际情况设置 ' title="配送时间提示">
                  <Icon type="question-circle-o" />
                </Popover>
              </FormItem>
            </Col>
          </Row>
          <h3 className="form-divider-header" style={{ margin: '0px' }}> 产品定价 </h3>
          <Row>
            <Col sm={12}>
              {/* <FormItem label="配送费分成方案" {...Lay_6_16}>
                <InputNumber min={0} max={100} step={0.1} {...itemSetProps('shipping_fee_courier_rate')}/>
                <p className="ant-form-split" style={{'display': 'inline-block'}}>%(骑士提成百分比)</p>
              </FormItem> */}
              <FormItem label="定价模式" {...Lay_6_16}>
                <RadioGroup {...itemSetProps('price_mode', {onChange:(e) => {radioChange('price_mode',e.target.value);} })}>
                  <Radio value={2}>阶梯计价</Radio>
                  <Radio value={1}>一口价</Radio>
                </RadioGroup>
              </FormItem>
              {show_price_type()}
            </Col>
            <Col sm={12}>
              {/* <FormItem label="小费分成方案" {...Lay_6_16}>
                <InputNumber min={0} max={100} step={0.1} {...itemSetProps('tip_fee_courier_rate')}/>
                <p className="ant-form-split" style={{'display': 'inline-block'}}>%(骑士提成百分比)</p>
              </FormItem> */}
            </Col>
          </Row>
          <Row  type="flex" justify="center">
            { showPricePlan() }
          </Row>
          <Row type="flex" justify="center">
            <FormItem key='btn1'> <Button onClick={(e) =>{toList()}}>返回</Button> </FormItem>
            <FormItem key='btn2'> <Button type="primary"  onClick={showConfirm}>保存</Button> </FormItem>
          </Row>
        </Form>
      </div>
      </div>
    );

  }
}

 View_edit = Form.create()(View_edit);

function mapStateToProps({business_sign,business_public}) {
  return {business_sign,business_public};
};
module.exports =  connect(mapStateToProps)(View_edit);
