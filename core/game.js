define(['core/grid', 'core/board'], function (Grid, Board) {
  var Game = function (app) {
    this.app = app;
    this.config = app.config;
    this.playerManager = app.playerManager;

    this.generation = 0;
    this.playerStats = [];

    this.nextTick = Date.now();
    this.gameStart = Date.now();
    this.updating = false;
  };

  Game.prototype.init = function (width, height) {
    this.grid = new Grid(this.app);
    this.grid.init(width, height);

    this.board = new Board(this.app);
    this.board.init(width / this.config.M, height / this.config.M)
  };

  Game.prototype.canPlaceLiveCells = function (player, cells) {
    if (cells.length > player.cells) {
      return {msg: '自由活细胞数量不够...'};
    }

    for (var i = 0; i < cells.length; i++) {
      var cell = this.grid.getCell(cells[i].x, cells[i].y);
      var man = this.board.getManFromCell(cell);

      //console.log(man)
      //if (man.livingCells && man.livingCells.length > 0) {
      //  return false;
      //}

      if (cell.alive) {
        return {msg: '自由活细胞放不下...'};
      }
    }

    return true;
  };

  Game.prototype.getCellCountByPlayer = function (playerId) {
    return this.grid.getCellCountByPlayer(playerId);
  };

  Game.prototype.getPlayerStats = function () {
    return this.playerStats;
  };

  Game.prototype.giveNewCells = function () {
    var players = this.playerManager.getPlayers();

    for (var i = 0; i < players.length; i++) {
      var player = players[i];

      // give each player another cell if they don't already have the max
      if (player.cells < this.config.cellsPerPlayer && player.cellsOnGrid < 1500) {
        var newCells = Math.round(200 * Math.pow(player.cellsOnGrid, -0.5));
        player.cells +=  newCells;
        if (this.app.renderer) {
          var msg = '自由活细胞 +' + newCells;
          this.app.renderer.flashMsg(msg);
        }
      }
    }
  };

  Game.prototype.isTimeToGiveNewCells = function () {
    return this.generation % this.config.giveCellsEvery === 0;
  };

  Game.prototype.isTimeToTick = function () {
    var now = Date.now();
    return (now >= this.nextTick);
  };

  Game.prototype.isBehindOnTicks = function () {
    var now = Date.now();

    return ((now - this.nextTick) > this.config.generationDuration);
  };

  Game.prototype.percentageOfTick = function () {
    return ((this.app.config.generationDuration - this.timeBeforeTick()) / this.app.config.generationDuration);
  };

  Game.prototype.placeCells = function (player, cells) {
    var mans = [], map = {}, cl=cells.length;

    for (var i = 0; i < cl; i++) {
      var cell = this.grid.getCell(cells[i].x, cells[i].y);
      var man = this.board.getManFromCell(cell), x = man.x, y = man.y,
        para = this.config.gridWidth;

      if (!cell) {
        return false;
      }

      cell.set('alive', true);
      cell.set('playerId', player.id);

      man.addLivingCell(cell);
      //console.log("getLivingCellsCount:" + man.getLivingCellsCount(), map);
      // 落子及其邻近需进行提子判断，push in mans[]
      if (! map[x*para+y]) {
        map[x * para + y] = true;
        man.latest = true;
        mans.push(man);

        if (x > 0) {
          map[(x - 1) * para + y] = true;
          mans.push(this.board.getMan(x - 1, y))
        }

        if (x < this.board.width-1) {
          map[(x + 1) * para + y] = true;
          mans.push(this.board.getMan(x + 1, y));
        }

        if (y > 0) {
          map[x * para + (y - 1)] = true;
          mans.push(this.board.getMan(x, y - 1));
        }

        if (y < this.board.height-1) {
          map[x * para + (y + 1)] = true;
          mans.push(this.board.getMan(x, y + 1));
        }
      }
    }

    var ml = mans.length;
    //console.log("click-----------", "map:", map, "mans.length:" + ml)
    // 落子执行提子规则
    this.board.checkCapturing(mans);

    player.setCells(player.cells - cells.length);
  };

  Game.prototype.tick = function () {
    this.generation += 1;

    this.grid.setNextGeneration();
    this.grid.tick();
    this.board.setMansLivingCells(this.grid.getLivingCells());
    this.board.tick();

    this.nextTick += this.app.config.generationDuration;
  };

  Game.prototype.timeBeforeTick = function () {
    var now = Date.now();
    return (this.nextTick - now);
  };

  Game.prototype.updatePlayerStats = function () {
    var cells = this.grid.getCells(),
      playerIds,
      players = this.playerManager.getPlayers(),
      playerCells = {};

    for (var i = 0; i < cells.length; i++) {
      if (cells[i].playerId) {
        if (playerCells[cells[i].playerId]) {
          playerCells[cells[i].playerId]++;
        } else {
          playerCells[cells[i].playerId] = 1;
        }
      }
    }

    this.playerStats = [];
    for (var i = 0; i < players.length; i++) {
      var player = players[i];
      if (playerCells[player.id]) {
        player.setCellsOnGrid(playerCells[player.id]);

        this.playerStats.push({
          id: player.id,
          name: player.name,
          color: player.color,
          cellsOnGrid: player.cellsOnGrid
        });
      } else {
        player.setCellsOnGrid(0);
      }
    }
  };

  return Game;
});