'use strict';
var AV = require('leanengine');

var APP_ID = process.env.LC_APP_ID;
var APP_KEY = process.env.LC_APP_KEY;
var MASTER_KEY = process.env.LC_APP_MASTER_KEY;

var debug = true
if (debug) {
  APP_ID = 'ogkH1VhFFHSwDpQE7o4lKhf3';
  APP_KEY = 'L2J9kLk6UMSRwrVe9B3umlL8';
  MASTER_KEY = 'hQBsa8y6E41k6wAzX7z7lSJJ';
}

AV.initialize(APP_ID, APP_KEY, MASTER_KEY);
console.log("AV init...")
// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();
// TODO 说明文档更新
AV.Promise._isPromisesAPlusCompliant = false

var app = require('./app');

// 端口一定要从环境变量 `LC_APP_PORT` 中获取。
// LeanEngine 运行时会分配端口并赋值到该变量。
//var PORT = parseInt(process.env.LC_APP_PORT || 3000);
//app.listen(PORT, function () {
//  console.log('Node app is running, port:', PORT);
//});
