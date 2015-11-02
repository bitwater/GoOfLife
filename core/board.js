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

  Board.prototype.getDominantInMan = function(man) {

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