geotype
---

[![Build Status](https://travis-ci.org/morganherlocker/geotype.svg)](https://travis-ci.org/morganherlocker/geotype)

geotype is a cli tool for rendering geojson as ascii in your terminal.

*colors*
![](https://dl.dropbox.com/s/pd6ewtiuazatwd8/Screenshot%202015-03-12%2000.39.18.png?dl=0)
*no colors*
![](https://dl.dropbox.com/s/m4pq6wqej2hbuhq/Screenshot%202015-03-12%2000.41.56.png?dl=0)

##install

```sh
npm install geotype -g
```

##run

```sh
geotype world.geojson
```

*or*

```sh
cat world.geojson | geotype
```

##options

```sh
-z --zoom : specify fixed tile pixel zoom level

-b --bbox=minX,minY,maxX,maxY : set frame to a bbox

-t --tile : set frame to a tile [x/y/z]

-m --mod : overzoom factor

-f --frame : number of tile pixels to pad sides of frame

--nocolor : display plain ascii w/o colors

-h --help : show docs
```

##test

```sh
npm t
```

##demo

```sh
cd ./test
sh test.sh
```