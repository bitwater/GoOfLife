/**
 * Utils.js
 * Authors: Michael Luo
 * Date: 16/6/1
 * Copyright (c) 2015 Swarma Wiki. All rights reserved.
 * http://wiki.swarma.net/index.php/%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F%E5%9B%B4%E6%A3%8B
 */

isMobile = {
  Android:function(){return navigator.userAgent.match(/Android/i);},
  BlackBerry:function(){return navigator.userAgent.match(/BlackBerry/i);},
  iOS:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
  Opera:function(){return navigator.userAgent.match(/Opera Mini/i);},
  Windows:function(){return navigator.userAgent.match(/IEMobile/i);},
  any:function(){return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
};
