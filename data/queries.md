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