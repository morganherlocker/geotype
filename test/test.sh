#!/bin/bash

for i in ./fixtures/misc/*; do
    echo $i
    node ../bin/geotype.js $i
done

for i in ./fixtures/misc/*; do
    echo $i
    node ../bin/geotype.js $i --no-color
done

for i in `seq 6 11`; do 
  echo $i
  node ../bin/geotype.js fixtures/misc/vt-map.geojson -t 9/11/5 -z $i
done

node ../bin/geotype.js fixtures/misc/vt-map.geojson -t 38/46/7
node ../bin/geotype.js fixtures/misc/vt-map.geojson -t 37/46/7
node ../bin/geotype.js fixtures/states/VT.geo.json -t 4/5/4 -z 9
node ../bin/geotype.js fixtures/states/VT.geo.json -t 4/5/4 -z 10
node ../bin/geotype.js fixtures/misc/world.geojson --bbox=-88,26,-69,35
node ../bin/geotype.js fixtures/misc/world.geojson --bbox=-88,26,-69,35 -m 1
node ../bin/geotype.js fixtures/misc/world.geojson -b=-88,26,-69,35
node ../bin/geotype.js fixtures/misc/world.geojson -b=-88,26,-69,35 -m 1

node ../bin/geotype.js fixtures/misc/vt-map.geojson --bbox=-71.75,42.97989806962013,-70.5,44.92249926375825 -z 13

for i in `seq 0 11`; do
  node ../bin/geotype.js fixtures/misc/world.geojson -t 4/$i/4 -z 9
done

for i in ./fixtures/misc/*; do
    echo $i
    node ../bin/geotype.js $i -f 5
done

for i in ./fixtures/misc/*; do
    echo $i
    node ../bin/geotype.js $i -m 1
done

for i in ./fixtures/states/*; do
    echo $i
    node ../bin/geotype.js $i
done

for i in ./fixtures/world/*; do
    echo $i
    node ../bin/geotype.js $i
done