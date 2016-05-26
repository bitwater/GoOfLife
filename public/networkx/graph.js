/*jshint browser:true, jquery:true*/
/*global jsnx:true, d3:true*/
$(function() {
  "use strict";
  var G;
  var tick;
  function draw() {
    clearTimeout(tick);
    var color = d3.scale.category20();
    if (Math.random() <= 0.02) {
      // NetworkX graph
      G = new jsnx.Graph();
      G.addNodesFrom([1,2,3,4], {group:1});
      G.addNodesFrom([5,6,7], {group:2});
      G.addNodesFrom([8,9,10,11], {group:3});

      G.addPath([1,2,5,6,7,8,11]);
      G.addEdgesFrom([
                       [1,3],[1,4],[3,4],[2,3],[2,4],[8,9],[8,10],[9,10],[11,10],[11,9]
      ]);
    }
    else {
      color = d3.scale.category10();
      // var edges = jsnx.binomialGraph(
        // Math.floor((Math.random() * 11) + 10),
        // 0.12
      // ).edges();
      // var edges = jsnx.binomialGraph(4, 0.5).edges();
      var edges = jsnx.fastGnpRandomGraph(33, 0.1).edges();
      // var edges = jsnx.completeGraph(6).edges();

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
    }

    d3.select('#canvas3').style('opacity', 0.01)
    .transition().style('opacity', 1);
    d3.select('#canvas3').style('height', '400px');

    jsnx.draw(G, {element: '#canvas3',
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
                  //console.log(G.nodes(), G.edges());
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
