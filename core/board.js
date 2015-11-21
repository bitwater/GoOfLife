define(['core/man'], function(Man) {
  var Board = function(app) {
    this.app = app;
    this.mans = [];
    this.dirty = true;
    this.M = app.config.M;
  };

  Board.prototype.init = function(width, height) {
    this.width = width;
    this.height = height;

    this.mans = this._buildMans(width, height);
  };

  Board.prototype.getMan = function(x, y) {
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

  Board.prototype.getMansFromLivingCells = function(cells) {
    var i, j, mark = [],
      mans = [],
      l = cells.length;

    for (i=0; i<l; i++) {
      var cell = cells[i];
      var x = Math.floor(cell.x / this.M),
        y = Math.floor(cell.y / this.M);

      var man = this.getManFromCell(cell);
      if (man) {
        mans.push(man);
      }

      //var man = this.getMan(x, y);
      //if (man) {
      //  if (man.playerId) {
      //    man.alive = cell.alive;
      //    man.playerId = cell.playerId;
      //  } else {
      //    man.alive = cell.alive;
      //    man.playerId = cell.playerId;
      //    mans.push(man);
      //  }
      //}

    }

    // 粗粒化染色算法 - 多数原则
    //for (j=0; j<mans.length; j++) {
    //
    //}

    return mans;
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
      l = mans.length;

    for (i = 0; i < l; i++) {
      var livingCells = mans[i].getLivingCells();
      if (livingCells.length > 0) {
        mans[i].set('alive', true);
        mans[i].set('playerId', this.getDominantPlayerIdInMan(livingCells));
      } else {
        mans[i].set('alive', false);
        mans[i].set('playerId', undefined);
      }

    }
  };

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
        max == mark[cell.playerId];
        dominant = cell.playerId;
      }
    }

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

  return Board;
});