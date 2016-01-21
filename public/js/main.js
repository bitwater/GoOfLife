requirejs.config({
  baseUrl: '/js',
  paths: {
    "jquery": "//cdn.bootcss.com/jquery/1.11.3/jquery.min",
    "bootstrap": "//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min"
    //"jquery": "lib/jquery.min",
    //"bootstrap": "lib/bootstrap.min"
  },
  shim: {
    "bootstrap": ["jquery"]
  }
});

requirejs(['app', 'config'], function(App, Config) {
  var app = new App(Config);

  app.init(Config.gridWidth, Config.gridHeight);

  // for testing, remove before production
  window.app = app;
});