# Representational category

## Representational-conciseness
1. [URIs length](#uris-length)
2. [Use of RDF structures](#rdf-structures)

#### **URIs Length**
For the calculation of this metric we need all the KG triples. For recover it, we use the following query:

```sql
SELECT *
WHERE{?s ?p ?o}
```

Three separate values are created, so as to have the length of the subject, predicate and object URIs. The calculation proceeds by counting the number of characters and the average, maximum, minimum and standard deviation are maintained.

--- 

#### **Use of RDF structures**
In this case we check that there are no RDF data structures, in fact their use comes discouraged by W3C. To check their use we use the following query:
```sql
PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT (COUNT(?s) AS ?triples)
WHERE{
{?s rdf:type rdf:List }
UNION
{?s rdf:type rdf:Statement}
UNION
{?s rdf:type rdf:Alt}
UNION
{?s rdf:type rdf:Bag}
UNION
{?s rdf:type rdf:Seq}
UNION
{?s rdf:type rdf:Container}
UNION
{?s rdf:subject ?o}
UNION
{?s rdf:predicate ?o}
UNION
{?s rdf:object ?o}
UNION
{?s rdfs:member ?o}
UNION
{?s rdf:first ?o}
UNION
{?s rdf:rest ?o}
UNION
{?s rdf:_’[0-9]+’}
}
```
If the query returns even just one result, it means we have
a triple that declares the use of RDF structures and therefore
we attribute a value of 1 to the data (i.e. they are used), 0 otherwise.