define(['colorpicker', 'leaderboard', 'playersonline', 'chat', 'jquery'], function (Colorpicker, Leaderboard, PlayersOnline, Chat, $) {
  var Renderer = function (app) {
    this.app = app;
    this.game = app.game;
    this.gameClient = app.gameClient;
    this.playerManager = app.playerManager;
    this.chatManager = app.chatManager;
    this.config = app.config;
    this.grid = app.game.grid;
    this.board = app.game.board;
    this.M = this.config.M;
    this.width = app.config.gridWidth;
    this.height = app.config.gridHeight;
    this.boardWidth = this.width / this.M,
    this.boardHeight = this.height / this.M,
    this.cellSize = this.config.cellSize;
    this.spacing = this.config.cellSpacing;
    this.pickedColor = false;
    this.hoveredCell = undefined;
    this.hoveredPlayer = undefined;
    this.flaggedCells = [];
    this.onlinePlayerCount = this.playerManager.getOnlinePlayers().length;
    this.lastHighScore = false;
    this.lastCellsOnGrid = 0;
    this.lastCellCount = 0;
    this.lastChatMessage = 0;
    this.newCell = 0;
    this.newForce = 0;

    // view big-bigView small-smallView
    this.view = 'big';
    this.model = 'multi'

    // random state
    this.randomState = false;

    this.pixelWidth = this.width * (this.cellSize + this.spacing) + 1;
    this.pixelHeight = this.height * (this.cellSize + this.spacing) + 1;

    this.tickBarHeight = this.config.tickBarHeight;

    this.nextTickBarUpdate = Date.now() + 100;
  };

  Renderer.prototype.init = function () {
    var cellSize = this.cellSize,
      cells = this.grid.getCells(),
      _this = this;

    console.log("init room render...")
    this.canvas = document.getElementById('c');
    this.context = this.canvas.getContext('2d');

    this.gameEl = document.getElementById('game');
    this.connectingEl = document.getElementById('connecting');
    this.tickBar = document.getElementById('tickbar');
    this.tickBarContext = this.tickBar.getContext('2d');
    this.favicon = document.getElementById('favicon');
    this.nameInput = document.getElementById('new-player').querySelector('.player-name');
    this.newPlayerErrorEl = document.getElementById('new-player-error-message');
    this.newPlayerEl = document.getElementById('new-player');
    this.controlsEl = document.getElementById('controls');
    this.placeCellsEl = this.controlsEl.querySelector('.place-cells');
    this.statsEl = document.getElementById('stats');
    this.placeRandomCellsEl = document.getElementById('place-random-cells');
    this.highScoreEl = document.getElementById('high-score');
    this.cellCountEl = this.statsEl.querySelector('.cell-count');
    this.cellsOnGridEl = this.statsEl.querySelector('.cells-on-grid');
    this.rulesEl = document.getElementById('rules');
    this.leaveGameContainerEl = document.getElementById('leave-game-container');
    this.newCellMessageEl = document.getElementById('new-cell-message');
    this.newHighScoreMessageEl = document.getElementById('new-high-score-message');
    this.observeLinkEl = document.getElementById('observe');
    this.cellsOnGridStatEl = document.getElementById('cells-on-grid-stat');
    this.loginLinkContainerEl = document.getElementById('login-link-container');
    this.loginLinkEl = document.getElementById('login-link');
    this.selectModelEl = document.getElementById('select-model');
    this.doubleModel = document.getElementById('double-model');
    this.multiModel = document.getElementById('multi-model');

    this.flashNewsEl = document.getElementById('flash-news');
    //this.flashNewsEl.style.left=(document.body.clientWidth-this.flashNewsEl.clientWidth)/2;
    //this.flashNewsEl.style.top=(document.body.clientHeight-this.flashNewsEl.clientHeight)/2;

    this.doubleModel.addEventListener('click', this._handleClickDouble.bind(this), false);
    this.multiModel.addEventListener('click', this._handleClickMulti.bind(this), false);

    this.initUI();

    this.colorpicker = new Colorpicker(this.app);
    this.colorpicker.init();

    this.playersOnline = new PlayersOnline(this.app);
    this.playersOnline.init();
    //this.playersOnline.el.addEventListener('mouseover', this._handleMouseOverPlayers.bind(this), false);
    //this.playersOnline.el.addEventListener('mouseleave', this._handleMouseLeavePlayers.bind(this), false);


    this.chat = new Chat(this.app);
    this.chat.init();
    this.placeCellsEl.style.display = 'none'
    this.placeRandomCellsEl.style.display = 'none'

    this.playButton = document.getElementById('new-player').querySelector('.play');

    this.observeLinkEl.addEventListener('click', this._handleClickObserve.bind(this), false);

    // request a new player when the play button is clicked
    this.playButton.addEventListener('click', this._handlePlayButtonClick.bind(this), false);

    // remove the flagged cells when the escape key is pressed
    document.addEventListener('keydown', function (event) {
      var key = event.which || event.keyCode;

      if (key === 27) {
        // escape was pressed
        _this._handleEscapePress.bind(_this)(event);
      } else if (key === 13) {
        // enter was pressed
        _this._handleEnterPress.bind(_this)(event);
      } else if (event.shiftKey) {
        if (_this.view === 'small') {
          _this._handleClickBigView();
        } else if (_this.view === 'big') {
          _this._handleClickSmallView();
        }
      } else if (key === 32) {
        _this._handlePlaceCells.bind(_this)(event);
        //_this._handlePlaceCells(event);
      } else if (event.shiftKey && key === 82) {
        _this._handlePlaceRandomCells.bind(_this)(event);
        //_this._handlePlaceCells(event);
      }
    });

    // submit new player on enter when selecting the input box
    this.nameInput.addEventListener('keypress', function (event) {
      var key = event.which || event.keyCode;

      if (key === 13) {
        _this._handlePlayButtonClick.bind(_this)(event);
      }
    });

    // prevent text selection when interacting with the canvas
    this.canvas.addEventListener('selectstart', function (e) {
      event.preventDefault();
    });

    // show the rules
    document.getElementById('rules-link').addEventListener('click', this._handleClickRulesLink.bind(this), false);

    // hide the rules when clicking the overlay
    this.rulesEl.addEventListener('click', this._handleClickRulesOverlay.bind(this), false);

    // "log out" of the current user
    document.getElementById('leave-game').addEventListener('click', this._handleLeaveGame.bind(this), false);

    // keep track of the mouse position on the canvas
    this.canvas.addEventListener('mousemove', this._handleMouseMove.bind(this), false);

    // repaint the hovered cell when the mouse leaves the canvas
    this.canvas.addEventListener('mouseleave', this._handleMouseLeave.bind(this), false);

    // make the cell living when clicked
    this.canvas.addEventListener('click', this._handleClick.bind(this), false);

    // attempt to place flagged cells when the place cells button is pushed
    this.placeCellsEl.addEventListener('click', this._handlePlaceCells.bind(this));

    // place random cells
    this.placeRandomCellsEl.addEventListener('click', this._handlePlaceRandomCells.bind(this));


    this.canvas.width = this.pixelWidth;
    this.canvas.height = this.pixelHeight;
    this.canvas.parentElement.style.width = this.pixelWidth + 'px';
    this.canvas.parentElement.style.height = this.pixelHeight + 'px';

    this.tickBar.width = this.pixelWidth;
    this.tickBar.height = this.tickBarHeight;

    //console.log(this.canvas);
    this.gameEl.style.width = this.pixelWidth + 'px';

    this._drawGrid();
    this.view = 'big';
    //this._drawBoard();

    this.setAccentColor(this.config.defaultAccentColor);
    this.setFaviconColor(this.config.defaultAccentColor);
  };

  Renderer.prototype.initUI = function () {
    var _this = this;

    $(function(){
      console.log("initUI.");

      $('#small-view').on('click', function () {
        _this._handleClickSmallView();
      })
    });

    $(function () {
      $("#big-view").click(function(){
        _this._handleClickBigView();
      });
    });

  };

  Renderer.prototype.getCellFromPosition = function (x, y) {
    var cellSize = this.cellSize,
      spacing = this.spacing,
      cellX = Math.floor((x - 1) / (cellSize + spacing)),
      cellY = Math.floor((y - 1) / (cellSize + spacing));

    if (cellY === this.config.gridHeight) {
      cellY--;
    }

    return this.grid.getCell(cellX, cellY);
  };

  Renderer.prototype.clear = function () {
    this.context.clearRect(0, 0, this.pixelWidth, this.pixelHeight);
  };

  Renderer.prototype.flashNews = function () {
    var _this = this,
      news = false,
      localPlayer = this.playerManager.getLocalPlayer();

    this.flashNewsEl.style.color = this.color;
    //this.flashNewsEl.style.top=(document.body.clientHeight-this.flashNewsEl.clientHeight)/2+document.body.scrollTop;
    //this.flashNewsEl.style.left = (document.body.clientWidth-this.flashNewsEl.clientWidth)/2+document.body.scrollLeft;
    this.flashNewsEl.innerHTML = '';
    this.placeRandomCellsEl.style.borderColor = '#bbb';

    if (localPlayer) {
      if (this.lastHighScore === false) {
        this.lastHighScore = localPlayer.highScore;
      }

      //if (this.game.isTimeToGiveNewCells() && localPlayer.cells < this.config.cellsPerPlayer) {
      //  this.flashNewsEl.innerHTML += '自由活细胞 +1  ';
      //  news = true;
      //}

      if (this.newCell) {
        this.flashNewsEl.innerHTML += '自由活细胞 + ' + this.newCell + '   ';
        news = true;
        this.newCell = 0;
      }

      if (this.newForce) {
        this.flashNewsEl.innerHTML += '原力指数 + ' + this.newForce + ' ! ';
        news = true;
        this.newForce = 0;
      }

      //if (localPlayer.highScore > this.lastHighScore) {
      //  this.lastHighScore = localPlayer.highScore;
      //
      //  this.flashNewsEl.innerHTML += '历史最高！';
      //  news = true;
      //}

      if (news) {
        _this.flashNewsEl.className = 'active';

        setTimeout(function () {
          _this.flashNewsEl.className = '';
        }, 1000);
      }
    }
  };

  Renderer.prototype.flashMsg = function (message) {
    console.log("msg:" + message)
    var _this = this;
    this.flashNewsEl.innerHTML += message;
    this.flashNewsEl.className = 'active';
    //this.flashNewsEl.style.left = (document.body.clientWidth-this.flashNewsEl.clientWidth)/2 + document.body.scrollLeft + 'px';
    //this.flashNewsEl.style.top = (document.body.clientHeight)/2 + document.body.scrollTop + 'px';

    setTimeout(function () {
      _this.flashNewsEl.innerHTML = '';
      _this.flashNewsEl.className = '';
    }, 800);
  };

  Renderer.prototype.handleConnect = function () {
    var _this = this;

    this.connectingEl.style.opacity = 0;

    setTimeout(function () {
      _this.connectingEl.style.display = 'none';
      _this.gameEl.style.display = 'block';
      _this.gameEl.style.opacity = 1;
      _this.chat.scrollToBottom();
    }, 500);
  };

  Renderer.prototype.hideRules = function () {
    var _this = this;
    this.rulesEl.style.opacity = 0;

    setTimeout(function () {
      _this.rulesEl.style.display = 'none';
    }, 250);
  };

  Renderer.prototype.hideOverlay = function () {
    var _this = this;
    this.newPlayerEl.parentElement.style.opacity = 0;

    setTimeout(function () {
      _this.newPlayerEl.parentElement.style.display = 'none';
    }, 500);
  };

  Renderer.prototype.hideSelectModel = function () {
    var _this = this;
    this.selectModelEl.parentElement.style.opacity = 0;
    _this.selectModelEl.style.display = 'none';

    //setTimeout(function () {
    //  _this.selectModelEl.parentElement.style.display = 'none';
    //}, 500);
  };

  Renderer.prototype.showSelectModel = function () {
    var _this = this;
    //this.selectModelEl.parentElement.style.opacity = 0;
    _this.selectModelEl.style.display = 'inline-block';
  };

  Renderer.prototype.newPlayerError = function (message) {
    this.newPlayerErrorEl.innerHTML = message;
    this.newPlayerErrorEl.style.display = 'block';
  };

  Renderer.prototype.render = function () {
    var i,
      cells = this.grid.getCells(),
      l = cells.length,
      mans = this.board.getMans(),
      m = mans.length;

    //console.log(mans)
    this.clear();
    if (this.model == 'double') {
      this._drawBoard();
      return;
    }

    if (this.view === 'big') {
      this._drawBoard();

      for (i=0; i<m; i++) {
        this._drawMan(mans[i]);
        mans[i].setClean();
      }

    } else {
      this._drawGrid();

      // draw all cells, set clean
      for (i = 0; i < l; i++) {
        this._drawCell(cells[i]);
        cells[i].setClean();
      }
    }

  };

  Renderer.prototype.renderChanges = function () {
    var now = Date.now(),
      cells = this.grid.getCells(),
      localPlayer = this.playerManager.getLocalPlayer(),
      onlinePlayerCount = this.playerManager.getOnlinePlayers().length,
      cellCount,
      cellsOnGrid;

    //this._drawTickBar(this.game.percentageOfTick());

    if (this.model == 'double') {
      this.clear();
      this._drawBoard();
      return;
    }

    if (this.view == 'big') {
      this.clear();
      this._drawBoard();
      var mans = this.board.getMans();
      for (var i = 0; i < mans.length; i++) {
        this._drawMan(mans[i]);
        mans[i].setClean();
      }

    } else {
      for (var i = 0; i < cells.length; i++) {
        if (cells[i].isDirty()) {
          this._drawCell(cells[i]);
          cells[i].setClean();
        }
      }

      if (this.playerManager.localPlayer && localPlayer.isDirty()) {
        this.updateControls();
        localPlayer.setClean();
      }

    }

    if (this.lastChatMessage !== this.chatManager.lastChatMessage) {
      this.chat.render();
      this.lastChatMessage = this.chatManager.lastChatMessage;
    }

    if (this.onlinePlayerCount !== onlinePlayerCount) {
      // players joined/left since last render
      this.onlinePlayerCount = onlinePlayerCount;

      this.updatePlayersOnline();
    }

    if (localPlayer) {
      cellCount = localPlayer.cells;
      cellsOnGrid = localPlayer.cellsOnGrid;

      if (cellCount !== this.lastCellCount || cellsOnGrid !== this.cellsOnGrid) {
        this.lastCellCount = cellCount;
        this.cellsOnGrid = cellsOnGrid;

        this.updateStats();
      }
    }

  };

  Renderer.prototype.setAccentColor = function (color) {
    this.color = color;
  };

  Renderer.prototype.setFaviconColor = function (color) {
    var canvas = document.createElement('canvas'),
      link = this.favicon,
      context;

    canvas.width = 16,
      canvas.height = 16,
      context = canvas.getContext('2d'),

      context.fillStyle = color;
    context.fillRect(0, 0, 16, 16);
    context.fill();

    link.href = canvas.toDataURL();
  };

  Renderer.prototype.showLoginLinkWithToken = function () {
    var token = this.app.getToken();
    this.loginLinkEl.href = '?token=' + token;
    this.loginLinkContainerEl.style.display = 'inline-block';
  };

  Renderer.prototype.showControls = function () {
    this.controlsEl.style.display = 'block';
  };

  Renderer.prototype.showLeaveGameContainer = function () {
    this.leaveGameContainerEl.style.display = 'inline-block';
  };

  Renderer.prototype.showNewChatBox = function () {
    this.chat.showNewChatBox();
  };

  Renderer.prototype.showRules = function () {
    var _this = this;
    this.rulesEl.style.display = 'block';

    setTimeout(function () {
      _this.rulesEl.style.opacity = 1;
    }, 1);
  };

  Renderer.prototype.showStats = function () {
    this.statsEl.style.display = 'block';
  };

  Renderer.prototype.updateControls = function () {
    var localPlayer = this.playerManager.getLocalPlayer();

    if (localPlayer) {
      var cellCount = localPlayer.cells,
        cellsOnGrid = localPlayer.cellsOnGrid;

      if (this.flaggedCells.length > 0
        && localPlayer.cells >= this.flaggedCells.length
        && this.game.canPlaceLiveCells(localPlayer, this.flaggedCells)) {
        this.placeCellsEl.className = 'place-cells enabled';
        this.placeCellsEl.style.borderColor = this.color;
      } else {
        this.placeCellsEl.className = 'place-cells';
        this.placeCellsEl.style.borderColor = '';
      }
    }
  };

  Renderer.prototype.updateStats = function () {
    var localPlayer = this.playerManager.getLocalPlayer(),
      cellCount,
      cellsOnGrid;

    if (localPlayer) {
      cellCount = localPlayer.cells;
      cellsOnGrid = localPlayer.cellsOnGrid;

      //this.highScoreEl.innerHTML = localPlayer.highScore;
      this.statsEl.style.color = this.color;
      //this.highScoreEl.style.color = this.color;
      //this.cellCountEl.style.color = this.color;
      //this.cellsOnGridEl.style.color = this.color;
      this.highScoreEl.innerHTML = (localPlayer.force/10000).toFixed(2);
      this.cellCountEl.innerHTML = cellCount;
      this.cellsOnGridEl.innerHTML = cellsOnGrid;
    }
  };

  Renderer.prototype.updatePlayersOnline = function () {
    this.playersOnline.render();
  };

  Renderer.prototype._drawTickBar = function (percent) {
    var nextWidth = this.pixelWidth * percent,
      context = this.tickBarContext,
      x = (this.pixelWidth - nextWidth) / 2;

    context.clearRect(0, 0, this.pixelWidth, this.tickBarHeight);
    context.fillStyle = this.color;
    context.fillRect(x, 0, nextWidth, this.tickBarHeight);
  };

  Renderer.prototype._drawBoard = function () {
    var i,
      config = this.config,
      context = this.context,
      cellSize = this.cellSize,
      spacing = this.spacing,
      M = config.M,
      boardHeight = this.boardHeight,
      boardWidth = this.boardWidth;

    for (i = 0; i < boardHeight; i++) {
      context.lineWidth = spacing;
      context.beginPath();
      context.moveTo(0, i * M * (cellSize + spacing) + 0.5 + cellSize * M / 2);
      context.lineTo(this.pixelWidth * M, i * M * (cellSize + spacing) + 0.5 + cellSize * M / 2);
      context.strokeStyle = 'rgba(0, 0, 0, 1)';
      context.stroke();
    }

    for (i = 0; i < boardWidth; i++) {
      context.beginPath();
      context.moveTo(i * M * (cellSize + spacing) + 0.5 + cellSize * M / 2, 0);
      context.lineTo(i * M * (cellSize + spacing) + 0.5 + cellSize * M / 2, this.pixelHeight);
      context.stroke();
    }

    // finish the border
    //context.beginPath();
    //context.moveTo(0, 0);
    //context.lineTo(0, this.pixelHeight - 0.5);
    //context.stroke();
    //
    //context.beginPath();
    //context.moveTo(0, 0);
    //context.lineTo(this.pixelWidth - 0.5, 0);
    //context.stroke();
    //
    //context.beginPath();
    //context.moveTo(this.pixelWidth - 0.5, 0);
    //context.lineTo(this.pixelWidth - 0.5, this.pixelHeight);
    //context.stroke();
    //
    //context.beginPath();
    //context.moveTo(0, this.pixelHeight - 0.5);
    //context.lineTo(this.pixelWidth - 0.5, this.pixelHeight - 0.5);
    //context.stroke();

  }

  Renderer.prototype._drawMan = function (man) {
    // return if the cell was made undefined by _handleMouseLeave
    if (man === undefined) {
      return;
    }

    var config = this.config,
      context = this.context,
      cellSize = this.cellSize,
      spacing = this.spacing,
      M = this.M,
      x1 = man.x * M * (cellSize + spacing),
      y1 = man.y * M * (cellSize + spacing),
      color;

    if (!man.alive) {
      context.fillStyle = config.deadCellColor;
    } else {
      //console.log(x1, y1);

      context.fillStyle = this.playerManager.getPlayer(man.playerId).color;
      context.beginPath();
      //context.fillStyle = this.playerManager.getLocalPlayer().color;
      //context.strokeStyle = this.color;
      context.arc(x1 + (cellSize) * M/2, y1 + (cellSize) * M/2, cellSize * M /2, 0, 2 * Math.PI);
      context.fill();
      //context.fillRect(x1, y1, cellSize * M, cellSize * M);
    }
  }

  Renderer.prototype._drawHoveredMan = function (man) {
    if (man === undefined) {
      return;
    }

    var context = this.context,
      cellSize = this.cellSize,
      spacing = this.spacing,
      M = this.M,
      x1 = man.x * (cellSize + spacing) + 1.5,
      y1 = man.y * (cellSize + spacing) + 1.5;

    context.fillStyle = this.playerManager.getPlayer(man.playerId).color;
    context.beginPath();
    //context.fillStyle = this.playerManager.getLocalPlayer().color;
    //context.strokeStyle = this.color;
    context.arc(x1 + (cellSize) * M/2, y1 + (cellSize) * M/2, cellSize * M /2, 0, 2 * Math.PI);
    context.fill();
  };

  Renderer.prototype._drawGrid = function () {
    var i,
      config = this.config,
      context = this.context,
      cellSize = this.cellSize,
      spacing = this.spacing;

    //for (i = 0; i < this.height; i++) {
    //  context.lineWidth = spacing;
    //  context.beginPath();
    //  context.moveTo(0, i * (cellSize + spacing) + 0.5);
    //  context.lineTo(this.pixelWidth, i * (cellSize + spacing) + 0.5);
    //  context.strokeStyle = 'rgba(0,0,0,1)';
    //  context.stroke();
    //}
    //
    //for (i = 0; i < this.width; i++) {
    //  context.beginPath();
    //  context.moveTo(i * (cellSize + spacing) + 0.5, 0);
    //  context.lineTo(i * (cellSize + spacing) + 0.5, this.pixelHeight);
    //  context.stroke();
    //}

    // finish the border
    //context.beginPath();
    //context.moveTo(this.pixelWidth - 0.5, 0);
    //context.lineTo(this.pixelWidth - 0.5, this.pixelHeight);
    //context.stroke();
    //
    //context.beginPath();
    //context.moveTo(0, this.pixelHeight - 0.5);
    //context.lineTo(this.pixelWidth - 0.5, this.pixelHeight - 0.5);
    //context.stroke();

    //context.strokeStyle = 'rgba(0,0,0,1)';

  };

  Renderer.prototype._drawCell = function (cell) {
    // return if the cell was made undefined by _handleMouseLeave
    if (cell === undefined) {
      return;
    }

    var config = this.config,
      context = this.context,
      cellSize = this.cellSize,
      spacing = this.spacing,
      x1 = cell.x * (cellSize + spacing) + 1,
      y1 = cell.y * (cellSize + spacing) + 1,
      color;

    if (!cell.alive) {
      context.fillStyle = config.deadCellColor;
    } else {
      context.fillStyle = this.playerManager.getPlayer(cell.playerId).color;
    }

    if (this.hoveredPlayer) {
      if (cell.alive && cell.playerId !== this.hoveredPlayer && this.playerManager.getPlayer(cell.playerId)) {
        color = this._hexToRGB(this.playerManager.getPlayer(cell.playerId).color);
        color.r = Math.floor(((255 - color.r) / 1.4) + color.r);
        color.g = Math.floor(((255 - color.g) / 1.4) + color.g);
        color.b = Math.floor(((255 - color.b) / 1.4) + color.b);

        context.fillStyle = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 1)';
      }
    }

    context.fillRect(x1, y1, cellSize, cellSize);

    if (this.app.isPlaying() && this.hoveredCell !== undefined && this.hoveredCell.equals(cell)) {
      var player = this.playerManager.getLocalPlayer();
      if (player.cells - this.flaggedCells.length > 0) {
        this._drawFramedCell(cell);
      }
    }

    if (this._isFlaggedCell(cell)) {
      this._drawFramedCell(cell);
    }
  };

  Renderer.prototype._drawRandomCells = function (cell) {
    if (cell === undefined)
      return;

    //console.log(cell);
    var size = 4;
    var x = cell.x, y = cell.y;

    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        this._drawCell(this.grid.getCell(x + i, y + j));
      }
    }
  }

  Renderer.prototype._drawFramedCell = function (cell) {
    if (cell === undefined) {
      return;
    }

    var context = this.context,
      cellSize = this.cellSize,
      spacing = this.spacing,
      x1 = cell.x * (cellSize + spacing) + 1.5,
      y1 = cell.y * (cellSize + spacing) + 1.5;

    context.lineWidth = 1.5;
    context.strokeStyle = this.color;
    context.strokeRect(x1 + .5, y1 + .5, cellSize - 2, cellSize - 2);
  };

  Renderer.prototype._isFlaggedCell = function (cell) {
    for (var i = 0; i < this.flaggedCells.length; i++) {
      if (cell.equals(this.flaggedCells[i])) {
        return true;
      }
    }

    return false;
  };

  Renderer.prototype._handleClick = function (event) {
    var clickedCell = this.getCellFromPosition(this.lastX, this.lastY),
      clickedMan = this.board.getManFromCell(clickedCell),
      player = this.playerManager.getLocalPlayer();

    // clear hovererPlayer
    this.hoveredPlayer = false;

    if (!app.isPlaying()) {
      return false;
    }

    //_vds.push(['setCS1','user_id', player.id]);
    //_vds.push(['setCS2','user_name', player.name]);

    zhuge.track('ClickCanvas', {
        id: player.id,
        name: player.name,
        color: player.color,
        cellsOnGrid: player.cellsOnGrid,
        ip: player.ip,
        force: player.force
    });

    // 宏观视角
    if (this.view == 'big') {
      var cells = this.grid.getRandomCells(clickedCell);
      this.gameClient.placeLiveCells(cells);
    } else {

      // 随机放下
      if (this.randomState) {
        this.placeRandomCellsEl.style.borderColor = '#bbb';
        var cells = this.grid.getRandomCells(clickedCell);
        this.gameClient.placeLiveCells(cells);
        this.randomState = false;
      } else {

        // 自主放置
        // if it isn't a flagged cell, and you have cells left to place
        if (!this._isFlaggedCell(clickedCell) && (player.cells - this.flaggedCells.length > 0)) {
          // flag it
          this.flaggedCells.push(clickedCell);
          clickedCell.setDirty();
        } else {
          // remove the cell
          for (var i = 0; i < this.flaggedCells.length; i++) {
            if (clickedCell.equals(this.flaggedCells[i])) {
              this.flaggedCells.splice(i, 1);
              clickedCell.setDirty();
              break;
            }
          }
        }
      }
    }

    this.updateControls();
  };


  Renderer.prototype.getPlacementCell = function (cell) {
    var x = cell.x;
    var y = cell.y;

    var x1 = Math.floor(x/this.M) * this.M;

    return this.grid.getCellFromPosition();
  };

  Renderer.prototype._handleClickDouble = function (event) {
    console.log("double");

    this.view = 'big';
    this.model = 'double';
    //this.selectModelEl.style.display = 'none';
    //this.canvas.style.display = 'none'
    this.statsEl.style.display = 'none'
    //this.tickBar.style.display = 'none'
    //this.controlsEl.style.display = 'none'
  };

  Renderer.prototype._handleClickMulti = function (event) {
    console.log("multi");
    this.model = 'multi';
    //this.selectModelEl.style.display = 'none';
    //this.canvas.style.display = 'inline-block'
    this.statsEl.style.display = 'inline-block'
    //this.tickBar.style.display = 'inline-block'
    //this.controlsEl.style.display = 'inline-block'
  };

  Renderer.prototype._handleClickBigView = function (event) {
    this.view = 'big';
    this.placeCellsEl.style.display = 'none'
    this.placeRandomCellsEl.style.display = 'none'
    this.render();
  };

  Renderer.prototype._handleClickSmallView = function (event) {
    this.view = 'small';
    this.placeCellsEl.style.display = 'inline-block'
    this.placeRandomCellsEl.style.display = 'inline-block'
    this.render();
  };

  Renderer.prototype._handleClickObserve = function (event) {
    this.hideOverlay();

    event.preventDefault();
  };

  Renderer.prototype._handleClickRulesLink = function (event) {
    this.showRules();

    event.preventDefault();
  };

  Renderer.prototype._handleClickRulesOverlay = function (event) {
    // make sure we're clicking the overlay and not the rules box content
    //if (event.target !== this.rulesEl) {
    //  return false;
    //}

    this.hideRules();
  };

  Renderer.prototype._handleEnterPress = function (event) {
    if (event.target === document.body) {
      // the key wasn't pressed in the chat input
      if (this.flaggedCells.length > 0) {
        this._handlePlaceCells.bind(this)(event);
      }
    }
  };

  Renderer.prototype._handleEscapePress = function (event) {
    this.flaggedCells = [];
    this.render();
  };

  Renderer.prototype._handleLeaveGame = function (event) {
    if (confirm("离开游戏吗？")) {
      this.app.deleteToken();
      location.reload();
    }

    event.preventDefault();
  };

  Renderer.prototype._handleMouseLeave = function (event) {
    var oldCell = this.hoveredCell;
    this.hoveredCell = undefined;
    this._drawCell(oldCell);
  };

  Renderer.prototype._handleMouseLeavePlayers = function (event) {
    this.hoveredPlayer = false;
    this.render();
  };

  Renderer.prototype._handleMouseLeaveCellsOnGridStat = function (event) {
    this.hoveredPlayer = false;
    this.render();
  };

  Renderer.prototype._handleMouseMove = function (event) {
    if (event.offsetX && event.offsetY) {
      this.lastX = event.offsetX;
      this.lastY = event.offsetY;
    } else {
      var rect = this.canvas.getBoundingClientRect();

      this.lastX = event.pageX - rect.left - window.scrollX;
      this.lastY = event.pageY - rect.top - window.scrollY;
    }

    var player = this.playerManager.getLocalPlayer(),
      oldCell = this.hoveredCell;
    this.hoveredCell = this.getCellFromPosition(this.lastX, this.lastY);

    if (this.view == 'big') {
      //this._drawMan(oldCell);

    } else {
      this._drawCell(oldCell);

      if (this.app.isPlaying() && (player.cells - this.flaggedCells.length) > 0) {
        this._drawFramedCell(this.hoveredCell);
      }
    }
  };

  Renderer.prototype._handleMouseOverPlayers = function (event) {
    var playerId = event.target.dataset.playerId || event.target.parentElement.dataset.playerId;

    if (playerId) {
      this.hoveredPlayer = parseInt(playerId);
      this.render();
    }
  };

  Renderer.prototype._handleMouseOverCellsOnGridStat = function (event) {
    this.hoveredPlayer = this.playerManager.getLocalPlayer().id;
    this.render();
  };

  Renderer.prototype._handlePlaceCells = function (event) {
    var player = this.playerManager.getLocalPlayer();

    event.preventDefault();

    if (this.game.canPlaceLiveCells(player, this.flaggedCells)) {
      this.gameClient.placeLiveCells(this.flaggedCells);
      this.flaggedCells = [];
    } else {
      return false;
    }

    zhuge.track('自主放下点击', {
      id: player.id,
      name: player.name,
      color: player.color
    });
  };

  Renderer.prototype._handlePlaceRandomCells = function (event) {
    var player = this.playerManager.getLocalPlayer();
    event.preventDefault();

    //if (this.randomState) {
    //  this.placeRandomCellsEl.style.borderColor = '#bbb';
    //  this.randomState = false;
    //} else {
    //  this.randomState = true;
    //  this.placeRandomCellsEl.style.borderColor = this.color;
    //}

    this.placeRandomCellsEl.style.borderColor = this.color;
    var cells = this.grid.getRandomCellsInGrid();
    this.gameClient.placeLiveCells(cells);

    zhuge.track('随机生成点击', {
      id: player.id,
      name: player.name,
      color: player.color
    });
  };

  Renderer.prototype._handlePlayButtonClick = function (event) {
    event.preventDefault();

    var color = this.color,
      name = this.nameInput.value.trim();

    if (name.length === 0 || !this.colorpicker.colorWasPicked()) {
      return false;
    }

    name = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    this.gameClient.requestNewPlayer(name, color);
  };

  Renderer.prototype._hexToRGB = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return Renderer;
});