## Representational category

### Representational-consistency
1. [Reuse of vocabularies](#reuse-of-vocabularies)
2. [Reuse of terms](#reuse-of-terms)

#### **Reuse of vocabularies**
For the calculation of this metric we need the vocabularies used in the KG. To recover this information we have used the same method that we have seen [here](#vocabularies). Then thanks to the REST API of the Linked Open Vocabularies (LOV), we check if the vocabularies is standard (i.e. is in the LOV). We assign at the metric 1 if new vocabularies are defined, otherwise 0.
Furthermore, track of the new vocabularies used will also be kept.

#### **Reuse of terms**
In this case we need all the terms used in the KG. We can get this information by using the following query:

```sql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT DISTINCT ?o
WHERE {?s rdf:type ?o}
```

Then we search every term founded on the Linked Open Vocabularies, to check if is present or not (if yes this mean that is considered a standard term). At the end of the analysis of all the terms, a value of 1 will be assigned if new ones are defined, 0 otherwise. Even in this case, a list of all new terms declared is still maintained