'use strict';

var SilentBird = require('./silentbird');

// A regular bird
var Bird = function(game, x, y, frame) {
  SilentBird.call(this, game, x, y, frame, 'You');

  // New sounds
  this.flapSound = this.game.add.audio('flap');
  this.pipeHitSound = this.game.add.audio('pipeHit');
  this.groundHitSound = this.game.add.audio('groundHit');

  this.body.collideWorldBounds = true;

  this.alpha = 1;
};

Bird.prototype = Object.create(SilentBird.prototype);
Bird.prototype.constructor = Bird;

module.exports = Bird;
