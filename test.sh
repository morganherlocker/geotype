#!/bin/bash
for i in ./fixtures/misc/*; do
    echo $i
    node index.js $i
done

for i in ./fixtures/states/*; do
    echo $i
    node index.js $i
done

for i in ./fixtures/world/*; do
    echo $i
    node index.js $i
done