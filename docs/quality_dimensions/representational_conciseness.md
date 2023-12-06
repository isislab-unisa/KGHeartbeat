---
title: Representational category
---

## Representational-conciseness
1. [Keeping URI short](#keeping-uri-short)

#### **Keeping URI short**
For the calculation of this metric we need all the KG triples. For recover it, we use the following query:

```sql
SELECT *
WHERE{?s ?p ?o}
```

Three separate values are created, so as to have the length of the subject, predicate and object URIs. The calculation proceeds by counting the number of characters and the average, maximum, minimum and standard deviation are maintained. To quantize the metric, we first count the number of URI that have less than 80 characters and doesn't have parameters in the URL ($urlApproved$). Then we execute the following query that count the number of triples that do not have the property `rdf:type`:
```sql
SELECT (COUNT(?o) AS ?triples)
WHERE{?s ?p ?o.
FILTER(?p NOT IN (rdf:type))
}
```
Lastly, we use the following query to quantize the metric, where $dlc$ is the output of the previous query:

$$
m_repCons = \frac{urlApproved}{dlc}
$$

--- 