---
title: Contextual category
---

## Amount of data
1. [Number of triples](#number-of-triples)
2. [Number of properties](#number-of-properties)
3. [Number of entities](#number-of-entities)

#### **Number of triples**
To calculate the number of triples in the KG we can proceed in two ways. The first consists in recovering the data through the metadata, in particular the *triples* key. This method is only applied when actual triples cannot be counted by accessing the SPARQL endpoint. Because the metadata is not updated along with the content of the KG. The following query is used for count the number of triples: 
```sql
SELECT (COUNT(?s) AS ?triples)
WHERE { ?s ?p ?o }
```

#### **Number of properties**
We can only obtain this type of value by executing a SPARQL query. In particular, the number of properties is given to us by this query:

```sql
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT DISTINCT (COUNT(?o) AS ?triples)
WHERE {
{ ?o a rdf:Property}
UNION
{?o a owl:DatatypeProperty}
UNION
{?o a skos:Property}
UNION
{?o a owl:DatatypeProperty}
UNION
{?o a owl:AnnotationProperty}
UNION
{?o a owl:OntologyProperty}
UNION
{?o a rdfs:subPropertyOf}
UNION
{?o a rdfs:Property}
}
```

#### **Number of entities**
In this case we simply recover it by searching for the triple with $void:entities$ predicate inside the VoID file. As an alternative if there isn't a VoID file available, we execute the following query on the SPARQL endpoint. 

```sql
PREFIX void:<http://rdfs.org/ns/void#>
SELECT ?triples
WHERE {?s void:entities ?triples}
```

Both of these methods, however, are based on the assumption that the provider of the dataset insert a triple in the KG with this information. Often, however, this does not happen, so in the event that the information is not provided we use another method. We first recover the URI regex or pattern, we recover this information by doing the following query:

```sql
SELECT DISTINCT ?o
WHERE
{?s void:uriRegexPattern ?o}
```

or this for the URI pattern

```sql
PREFIX void: <http://rdfs.org/ns/void#>
SELECT DISTINCT ?o
WHERE {?s void:uriSpace ?o}
```
In case the regex is not available, but we only have the
URI space (which is not a regex), we transform it into a regex to use it for comparison. Once we got the regex we use the following query for count the number of entities:
```sql
SELECT (COUNT(?s) as ?triples)
WHERE{
{?s ?p ?o}
FILTER(regex(?s,"%s"))
}
```
(The %s parameter in the regex function is set with the regex that we obtained with the mechanisms indicated above.)
