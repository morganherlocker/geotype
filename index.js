#!/usr/bin/env node
var turf = require('turf');
var flatten = require('geojson-flatten');
var tileCover = require('tile-cover');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var colors = require('colors/safe');
var normalize = require('geojson-normalize');
var tilebelt = require('tilebelt');

if(argv.h || argv.help){
  docs();
}
else {
  var fc = flatten(normalize(JSON.parse(fs.readFileSync(argv._[0]))));

  // parse options
  var zoom;
  if(argv.z) zoom = parseFloat(argv.z);
  if(argv.zoom) zoom = parseFloat(argv.zoom);
  var border = 1;
  if(argv.b) border = argv.b;
  if(argv.border) border = argv.border;
  var mod = 0;
  if(argv.m) mod = argv.m;
  if(argv.mod) mod = argv.mod;

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
      var lineXs = lineTilesX.map(function(t){return t[0]; });
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

  zoom += mod;
  var map = '';
  var tiles = [];
  fc.features.forEach(function(f) {
    var newTiles = tileCover.tiles(f.geometry, {min_zoom: zoom, max_zoom: zoom})
      .map(function(t){
        t[2] = f.geometry.type;
        return t;
      });

    tiles = tiles.concat(newTiles);
  });

  var minX;
  var minY;
  var maxX;
  var maxY;

  if(argv.bbox) argv.bbox = argv.bbox.split(',').map(parseFloat);
  else if(argv.t) argv.bbox = tilebelt.tileToBBOX(argv.t.split('/').map(parseFloat));
  else if(argv.tile) argv.bbox = tilebelt.tileToBBOX(argv.tile.split('/').map(parseFloat));
  if(argv.bbox) {
    border = 0;
    tiles.push(tilebelt.pointToTile(argv.bbox[0], argv.bbox[3], zoom));
    tiles.push(tilebelt.pointToTile(argv.bbox[2], argv.bbox[1], zoom));
  }

  var xs = tiles.map(function(t){return t[0]; });
  var ys = tiles.map(function(t) { return t[1]; });
  minX = xs.reduce(function(a, b){
    if(a < b) return a;
    else return b;
  });
  minY = ys.reduce(function(a, b){
    if(a < b) return a;
    else return b;
  });
  maxX = xs.reduce(function(a, b){
    if(a > b) return a;
    else return b;
  });
  maxY = ys.reduce(function(a, b){
    if(a > b) return a;
    else return b;
  });
  minX -= border;
  minY -= border;
  maxX += border;
  maxY += border;

  var tileHash = {};
  tiles.forEach(function(tile){
    tileHash[tile[0]+'/'+tile[1]] = tile[2];
  });

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

  console.log(map);
}

function docs(){
  console.log('geotype\n===\n');
  console.log('geotype [file]\n');
  console.log('-z --zoom : specify fixed tile pixel zoom level\n');
  console.log('--bbox=minX,minY,maxX,maxY : set frame to a bbox\n');
  console.log('-t --tile : set frame to a tile [x/y/z]\n');
  console.log('-m --mod : overzoom factor\n');
  console.log('-b --border : number of tile pixels to pad sides of frame\n');
  console.log('--nocolor : display plain ascii w/o colors\n');
  console.log('-h --help : show docs\n');
}