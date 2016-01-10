define(['core/man'], function(Man) {
  var Board = function(app) {
    this.app = app;
    this.mans = [];
    this.dirty = true;
    this.M = app.config.M
  };

  Board.prototype.init = function(width, height, grid) {
    this.width = width;
    this.height = height;
    this.grid = grid;

    this.mans = this._buildMans(width, height);
  };

  Board.prototype.getMan = function(x, y) {
    if (x<0 || y<0)
      return false;

    x = Math.max(x, 0);
    y = Math.max(y, 0);

    if (this.mans[y] && this.mans[y][x]){
      return this.mans[y][x];
    } else {
      return false;
    }
  };

  Board.prototype.getMans = function() {
    return [].concat.apply([], this.mans);
  };

  Board.prototype.getManFromCell= function (cell) {
    var x = Math.floor(cell.x / this.M),
      y = Math.floor(cell.y / this.M);

    //console.log("cell: " + cell.x + cell.y + "  man: " + x + "  " + y +cell.alive)
    if (this.mans[y] && this.mans[y][x]){
      var man = this.mans[y][x];
      man.alive = cell.alive;
      man.playerId = cell.playerId;

      return man;
    } else {
      return false;
    }
  }

  Board.prototype.setMansLivingCells = function (livingCells) {
    var i, j, m, mark = [],
      mans = this.getMans(),
      l = livingCells.length;

    // clear all mans
    for (m=0; m<mans.length; m++) {
      mans[m].set('alive', false);
      mans[m].set('playerId', undefined);
      mans[m].clearLivingCells();
    }

    // group livingCells to Mans
    for (i=0; i<l; i++) {
      var cell = livingCells[i];
      var x = Math.floor(cell.x / this.M),
        y = Math.floor(cell.y / this.M);

      if (this.mans[y] && this.mans[y][x]) {
        this.mans[y][x].addLivingCell(cell);
      }
    }
  }

  Board.prototype.tick = function () {
    var mans = this.getMans(),
      i,
      l = mans.length, liberties, captured;

    // 先遍历计算出每个棋子是否存活和粗粒化颜色dominantPlayerId
    for (i = 0; i < l; i++) {
      var livingCells = mans[i].getLivingCells();
      if (livingCells.length > 0) {
        var dominantPlayerId = this.getDominantPlayerIdInMan(livingCells);
        mans[i].set('playerId', dominantPlayerId);
        mans[i].set('alive', true);

      } else {
        mans[i].set('alive', false);
        mans[i].set('playerId', undefined);
      }
    }

    // 再遍历实现围棋的提子规则
    for (i = 0; i < l; i++) {
      if (mans[i].alive == true) {
        var checkeds = this.createCheckedArray(this.width, this.height);
        liberties = this.checkLiberties(mans[i], mans[i].playerId, checkeds);
        //console.log("------------liberties:", liberties);

        if (!liberties) {
          this.doCapture(mans[i], mans[i].playerId);
        }
      }

    }

  };

  Board.prototype.checkCapturing = function (man) {
    var captured = [], checkeds = this.createCheckedArray(this.width, this.height);
    if (!this.checkLiberties(man, man.playerId, checkeds)) {
      this.doCapture(man);
    }

    return captured;
  }

  Board.prototype.doCapture = function (man, id) {
    if (man && man.playerId == id && man.alive) {
      //console.log("doCapture ", man)

      man.set('alive', false);
      var x = man.x, y = man.y, cells = man.getLivingCells(), l = cells.length;
      for (var i=0; i<l; i++){
        if (cells[i].playerId == id) {
          cells[i].set('alive', false);
          cells[i].set('playerId', undefined);
        }
      }

      this.doCapture(this.getMan(x+1, y), id);
      this.doCapture(this.getMan(x-1, y), id);
      this.doCapture(this.getMan(x, y+1), id);
      this.doCapture(this.getMan(x, y-1), id);
    }
  }

  // 0 liberties: false; above 0 liberties: true
  Board.prototype.checkLiberties = function (man, id, checkeds) {
    var x = man.x, y = man.y, length = 0;

    //console.log("0   x,y ", x + "," +y, "  id:" + id);
    // out of the board there aren't liberties
    if (x === undefined || y === undefined || x<0 || x>=this.width || y<0 || y>=this.height)
      return false;

    //console.log("1  alive:", man.alive);
    // empty fields means liberties
    if (man.alive == false)  return true;

    //console.log("2  checked: " +checkeds[x*this.width + y], "  id:" + id, " playerId:"+man.playerId);
    // already tested field or other playId isn't giving a liberity
    if (checkeds[x*this.width + y] || man.playerId != id)  return false;

    checkeds[x*this.width + y] = true;

    //console.log("3 if we get 4 false, it has no liberty ");
    // in this case we are checking our stone, if we get 4 false, it has no liberty
    return this.checkLiberties(this.getMan(x+1, y), id, checkeds) ||
      this.checkLiberties(this.getMan(x-1, y), id, checkeds) ||
      this.checkLiberties(this.getMan(x, y+1), id, checkeds) ||
      this.checkLiberties(this.getMan(x, y-1), id, checkeds);
  }

  Board.prototype.getDominantPlayerIdInMan = function(livingCells) {
    var l=livingCells.length, j, dominant, mark={}, max=0;

    for (j = 0; j < l; j++) {
      var cell = livingCells[j];
      if (mark[cell.playerId] === undefined) {
        mark[cell.playerId] = 1;
      } else {
        mark[cell.playerId]++;
      }

      if (mark[cell.playerId] > max) {
        max = mark[cell.playerId];
        dominant = cell.playerId;
      }
    }

    //console.log(livingCells, mark)
    return dominant;
  }

  Board.prototype._buildMans = function(width, height) {
    var i, j, mans = new Array(height);

    for (i = 0; i < height; i++) {
      mans[i] = new Array(width);
      for (j = 0; j < width; j++) {
        mans[i][j] = new Man(j, i);
      }
    }

    return mans;
  };

  Board.prototype.createCheckedArray = function(width, height) {
    var i, j, checkeds = new Array(width * height);

    for (i = 0; i < width * height ; i++) {
        checkeds[i] = false;
    }

    return checkeds;
  };

  return Board;
});