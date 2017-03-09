module.exports =  {
  // 登录模块
  'LOGIN': {
    vcode: 'login/getVcode', //获取验证码
    submit: 'login/submit', //登录提交
    'ssm': 'login/io/send_verify_code',
  },
// 注册模块
  'REGISTER': {
    vcode: 'register/getVcode',//获取验证码
    submit: 'register/submit',//注册提交
    'ssm': 'register/io/send_verify_code',
  }
}
