---
title: Contextual category
---

## Completeness
1. [Interlinking completeness](#interlinking-completeness)

#### **Interlinking completeness**
For the calculation of the interlinking completeness
we count the total number of triples that are connected with other KGs. This occurs by analyzing the metadata and in particular the *external links* field, which contains a list of values in the form *key*-*value*, where the *key* is the id of the KG with which it is connected and the *value* is the number of triples. We analyze this list and we do the sum of all the values. Then we apply the following formula to obtain the interlinking completeness (where $triplesL$ is the number of triples linked and $T_{KG}$ is the set of all the triples in the KG):

$$
m_{intCompl} = \frac{triplesL}{T_{KG}}
$$
