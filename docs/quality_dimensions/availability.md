## Accessibility category

## Availability
1. [SPARQL endpoint](#sparql-endpoint)
2. [RDF Dump](#rdf-dump)
3. [URIs dereferenciability](#uris-dereferenciability)
4. [Inactive links](#inactive-links)

#### **SPARQL endpoint**
First of we need to check that it is present
for the KG we are considering. The SPARQL endpoint link can be recovered in three different ways:
1. The first (easiest) is to analyze the metadata and search for the resource with the tag in the resources field api/sparql or whose key is sparql.
2. Just in case this way is unable to recover it, then we proceed to search inside the VoID file if it is available. In this case we go in search of the triple having ``` void:sparqlEndpoint ``` as predicate.
3. The third and final method involves retrieving the URL of the dataset and adding /sparql to it, since this is the position that is usually given to the SPARQL endpoint on the server.

If none of these three methods leads to having a SPARQL
endpoint, then it is declared that this KG does not have one and is given to it
assigned value -1.
In case we manage to recover the link instead, a simple query is run on the SPARQL endpoint to test whether it is online or offline.
```
SELECT ?s
WHERE {?s ?p ?o .}
LIMIT 1
```
If we get the triple correctly in the answer, then
the SPARQL endpoint is declared active and a is assigned
value equal to 1. Otherwise, if errors occur during the query,
or no result is returned, then it is declared
offline and given value 0.

---

#### **RDF dump**
To check for the presence of the RDF dump we have three possible approaches:
1. We can analyze the metadata and check if in the resources field there are one or more resources with one of the following tags: ```application/rdf+xml```, ```text/turtle```, ```application/x-ntriples```, ```application/x-nquads```, ```text/n3```, ```rdf```,```text/rdf+n3```, ```rdf/turtle```.
2. Another method is to check inside the VoID file (if available). In this case we search for the triple having ```void:dataDump``` as its predicate.
3. Finally, the last way involves execution of a query on the SPARQL endpoint (if online). 
The query executed is as follows:
```
PREFIX void: <http://rdfs.org/ns/void#>
SELECT DISTINCT ?o
WHERE
{?s void:dataDump ?o}
```

Once the dump link has been retrieved, a simple HEAD request is made on the URL, to check whether it is online or not. If it is online, a value of 1 is given to the data, if offline 0 and if not present -1. 

---

#### **URIs dereferenciability**
5000 triples (which contain URIs) are randomly retrieved with this query:

```sql
SELECT DISTINCT ?s
WHERE {
?s ?p ?o
FILTER(isIRI(?s))
}
ORDER BY RAND()
LIMIT 5000
```

Then a GET request is performed for each of them, specifying it in the header
application/rdf+xml as accepted format. If it is returned
status code 200 then the resource is available, otherwise it comes
declared as unreachable. At the end of the test on all 5000
triple the following formula is applied to quantize the data, where
$U_g$ indicates the set of URIs that are tested:

$$
m_{def} = \frac{|Dereferencable(U_g)|}{|U_g|}
$$

---

#### **Inactive links**
All links present in the "resources" field in the metadata are recovered for the KG selected and a HEAD request is performed on each of this links. If there are links that are not active, the data is given a value of 0, otherwise 1.