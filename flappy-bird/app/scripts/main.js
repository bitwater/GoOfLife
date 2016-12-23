'use strict';

var Phaser = require('Phaser'),
    BootState = require('./states/boot'),
    MenuState = require('./states/menu'),
    PlayState = require('./states/play'),
    PreloadState = require('./states/preload');

var node = document.getElementById('flappy-bird-reborn'),
    game = new Phaser.Game(node.clientWidth, node.clientHeight,
                           Phaser.AUTO,
                           'flappy-bird-reborn');

// Game States
game.state.add('boot', BootState);
game.state.add('menu', MenuState);
game.state.add('play', PlayState);
game.state.add('preload', PreloadState);

game.state.start('boot');
