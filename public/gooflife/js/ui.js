/**
 * ui.js
 * Authors: Michael Luo
 * Date: 16/1/20
 * Copyright (c) 2015 Swarma Wiki. All rights reserved.
 * http://wiki.swarma.net/index.php/%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F%E5%9B%B4%E6%A3%8B
 */
define(['jquery', 'bootstrap'], function($){
  console.log($)
  // DOM ready
  $(function(){
    console.log("main.js Enter.");
    // Twitter Bootstrap 3 carousel plugin
    $("#carousel-example-generic").carousel({ interval: 2000, cycle: true });

    $('#small-view').on('click', function () {
        alert("small")
        $(this).button('complete') // button text will be "finished!"
      })
    });

    $(function () {
      $("#big-view").click(function(){
        alert("hello")
        $(this).button('toggle');
      });
  });
});
