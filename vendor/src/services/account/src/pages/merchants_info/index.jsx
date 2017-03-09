import React, {Component, PropTypes} from 'react';
import { Row, Col, message} from 'antd';
import {connect} from 'dva';
import {ACCOUNT} from '../../ActionsName.js';
import DetailView from './detail';
import EditView from './edit';

class View extends Component {
  constructor(props) {
    super();
    this.vendor_id = window.currentAppVendorInfo.id;
  }

  render() {
    const {account_merchant, dispatch} = this.props;
    const {details, page_status} = account_merchant;
    const {vendor_id} = this;
    const DetailsProps = {
      details,
      change_to_Edit() {
        dispatch({ type: ACCOUNT.toEdit, payload: '-100' });
      },
      apply_verify(values) {
        if(values.id_card_sn.length === 0) {
          message.info('请编辑提交相关资质信息!');
          return ;
        };
        dispatch({ type: ACCOUNT.toApplyVerify, payload: {...values, vendor_id} });
      }
     };

    const EditProps = {
      details,
      cancel_Edit() {
        dispatch({ type: ACCOUNT.toEdit, payload: {page_status:'100'} });
      },
      handleUpload(values) {
        dispatch({ type: ACCOUNT.upload, payload: {...values, vendor_id} });
      },
      didSubmit(values) {
        dispatch({ type: ACCOUNT.merchantUpdates, payload: {...values,vendor_id} });
      }
    };

    return (
      <div className="con-body">
        <div className="bd-content">
          {
            page_status === '100'
            ?
            <DetailView {...DetailsProps}/>
            :
            <EditView {...EditProps}/>
          }
        </div>
      </div>
    )
  }

}



function mapStateToProps({account_merchant}) {
  return {account_merchant};
};

module.exports =  connect(mapStateToProps)(View);
