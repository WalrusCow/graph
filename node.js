define(['graph/edge'], function(Edge) {
  function Node(id, options) {
    options = options || {};
    this.id = id;

    this.neighbours = [];
    this.edges = [];
    this.degree = 0;

    this.animating = false;
    this.percentDrawn = 0;

    this.radius = 6;
    this.colour = options.colour || '#2f55ee';
    this.fillColour = options.fillColour;
  }

  Node.prototype.addEdge = function(edge) {
    this.neighbours.push(edge.otherEnd(this));
    this.edges.push(edge);
    this.degree += 1;
  };

  Node.prototype.deleteEdge = function(edge) {
    this.edges = this.edges.filter(function(e) {
      return e.id !== edge.id;
    });
    this.neighbours = this.neighbours.filter(function(n) {
      return edge.otherEnd(this) !== n;
    }, this);
    this.degree -= 1;
  };

  Node.prototype._clear = function(ctx) {
    ctx.beginPath();
    // Damnit... There's a pixel missing from the edge because of the + 1,
    // but if I don't and I draw multiple circles then the circle get fat...
    ctx.arc(this.coords.x, this.coords.y, this.radius + 1, 0, 2 * Math.PI);
    ctx.save();
    ctx.clip();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  };

  Node.prototype._draw = function(ctx, start, end) {
    this._clear(ctx);
    ctx.beginPath();
    ctx.arc(this.coords.x, this.coords.y, this.radius, start, end);
    if (end - start >= 2 * Math.PI && this.fillColour) {
      ctx.fillStyle = this.fillColour;
      ctx.fill();
    }
    ctx.strokeStyle = this.colour;
    ctx.stroke();
  };

  Node.prototype.draw = function(ctx, animate) {
    if (animate && this.animating) {
      var step = .01;
      var percent = step;
      var ccw = Math.random() < 0.5;

      // Shorthand
      var x = this.coords.x;
      var y = this.coords.y;
      var r = this.radius;
      var start = 0;
      var self = this;

      function draw() {
        // Done
        if (percent > 1 + step) return;
        var d = percent * 2 * Math.PI;
        // We will fake ccw so that _draw is simpler
        if (ccw)
          self._draw(ctx, start - d, start);
        else
          self._draw(ctx, start, start + d);
        percent += step;
        requestAnimationFrame(draw);
      }
      requestAnimationFrame(draw);
    }
    else {
      this._draw(ctx, 0, 2 * Math.PI);
    }
  };

  Node.prototype.adjacentTo = function(node) {
    // Return true if we neighbour the given node
    return this.neighbours.indexOf(node) !== -1;
  };

  Node.prototype.updateCoords = function(newCoords) {
    this.coords = newCoords;
    this.coords.x = Math.round(this.coords.x);
    this.coords.y = Math.round(this.coords.y);
    this.edges.forEach(function(edge) {
      edge.updateCoords();
    });
  };

  return Node;
});
