'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width / 2,
                                 this.height / 2,
                                 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('background', 'images/background.png');
    this.load.image('ground', 'images/ground.png');
    this.load.image('title', 'images/title.png');
    this.load.spritesheet('bird', 'images/bird.png', 34, 24, 3);
    this.load.spritesheet('pipe', 'images/pipes.png', 54, 320, 2);
    this.load.image('startButton', 'images/start-button.png');

    this.load.image('instructions', 'images/instructions.png');
    this.load.image('getReady', 'images/get-ready.png');

    this.load.image('gameover', 'images/gameover.png');
    this.load.image('particle', 'images/particle.png');

    this.load.audio('flap', 'sounds/flap.wav');
    this.load.audio('pipeHit', 'sounds/pipe-hit.wav');
    this.load.audio('groundHit', 'sounds/ground-hit.wav');
    this.load.audio('score', 'sounds/score.wav');
    this.load.audio('ouch', 'sounds/ouch.wav');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if (!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
