geotype
---

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
geotype vermont.geojson
```

##options

```sh
-z --zoom : specify fixed tile zoom level

-m --mod : overzoom factor

-b --border : number of tiles to pad sides of frame

--nocolor : display plain ascii w/o colors

-h --help : show docs
```

##test

```sh
sh ./test.sh
```
