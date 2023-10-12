---
title: Dataset dynamicity category
---

## Currency
1. [Creation date](#creation-date)
2. [Modification date](#modification-date)
3. [Time since last modification](#time-since-last-modification)
4. [History of changes made](#history-of-changes-made)

#### **Creation date**
The value regarding the KG creation date can be obtained from the VoID file or by executing a query on the SPARQL endpoint. In the VoID file we look for a triple having $dcterms:created$ as predicate. Instead the query for the endpoint should be of the type:

```sql
PREFIX dcterms: <http://purl.org/dc/terms/>
SELECT DISTINCT ?o
WHERE{?s dcterms:created ?o}
ORDER BY ASC(?o)
LIMIT 1
```
What this query does is retrieve all triples with predicate
$dcterms:created$, then sorts the results in ascending order and takes the
first value. This is because often multiple triples can be indicated
with that predicate.

---

#### **Modification date**
This value can also be obtained either from the file
VoID or by executing a query. In the VoID file we look for the triple with predicate $dcterms:modified$, while on the SPARQL endpoint we execute the following query:

```sql
PREFIX dcterms: <http://purl.org/dc/terms/>
SELECT DISTINCT ?o
WHERE{?s dcterms:modified ?o}
ORDER BY ASC(?o)
LIMIT 1
```
In the opposite way to what happened for the creation date, here we sort the output in descending order and take the first result.

---

#### **Time since last modification**
In this case we simply retrieve the modification date (with the previous query) and make the difference between the date on which we are performing the analysis and the date of the last modification. The value is expressed in days.

---

#### **History of changes made**
To calculate this data we need all the triples with $dcterm:modified$ predicate, which correspond to all the different modification dates. We use the same query used in the [modification date metric](#modification-date), but we remove LIMIT 1. At this point, for each date we obtained from the query, we execute the following query:

```sql
PREFIX dcterms:<http://purl.org/dc/terms/>
SELECT DISTINCT (COUNT(?o) AS ?triples)
WHERE{
{?s dcterms:modified ?o}
FILTER regex(?o,’%s’)
}
```
In the regex function the ```%s``` parameter is set with the modification date for which we want to count the number of updated triples.

---