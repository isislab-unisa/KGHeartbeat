---
title: Accessibility category
---

## Performance
1. [Latency](#latency)
2. [Throughput](#throughput)

The values calculated in this case are latency and throughput. Since they are highly variable tests, they are repeated several times and the mean, standard deviation, maximum and minimum are calculated. In fact, the values could vary due to the difference in performance of our network over time or the load of the server where the SPARQL endpoint is located (as well as the performance of the server network itself).

#### **Latency**
The test is repeated 5 times and involves the execution of one
simple query that retrieves a generic triple of the dataset and comes
measured the time between the request for the triple and when
the answer is actually returned to us.
The query executed is as follows:
```sql
SELECT *
WHERE {?s ?p ?o .}
LIMIT 1
```
To quantize the latency, if the latency is less than 1 second, then 1 is assigned to this metric. Otherwise we average the five latency measurements and divide by a 1000.

---
#### **Throughput**
Also in this case the test is repeated 5 times and we use the same previous query. But in this case we see in a second how many requests we can complete. The query executes in a while loop that stops after one second, and a count counter is incremented each time the query returns the result. At the end of each test, this variable will contain the number of requests and responses completed. To quantize the metric, if the throughput is greater than 5, we assign 1 to this metric. Otherwise we divide the throughput obtained by 200 and the value obtained is the value for the metric.