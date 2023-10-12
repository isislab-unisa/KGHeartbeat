## Representational category

### Versatility
1. [Languages](#languages)
2. [Serialization formats](#serialization-formats)
3. [Access to the KG](#access-to-the-kg)


#### **Languages**
To check if there are different languages supported (and this is indicated), we use the following query:

```sql
SELECT DISTINCT ?triples
WHERE{
?s ?p ?o.
BIND(LANG(?o) as ?triples)
}
```
---

#### **Serialization formats**
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

---

#### **Access to the KG**
In this metric we insert the available links to access to the KG, only if this links are online. The metric is then quantized by giving value 1 in the case there is at least one working access method, 0 otherwise.