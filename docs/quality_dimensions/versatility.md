---
title: Representational category
---

## Versatility
1. [Usage of multiple languages](#usage-of-multiple-languages)
2. [Different serialization formats](#different-serialization-formats)
3. [Accessing of data in different ways](#accessing-of-data-in-different-ways)


#### **Usage of multiple languages**
To check if there are different languages supported (and this is indicated), we use the following query:

```sql
SELECT DISTINCT ?triples
WHERE{
?s ?p ?o.
BIND(LANG(?o) as ?triples)
}
```
To quantize this metric, we assign 1 if we have indication about the languages used, 0 otherwise.

---

#### **Different serialization formats**
We calculate this metric bby using two different methods: the first is to look for triples with *void:feature* predicate within the VoID file, the second one involves executing the following query on the SPARQL endpoint:

```sql
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
SELECT DISTINCT ?o
WHERE{
{?s void:feature ?o}
UNION
{?s dcat:mediaType ?o}
}
```
To quantize this metric, we assign 1 if we have indication about the serialization formats available, 0 otherwise.
---

#### **Accessing of data in different ways**
In this metric we insert the available links to access to the KG, only if this links are online. The metric is then quantized by giving value 1 in the case we can access at the KG both throught the SPARQL endpoint or by downloading the RDF dump.