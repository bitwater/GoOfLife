define(['core/grid', 'core/board'], function (Grid, Board) {
  var goGame = function (app, gameAttr) {
    this.app = app;
    this.config = app.config;
    this.playerManager = app.playerManager;

    if (gameAttr) {
      this.id = gameAttr.id || 0;
      this.title = gameAttr.title || '';
      this.width = gameAttr.width || 0;
      this.height = gameAttr.height || 0;
    }

    this.generation = 0;
    this.playerStats = [];

    this.nextTick = Date.now();
    this.gameStart = Date.now();
    this.updating = false;
    this.state = 0; //0-停止；1-开始；2-等待

    //this.grid = new Grid(this.app);
    //this.grid.init(width, height);
    //
    //this.board = new Board(this.app);
    //this.board.init(width / this.config.M, height / this.config.M);
  };

  goGame.prototype.init = function (width, height) {
    this.grid = new Grid(this.app);
    this.grid.init(width, height);
    this.livingCells = this.grid.getLivingCells();

    this.board = new Board(this.app);
    this.board.init(width / this.config.M, height / this.config.M);
  };

  goGame.prototype.canPlaceLiveCells = function (player, cells) {
    if (cells.length > player.cells) {
      return {msg: '自由活细胞数量不够...'};
    }

    for (var i = 0; i < cells.length; i++) {
      var cell = this.grid.getCell(cells[i].x, cells[i].y);
      var man = this.board.getManFromCell(cell);

      console.log(man)
      if (man.livingCells && man.livingCells.length > 0) {
        return {msg: '已有落子...'};
      }
      //if (cell.alive) {
      //  return {msg: '已经有自由活细胞放不下...'};
      //}

      if (!this.board.checkLiberties(man, cell.playerId, this.board.createCheckedArray(this.board.width, this.board.height))) {
        return {msg: '无气，无法落子...'};
      }

    }

    return true;
  };

  goGame.prototype.getCellCountByPlayer = function (playerId) {
    return this.grid.getCellCountByPlayer(playerId);
  };

  goGame.prototype.getPlayerStats = function () {
    return this.playerStats;
  };

  goGame.prototype.giveNewCells = function () {
    var players = this.playerManager.getPlayers();

    for (var i = 0; i < players.length; i++) {
      var player = players[i];

      // give each player another cell if they don't already have the max
      if (player.cells < this.config.cellsPerPlayer) {
        var newCells = 0;
        if (player.cellsOnGrid <= 0)  newCells = 500;
        else
          newCells = Math.round(400 * Math.pow(player.cellsOnGrid, -0.6));

        player.cells +=  newCells;
        if (this.app.renderer && player.id == this.playerManager.getLocalPlayer().id) {
          this.app.renderer.newCell = newCells;
        }
      }
    }
  };

  goGame.prototype.isTimeToGiveNewCells = function () {
    return this.generation % this.config.giveCellsEvery === 0;
  };

  goGame.prototype.isTimeToTick = function () {
    var now = Date.now();
    return (now >= this.nextTick);
  };

  goGame.prototype.isBehindOnTicks = function () {
    var now = Date.now();

    return ((now - this.nextTick) > this.config.generationDuration);
  };

  goGame.prototype.percentageOfTick = function () {
    return ((this.app.config.generationDuration - this.timeBeforeTick()) / this.app.config.generationDuration);
  };

  goGame.prototype.placeCells = function (player, cells) {
    var mans = [], map = {}, cl=cells.length;

    // 通过myTurn回合制对弈
    if (this.app.renderer) {
      if ( player.id == this.playerManager.getLocalPlayer().id) {
        this.app.renderer.myTurn = false;
      } else {
        this.app.renderer.myTurn = true;
      }
    }

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
  };

  goGame.prototype.tick = function () {
    this.generation += 1;

    this.grid.setNextGeneration();
    this.grid.tick();
    this.board.setMansLivingCells(this.grid.getLivingCells());
    this.board.tick();

    this.nextTick += this.app.config.generationDuration;
  };

  goGame.prototype.timeBeforeTick = function () {
    var now = Date.now();
    return (this.nextTick - now);
  };

  goGame.prototype.updatePlayerStats = function () {
    var cells = this.grid.getCells(),
      localPlayer = this.playerManager.getLocalPlayer(),
      playerIds,
      players = this.playerManager.getPlayers(),
      onlinePlayersNum = this.playerManager.getOnlinePlayers().length || 0,
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
      var player = players[i], cellCount = playerCells[player.id];
      if (cellCount) {
        player.cellsOnGrid = cellCount;

        //player.updatePlayerKPI(playerCells[player.id], onlinePlayersNum);
        //console.log("原力指数 +" + cellCount * onlinePlayersNum/2);
        this.playerStats.push({
          id: player.id,
          name: player.name,
          color: player.color,
          cellsOnGrid: player.cellsOnGrid,
          force: player.force
        });
      }
    }
  };

  goGame.prototype.transmission = function() {
    return {
      id: this.id,
      title: this.title,
      width: this.width,
      height: this.height,
      nextTick: this.nextTick,
      livingCells: this.grid.getLivingCells(),
      generation: this.generation,
      state: this.state
    };
  };

  return goGame;
});