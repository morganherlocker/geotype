#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var geotype = require('../');
var concat = require('concat-stream');

if(argv.h || argv.help){
  docs();
}
else {
  ((argv._[0] && fs.createReadStream(argv._[0])) || process.stdin).pipe(concat(function(body){
    console.log(geotype(JSON.parse(body.toString()), argv));
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
  console.log('--nocolor : display plain ascii w/o colors\n');
  console.log('-h --help : show docs\n');
}