---
title: Trust category
---

## Reputation
1. [Reputation of the dataset ](#reputation-of-the-dataset)

#### **Reputation of the dataset**
Since for the calculation of interlinking [here](./interlinking) we have built the graph containing all the KGs with the related external links, the function that calculates the PageRank on the node of interest (which corresponds to the KG we are analyzing) will be applied to this graph. The function used is the one made available by networkx and we pass it as input the ID of the KG whose PageRank we want to calculate. The function will return a value between 1 and 10. The closer the data is to 10, the more the KG has a high reputation and therefore of good quality. For quantize the metric, and get a value between 0 and 1, we divide the pagerank by 10.0