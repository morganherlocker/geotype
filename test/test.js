var test = require('tape');
var geotype = require('../');
var fs = require('fs');
var exec = require('child_process').execSync;

var vt = JSON.parse(fs.readFileSync(__dirname+'/fixtures/misc/vt-map.geojson'));
var world = JSON.parse(fs.readFileSync(__dirname+'/fixtures/misc/world.geojson'));

test('geotype', function(t) {
  t.ok(geotype(world), 'world');
  t.ok(geotype(vt), 'vt');

  // frame
  t.true(geotype(world).split('\n')[0].length < geotype(world, {frame:2}).split('\n')[0].length,
    'frame 2 > default');
  t.true(geotype(world).split('\n')[0].length === geotype(world, {frame:1}).split('\n')[0].length,
    'frame defaults to 1');
  t.true(geotype(world).split('\n')[0].length < geotype(world, {f:2}).split('\n')[0].length,
    '-f alias');

  // mod
  t.true(geotype(vt).length < geotype(vt, {mod:1}).length,
    'mod 1 > default');
  t.true(geotype(vt).length < geotype(vt, {mod:2}).length,
    'mod 2 > default');
  t.true(geotype(vt, {mod:3}).length > geotype(vt, {mod:2}).length,
    'mod 3 > mod 2');
  t.true(geotype(vt, {m:2}).length === geotype(vt, {mod:2}).length,
    '-m alias');

  // zoom
  t.true(geotype(vt, {zoom:13}).length > geotype(vt, {zoom:12}).length,
    'zoom 13 > zoom 12');
  t.true(geotype(vt, {zoom:12}).length > geotype(vt, {zoom:2}).length,
    'zoom 12 > zoom 2');
  t.true(geotype(vt, {zoom:10, mod: 3}).length > geotype(vt, {zoom:12}).length,
    'zoom 10 mod 3 > zoom 12');
  t.true(geotype(vt, {z:12}).length === geotype(vt, {zoom:12}).length,
    '-z alias');

  // bbox
  var small = [
    -73.8006591796875,
    42.589488572714245,
    -71.82861328125,
    44.422011314236634
  ]
  var large = [
    -76.025390625,
    37.50972584293751,
    -66.2255859375,
    46.08847179577592
  ]
  t.true(geotype(vt, {bbox:small}).length < geotype(vt, {bbox:large}).length,
    'bbox small < large');
  t.true(geotype(vt, {bbox:small}).length < geotype(vt, {bbox:large}).length,
    '-b alias');

  // tile
  t.true(geotype(world, {tile: '4/4/4', zoom: 9}).length > 14000,
    'tile renders world clip');
  for(var i = 0; i < 10; i++) {
    t.true(geotype(world, {t: '4/'+i+'/4', zoom: 9}).length > 14000,
      'world 4/'+i+'/4 js');
    t.true(exec('node '+__dirname+'/../bin/geotype.js '+__dirname+'/fixtures/misc/world.geojson -t 4/'+i+'/4 -z 9')
      .toString().length > 1500,
      'world 4/'+i+'/4 cli');
  }

  t.end();
});