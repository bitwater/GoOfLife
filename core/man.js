define([], function() {
  var Man = function(x, y) {
    this.x = x;
    this.y = y;
    this.alive = false;
    this.dirty = true;
    this.livingCells = [];
  };

  Man.prototype.equals = function(m) {
    if (m !== undefined && this.x === m.x && this.y === m.y) {
      return true;
    }

    return false;
  };

  Man.prototype.isDirty = function() {
    return this.dirty;
  };

  Man.prototype.setDirty = function() {
    this.dirty = true;
  };

  Man.prototype.setClean = function() {
    this.dirty = false;
  };

  Man.prototype.set = function(k, v) {
    this[k] = v;
    this.setDirty();
  };

  Man.prototype.setAlive = function() {
    this.set('alive', true);
  };

  Man.prototype.tick = function() {
    this.set('alive', this.aliveNextGeneration);
    this.aliveNextGeneration = undefined;
  };

  Man.prototype.addLivingCell = function(c) {
    this.livingCells.push(c);
  };

  Man.prototype.getLivingCells = function() {
    return this.livingCells;
  };

  Man.prototype.clearLivingCells = function() {
    this.livingCells = [];
  };

  return Man;
});