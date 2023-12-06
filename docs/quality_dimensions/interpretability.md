---
title: Accessibility category
---

## Interpretability
1. [No misinterpretation of missing values](#no-misinterpretation-of-missing-values)
2. [Atypical use of collections containers and reification](#atypical-use-of-collections-containers-and-reification)

#### **No misinterpretation of missing values**
To count the number of nodes we use the following query:
```sql
SELECT (COUNT(?bnode) AS ?triples)
WHERE { ?bnode ?p ?o
FILTER (isBlank(?bnode))}
```
The query output is the number of blank nodes in the KG, and is used to understand the incidence of blank nodes compared to other resources.
To quantize the metric, we first execute the following query that count the number of triples that do not have the property `rdf:type`:
```sql
SELECT (COUNT(?o) AS ?triples)
WHERE{?s ?p ?o.
FILTER(?p NOT IN (rdf:type))
}
```
Then we use the following formmula where $numBN$ is the output of the first query and $numDlc$ is the output of the second query:

$$
m_{BN} = 1 - \frac{numBN}{numDlc}
$$

---
#### **Atypical use of collections containers and reification**
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
