---
title: Accessibility category
---

## Interlinking
1. [Degree of connection](#degree-of-connection)
2. [Clustering coefficient](#clustering-coefficient)
3. [Centrality](#centrality)
4. [Number of *same as* chains](#number-of-same-as-chains)

For the caluculation of the Degree of connection, clustering coefficient and centrality, we utilize a tool for network measurement. We use a Python library named ```networkx``` for our purpose. In KGHeartbeat, the module called [```Graph.py```](https://github.com/isislab-unisa/KGHeartbeat/blob/main/Graph.py) is responsable to the caluculation of these three value. In particular, it is responsible for creating the graph that contains all the KGs that can be retrieved automatically from Internet. The external connections for every KG are analyzed (field
present in the metadata under the "external links" key) and for each connection we find, we insert the node inside the graph, labeled with the id of the KG and insert the edge with a weight equal to the number of triples with which it is connected to the other KGs. The process is then iterated for every KGs recovered. At the end of these process, on this Graph we calculate: *Degree of connection*, *Clustering coefficient* and *Centrality*. 

---
#### **Degree of connection**
The degree of connection is calculated by counting the number of edge that the KG has in the graph constructed as explained before. To quantize the metric, if we have this value, we assign 1 to the metric, 0 otherwise.

---
#### **Clustering coefficient**
The clustering coefficient (specifically here we calculate the local clustering coefficient), measures the degree to which the node tends to form a clique with its neighbors and is a value in the range [0-1].

---
#### **Centrality**
Centrality allows us to understand how important the KG is inside the graph and it is also a value between [0-1]. A higher centrality means a higher importance of the node, that is, it is involved in many connections. Instead, the lower it is, the more it means that those node is in the peripheral areas of the graph.

---
#### **Number of *same as* chains**
In this case we use the following query which counts the number of triples that have the ```owl:sameAs``` predicate.

```sql
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT (COUNT(?o) AS ?triples)
WHERE {
?s owl:sameAs ?o
}
```
To quantize this metric we use the following formula where $|T_{KG}|$ is the number of triples in the KG and nSameAs is the output of the previous query:

$$ m_{sameAS} = \frac{nSameAs}{T_{KG}} $$