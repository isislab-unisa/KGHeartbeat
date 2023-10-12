### Licensing
1. [Machine-readable license](#machine-readable-license)
2. [Human-readable license](#human-readable-license)
3. [License in the metadata](#license-in-the-metadata)


#### **Machine-readable license**
We can verify the presence of this type
license in two ways:
1. We look for it inside the VoID file, looking for the triple with the predicate ```dcterms: license```.
2. The other method involves executing query 4 on the
SPARQL endpoints. The other method involves executing the following query on the SPARQL endpoints:
```sql
PREFIX cc: <http://creativecommons.org/ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX schema: <http://schema.org/>
PREFIX doap: <http://usefulinc.com/ns/doap#>
PREFIX xhtml: <http://www.w3.org/1999/xhtml#>
SELECT DISTINCT ?o
WHERE{
{?s ?p ?o}
VALUES (?p) {
(dct:license) (dct:rights)(cc:license)
(dc:license)(schema:license)(doap:license)
(xhtml:license)(dc:rights)
}
}
```
Because queries with the VALUES function may not be supported
from SPARQL endpoints that are based on SPARQL 1.0,
alternative queries are provided which instead use the UNION.

---
#### **Human-readable license**
For this type of license we must access the triples of the KG to verify that there is a label understandable to the user on a triple. All the labels contained in the KG are recovered and then filtered using the following regex: 

```. ∗(licensed?|copyrighte?d?).∗(under|grante?d?|rights?)```

The complete query that runs on the SPARQL endpoint is:
```sql
PREFIX rdf:<http://www.w3.org/2000/01/rdf-schema#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX schema: <http://schema.org/>
SELECT ?o
WHERE{
{?s rdfs:label ?o}
UNION
{?s dct:description ?o}
UNION
{?s rdfs:comment ?o}
UNION
{?s rdfs:label ?o}
UNION
{?s schema:description ?o}
FILTER
regex(?o,
".*(licensed?|copyrighte?d?).*(under|grante?d?|rights?).*")
}
```

---
#### **License in the metadata**
In this case, we simply analyze the KG metadata and the value of the ```license``` key in it.

---
