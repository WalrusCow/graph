requirejs.config({
  urlArgs: "ts="+new Date().getTime(),
  paths: {
    'graph': '.'
  }
});

var canvas = document.getElementById('graphCanvas');
var wrapper = document.getElementById('wrapper');
canvas.height = wrapper.clientHeight;
canvas.width = wrapper.clientWidth;

requirejs(['graph/generate'], function(generateGraph) {
  generateGraph({
    canvas: 'graphCanvas',
    graph: {
      node: {
        colour: 'red'
      },
      edge: {
        colour: 'orange'
      }
    }
  });
});
