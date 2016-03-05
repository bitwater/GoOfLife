define(['core/gogame'], function(Game) {
  var GameManager = function(app) {
    this.app = app;
    this.games = [];
  };

  GameManager.prototype.addGame = function(game) {
    if (!this.getGame(game.id)) {
      this.games.push(game);
      return game;
    } else {
      return false;
    }
  };

  GameManager.prototype.addGames = function(games) {
    for (var i = 0; i < games.length; i++) {
      this.addGame(games[i]);
    }
  };

  GameManager.prototype.createNewGame = function(id) {
    var newGame, gameAttr={};

    //if (id === undefined) {
    //  if (this.games.length > 0) {
    //    gameAttr.id = this.games[this.games.length - 1].id + 100000;
    //  } else {
    //    gameAttr.id = 100000;
    //  }
    //}

    //gameAttr.width = this.app.config.gridWidth;
    //gameAttr.height = this.app.config.gridHeight;

    gameAttr.id = id;
    gameAttr.title = "hello world";
    newGame = new Game(this.app, gameAttr);
    newGame.init(this.app.config.gridWidth, this.app.config.gridHeight);

    this.addGame(newGame);

    console.log("newGame:", newGame.transmission(), "  games:", this.games.length)
    return newGame;
  };

  GameManager.prototype.getMainGame = function() {
    return this.game;
  };

  GameManager.prototype.getOnlineIPs = function() {
    var games = this.getOnlineGames(),
      ip,
      ips = {};

    for (var i = 0; i < games.length; i++) {
      ip = games[i].getIP();

      if (ips[ip] === undefined) {
        ips[ip] = 1;
      } else {
        ips[ip] += 1;
      }
    }

    return ips;
  };

  GameManager.prototype.getOnlineGames = function() {
    var onlineGames = [];

    for (var i = 0; i < this.games.length; i++) {
      var player = this.games[i];

      if (player.online) {
        onlineGames.push(player);
      }
    }

    return onlineGames;
  };

  GameManager.prototype.getGame = function(id) {
    console.log("id: ", id, " games: ", this.games.length)

    if (typeof id !== 'number') {
      return false;
    }

    for (var i = 0; i < this.games.length; i++) {
      var game = this.games[i];
      console.log(game.transmission());
      if (game.id === id) {
        return game;
      }
    }

    return false;
  };

  GameManager.prototype.getGames = function() {
    return this.games;
  };

  GameManager.prototype.getGamesByHighScore = function() {
    return this.games.sort(function(a, b) {
      return b.highScore - a.highScore;
    });
  };

  GameManager.prototype.getGamesByForce = function() {
    return this.games.sort(function(a, b) {
      return b.force - a.force;
    });
  };

  GameManager.prototype.getGameByName = function(name) {
    for (var i = 0; i < this.games.length; i++) {
      if (this.games[i].name === name) {
        return this.games[i];
      }
    }

    return false;
  };

  GameManager.prototype.setMainGame = function(player) {
    this.game = this.getGame(player.id);
  };

  GameManager.prototype.updateOnlineGames = function() {
    var games = this.getOnlineGames();

    for (var i = 0; i < games.length; i++) {
      if (games[i].getLastSeen() < Date.now() - this.app.config.lastSeenTimeout
        && games[i].cellsOnGrid < 5) {
        games[i].setOnline(false);
        console.log(games[i].name + ' timed out. ' + this.getOnlineGames().length + ' player(s) online.');
      }
    }
  };

  GameManager.prototype.updateGame = function(player) {
    var ourGame = this.getGame(player.id);

    if (ourGame) {
      ourGame.setColor(player.color);
      ourGame.setCells(player.cells);
      ourGame.setDirty();
    } else {
      return false;
    }
  };

  GameManager.prototype.updateGames = function(games) {
    for (var i = 0; i < games.length; i++) {
      if (!(games[i] instanceof Game)) {
        // this lets the method handle an array of games
        // or an array of objects representing games
        games[i] = new Game(games[i].id, games[i].name, games[i].color, games[i].cells,
          games[i].online, games[i].highScore, games[i].lastSeen, games[i].force);
      }

      var player = this.getGame(games[i].id);

      if (player) {
        player.setColor(games[i].color);
        player.setCells(games[i].cells);
        player.setOnline(games[i].online);
        player.setHighScore(games[i].highScore);
        player.setLastSeen(games[i].lastSeen);
        player.setForce(games[i].force);

        if (games[i].token) {
          player.setToken(games[i].token);
        }
      } else {
        this.addGame(games[i]);
      }
    }
  };

  return GameManager;
});