---
title: Trust category
---

## Verifiability
1. [Vocabularies](#vocabularies)
2. [Authors](#authors)
3. [Contributors](#contributors)
4. [Publishers](#publishers)
5. [Sources](#sources)
6. [Signature](#signature)

#### **Vocabularies**
For recover the vocabularies used in the KG we can use two different approach. The first is try to parse the VoID file if available and we have to search the triples with the $void:vocabulary$ triples. The second method is to use the following query on the SPARQL endpoint.

```sql
PREFIX void: <http://rdfs.org/ns/void#>
SELECT DISTINCT ?o
WHERE{?s void:vocabulary ?o }
```
To quantize this metric we need to recover all terms used in the KG. We use the query illustred [here](./representational_consistency.md#reuse-of-terms), then we determine the vocabulary from which each term comes and we put the number into the $namespaces$ variable. Lastly, to quantize the metric we use the following formula, where $vocabs$ is the output of the first query:

$$
m_{vocabs} = \frac{vocabs}{namespace}
$$

---

#### **Authors**
Also the authors can be recovered via the VoID file or the SPARQL endpoint. In the VoID file we have to search the triples with the predicate equals to $dcterms:creator$. As alternative, we execute the following query on the SPARQL endpoint.

```sql
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT DISTINCT ?o
WHERE{
{?s dc:creator ?o }
UNION
{?s dcterms:creator ?o}
UNION
{?s foaf:maker ?o}
}
```
To quantize this metric, we assign 1 if authors are indicated, 0 otherwise.

---

#### **Contributors**
This metric is recoverable by searching the $dcterms:contributor$ predicate in the VoID file or by executing the following query on the SPARQL endpoint:

```sql
PREFIX dcterms:<http://purl.org/dc/terms/>
SELECT DISTINCT ?o
WHERE {?s dcterms:contributor ?o.}
```
To quantize this metric, we assign 1 if contributors are indicated, 0 otherwise.

---

#### **Publishers**
The metric is calculated by searching the $dcterms:publisher$ predicate in the VoID file or by executing the following query on the SPARQL endpoint:

```sql
PREFIX dc: <http://purl.org/dc/elements/1.1/>
SELECT DISTINCT ?o
WHERE {?s dc:publisher ?o}
```
To quantize this metric, we assign 1 if publichers are indicated, 0 otherwise.

---

#### **Sources**
For this metric we analyze the KG metadata and in particular we get the value from the field that has as key $sources$ .
To quantize this metric, we assign 1 if sources is indicated, 0 otherwise.

---

### **Signature**
To check and retrieve the signature on the KG if present, the following query is executed:

```sql
PREFIX swp:<http://www.w3.org/2004/03/trix/swp-2/>
SELECT ?s ?o
WHERE{
{?s swp:signature ?o}
UNION
{?s swp:authority ?o}
UNION
{?s swp:certificate ?o}
UNION
{?s swp:quotedBy ?o}
UNION
{?s swp:assertedBy ?o}
}
```
To quantize this metric, we assign 1 if there is a signature, 0 otherwise.