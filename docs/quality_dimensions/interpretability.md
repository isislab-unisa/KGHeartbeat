---
title: Accessibility category
---

## Interpretability
1. [Number of blank nodes](#number-of-blank-nodes)
2. [Use of RDF structures](#rdf-structures)

#### **Number of blank nodes**
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
m_{BN} = \frac{numBN}{numDlc}
$$

---
#### **RDF structures**
For the calculation of this metric we use the same method described [here](./representational_conciseness#use-of-rdf-structures).
