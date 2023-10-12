---
title: Dataset dynamicity category
---
## Volatility
1. [Update frequency](#update-frequency)

#### **Update frequency**
For the calculation of this metric we use this query:
```sql
PREFIX dcterms:<http://purl.org/dc/terms/>
SELECT DISTINCT ?o
WHERE{
{?s dcterms:accrualPeriodicity ?o}
UNION
{?s dcterms:Frequency ?o}
}
```
The output of this query can be a code that indicate the update frequency (may vary based on the KG considered). For example A stands for annual, M for monthly, D for daily, W for weekly.