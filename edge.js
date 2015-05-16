define(['lib/lines/lines'], function(lines) {
  var Line = lines.Line;

  function Edge(id, u, v, options) {
    options = options || {};
    this.id = id;
    this.u = u;
    this.v = v;

    this._lineOpts = { strokeColour : options.colour || '#808080' };
  }

  Edge.prototype.otherEnd = function(end) {
    if (this.u.id === end.id) return this.v;
    if (this.v.id === end.id) return this.u;
    throw new Error("Given node not in this edge");
  };

  Edge.prototype.intersects = function(edge) {
    return lines.intersect(this.line, edge.line);
  };

  Edge.prototype.draw = function(ctx, animate) {
    if (!animate) {
      this._draw(ctx, this.u.coords, this.v.coords);
      return;
    }

    if (this.animating) {
      if (this.percentDrawn < 1) {
        this.percentDrawn += this.step;
      }

      if (this.percentDrawn >= 1 && this.animateCallback) {
        this.animateCallback();
        this.animateCallback = null;
        if (!this.drawEnd.animating) this.drawEnd.startAnimation();
      }

      // Shorthand
      var ds = this.drawStart.coords;
      var de = this.drawEnd.coords;
      // Distance we will draw
      var d = {
        x : this.percentDrawn * (de.x - ds.x),
        y : this.percentDrawn * (de.y - ds.y)
      };
      var drawEnd = {
        x: d.x + ds.x,
        y: d.y + ds.y
      };
      this._draw(ctx, ds, drawEnd);
    }
  };

  Edge.prototype.startAnimation = function(node) {
    // Begin animating drawing from "node"
    this.animating = true;
    this.percentDrawn = 0;
    this.step = 0.02;
    this.drawStart = node;
    this.drawEnd = this.otherEnd(node);
  };

  Edge.prototype._draw = function(ctx, start, end) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = this._lineOpts.strokeColour;
    ctx.stroke();
  };

  Edge.prototype.updateCoords = function() {
    if (this.u.coords && this.v.coords) {
      this.line = new Line(this.u.coords, this.v.coords, this._lineOpts);
    }
  };

  return Edge;
});
