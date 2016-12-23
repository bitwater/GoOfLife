/**
 * All API errors.
 * Author: Evan Liu   Jacky.L
 */
var
  //ErrorHandler = require('../../lib/ErrorHandler'),
  commonUtil = require('./utils');


//Error categories indicated by HTTP status code 
//TODO should it be placed somewhere else?
var HTTP_OK = 200, //OK => OK
  HTTP_CREATED = 201, //Created => 创建成功
  HTTP_REQUEST_ERR = 400, //Request err => 请求参数问题
  HTTP_NOT_AUTHORIZED = 401, //Unauthorized
  HTTP_FORBIDDEN = 403, //Forbidden => 禁止访问
  HTTP_NOT_FOUND = 404, //Not Found => 找不到
  HTTP_NOT_ACCEPTABLE = 406, //Not Acceptable => 数据校验失败
  HTTP_INTERNAL_SERVER_ERROR = 500; //Internal Server Error => 系统底层组件报错

//API errors
var errorDef = {
  //for db system (or data model layer?) error
  SYS_DB_ERROR: [HTTP_INTERNAL_SERVER_ERROR, 9000, '数据库错误'],

  //for care apis
  //name: http status code, customized code, msg
  RESOURCE_INVALID: [HTTP_NOT_ACCEPTABLE, 1005, '资源操作无效'],
  RESOURCE_ILLEGAL_OP: [HTTP_FORBIDDEN, 1006, "对资源记录操作非法"],
  COMMENT_ILLEGAL: [HTTP_FORBIDDEN, 1008, "评价有误，请重试"],
  RESOURCE_ORDERED: [HTTP_FORBIDDEN, 1009, "资源已被订购"],
  RESOURCE_TIMEOUT: [HTTP_FORBIDDEN, 1010, "资源已过期"],
  RESOURCE_TIME_DUPLICATED: [HTTP_FORBIDDEN, 1011, "同一时段不能重复发布资源"],
  FV_DUPLICATED_ORDER: [HTTP_FORBIDDEN, 1012, "家庭医生重复订购"],
  BILL_ILLEGAL_OP: [HTTP_FORBIDDEN, 1013, "付款操作非法"],
  CHECK_ILLEGAL_OP: [HTTP_FORBIDDEN, 1014, "收款操作非法"],

  //for transaction apis
  TXN_WRONG_SECRET: [HTTP_FORBIDDEN, 3000, '禁止访问'],
  TXN_MISSING_FIELDS: [HTTP_NOT_ACCEPTABLE, 3001, '缺少字段'],
  TXN_WRONG_FIELD_TYPE: [HTTP_NOT_ACCEPTABLE, 3002, '字段类型错误，字段为'],
  TXN_INSUFFICIENT_CASH_C: [HTTP_NOT_ACCEPTABLE, 3003, '您的账户余额不足'],
  TXN_INSUFFICIENT_CASH_B: [HTTP_NOT_ACCEPTABLE, 3004, '医生账户余额不足'],

  //FOR user errors
  USER_NOT_FOUND: [HTTP_NOT_FOUND, 4000, '用户不存在'],
  USER_WRONG_PASSWORD: [HTTP_NOT_ACCEPTABLE, 4001, '密码错误'],
  USER_ILLEGAL_AUTHCODE: [HTTP_NOT_ACCEPTABLE, 4002, '非法验证码'],
  USER_EXPIRE_AUTHCODE: [HTTP_NOT_ACCEPTABLE, 4003, '验证码过期'],
  USER_ILLEGAL_INFO: [HTTP_NOT_ACCEPTABLE, 4004, '用户信息非法'],
  PHONENUM_EXISTED: [HTTP_NOT_ACCEPTABLE, 4009, '手机号已存在'],
  ERR_AUTHCODE: [HTTP_NOT_ACCEPTABLE, 4010, '验证码错误'],
  //USER_REFERRAL_DENIED: [HTTP_NOT_ACCEPTABLE, 4011, '您的医生身份还未验证，请联系400-618-2273'],


  COUPON_EXPIRED: [HTTP_FORBIDDEN, 5000, '优惠码无效'],
  ORDER_ILLEGAL: [HTTP_FORBIDDEN, 5001, '订单不存在'],
  TODO_ILLEGAL_STAGE: [HTTP_FORBIDDEN, 5002, '非法的待办事项状态'],


  RELATION_CHANNEL_EXISTS: [HTTP_FORBIDDEN, 6000, '转诊通道关系已存在'],
  RELATION_EXISTS: [HTTP_FORBIDDEN, 6001, '已存在的关系'],
  RELATION_FORBIDDEN_FOLLOW: [HTTP_FORBIDDEN, 6002, '非法关注操作'],
  RELATION_NOT_FOUND: [HTTP_FORBIDDEN, 6003, '关系不存在'],
  RELATION_FORBIDDEN_REQ: [HTTP_FORBIDDEN, 6004, '您不能添加自己'],

  REQUEST_NOT_FOUND: [HTTP_NOT_FOUND, 7000, '请求未找到'],

  //for common errors
  COMMON_MISSING_FIELDS: [HTTP_NOT_ACCEPTABLE, 8000, '字段缺失'],
  COMMON_WRONG_FIELDS: [HTTP_NOT_ACCEPTABLE, 8001, '字段错误'],
  COMMON_NOT_FOUND: [HTTP_NOT_FOUND, 8002, '资源不存在'],
  COMMON_FORBIDDEN: [HTTP_FORBIDDEN, 8003, '非法操作'],
  COMMON_ERROR: [HTTP_REQUEST_ERR, 8004, '请求参数有误'],
  COMMON_NOT_AUTHORIZED: [HTTP_NOT_AUTHORIZED, 8005, '请先登录']
};

//TODO re-thinking: do we need to distinguish different successes?
var successDef = {
  OK: HTTP_OK,
  CREATED: HTTP_CREATED
};

/**
 * e is errorDef
 */
function gen_error(e) {
  return function (res, type) {
    console.log("gen error...." + type);
    var http_status = e[0];
    var code = e[1];
    var msg = e[2];
    for (var i = 1; i < arguments.length; i++)
      msg += arguments[i];
    // res.send(http_status, JSON.stringify({code:code, msg:msg}));
    // console.error("err: " + http_status + "----"+code+"---"+msg);
    commonUtil.commonResponse(res, http_status, {code:code, msg:msg}, null);
  };
}

function gen_success(e) {
  //!!! The param data must be JSON object!!
  return function (res, data) {
    //var body = '';
    //for (var i = 1; i < arguments.length; i++)
    //  body += arguments[i];
    //res.send(e, JSON.stringify(body));
    //if (data) console.log(typeof(data)+"=====>"+data.length);
    commonUtil.commonResponse(res, e, data, null);
  };
}

var APIErrors = {};
for (var i in errorDef) {
  APIErrors[i] = gen_error(errorDef[i]);
}
for (var i in successDef ) {
  APIErrors[i] = gen_success(successDef[i]);
}
//service层报出的错误可以统一使用该方法处理; 需要配置information.json文件;
APIErrors["OUTER_DEF"] = function (res, err){
  console.log("outer gen error...code: " + err.code + "  message: " + err.message+" http code "+err.httpCode+" response "+res);

  if (!err.code || !err.message)
    err = {
      "code": "9000",
      "sysMessage": "服务器异常",
      "businessMessage": "服务器异常",
      "httpCode": "500"
    };

  var http_status = err.httpCode;
  var code = err.code;
  var msg = err.message;

  commonUtil.commonResponse(res, http_status, {code:code, msg:msg}, null);
};

module.exports = APIErrors;