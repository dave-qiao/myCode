import React from 'react';
import { Form, Input, Table, Popover, Modal, Icon, InputNumber, Button, Row, Col, TimePicker, Radio, message } from 'antd';
const confirm = Modal.confirm;
import { SERVICE } from '../../ActionsName.js';

// 时间插件的时间范围限制只能选择整点和半点
function disabledMinutes() {
  return newArray(0, 60).filter(value => value % 30 !== 0);
}

// 数组的结构重新组织
function newArray(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

const [FormItem, RadioGroup, InputGroup] = [Form.Item, Radio.Group, Input.Group];
const Lay_6_16 = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

//定价模式
const PriceMode = {
  stand: 1, //一口价
  level: 2, //阶梯定价
};

class View_form extends React.Component {

  constructor(props) {
    super();
    // 从props里面获取信息
    const { plan_temp, visible } = props;
    const { price_mode, biz_time, plan_type, price_plan } = props.detail;
    const _price_plan = JSON.stringify(price_plan);

    const defaultPricePlan = plan_temp;
    defaultPricePlan.time_span = biz_time;
    // 初始化页面时将数据存放到内部变量state中以便于后面更新内部的state
    this.state = {
      price_mode,
      plan_type,
      // 阶梯定价
      curr_price_plan: (price_mode === PriceMode.level) ? JSON.parse(_price_plan) : [defaultPricePlan],
      //一口价模式
      curr_stand_price_plan: (price_mode === PriceMode.stand) ? JSON.parse(_price_plan) : [defaultPricePlan],
      visible,
    };


    Object.assign(this, {
      plan_temp,
      alter_count: 0,
      default_price_plan: JSON.parse(_price_plan),
      planHasalter: true, //flag
      price_plan_guide: (//导读
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
      biz_time0: biz_time[0], //营业的开始时间
      biz_time1: biz_time[1],//营业的结束时间
      span_time: biz_time[1],//时间断点 用来判断时间的合法性 是否判断的基础
    });
  }

  // 服务设置的提交函数
  handleSubmit = (e) => {
    e.preventDefault();
    //初始化
    const { detail, form, didSubmit } = this.props;
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
        message.info('距离分段错误，请重新选择');
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

    //判断 创建还是更新
    const actionType = typeof detail.id === 'undefined' ? 'creates' : 'updates';
    didSubmit({ actionType, values });
  }
  //展示定价类型
  show_price_type = () => {
    const { price_mode, curr_stand_price_plan } = this.state;
    const { radioChange, itemSetProps, pricePlanChange } = this;
    // 一口价模式
    if (price_mode === PriceMode.stand) {
      //一口价的价格
      const standPricePlan = curr_stand_price_plan[0].base_price / 100;
      return ([
        <FormItem label="定价方案" {...Lay_6_16} ><InputNumber min="0" step="0.01" onChange={pricePlanChange} defaultValue={standPricePlan} /> 元／单</FormItem>,
        <FormItem label="说明" {...Lay_6_16} > 一口价，一律按订单计价，所有订单配送费不分距离、时间如：设置费用5元/单，1单配送费为5元 </FormItem>,
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
// 增加或者删除行是相关数据的判断
  alter_plan = ({ type, poi, action, dis_len }) => {
 // 获取当前的的定价方案
    const { curr_price_plan } = this.state;
// 从this里面获取信息
    let { biz_time1, biz_time0, span_time } = this;

    const [biz_time1_num, biz_time0_num, span_time_num] = [biz_time1.replace(':', '') * 1, biz_time0.replace(':', '') * 1, span_time.replace(':', '') * 1];
    //验证  距离 | 时间
    if (type === 'time' && action === 'add') {
      if (biz_time0_num >= biz_time1_num) {
        message.info('营业时间错误，请重新选择');
        return;
      }
      // 验证时间分段
      if (biz_time0_num >= span_time_num || biz_time1_num <= span_time_num) {
        message.info('时间分段错误，请重新选择');
        return;
      }
    }
    // 取出当前定价方案的最后一条时间规则
    const last_price_plan = curr_price_plan.pop();
    let err_msg = '';
    // 判断距离分段
    if (type === 'distance' && action === 'add') {
      const { max_distance, min_distance } = last_price_plan;
      switch (true) {
        case max_distance === min_distance :
          err_msg = '该距离分段已存在';
          break;
        case max_distance === 10000:
          err_msg = '距离分段已达最大值,无法继续添加';
          break;
      }
    }
    // 添加行的时候验证时间分段时候在合适的范围内 是否有效
    if (type === 'time' && action === 'add') {
      // 获取最后一条方案的时间段
      const { time_span } = last_price_plan;
      switch (true) {
        case time_span[0].replace(':', '') * 1 >= span_time.replace(':', '') * 1 :
          err_msg = '该时间分段无效';
          break;
        case span_time === time_span[1]:
          err_msg = '该时间分段已达最大值,无法继续添加';
          break;
      }
    }
    // 将处理后的最后一条定价方案塞回到定价方案中
    curr_price_plan.push(last_price_plan);
    //验证未通过
    if (err_msg.length !== 0) {
      message.info(`${err_msg},请重新选择！`);
      return;
    }
    // 验证通过
    const _plan_arr = [];
    let n = curr_price_plan.length / dis_len;
    while (n > 0) {
      _plan_arr.push(curr_price_plan.splice(0, dis_len));
      n--;
    }
    const _plan_arr_len = _plan_arr.length;
    //添加 需要做更新
    if (action === 'add' && type === 'distance') {
      _plan_arr.forEach((item) => {
        const _temp = item.pop();
        const { max_distance } = _temp;
        const _new = JSON.parse(JSON.stringify(_temp));
        _new.min_distance = max_distance;
        item.push(_temp, _new);
      });
    }
    // 如果是添加操作
    if (action === 'add' && type === 'time') {
      const _temp = _plan_arr.pop();
      const _new = JSON.parse(JSON.stringify(_temp));
      _temp.forEach((item) => { item.time_span[1] = span_time; });
      _new.forEach((item) => { item.time_span = [span_time, biz_time1]; });
      _plan_arr.push(_temp, _new);
    }

    //移除 需要做拼接
    if (action === 'remove' && type === 'distance') {
      _plan_arr.forEach((item) => {
        const _del_one = item.splice(poi, 1)[0];
        if (poi === 0) {
          item[0].min_distance = 0;
        } else if (poi !== dis_len - 1) {
          item[poi].min_distance = _del_one.min_distance;
        }
      });
    }
    // 如果是移除操作
    if (action === 'remove' && type === 'time') {
      const _del_one = _plan_arr.splice(poi, 1);
      const { time_span } = _del_one[0][0];
      if (poi !== _plan_arr_len - 1) {
        //不是最后一个
        _plan_arr[poi].forEach((item) => {
          item.time_span[0] = time_span[0];
        });
      } else {
        //最后一个
        _plan_arr[poi - 1].forEach((item) => {
          item.time_span[1] = time_span[1];
        });
      }
    }
    // 重置数据
    const new_price_plan = [].concat(..._plan_arr);
    // 更新当前的定价方案的值
    this.setState({ curr_price_plan: new_price_plan });
    this.span_time = biz_time1;
    //重置标记
    this.planHasalter = true;
  }

  // 获取改变后的值
  change_time = (type, val) => {
    this[type] = val;
  }
 // 更新定价方案的值
  change_plan_val = (type, poi, val, dis_len) => {
    const { curr_price_plan } = this.state;
    const _plan_arr = [];
    let n = curr_price_plan.length / dis_len;
    while (n > 0) {
      _plan_arr.push(curr_price_plan.splice(0, dis_len));
      n--;
    }
    if (type === 'max_distance') {
      _plan_arr.forEach((item) => { item[poi[0]][type] = val * 1000 });
    } else {
      _plan_arr[poi[0]][poi[1]][type] = val * 100;
    }
    const new_price_plan = [].concat(..._plan_arr);
    // 更新定价方案的值
    this.setState({ curr_price_plan: new_price_plan });
    //重置标记
    this.planHasalter = true;
  }

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
                <span key="2">小于<InputNumber {...inputProps} min={0} max={10} value={max_distance / 1000} step={1} onChange={(val) => { change_plan_val('max_distance', [0], val, dis_len) }} />km</span>,
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
            <InputNumber key="1" {...inputProps} min={0} value={base_price / 100} step={0.01} onChange={(val) => { change_plan_val('base_price', [rowNum, 0], val, dis_len) }} />,
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
              <span key="3">小于<InputNumber {...inputProps} min={min_distance / 1000} max={10} step={1} value={max_distance / 1000} onChange={(val) => { change_plan_val('max_distance', [colNum], val, dis_len) }} />km</span>,
            ]);
          }
          //不是最后一个, 减号，不可编辑
          return ([
            <Icon key="1" {...clicks.cross} />,
            <span key="2">小于{max_distance / 1000}km</span>,
          ]);
        }
        return ([
          <InputNumber
            key="1" {...inputProps} min={0} step={0.01} value={base_price / 100}
            onChange={(val) => { change_plan_val('base_price', [rowNum, colNum], val, dis_len) }}
          />,
          <span key="2">元／{min_distance / 1000}km ＋ </span>,
          <InputNumber
            key="3" {...inputProps} min={0} step={0.01} value={ext_price / 100}
            onChange={(val) => { change_plan_val('ext_price', [rowNum, colNum], val, dis_len) }}
          />,
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

  reset_price_plan = () => {
    const { plan_temp } = this;
    const { form } = this.props;
    // 获取最新的时间值
    const [biz_time0, biz_time1] = [form.getFieldValue('biz_time0'), form.getFieldValue('biz_time1')];
    // 改变时间段的时候用，但是为什么打印不出来东西
    // if(!planHasalter) {
    //   return ;
    // };
    const curr_price_plan = [{ ...plan_temp, time_span: [biz_time0, biz_time1] }];
    this.setState({ curr_price_plan }, () => {
    });

    Object.assign(this, {
      biz_time0,
      biz_time1,
      span_time: biz_time1,
    });
    //重置标记
    this.planHasalter = false;
  };

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

  itemSetProps = (name, obj) => {
    const { detail } = this.props;
    const { getFieldProps } = this.props.form;
    return getFieldProps(name, { initialValue: detail[name], ...obj });
  };

  handleCancel = () => {
    const { changeVisible } = this.props;
    changeVisible();
  };

  bottmBtns = () => {
    const { showConfirm, showModal, handleCancel, handleSubmit } = this
    const { curr_status, changeCurrStatus, didEnabled, visible, laterhandle } = this.props;
    switch (curr_status) {
      case 'add':
        return (
          <FormItem>
            <Button type="primary" htmlType="submit">提交</Button>
          </FormItem>
        );
        break;
      case 'edit':
        return ([
          <FormItem key="btn1"> <Button onClick={(e) => { changeCurrStatus('detail') }}>返回</Button> </FormItem>,
          <FormItem key="btn2"> <Button type="primary" htmlType="submit" >保存</Button> </FormItem>,
          <Modal
            visible={visible}
            title="小提示"
            onOk={didEnabled}
            onCancel={handleCancel}
            footer={[
              <Button key="back" type="ghost" size="large" onClick={laterhandle}>稍后</Button>,
              <Button key="submit" type="primary" size="large" onClick={didEnabled}>
                启用
              </Button>,
            ]}
          >
            <p>当前服务产品保存成功，需要您启用产品，产品启用将立即生效，是否现在启用？</p>
          </Modal>,

        ]);
        break;
    }
  }

  render() {
    const { detail, curr_status, changeCurrStatus, didEnabled, visible } = this.props;
    const { getFieldProps } = this.props.form;
    const { reset_price_plan, change_time, itemSetProps, showConfirm, showPricePlan, handleSubmit, show_price_type, bottmBtns, price_plan_guide, radioChange } = this;

    const distribution_time = (
      <div>
        <p>1.即时单: 商家订单发布起计算时间，超过配送时间将通知商家，请根据实际情况设置，<br />2.预约单: 商家自定义期望送达时间，期望送达时间减去配送时间不在营业时间内不能发单</p>
      </div>
    );

    const biz_timeProps = {
      common: {
        disabledMinutes,
        hideDisabledOptions: true,
        format: 'HH:mm',
      },
      props: (num) => {
        return getFieldProps(`biz_time${num}`,
          {
            initialValue: detail.biz_time[num],
            getValueFromEvent: (date, dateString) => dateString,

            onChange: (date, dateString) => {
              // 将选的时间分段值添加到相应的this属性里面以备下面比较
              change_time(`'biz_time${num}`, dateString);
              // 重新渲染定价方案
              setTimeout(() => {
                reset_price_plan();
              }, 100);
            },
          },
        );
      },
    };

    return (
      <Form horizontal onSubmit={handleSubmit} className="main-form">
        <div className="bd-header">
          <Row><h3 className="form-divider-header" style={{ margin: '0px' }}>产品基本信息</h3></Row>
          <Row style={{ paddingTop: '20px' }}>
            <Col sm={12}>
              <FormItem label="产品名称" {...Lay_6_16}>
                <Input style={{ width: '80%' }} placeholder="请输入产品名称" {...itemSetProps('name', { validate: [{ rules: [{ required: true, max: 30, message: '请输入产品名称, 且长度不能超过30个字符' }, ], trigger: 'onBlur' }] })} />
              </FormItem>
              <FormItem label="营业时间" {...Lay_6_16} >
                <TimePicker {...biz_timeProps.common} {...biz_timeProps.props(0)} />
                <span>-</span>
                <TimePicker {...biz_timeProps.common} {...biz_timeProps.props(1)} />
                <Popover content="营业时间可自定义，系统不接收营业时间之外订单，请根据业务需求设置" title="营业时间说明：">
                  <Icon type="question-circle-o" />
                </Popover>
              </FormItem>
            </Col>

            <Col sm={12}>
              <FormItem label="业务模式" {...Lay_6_16}>
                <RadioGroup {...itemSetProps('biz_mode')} >
                  <Radio value={10}>本地生活圈</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="配送时间" {...Lay_6_16} >
                <InputNumber min={1} max={500} {...itemSetProps('delivery_time')} />
                <p className="ant-form-split" style={{ display: 'inline-block' }}> 分钟 </p>
                <Popover content={distribution_time} title="配送时间说明：">
                  <Icon type="question-circle-o" />
                </Popover>
              </FormItem>
            </Col>
          </Row>
        </div>
        <div className="bd-content">
          <Row>
            <h3 className="form-divider-header" style={{ margin: '0px' }}>产品定价&nbsp;
              <Popover content={price_plan_guide} placement="rightTop" title="产品定价说明：">
                <Icon type="question-circle-o" />
              </Popover>
            </h3>
          </Row>
          <Row style={{ paddingTop: '20px' }}>
            <Col sm={12}>
              {/* <FormItem label="配送费分成方案" {...Lay_6_16}>
                <InputNumber min={0} max={100} step={0.1} {...itemSetProps('shipping_fee_courier_rate')} />
                <p className="ant-form-split" style={{ display: 'inline-block' }}>%(骑士提成百分比)</p>
              </FormItem> */}
              <FormItem label="定价模式" {...Lay_6_16}>
                <RadioGroup {...itemSetProps('price_mode', { onChange: (e) => { radioChange('price_mode', e.target.value); } })}>
                  <Radio value={2}>阶梯计价</Radio>
                  <Radio value={1}>一口价</Radio>
                </RadioGroup>
              </FormItem>
              {show_price_type()}
            </Col>
            <Col sm={12}>
              {/* <FormItem label="小费分成方案" {...Lay_6_16}>
                <InputNumber min={0} max={100} step={0.1} {...itemSetProps('tip_fee_courier_rate')} />
                <p className="ant-form-split" style={{ display: 'inline-block' }}>%(骑士提成百分比)</p>
              </FormItem> */}
            </Col>
          </Row>
          <Row type="flex" justify="center">
            {showPricePlan()}
          </Row>

          <Row type="flex" justify="center" align="top">
            {bottmBtns()}
          </Row>
        </div>
      </Form>
    );
  }

}
View_form = Form.create()(View_form);
module.exports = View_form;
