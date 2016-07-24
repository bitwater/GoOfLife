/**
 * index.js
 * Authors: Michael Luo
 * Date: 16/7/24
 * Copyright (c) 2015 Swarma Wiki. All rights reserved.
 * http://wiki.swarma.net/index.php/%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F%E5%9B%B4%E6%A3%8B
 */
$(window).scroll(function () {
  var scroll = $(document).scrollTop();
  var opa = scroll/360;
  if (opa >= 0.96)
    opa = 0.96

  $('.navbar').css("opacity", opa);
  //if ($(document).scrollTop() > 60 && $(document).scrollTop() <= 120 ) {
  //  //$('.navbar').css('background-color', 'rgba(255, 255, 255, 0.3)');
  //  $('.navbar').css("opacity", "0.3");
  //} else if ($(document).scrollTop() > 120 && $(document).scrollTop() <= 180) {
  //  //$('.navbar').css('background-color', 'rgba(255, 255, 255, 0.3)');
  //  $('.navbar').css("opacity", "0.6");
  //} else if ($(document).scrollTop() > 180 && $(document).scrollTop() <= 256) {
  //  //$('.navbar').css('background-color', 'rgba(255, 255, 255, 0.3)');
  //  $('.navbar').css("opacity", "0.9");
  //} else if ($(document).scrollTop() > 256) {
  //  //$('.navbar').css('background-color', 'rgba(255, 255, 255, 0.3)');
  //  $('.navbar').css("opacity", "0.999");
  //} else {
  //  //$('.navbar').css('background-color', 'rgba(255, 255, 255, 0)');
  //  $('.navbar').css("opacity", "0");
  //}

});
