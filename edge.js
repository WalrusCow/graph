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
    this.line.setContext(ctx);
    this.line.draw();
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
