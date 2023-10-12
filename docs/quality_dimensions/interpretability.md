# Representational category

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

---
#### **RDF structures**
For the calculation of this metric we use the same method described [here](#use-of-rdf-structures).
