#!/bin/bash
for i in ./fixtures/*; do
    echo $i
    node index.js $i
done