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

  $('.navbar').css("opacity", 0);

  if (scroll > 99) {
    $('.intro-message').fadeOut();
  } else {
    $('.intro-message').fadeIn();
  }

  parallax();

  //$('.social .col-md-12').each(function(){
  //
  //  var imagePos = $(this).offset().top;
  //  var topOfWindow = $(window).scrollTop();
  //
  //  if (imagePos < topOfWindow+550) {
  //    $(this).addClass("animated fadeInLeft");
  //  }
  //});

});


$(function(){
  $('.social .col-md-12').addClass('visibility');

  var browserWidth = $(window).width();

  if (browserWidth > 560){

    $(window).scroll(function() {
      parallax();
    });

  }
})

$(window).resize(function () {

  var browserWidth = $(window).width();

  if (browserWidth > 560){
    $(window).scroll(function() {
      parallax();
    });

  }

});

function parallax() {
  // Turn parallax scrolling off for iOS devices
  var iOS = false,
    p = navigator.platform;

  if (p === 'iPad' || p === 'iPhone' || p === 'iPod') {
    iOS = true;
  }

  var scaleBg = -$(window).scrollTop() / 2;

  if (iOS === false) {
    //console.log(scaleBg);
    //$('.payoff').css('background-position-y', scaleBg - 150);
    $('.quote').css('background-position-y', scaleBg + 200);
  }

}