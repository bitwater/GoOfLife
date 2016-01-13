define([], function() {
  var Leaderboard = function(app) {
    this.app = app;
    this.config = app.config;
    this.game = app.game;
    this.playerManager = app.playerManager;
    this.playerStats = app.game.playerStats;
  };

  Leaderboard.prototype.init = function() {
    this.el = document.getElementById('leaderboard');
  };

  Leaderboard.prototype.render = function() {
    var playerStats = this.playerManager.getPlayersByForce(),
      html = '';

    for (var i = 0; i < playerStats.length; i++) {
      var stat = playerStats[i];

      if (stat.force > 0) {
        html += '<div data-player-id="'+ stat.id +'"><div class="color" style="background: ' + stat.color + ';"></div>';
        html += '<span class="name">' + stat.name + '</span>';
        html += '<div class="cells">' + (stat.force/10000).toFixed(2) + '</div></div>';
      }
    }

    this.el.innerHTML = html;
  };

  return Leaderboard;
});