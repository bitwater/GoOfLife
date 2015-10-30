define(['core/man'], function(Cell) {
  var Board = function(app) {
    this.app = app;
    this.cells = [];
    this.dirty = true;
  };

  return Board;
});