'use strict';

var Phaser = require('Phaser'),
    Ground = require('../prefabs/ground'),
    Pipe = require('../prefabs/pipe');

// A silent translucent bird
var SilentBird = function(game, x, y, frame, name) {
  Phaser.Sprite.call(this, game, x, y, 'bird', frame);
  this.anchor.setTo(0.5, 0.5);
  this.animations.add('flap');
  this.animations.play('flap', 12, true);

  this.name = name;
  this.alive = false;
  this.onGround = false;
  this.alpha = 0.4;

  // enable physics on the bird
  // and disable gravity on the bird
  // until the game is started
  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  this.body.collideWorldBounds = false;

  this.events.onKilled.add(this.onKilled, this);
};

SilentBird.prototype = Object.create(Phaser.Sprite.prototype);
SilentBird.prototype.constructor = SilentBird;

SilentBird.prototype.update = function() {
  // check to see if our angle is less than 90
  // if it is rotate the bird towards the ground by 2.5 degrees
  if(this.angle < 90 && this.alive) {
    this.angle += 2.5;
  }
};

SilentBird.prototype.flap = function() {
  if(!!this.alive) {
    if (this.flapSound) {
      this.flapSound.play();
    }

    //cause our bird to "jump" upward
    this.body.velocity.y = -400;

    // rotate the bird to -40 degrees
    this.game.add.tween(this).to({angle: -40}, 100).start();
  }
};

SilentBird.prototype.onKilled = function() {
  this.exists = true;
  this.visible = true;
  this.animations.stop();
  var duration = 90 / this.y * 300;
  this.game.add.tween(this).to({angle: 90}, duration).start();
};

SilentBird.prototype.deathHandler = function(enemy) {
  if (enemy instanceof Ground && !this.onGround) {
    if (this.groundHitSound) {
      this.groundHitSound.play();
    }
    this.onGround = true;
  } else if (enemy instanceof Pipe) {
    if (this.pipeHitSound) {
      this.pipeHitSound.play();
    }
  }
  this.body.velocity.x = 0;
};

// Serialize ourself
SilentBird.prototype.serialize = function() {
  return {
    x: this.body.x,
    y: this.body.y,
    dx: this.body.velocity.x,
    dy: this.body.velocity.y,
    gravity: this.body.allowGravity,
    angle: this.angle,
    alive: this.alive,
    onGround: this.onGround
  };
};

// Unserialize ourself
SilentBird.prototype.unserialize = function(data) {
  this.body.allowGravity = data.gravity;
  this.angle = data.angle;
  this.alive = data.alive;
  this.onGround = data.onGround;
  this.reset(data.x, data.y);
  this.body.velocity.setTo(data.dx, data.dy);

  if (data.event === 'flap') {
    this.game.add.tween(this).to({angle: -40}, 100).start();
  } else if (data.event === 'killed') {
    this.kill();
  }
};

module.exports = SilentBird;
