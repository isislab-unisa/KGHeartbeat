---
#
# By default, content added below the "---" mark will appear in the home page
# between the top bar and the list of recent posts.
# To change the home page layout, edit the _layouts/home.html file.
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
#
layout: home
---
Little introduction

# Index
1. [Accessibility](#accessibility)  
    1.1 [Availability](#availability)  
    1.2 [Licensing](#licensing)  
    1.3 [Interlinking](#interlinking)  
    1.4 [Security](#security)
2. [Intrinsic](#intrinsic)
    2.1 [Accuracy](#accuracy)
    2.2 [Consistency](#consistency)
    2.3 [Conciseness](#conciseness)

---

## Accessibility

### Availability
1. [SPARQL endpoint](#sparql-endpoint)
2. [RDF Dump](#rdf-dump)
3. [URIs dereferenciability](#uris-dereferenciability)
4. [Inactive links](#inactive-links)

### Licensing
1. [Machine-readable license](#machine-readable-license)
2. [Human-readable license](#human-readable-license)
3. [License in the metadata](#license-in-the-metadata)

### Interlinking
1. [Degree of connection](#degree-of-connection)
2. [Clustering coefficient](#clustering-coefficient)
3. [Centrality](#centrality)
4. [Number of *same as* chains](#number-of-same-as-chains)

### Security
1. [Authentication](#authentication)
2. [Use HTTPS](#use-https)

--- 
### **Availability**

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

```
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

---

### **Licensing**

#### **Machine-readable license**
We can verify the presence of this type
license in two ways:
1. We look for it inside the VoID file, looking for the triple with the predicate ```dcterms: license```.
2. The other method involves executing query 4 on the
SPARQL endpoints. The other method involves executing the following query on the SPARQL endpoints:
```
PREFIX cc: <http://creativecommons.org/ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX schema: <http://schema.org/>
PREFIX doap: <http://usefulinc.com/ns/doap#>
PREFIX xhtml: <http://www.w3.org/1999/xhtml#>
SELECT DISTINCT ?o
WHERE{
{?s ?p ?o}
VALUES (?p) {
(dct:license) (dct:rights)(cc:license)
(dc:license)(schema:license)(doap:license)
(xhtml:license)(dc:rights)
}
}
```
Because queries with the VALUES function may not be supported
from SPARQL endpoints that are based on SPARQL 1.0,
alternative queries are provided which instead use the UNION.

---
#### **Human-readable license**
For this type of license we must access the triples of the KG to verify that there is a label understandable to the user on a triple. All the labels contained in the KG are recovered and then filtered using the following regex: 

```. ∗(licensed?|copyrighte?d?).∗(under|grante?d?|rights?)```

The complete query that runs on the SPARQL endpoint is:
```
PREFIX rdf:<http://www.w3.org/2000/01/rdf-schema#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX schema: <http://schema.org/>
SELECT ?o
WHERE{
{?s rdfs:label ?o}
UNION
{?s dct:description ?o}
UNION
{?s rdfs:comment ?o}
UNION
{?s rdfs:label ?o}
UNION
{?s schema:description ?o}
FILTER
regex(?o,
".*(licensed?|copyrighte?d?).*(under|grante?d?|rights?).*")
}
```

---
#### **License in the metadata**
In this case, we simply analyze the KG metadata and the value of the ```license``` key in it.

---

### **Interlinking**
For the caluculation of the Degree of connection, clustering coefficient and centrality, we utilize a tool for network measurement. We use a Python library named ```networkx``` for our purpose. In KGHeartbeat, the module called [```Graph.py```](https://github.com/isislab-unisa/KGHeartbeat/blob/main/Graph.py) is responsable to the caluculation of these three value. In particular, it is responsible for creating the graph that contains all the KGs that can be retrieved automatically from Internet. The external connections for every KG are analyzed (field
present in the metadata under the "external links" key) and for each connection we find, we insert the node inside the graph, labeled with the id of the KG and insert the edge with a weight equal to the number of triples with which it is connected to the other KGs. The process is then iterated for every KGs recovered. At the end of these process, on this Graph we calculate: *Degree of connection*, *Clustering coefficient* and *Centrality*. 

---
#### **Degree of connection**
The degree of connection is calculated by counting the number of edge that the KG has in the graph constructed as explained before.

---
#### **Clustering coefficient**
The clustering coefficient (specifically here we calculate the local clustering coefficient), measures the degree to which the node tends to form a clique with its neighbors and is a value in the range [0-1].

---
#### **Centrality**
Centrality allows us to understand how important the KG is inside the graph and it is also a value between [0-1]. A higher centrality means a higher importance of the node, that is, it is involved in many connections. Instead, the lower it is, the more it means that those node is in the peripheral areas of the graph.

---
#### **Number of *same as* chains**
In this case we use the following query which counts the number of triples that have the ```owl:sameAs``` predicate.

```
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT (COUNT(?o) AS ?triples)
WHERE {
?s owl:sameAs ?o
}
```

---

### **Security**
For the calculation of the following two metrics we will need the SPARQL endpoint to be present and active see how [here](#sparql-endpoint).
#### **Authentication**
To check this metric we use the same query used to test the availability of the SPARQL endpoint (see [here](#sparql-endpoint)), but in this case we check if the status code 401 is returned to us.

---

#### **Use HTTPS**
To check if the HTTPS protocol is used, we check if
the link provided to us is on HTTPS protocol and works. If the link is provided in HTTP, then we check if there is an automatic redirect to HTTPS (very common practice). To do this we send an initial request to the HTTP link with a GET, using the Python requests library. If there is a redirect, on the response object that is returned to us, we call the ```geturl()``` method, which contains the link of the last redirect that was executed (if it is carried out). At this point we check if the link obtained is in HTTPS and is working. The last method is to try to force the
request on HTTPS protocol by modifying the link of the SPARQL endpoint and checking the response received.

---
### Performance
The values calculated in this case are latency and throughput. Since they are highly variable tests, they are repeated several times and the mean, standard deviation, maximum and minimum are calculated. In fact, the values could vary due to the difference in performance of our network over time or the load of the server where the SPARQL endpoint is located (as well as the performance of the server network itself).

#### **Latency**
The test is repeated 5 times and involves the execution of one
simple query that retrieves a generic triple of the dataset and comes
measured the time between the request for the triple and when
the answer is actually returned to us.
The query executed is as follows:
```
SELECT *
WHERE {?s ?p ?o .}
LIMIT 1
```

---
#### **Throughput**
Also in this case the test is repeated 5 times and we use the same previous query. But in this case we see in a second how many requests we can complete. The query executes in a while loop that stops after one second, and a count counter is incremented each time the query returns the result. At the end of each test, this variable will contain the number of requests and responses completed.

---
## Intrinsic

### Accuracy
1. [Empty label](#empty-label)
2. [Whitespace at the beginnig or end of the label](#whitespace-at-the-beginnig-or-end-of-the-label)
3. Wrong datatype
4. Functional propery violation
5. Inverse functional property violation

### Consistency

### Conciseness

---

### **Accuracy**

#### **Empty label**
For the calculation of this metric, we first recover the label in the KG with the follow query:
```
PREFIX skosxl:<http://www.w3.org/2008/05/skos-xl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX awol: <http://bblfish.net/work/atom-owl/2006-06-06/#>
PREFIX wdrs: <http://www.w3.org/2007/05/powder-s#>
PREFIX schema: <http://schema.org/>
SELECT (COUNT(?o) AS ?triples)
WHERE{
{?s rdfs:label ?o}
UNION
{?s foaf:name ?o}
UNION
{?s skos:prefLabel ?o}
UNION
{?s dcterms:title ?o}
UNION
{?s dcterms:decription ?o}
UNION
{?s rdfs:comment ?o}
UNION
{?s awol:label ?o}
UNION
{?s dcterms:alternative ?o}
UNION
{?s skos:altLabel ?o}
UNION
{?s skos:note ?o}
UNION
{?s wdrs:text ?o}
UNION
{?s skosxl:altLabel ?o}
UNION
{?s skosxl:hiddenLabel ?o}
UNION
{?s skosxl:prefLabel ?o}
UNION
{?s skosxl:literalForm ?o}
UNION
{?s schema:name ?o}
UNION
{?s schema:description ?o}
UNION
{?s schema:alternateName ?o}
```
We have a lot of predicates beacuse we have different mechanism to attach a label on a triple. All the labels recovered are compared with the empty string. If we found an empty label, then we increment a counter named ```emptyAnnotation```. At the end of the process we use the follow formula to to quantize the metric, where $L_{KG}$ is the number of KG labels:

$$
m_{label} = 1.0 - \frac{emptyAnnotation}{|L_{KG}|} 
$$

---

#### **Whitespace at the beginnig or end of the label**
Always using the query to retrieve all the labels on the triples (which we saw [here](#empty-label)), but this time scrolling through the different labels we go to apply the strip() function on each of the labels, Then, the string obtained is compared with the one before applying the function and if they are the same, it means that the label did not present the problem of spaces, otherwise a $wSP$ counter is incremented. At the end of the process, the following formula is applied to obtain the value of the data, where $L_{KG}$ is the number of KG labels.
$$
m_{wsLabel} = 1.0 - \frac{wSP}{|L_{KG}|}
$$

---

#### **Wrong datatype**
In this case we used the W3C documentation available [here](https://www.w3.org/TR/xmlschema11-2/). From this document, in addition to the data types, for each of them the regex has also been indicated which defines the range of values that it can take on. In our application an hash table was therefore created, where each entry is made up of a key, which is one of the data types, while the value is the corresponding regex which determines the domain. At this point we just have to catch up
all triples from the KG and filter out those that contain a literal to perform the type checking (the check can also be done directly with a query on the SPARQL endpoint, but this often leads to overloading and the query might fail). The value calculation mechanism is given by the following pseudo code.

```c
Data: triples list triplesLi
Result: number of malformed triples malformedLiteral
malformedLiteral ← 0;
while NOT at the end of triplesLi do
    tripla = read triple from triplesLi;
    o = object in the triple ;
    if o is a literal then
        dataType = datatype key returned with the literal;
        regex = call the get in the hash table by using dataType as key
        if o NOT satisfy regex then
            malformedLiteral ← malformedLiteral +1;
        end
    end
end
```

## Trust

### Reputation
### Believability
### Verifiability
### Objectivity

## Dataset dynamicity

### Currency
### Volatility
### Timeliness

## Contextual

### Completeness
### Amount of data
### Relevancy

## Representational

### Representational-conciseness
### Representational-consistency
### Understandability
### Interpretability
### Versatility