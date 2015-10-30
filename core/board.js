define(['core/man'], function(Man) {
  var Board = function(app) {
    this.app = app;
    this.mans = [];
    this.dirty = true;
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