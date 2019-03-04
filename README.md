geotype
---

[![Build Status](https://travis-ci.org/morganherlocker/geotype.svg)](https://travis-ci.org/morganherlocker/geotype)

geotype is a cli tool for rendering geojson as ascii in your terminal.

## cli

#### install

```sh
npm install geotype -g
```

#### run

```sh
geotype world.geojson
```

*or*

```sh
cat world.geojson | geotype
```

## node.js

#### install

```sh
npm install geotype
```

#### example

```js
var geotype = require('geotype')
var fs = require('fs')

//default
var world = JSON.parse(fs.readFileSync('./world.geojson'))
var ascii = geotype(world)
console.log(ascii)

//options
console.log(geotype(world, {tile: '4/4/4', zoom: 9}))
```

## options

```sh
-z --zoom : specify fixed tile pixel zoom level

-b --bbox=minX,minY,maxX,maxY : set frame to a bbox

-t --tile : set frame to a tile [x/y/z]

-m --mod : overzoom factor

-f --frame : number of tile pixels to pad sides of frame

--nocolor : display plain ascii w/o colors

-p --png : output to png instead of ascii

-r --res [256]: image resolution

-h --help : show docs
```

## test

```sh
npm t
```

## demo

```sh
cd ./test
sh test.sh
```
