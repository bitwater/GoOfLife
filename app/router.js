/**
 * database.js
 * Authors: Michael Luo
 * Date: 16/1/26
 * Copyright (c) 2015 Swarma Wiki. All rights reserved.
 * http://wiki.swarma.net/index.php/%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F%E5%9B%B4%E6%A3%8B
 */
var
  VERSION = "/v1",
  RoomController = require('./controllers/RoomController');
  UserController = require('./controllers/UserController');


module.exports = function (app) {
  app.get(VERSION + "/test", UserController.test);

  /******** API V1版 REST接口定义 *******/
  app.get(VERSION + "/room", RoomController.getRoom);
  app.post(VERSION + "/room", RoomController.postRoom);
  app.get(VERSION + "/room/:id", RoomController.getRoomById);
  app.get(VERSION + "/user/:id", RoomController.getRoomById);
};
