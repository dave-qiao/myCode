const createData = require('./createDatas.js');
const data =  {
            "account_id": "110001",
            "seller_type": 2,
            "owner_name": "maxiaoying",
            "mobile": "18699883748",
            "code": "10123400",
            "name": "老王",
            "state": 100,
            "sex":'女',
            "verify_state": 1,
            "city_code": "110000",
            "created_at": "2016-06-28T11: 56: 42.493Z",
            "__type": "Seller",
            "id_card_sn":'41272839382',
            "state":'离职',
            "hired_date":'2014-02-09',
            "role":'管理员'
        };
module.exports = createData(data);
