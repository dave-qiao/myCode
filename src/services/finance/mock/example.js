'use strict';
const qs = require('qs');

const [ courier_bills,parnter_bills,parnter_wallet] = [
  require('./mockDatas/courier_bills.js'),
  require('./mockDatas/parnter_bills.js'),
  require('./mockDatas/parnter_wallet.js')
];
function query(field,id,datas){
  let _result = null;
  if (id) {
    for (let data of datas) {
      if(data[field] === id) {
        _result = data;
        break;
      };
    };
  } else {
    _result = datas;
  };
  return {
    success: true,
    data: _result,
    page: {
      total: 3,
      current:1,
    }
  };

};


module.exports = {
  'GET /areas/': function (req, res) {
    let _result = query('id', qs.parse(req.query).id, courier_bills);
    setTimeout(function () { res.json(_result); }, 500);
  },
  'GET /parnter/': function (req, res) {
    let _result = query('id', qs.parse(req.query).id, parnter_wallet);
    setTimeout(function () { res.json(_result); }, 500);
  },
  'GET /parnter/': function (req, res) {
    let _result = query('id', qs.parse(req.query).id, parnter_bills);
    setTimeout(function () { res.json(_result); }, 500);
  }
};
