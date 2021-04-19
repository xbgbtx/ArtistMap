WikiData Queries:
=================

List of rock bands and their formation location:

```
#Rock Band Locations
SELECT DISTINCT ?band ?location WHERE {
   ?band wdt:P31 wd:Q5741069 .
   ?band wdt:P740 ?location;
}
```
