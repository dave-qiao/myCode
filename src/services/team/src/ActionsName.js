module.exports = {
  'EMPLOYEE': {
    find: 'employee/querys',
    getDetail: 'employee/getDetail',
    updateDetail: 'employee/queryItemSuccess',
    list: 'employee/querySuccess',
    creates: 'employee/creates',
    updates: 'employee/updates',
  },
  'COURIER': {
    find: 'business_courier/querys',
    getDetail: 'business_courier/getDetail',
    updateDetail: 'business_courier/queryItemSuccess',
    upload: 'business_courier/upload',
    uploadOK: 'business_courier/uploadSuccess',
    list: 'business_courier/querySuccess',
    creates: 'business_courier/creates',
    updates: 'business_courier/updates',
    approve_verify: 'business_courier/approve_verify',
  },
  'TEAM': {
    getTeamList: 'business_courier/getTeam',
  },
};
