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
    // Clear the inside of the circle
    ctx.arc(this.coords.x, this.coords.y, this.radius, 0, 2 * Math.PI);
    ctx.save();
    ctx.clip();
    ctx.clearRect(this.coords.x - this.radius, this.coords.y - this.radius,
                  2 * this.radius, 2 * this.radius);
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
    if (!animate) {
      this._draw(ctx, 0, 2 * Math.PI);
      return;
    }

    if (this.animating) {
      if (this.percentDrawn < 1) {
        this.percentDrawn += this.step;
      }

      if (this.percentDrawn >= 1 && this.animateCallback) {
        this.animateCallback();
        this.animateCallback = null;
        this.edges.forEach(function(e) {
          // Start animating neighbours if they haven't yet started
          if (!e.animating) e.startAnimation(this);
        }, this);
      }

      var start = 0;
      var d = this.percentDrawn * 2 * Math.PI;
      // We will fake ccw so that _draw is simpler
      if (this.ccw)
        this._draw(ctx, start - d, start);
      else
        this._draw(ctx, start, start + d);
    }
  };

  Node.prototype.startAnimation = function() {
    this.animating = true;
    this.percentDrawn = 0;
    // TODO: Compute step based off of velocity and distance to travel
    this.step = 0.01;
    // Randomly choose cw or ccw
    this.ccw = Math.random() < 0.5;
    // TODO: Take starting angle as input (from edge)
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
