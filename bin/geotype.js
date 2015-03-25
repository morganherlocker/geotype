#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var geotype = require('../');
var concat = require('concat-stream');
var savePixels = require("save-pixels");
var zeros = require("zeros");

if(argv.h || argv.help){
  docs();
}
else {
  ((argv._[0] && fs.createReadStream(argv._[0])) || process.stdin).pipe(concat(function(body){
    if(argv.p || argv.png) {
      var res = 256;
      if(argv.r) res = argv.r;
      if(argv.res) res = argv.res;
      var pixels = zeros([res, res, 3]);
      for(var x = 0; x < res; x++) {
        for(var y = 0; y < res; y++) {
          pixels.set(x, y, 0, 20);
          pixels.set(x, y, 1, 20);
          pixels.set(x, y, 2, 20);
        }
      }
      var ascii = geotype(JSON.parse(body.toString()), argv);
      var asciiHeight = ascii.split('\n').length;
      var asciiWidth = ascii.split('\n')[0].split('').length;
      var vertScale = Math.round(res/asciiHeight);
      if(vertScale<1) vertScale = 1;
      var horzScale = Math.round(res/asciiWidth);
      if(horzScale<1) horzScale = 1;
      
      ascii.split('\n').forEach(function(line, y){
        line.split('').forEach(function(c, x){
          if(c === ':') {
            var xPx = Math.round(res * (x/asciiWidth));
            var yPx = Math.round(res * (y/asciiHeight));
            for(var i = 0; i < horzScale+1; i++)
              for(var k = 0; k < vertScale+1; k++){
              pixels.set(xPx+i, yPx+k, 0, 100);
              pixels.set(xPx+i, yPx+k, 1, 100);
              pixels.set(xPx+i, yPx+k, 2, 100);
            }
          }
        });
      });
      ascii.split('\n').forEach(function(line, y){
        line.split('').forEach(function(c, x){
          if(c === 'X') {
            var xPx = Math.round(res * (x/asciiWidth));
            var yPx = Math.round(res * (y/asciiHeight));
            for(var i = 0; i < horzScale+1; i++)
              for(var k = 0; k < vertScale+1; k++){
              pixels.set(xPx+i, yPx+k, 0, 250);
              pixels.set(xPx+i, yPx+k, 1, 0);
              pixels.set(xPx+i, yPx+k, 2, 0);
            }
          }
        });
      });
      ascii.split('\n').forEach(function(line, y){
        line.split('').forEach(function(c, x){
          if(c === '@') {
            var xPx = Math.round(res * (x/asciiWidth));
            var yPx = Math.round(res * (y/asciiHeight));
            for(var i = 0; i < horzScale+1; i++)
              for(var k = 0; k < vertScale+1; k++){
              pixels.set(xPx+i, yPx+k, 0, 0);
              pixels.set(xPx+i, yPx+k, 1, 0);
              pixels.set(xPx+i, yPx+k, 2, 250);
            }
          }
        });
      });

      //console.log(ascii)
      savePixels(pixels, "png").pipe(process.stdout);
    } else {
      console.log(geotype(JSON.parse(body.toString()), argv));
    }
  }));
}

function docs(){
  console.log('geotype\n===\n');
  console.log('geotype [file]\n');
  console.log('-z --zoom : specify fixed tile pixel zoom level\n');
  console.log('-b --bbox=minX,minY,maxX,maxY : set frame to a bbox\n');
  console.log('-t --tile : set frame to a tile [x/y/z]\n');
  console.log('-m --mod : overzoom factor\n');
  console.log('-f --frame : number of tile pixels to pad sides of frame\n');
  console.log('-p --png : output to png instead of ascii\n');
  console.log('-r --res [256]: image resolution\n');
  console.log('--nocolor : display plain ascii w/o colors\n');
  console.log('-h --help : show docs\n');
}