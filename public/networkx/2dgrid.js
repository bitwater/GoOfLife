/*jshint browser:true, jquery:true*/
/*global jsnx:true, d3:true*/
$(function() {
  "use strict";
  var G;
  var tick;
  function draw() {
    clearTimeout(tick);
    var color = d3.scale.category20();
      color = d3.scale.category10();
      // var edges = jsnx.binomialGraph(4, 0.5).edges();
      // var edges = jsnx.fastGnpRandomGraph(100, 0.1).edges();
      var edges = jsnx.completeGraph(6).edges();
      G = new jsnx.Graph();
      // var edges = jsnx.grid2dGraph(3, 3).edges();

      (function t() {
        if (edges.length) {
          G.addEdge.apply(G, edges.shift());
          tick = setTimeout(t, 500);
          // console.log(edges)
        } else {
          G.addEdge(2, 10);
        }
      }());

    d3.select('#gridCanvas').style('opacity', 0.01)
    .transition().style('opacity', 1);
    d3.select('#gridCanvas').style('height', '400px');

    jsnx.draw(G, {element: '#gridCanvas',
              layoutAttr: {
                // width: 400,
                charge: -100,
                linkDistance: 20,
                gravity: 0.3
              },
              // panZoom: {
              //   enabled: false
              // },
              nodeAttr: {
                r: 4
              },
              nodeStyle: {
                fill: function(d) {
                  console.log(G.nodes(), G.edges());
                  // console.log(d);
                  return color(d.node % 4);
                },
                stroke: 'none'
              },
              edgeStyle: {
                fill: '#999'
              }
    }, true);
  }
  draw();
  var timer;
  //$(window).resize(function() {
  //   clearTimeout(timer);
  //   timer = setTimeout(draw, 300);
  //});
});
