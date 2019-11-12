'use strict';
var domain = require('domain');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var requirejs = require('requirejs');
var fs = require('fs');
var flash = require('connect-flash');
var router = require('./app/router');
//var errorhandler = require('errorhandler');

var app = express();

// configure database
//require('./config/database')(app, mongoose);

// 设置 view 引擎
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
router(app);

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
// 如果任何路由都没匹配到，则认为 404
// 生成一个异常让后面的 err handler 捕获
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});

// error handlers
//// 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) { // jshint ignore:line
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// 如果是非开发环境，则页面只输出简单的错误信息
//app.use(function(err, req, res, next) { // jshint ignore:line
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});


var http = require('http').Server(app);
var io = require('socket.io')(http);
var environment = process.env.NODE_ENV || 'development';
// General configuration
app.set('port', process.env.PORT || 3000);
http.listen(app.get('port'), function() {
  console.log('Conway started: ' + app.get('port') + ' (' + environment + ')', http.address());
});

requirejs.config({
  baseUrl: './app',
  name: 'main',
  //Pass the top-level main.js/index.js require
  //function to requirejs so that node modules
  //are loaded relative to the top-level JS file.
  nodeRequire: require
});

// requirejs加载主程序
requirejs(['app/main.js'], function(Conway) {
  // Development
  //if (environment === 'development') {
    //app.use(errorhandler());
    //app.use(express.static(path.join(__dirname, 'public')));
  //}

  var conway = new Conway(fs, io);
});

module.exports = app;
