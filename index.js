#!/usr/bin/env node
var turf = require('turf');
var flatten = require('geojson-flatten');
var tileCover = require('tile-cover');
var colors = require('colors/safe');
var normalize = require('geojson-normalize');
var tilebelt = require('tilebelt');

module.exports = function(geo, opts){
  if(!opts) opts = {};
  // normalize geojson data
  var fc = JSON.parse(JSON.stringify(geo))
  fc = flatten(normalize(fc));

  // parse options
  // fixed pixel zoom
  var zoom;
  if(opts.z) zoom = parseFloat(opts.z);
  if(opts.zoom) zoom = parseFloat(opts.zoom);
  // frame buffer
  var frame = 1;
  if(opts.f) frame = opts.f;
  if(opts.frame) frame = opts.frame;
  // overzoom mod
  var mod = 0;
  if(opts.m) mod = opts.m;
  if(opts.mod) mod = opts.mod;
  // fixed tile and bbox frame
  if(opts.b && typeof opts.b === 'string') opts.bbox = opts.b.split('=').join('').split(',').map(parseFloat);
  else if(opts.b) opts.bbox = opts.b

  if(opts.bbox && typeof opts.bbox === 'string') opts.bbox = opts.bbox.split('=').join('').split(',').map(parseFloat);
  else if(opts.bbox) opts.bbox = opts.bbox;
  else if(opts.t) opts.bbox = tilebelt.tileToBBOX(opts.t.split('/').map(parseFloat));
  else if(opts.tile) opts.bbox = tilebelt.tileToBBOX(opts.tile.split('/').map(parseFloat));

  // clip geometries to bbox
  if(opts.bbox) {
    var bboxPoly = turf.bboxPolygon(opts.bbox);
    fc.features = fc.features.map(function(f){
      var intersect = turf.intersect(bboxPoly, f);
      if(intersect) return intersect;
    });
    fc.features = fc.features.filter(function(f){
      if(f) return f;
    });
  }

  // auto pixel zoom if not specified
  if(!(zoom>0)) {
    var bbox = turf.extent(fc);
    var found = false;
    var z = 3;
    while(!found && z < 28) {
      // x fit
      var lineTilesX = tileCover.tiles(
          turf.linestring([[bbox[0], bbox[1]], [bbox[2], bbox[1]]]).geometry,
          {min_zoom: z, max_zoom: z}
        );
      var lineXs = lineTilesX.map(function(t){ return t[0]; });
      var lineMinX = lineXs.reduce(function(a, b){
        if(a < b) return a;
        else return b;
      });
      var lineMaxX = lineXs.reduce(function(a, b){
        if(a > b) return a;
        else return b;
      });
      var diffX = lineMaxX - lineMinX;

      // y fit
      var lineTilesY = tileCover.tiles(
          turf.linestring([[bbox[0], bbox[1]], [bbox[0], bbox[3]]]).geometry,
          {min_zoom: z, max_zoom: z}
        );
      var lineYs = lineTilesY.map(function(t){return t[1]; });
      var lineMinY = lineYs.reduce(function(a, b){
        if(a < b) return a;
        else return b;
      });
      var lineMaxY = lineYs.reduce(function(a, b){
        if(a > b) return a;
        else return b;
      });
      var diffY = lineMaxY - lineMinY;

      if (diffX > 30 || diffY > 23) {
        found = true;
        zoom = z;
      }
      z++;
    }
  }

  // apply overzoom mod
  zoom += mod;

  // rasterize geometries to tile pixels
  var tiles = [];
  fc.features.forEach(function(f) {
    var newTiles = tileCover.tiles(f.geometry, {min_zoom: zoom, max_zoom: zoom})
      .map(function(t){
        t[2] = f.geometry.type;
        return t;
      });
    tiles = tiles.concat(newTiles);
  });

  // fit frame to bbox and filter out of scope tile pixels
  if(opts.bbox) {
    // override frame if bbox or tile is given
    frame = 0;
    var topLeft = tilebelt.pointToTile(opts.bbox[0], opts.bbox[3], zoom);
    var bottomRight = tilebelt.pointToTile(opts.bbox[2], opts.bbox[1], zoom);
    // clip tile pixels outside the bbox frame
    tiles = tiles.filter(function(t) {
      if(t[0] >= topLeft[0] &&
         t[0] <= bottomRight[0] &&
         t[1] >= topLeft[1] &&
         t[1] <= bottomRight[1]) return true;
    });
    tiles.push(topLeft);
    tiles.push(bottomRight);
  }

  // find frame tile pixel bounds
  var xs = tiles.map(function(t){return t[0]; });
  var ys = tiles.map(function(t) { return t[1]; });
  var minX = xs.reduce(function(a, b){
    if(a < b) return a;
    else return b;
  });
  var minY = ys.reduce(function(a, b){
    if(a < b) return a;
    else return b;
  });
  var maxX = xs.reduce(function(a, b){
    if(a > b) return a;
    else return b;
  });
  var maxY = ys.reduce(function(a, b){
    if(a > b) return a;
    else return b;
  });

  // apply frame buffer
  minX -= frame;
  minY -= frame;
  maxX += frame;
  maxY += frame;

  var tileHash = {};
  tiles.forEach(function(tile){
    tileHash[tile[0]+'/'+tile[1]] = tile[2];
  });

  // write tile pixels
  var map = '';
  var x = minX;
  var y = minY;
  while(y <= maxY) {
    while(x <= maxX) {
      if(tileHash[x+'/'+y]) {
        if(tileHash[x+'/'+y] === 'Polygon' || tileHash[x+'/'+y] === 'MultiPolygon') map+=colors.bgGreen.green('::');
        else if(tileHash[x+'/'+y] === 'LineString' || tileHash[x+'/'+y] === 'MultiLineString') map+=colors.bgBlack.black('XX');
        else if(tileHash[x+'/'+y] === 'Point' || tileHash[x+'/'+y] === 'MultiPoint') map+=colors.bgRed.red('@@');
        else map+=colors.bgBlue('  ');
      }
      else map+=colors.bgBlue('  ');
      x++;
    }
    map+='\n';
    x = minX;
    y++;
  }

  // output ascii render
  return map;
}