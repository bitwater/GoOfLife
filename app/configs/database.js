/**
 * database.js
 * Authors: Michael Luo
 * Date: 16/1/20
 * Copyright (c) 2015 Swarma Wiki. All rights reserved.
 * http://wiki.swarma.net/index.php/%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F%E5%9B%B4%E6%A3%8B
 */
var config = require('config');
var db = "gooflife.db";

module.exports = function (app, mongoose) {

  var connect = function () {
    var options = {
      server: {
        socketOptions: { keepAlive: 1 }
      },
      auto_reconnect:true
    };
    mongoose.connect(config.get(db), options);
  };
  connect();

  // Error handler
  mongoose.connection.on('error', function (err) {
    console.error('MongoDB Connection Error. Please make sure MongoDB is running. -> ' + err);
  });

  // Reconnect when closed
  mongoose.connection.on('disconnected', function () {
    connect();
  });

};