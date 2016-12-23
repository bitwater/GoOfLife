/**
 * mongoose
 * Authors: Michael Luo
 * Date: 16/8/17
 */
var mongoose = require('mongoose');
//var dbUrl = "mongodb://root:Caiyun123@dds-m5e2645aabc897a42.mongodb.rds.aliyuncs.com:3717,dds-m5e2645aabc897a41.mongodb.rds.aliyuncs.com:3717/admin?replicaSet=mgset-1208669";
var dbUrl = "mongodb://localhost:27017";

mongoose.connect(dbUrl);
var connection = mongoose.connection;
//var connection = mongoose.createConnection(dbUrl, 'wp');

connection.on('error', function (err) {
  console.error('Connection to mongodb error: ' + err);
});

connection.once('open', function () {
  console.log('Connect to mongodb sucessfully');
});

mongoose.set('debug', false);

exports.mongoose = mongoose;

