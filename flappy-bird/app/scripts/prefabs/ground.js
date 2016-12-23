'use strict';

var Phaser = require('Phaser');

var Ground = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');
  // start scrolling our ground
  this.autoScroll(-200,0);
  this.fixedToCamera = true;

  // enable physics on the ground sprite
  // this is needed for collision detection
  this.game.physics.arcade.enableBody(this);

  // we don't want the ground's body
  // to be affected by gravity or external forces
  this.body.allowGravity = false;
  this.body.immovable = true;

  // Workaround for bug in 2.3.0:
  // https://github.com/photonstorm/phaser/commit/5fb113017564fce04356e90d0fb3e9d605e5348c
  this.physicsType = Phaser.SPRITE;
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
};

module.exports = Ground;
