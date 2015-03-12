#!/bin/bash
for i in ./fixtures/misc/*; do
    echo $i
    node index.js $i
done

for i in `seq 6 12`; do 
  echo $i
  node index.js fixtures/misc/vt-map.geojson -t 9/11/5 -z $i
done

node index.js fixtures/misc/vt-map.geojson --bbox=-71.75,42.97989806962013,-70.5,44.92249926375825 -z 13

for i in ./fixtures/misc/*; do
    echo $i
    node index.js $i -b 5
done

for i in ./fixtures/misc/*; do
    echo $i
    node index.js $i -m 1
done

for i in ./fixtures/misc/*; do
    echo $i
    node index.js $i --no-color
done

for i in ./fixtures/states/*; do
    echo $i
    node index.js $i
done

for i in ./fixtures/world/*; do
    echo $i
    node index.js $i
done