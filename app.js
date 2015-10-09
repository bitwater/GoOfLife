'use strict';
var domain = require('domain');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var todos = require('./routes/todos');
var cloud = require('./cloud');
var AV = require('leanengine');
var app = express();

var requirejs = require('requirejs');
var http = require('http').Server(app);
//var app = require('express').createServer();
var io = require('socket.io')(http);
var fs = require('fs');
//var errorhandler = require('errorhandler');

// 设置 view 引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

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
// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();
// TODO 说明文档更新
AV.Promise._isPromisesAPlusCompliant = false

// 加载云代码方法
//app.use(AV.Cloud);
app.use(cloud);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 未处理异常捕获 middleware
app.use(function(req, res, next) {
  var d = domain.create();
  d.add(req);
  d.add(res);
  d.on('error', function(err) {
    console.error('uncaughtException url=%s, msg=%s', req.url, err.stack || err.message || err);
    if(!res.finished) {
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json; charset=UTF-8');
      res.end('uncaughtException');
    }
  });
  d.run(next);
});

//app.get('/', function(req, res) {
//  res.render('index', { currentTime: new Date() });
//});
// 可以将一类的路由单独保存在一个文件中
app.use('/todos', todos);

// 如果任何路由都没匹配到，则认为 404
// 生成一个异常让后面的 err handler 捕获
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) { // jshint ignore:line
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 如果是非开发环境，则页面只输出简单的错误信息
app.use(function(err, req, res, next) { // jshint ignore:line
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

requirejs.config({
  baseUrl: './app',
  name: 'main'
});

// requirejs加载主程序
requirejs(['app/main.js'], function(Conway) {
  var environment = process.env.NODE_ENV || 'development';

  // General configuration
  app.set('port', process.env.PORT || 3000);

  // Development
  if (environment === 'development') {
    //app.use(errorhandler());
    app.use(express.static(path.join(__dirname, 'public')));
  }

  http.listen(app.get('port'), function() {
    console.log('Conway started: ' + app.get('port') + ' (' + environment + ')');
  });

  //app.use(bodyParser());

  var conway = new Conway(fs, io);
});

module.exports = app;
