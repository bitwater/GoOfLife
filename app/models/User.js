/**
 * User
 * Authors: Michael Luo
 * Date: 16/12/23
 * Desc:
 * Copyright (c) 2016 caiyunapp.com. All rights reserved.
 */
var
  mongodb = require('../libs/mongoose.js'),
  Schema = mongodb.mongoose.Schema;

var schema = new Schema({
  name: String,
  avatar: String,
  score: {type: Number, default: 0},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: Date.now},
  isDeleted: {type: Boolean, default: false}
}, {
  collection: 'users'
});

var User = mongodb.mongoose.model('users', schema);

module.exports = User;