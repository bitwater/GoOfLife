# Flappy Bird Reborn Multiplayer

This is a fork of [Flappy Bird Reborn][] a flappy bird clone using
[Phaser][], a game engine.

[Flappy Bird Reborn]: https://github.com/codevinsky/flappy-bird-reborn
[Phaser]: http://phaser.io/

What has been modified:

 - compatibility with mobile phones.
 - build system (and not embedding a prebuilt version).
 - multiplayer through Socket.IO.
 - score board removed.

Idea has been stolen from @vladimirkosmala: [xdk-flappy-multi][].

[xdk-flappy-multi]: https://github.com/vladimirkosmala/xdk-flappy-multi

## Build

    npm install
    npm install -g grunt-cli
    grunt

Once built, you can create a Docker container:

    docker build -t vincentbernat/flappy-bird-reborn .

## Use

    node server.js

## Development

    grunt serve

