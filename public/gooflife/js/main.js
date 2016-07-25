requirejs.config({
  baseUrl: '/gooflife/js',
  paths: {
    //"jquery": "//cdn.bootcss.com/jquery/1.11.3/jquery.min",
    //"bootstrap": "//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min"
    "jquery": "lib/jquery.min",
    "bootstrap": "lib/bootstrap.min"
  },
  shim: {
    "bootstrap": {
      deps:['jquery']
    }
      //["jquery"]
  }
});

requirejs(['app', 'config', 'jquery', 'roomApp', 'bootstrap'], function(App, Config, $, roomApp, bootstrap) {
  if($('#room').length) {
    var app = new roomApp(Config);
  } else {
    var app = new App(Config);
  }

  console.log($, bootstrap);
  app.init();
  window.app = app;
});