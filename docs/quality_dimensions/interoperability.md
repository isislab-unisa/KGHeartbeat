---
title: Representational category
---

## Interoperability
1. [Re-use of existing vocabularies](#re-use-of-existing-vocabularies)
2. [Re-use of existing terms](#re-use-of-existing-terms)

#### **Re-use of existing vocabularies**
For the calculation of this metric we need the vocabularies used in the KG. To recover this information we have used the same method that we have seen [here](./verifiability#vocabularies). Then thanks to the REST API of the Linked Open Vocabularies (LOV), we check if the vocabularies is standard (i.e. is in the LOV). We assign at the metric 1 if no new vocabularies are defined, otherwise 0.
Furthermore, track of the new vocabularies used will also be kept.

#### **Re-use of existing terms**
In this case we need all the terms used in the KG. We can get this information by using the following query:

```sql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT DISTINCT ?o
WHERE {?s rdf:type ?o}
```

Then we search every term founded on the Linked Open Vocabularies, to check if is present or not (if yes this mean that is considered a standard term). At the end of the analysis of all the terms, we use the following formula to quantize the metric:

$$
m_{newTerms} = 1.0 - \frac{numNewTerms}{totalTermsInTheKG}
$$