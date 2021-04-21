WikiData Queries:
=================

List of rock bands and their formation location:

https://query.wikidata.org/#%23Rock%20Band%20Locations%0ASELECT%20DISTINCT%20%3Fband%20%3Flocation%20%3Fcoor%20WHERE%20%7B%0A%20%20%3Fband%20wdt%3AP31%20wd%3AQ5741069%20.%0A%20%20%3Fband%20wdt%3AP740%20%3Flocation%20.%0A%20%20%3Flocation%20wdt%3AP625%20%3Fcoor.%0A%7D

```
#Rock Band Locations
SELECT DISTINCT ?band ?location WHERE {
   ?band wdt:P31 wd:Q5741069 .
   ?band wdt:P740 ?location .
   ?location wdt:P625 ?coor.
}
```

Get the wikipedia article for a wikidata item:

```
SELECT ?name ?article WHERE {
   ?article schema:about wd:Q9920 ;
      schema:inLanguage ?lang ;
      schema:name ?name ;
      schema:isPartOf <https://en.wikipedia.org/>; .
   FILTER (!CONTAINS(?name, ':')) .
   FILTER(?lang in ('en') ).
}
```

Ensemble locations:
```
SELECT DISTINCT ?artist ?location ?coor WHERE {

     ?artist wdt:P31/wdt:P279* wd:Q2088357 ;  
               wdt:P740 ?location .
  
   ?location wdt:P625 ?coor.
}
```

Musician Locations:
```
SELECT DISTINCT ?artist ?location ?coor WHERE {

     ?artist wdt:P106 wd:Q639669 ;  
               wdt:P19 ?location .
  
   ?location wdt:P625 ?coor.
}
}
```
