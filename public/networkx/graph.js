/*jshint browser:true, jquery:true*/
/*global jsnx:true, d3:true*/
$(function() {
  "use strict";
  var G;
  var tick;

  $(function () {
    var grid = jsnx.grid2dGraph(6, 6);
    var color = d3.scale.category10();
    d3.select('#canvas4').style('height', '400px');
    //d3.select('#canvas-bg').style('width', '100%');

    jsnx.draw(grid, {
      element: '#canvas4',
      layoutAttr: {
        charge: -300,
        linkDistance: 25,
        gravity: 0.5
      },
      nodeAttr: {
        r: 5,
        title: function (d) {
          return d.label;
        }
      },
      nodeStyle: {
        fill: function (d) {
          return color(d.node % 4);
        },
        stroke: 'none'
      },
      edgeStyle: {
        fill: '#999'
      }
    });

    var G1 = jsnx.completeGraph(random(3, 6));
    var G2 = new jsnx.Graph();

    G2.addNodesFrom([1, 2, 3, 4], {group: 0});
    G2.addNodesFrom([5, 6, 7], {group: 1});
    G2.addNodesFrom([8, 9, 10, 11], {group: 2});
    G2.addPath([1, 2, 5, 6, 7, 8, 11]);
    G2.addEdgesFrom([[1, 3], [1, 4], [3, 4], [2, 3], [2, 4], [8, 9], [8, 10], [9, 10], [11, 10], [11, 9]]);
    var color = d3.scale.category20();
    jsnx.draw(G2, {
      element: '#canvas2',
      layoutAttr: {
        charge: -120,
        linkDistance: 20
      },
      nodeAttr: {
        r: 5,
        title: function (d) {
          return d.label;
        }
      },
      nodeStyle: {
        fill: function (d) {
          return color(d.data.group);
        },
        stroke: 'none'
      },
      edgeStyle: {
        fill: '#999'
      }
    });
  })

  function random(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
  }

  function draw() {
    clearTimeout(tick);
    var color = d3.scale.category10();
    //if (Math.random() <= 0.02) {
    //  // NetworkX graph
    //  G = new jsnx.Graph();
    //  G.addNodesFrom([1,2,3,4], {group:1});
    //  G.addNodesFrom([5,6,7], {group:2});
    //  G.addNodesFrom([8,9,10,11], {group:3});
    //
    //  G.addPath([1,2,5,6,7,8,11]);
    //  G.addEdgesFrom([
    //                   [1,3],[1,4],[3,4],[2,3],[2,4],[8,9],[8,10],[9,10],[11,10],[11,9]
    //  ]);
    //}
      //color = d3.scale.category10();
      // var edges = jsnx.binomialGraph(
        // Math.floor((Math.random() * 11) + 10),
        // 0.12
      // ).edges();
      // var edges = jsnx.binomialGraph(4, 0.5).edges();
      var edges = jsnx.fastGnpRandomGraph(23, 0.2).edges();
      // var edges = jsnx.completeGraph(6).edges();

      G = new jsnx.Graph();
      // var edges = jsnx.grid2dGraph(3, 3).edges();

      (function t() {
        if (edges.length) {
          G.addEdge.apply(G, edges.shift());
          tick = setTimeout(t, 800);
          // console.log(edges)
        } else {
          G.addEdge(2, 10);
        }
      }());

    d3.select('#canvas3').style('opacity', 0.01).transition().style('opacity', 1);
    d3.select('#canvas3').style('height', '400px');

    jsnx.draw(G, {element: '#canvas3',
              layoutAttr: {
                // width: 400,
                charge: -300,
                linkDistance: 30,
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
