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
3. [Trust](#trust)  
    3.1 [Reputation](#reputation)  
    3.2 [Believability](#believability)  
    3.3 [Verifiability](#verifiability)
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

### Performance
1. [Latency](#latency)
2. [Throughput](#throughput)

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

---

### **Licensing**

#### **Machine-readable license**
We can verify the presence of this type
license in two ways:
1. We look for it inside the VoID file, looking for the triple with the predicate ```dcterms: license```.
2. The other method involves executing query 4 on the
SPARQL endpoints. The other method involves executing the following query on the SPARQL endpoints:
```sql
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
```sql
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

```sql
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
```sql
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
3. [Wrong datatype](#wrong-datatype)
4. [Functional property violation](#functional-property-violation)
5. [Inverse functional property violation](#functional-property-violation)

### Consistency
1. [Number of entities defined as member of disjoint class](#number-of-entities-defined-as-member-of-disjoint-class)
2. [Misplaced classes](#misplaced-class)
3. [Misplaced properties](#misplaced-properties)
4. [Deprecated classe and properties](#deprecated-classes-and-deprecated-properties)
5. [Undefined classes](#undefined-classes)
6. [Undefined properties](#undefined-properties)
7. [Ontology Hijacking](#ontology-hijacking)

### Conciseness
1. [Intensional conciseness](#intensional-conciseness)
2. [Extensional conciseness](#extensional-conciseness)
---

### **Accuracy**

#### **Empty label**
For the calculation of this metric, we first recover the label in the KG with the follow query:
```sql
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
#### **Functional Property violation**
For the calcuation of this metric we have followed the definition given [here](https://www.w3.org/TR/owl-ref/#FunctionalProperty-def). For identify the functional property violation we first recover all triples that are a declaration of a functional property with the following query:
```sql
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT *
WHERE
{?s owl:FunctionalProperty ?o.}
```

At this point we verify that there isn't any triples in the KG that have the same subject but with different object, if this triple exist, the triple violate the functional property. With the following algorithm, we automatize the metric calculation.

```c
Data: list of all triples that declare a functional property
triplesFP and list of all the triples of the KG
Result: number of triples that violates the Functional property
violationFP ← 0;
while NOT at the end of triplesFP do
    tripla = read a triple from the triplesFP list;
    s = subject in the triple;
    o = object in the triple;
    while NOT at the end of triples do
        s2 = sobject of the triple;
        o2 = object in the triple;
        if s is equal to s2 AND o in not equal to o2 then
            violationFP ← violationFP +1;
        end
    end
end
```
After the calculation of the number of triples that violate the functional property we use the following formula to quantize the metric, where $T_{KG}$ is the set of all triples in the KG:

$$
m_{FP} = \frac{violationFP}{|T_{KG}|}
$$

---

#### **Inverse functional property violation**
For the calculation of this metric we have followed the definition given [here](https://www.w3.org/TR/owl-ref/#InverseFunctionalProperty-def). We first recover all the triples in the KG with the $owl:InverseFunctionalProperty$ predicate by using the following query:
```sql
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT *
WHERE
{?s owl:InverseFunctionalProperty ?o.}
```
Then with the following algorithm we obtain the number of triples that violate the inverse functional property.
```c
Data: list of triple that declare a inverse functional-property triplesIFP and list of all triplesin the KG triples
Result: number of triples that violate the inverse functional property violationIFP
violationIFP ← 0;
    while NOT at the end of triplesIFP do
        triple = read the triple from the triplesIFP list;
        s = subject in the triple;
        o = object in the triple;
        while NOT at the end of triples do
            s2 = subject in the triple in triples;
            o2 = object in the triple in triples;
            if o is equal to o2 AND s is not equal to s2 then
                violationIFP ← violationIFP +1;
            end
        end
    end
```
The following formula instead, allow us to quantize the metric (where $T_{KG}$ is the set with all the KG triples):

$$
m_{IFP} = 1.0 - \frac{violationIFP}{|T_{KG}|}
$$

---

### **Consistency**

#### **Number of entities defined as member of disjoint class**
For the calculation of this metric we first execute the following query on the SPARQL endpoint for recover all the triples with the $owl:disjointWith$ predicate:
```sql
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT DISTINCT (COUNT(?s) AS ?triples)
WHERE
{?s owl:disjointWith ?o.}
```
To obtain the final value of the metric, we need also the number of entities in the KG. To recover this number, we follow the same method described [here](insert refer here when understandability is available). Lastly, with the following formula we obtain the value of the metric (where $E_{KG}$ is the set of all KG entities and $disjV$ is the number of triples recovered with the previuos query).

$$
m_{disjV} = \frac{numDisj}{E_{KG}}
$$

---

#### **Misplaced class**
For this metric we have to check if there is any class (declared like this in the KG) that is used as property and this mean that is used as predicate in the triple. We first recover all the properties in the KG with the following query:

```sql
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT DISTINCT ?p
WHERE {
{ ?s ?p rdf:Property}
UNION
{?s ?p owl:DatatypeProperty}
UNION
{?s ?p skos:Property}
}
```
Then with the following algorithm we calculate the number of triples with this problem

<!--TODO: inserire algoritmo-->

In the end, the following formula allow us to quantize the metric:

$$
m_{mispP} = 1.0 - \frac{numMissP}{|T_{KG}|}
$$

#### **Misplaced properties**
In this case however we must ensure that values defined as properties are not used as classes. With the following query we obtain all the classes declared in the KG:

```sql
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT DISTINCT ?s
WHERE {?s rdf:type owl:Class}
```
With the following algorithm instead we count the number of triples that have this problem.

<!--TODO: Inserire algoritmo-->

Finally, the following formula help us to quantize the metric (where $T_{KG}$ is the set of all triples in the KG):

$$
m_{mispP} = 1.0 - \frac{numMissP}{T_{KG}}
$$


---

#### **Deprecated classes and deprecated properties**
For the calculation of this metric, we execute the following query that count the number of triples in the KG with the predicate ```owl:DeprecatedClass``` and ```owl:DeprecatedProperty```. Note that we rely on the fact that whoever created the dataset knows that that class or property is deprecated, but uses it by reporting it.

```sql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT DISTINCT ?s
WHERE{
{?s rdf:type owl:DeprecatedClass}
UNION
{?s rdf:type owl:DeprecatedProperty}
}
```
Then we quantize it with the following formula, in which $C_{KG}$ and P_{KG} are respectively the set of all classes and the set of all properties in the KG, and $numDeprecated$ is the value return by the previuos query,

$$
m_{deprec.} = 1.0 - \frac{numDeprecated}{|C_{KG} + P_{KG}|}
$$

---

#### **Undefined classes**
It is necessary to verify that there is no use of classes that have not been appropriately defined. With the following query we recover all classes and properties declarations that are executed.
```sql
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT DISTINCT ?s
WHERE {?s rdf:type ?o}
```

And then we use the following algorithm

<!--TODO: inserire algoritmo-->
This formula, where $T_{KG}$ is the set of all KG triples

$$
m_{undefC} = 1.0 - \frac{numUndefC}{T_{KG}}
$$

give us the metric value.

---

#### **Undefined properties**
The calculation of this metric is equal to the previous, but in this case we focus on the properties, that is, on the predicate in the triple.

<!-- TODO: inserire algoritmo-->

Similar to the previous case, the following formula allow us to quantize the metric, where $T_{KG}$ is the set of all KG triples.

$$
m_{undefP} 1.0 - \frac{numUndefP}{|T_{KG}|}
$$

#### **Ontology Hijacking**
We need the terms defined inside the KG, to check whether standard terms have been redefined. Let's recover all classes and properties declarations in the same way as done for the undefined classes and undefined properties, by using the same query used [here](#undefined-classes). Then we use the [Linked Open Vocabulary](https://lov.linkeddata.es/dataset/lov) [REST API](https://lov.linkeddata.es/dataset/lov/api) (LOV), to search if the selected one is a standard term. The following algorithm allow us to detect the problem:

<!--TODO: inserire algoritmo-->

If the problem is present, the data is assigned a value
1, otherwise 0.

---

### **Conciseness**
For the calculation of both metrics we use the probabilistic Bloom filter algorithm. For calculation of both types of values we are going to use this type of algorithm that helps us detect any duplicates in the data.

#### **Intensional conciseness**
In this case we need to check if there are any duplicate properties within the dataset. We use the following query for recover all the triples that are declared as properties in the KG.

```sql
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT DISTINCT ?s ?p
WHERE {
{ ?s ?p rdf:Property}
UNION
{?s ?p owl:DatatypeProperty}
UNION
{?s ?p skos:Property}
}
```
Once we have obtained the list of properties we can apply the following algorithm to detect any duplicates.

<!--TODO: inserire algoritmo-->

Finally, to obtain the value of Intentional conciseness, we use the following formula, where $duplicateP$ and $propertiesConcat$ come from the output of the previous algorithm:

$$
m_{intC} = 1.0 - \frac{duplicateP}{|propertiesConcat|}
$$


#### **Extensional conciseness**
In this case, instead of simply checking the duplication of properties, we will measure any redundancy between all the triples of the KG. First we retrieve all the data contained in the dataset.

```sql
SELECT *
WHERE{?s ?p ?o}
```
Then we apply the following algorithm:

<!--TODO: inserire algoritmo-->

In the end the value of extensional conciseness is given by the formula that follows, where $duplicates$ and $triplesConcat$ come as output from the previous algorithm.

---

## Trust

### Reputation
1. [PageRank](#pagerank)

### Believability
1. [Title](#title)
2. [Description](#description)
3. [Sources](#sources)
4. [Reliable provider](#reliable-provider)
5. [Trust value](#trust-value)

### Verifiability
1. [Vocabularies](#vocabularies)
2. [Authors](#authors)
3. [Contributors](#contributors)
4. [Publishers](#publishers)
5. [Sources](#sources)
6. [Signature](#signature)

---


### Reputation
#### **PageRank**
Since for the calculation of interlinking [here](#interlinking) we have built the graph containing all the KGs with the related external links, the function that calculates the PageRank on the node of interest (which corresponds to the KG we are analyzing) will be applied to this graph. The function used is the one made available by networkx and we pass it as input the ID of the KG whose PageRank we want to calculate. The function will return a value between 1 and 10. The closer the data is to 10, the more the KG has a high reputation and therefore of good quality.

---
### Believability
#### **Title**
To recover the title, we simply analyze the KG metadata, in
in particular the “title” field.

---

#### **Description**
The description however, as with the title, can be recovered
from the metadata and is present in the “Description” field.

---

#### **Sources**
By KG source we mean all relevant information from the provider. It is a field present within the metadata and is structured as a list of values containing: the web address, name and provider email. The field has the key “sources”.

---

#### Reliable provider
The presence in a list of reliable providers is verified by recovering the keywords associated with the KG. These are present in the metadata in the "keyword" field. Among the many values it contains,
there is also the one relating to the provider. Then, the list is traversed and each value is compared with a list of providers deemed reliable. Since there is still no a list of reliable provider in the LOD panorama, we build this list by including the most well-known providers in the panorama of LOD. The list can be seen in the following table and is not to be considered exhaustive and definitive.
|Provider|
|---|
|Wikipedia|
|Government|
|Bioportal|
|Bio2RDF|
|Academic|

---

#### **Trust value**
It is a score which is between 0 and 1 which helps the KG user to understand how much information about the believability is available.
In fact, this value is calculated as a weighted average based on how many of the following values are present: name, description, URL and presence in the reliable provider list. For each of these values, if the KG has it, 1 is assigned, otherwise 0. The sum is made and then divided by 4. The value obtained will be the trust value of the dataset.

---

### **Verifiability**

#### **Vocabularies**
For recover the vocabularies used in the KG we can use two different approach. The first is try to parse the VoID file if available and we have to search the triples with the $void:vocabulary$ triples. The second method is to use the following query on the SPARQL endpoint.

```sql
PREFIX void: <http://rdfs.org/ns/void#>
SELECT DISTINCT ?o
WHERE{?s void:vocabulary ?o }
```

---

#### **Authors**
Also the authors can be recovered via the VoID file or the SPARQL endpoint. In the VoID file we have to search the triples with the predicate equals to $dcterms:creator$. As alternative, we execute the following query on the SPARQL endpoint.

```sql
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT DISTINCT ?o
WHERE{
{?s dc:creator ?o }
UNION
{?s dcterms:creator ?o}
UNION
{?s foaf:maker ?o}
}
```
---

#### **Contributors**
This metric is recoverable by searching the $dcterms:contributor$ predicate in the VoID file or by executing the following query on the SPARQL endpoint:

```sql
PREFIX dcterms:<http://purl.org/dc/terms/>
SELECT DISTINCT ?o
WHERE {?s dcterms:contributor ?o.}
```

---

#### **Publishers**
The metric is calculated by searching the $dcterms:publisher$ predicate in the VoID file or by executing the following query on the SPARQL endpoint:

```sql
PREFIX dc: <http://purl.org/dc/elements/1.1/>
SELECT DISTINCT ?o
WHERE {?s dc:publisher ?o}
```

---

#### **Sources**
For this metric we analyze the KG metadata and in particular we get the value from the field that has as key $sources$ .

---

### **Signature**
To check and retrieve the signature on the KG if present, the following query is executed:

```sql
PREFIX swp:<http://www.w3.org/2004/03/trix/swp-2/>
SELECT ?s ?o
WHERE{
{?s swp:signature ?o}
UNION
{?s swp:authority ?o}
UNION
{?s swp:certificate ?o}
UNION
{?s swp:quotedBy ?o}
UNION
{?s swp:assertedBy ?o}
}
```
---

## Dataset dynamicity

### Currency
1. [Creation date](#creation-date)
2. [Modification date](#modification-date)
3. [Time since last modification](#time-since-last-modification)
4. [History of changes made](#history-of-changes-made)

### Volatility
1. [Update frequency](#update-frequency)

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

### **Volatility**

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

## Contextual

### Completeness
1. [Interlinking completeness](#interlinking-completeness)

### Amount of data
1. [Number of triples](#number-of-triples)
2. [Number of properties](#number-of-properties)
3. [Number of entities](#number-of-entities)

### **Completeness**

#### **Interlinking completeness**
For the calculation of the interlinking completeness
we count the total number of triples that are connected with other KGs. This occurs by analyzing the metadata and in particular the *external links* field, which contains a list of values in the form *key*-*value*, where the *key* is the id of the KG with which it is connected and the *value* is the number of triples. We analyze this list and we do the sum of all the values. Then we apply the following formula to obtain the interlinking completeness (where $triplesL$ is the number of triples linked and $T_{KG}$ is the set of all the triples in the KG):

$$
m_{intCompl} = \frac{triplesL}{T_{KG}}
$$

---

### **Amount of data**

#### **Number of triples**
To calculate the number of triples in the KG we can proceed in two ways. The first consists in recovering the data through the metadata, in particular the *triples* key. This method is only applied when actual triples cannot be counted by accessing the SPARQL endpoint. Because the metadata is not updated along with the content of the KG. The following query is used for count the number of triples: 
```sql
SELECT (COUNT(?s) AS ?triples)
WHERE { ?s ?p ?o }
```

#### **Number of properties**
We can only obtain this type of value by executing a SPARQL query. In particular, the number of properties is given to us by this query:

```sql
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
SELECT DISTINCT (COUNT(?o) AS ?triples)
WHERE {
{ ?o a rdf:Property}
UNION
{?o a owl:DatatypeProperty}
UNION
{?o a skos:Property}
UNION
{?o a owl:DatatypeProperty}
UNION
{?o a owl:AnnotationProperty}
UNION
{?o a owl:OntologyProperty}
UNION
{?o a rdfs:subPropertyOf}
UNION
{?o a rdfs:Property}
}
```

#### **Number of entities**
In this case we simply recover it by searching for the triple with $void:entities$ predicate inside the VoID file. As an alternative if there isn't a VoID file available, we execute the following query on the SPARQL endpoint. 

```sql
PREFIX void:<http://rdfs.org/ns/void#>
SELECT ?triples
WHERE {?s void:entities ?triples}
```

Both of these methods, however, are based on the assumption that the provider of the dataset insert a triple in the KG with this information. Often, however, this does not happen, so in the event that the information is not provided we use another method. We first recover the URI regex or pattern, we recover this information by doing the following query:

```sql
SELECT DISTINCT ?o
WHERE
{?s void:uriRegexPattern ?o}
```

or this for the URI pattern

```sql
PREFIX void: <http://rdfs.org/ns/void#>
SELECT DISTINCT ?o
WHERE {?s void:uriSpace ?o}
```
In case the regex is not available, but we only have the
URI space (which is not a regex), we transform it into a regex to use it for comparison. Once we got the regex we use the following query for count the number of entities:
```sql
SELECT (COUNT(?s) as ?triples)
WHERE{
{?s ?p ?o}
FILTER(regex(?s,"%s"))
}
```
(The %s parameter in the regex function is set with the regex that we obtained with the mechanisms indicated above.)


## Representational

### Representational-conciseness
1. [URIs length](#uris-length)
2. [Use of RDF structures](#rdf-structures)

### Representational-consistency
1. [Reuse of vocabularies](#reuse-of-vocabularies)
2. [Reuse of terms](#reuse-of-terms)

### Understandability
1. [Number of label](#number-of-labels)
2. [Presence of example](#presence-of-examples)
3. [URIs regex](#uris-regex)
4. [Vocabularies](#vocabularies-1)

### Interpretability
1. [Number of blank nodes](#number-of-blank-nodes)
2. [Use of RDF structures](#rdf-structures)

### Versatility
1. [Languages](#languages)
2. [Serialization formats](#serialization-formats)
3. [Access to the KG](#access-to-the-kg)


### **Representational-conciseness**

#### **URIs Length**
For the calculation of this metric we need all the KG triples. For recover it, we use the following query:

```sql
SELECT *
WHERE{?s ?p ?o}
```

Three separate values are created, so as to have the length of the subject, predicate and object URIs. The calculation proceeds by counting the number of characters and the average, maximum, minimum and standard deviation are maintained.

--- 

#### **Use of RDF structures**
In this case we check that there are no RDF data structures, in fact their use comes discouraged by W3C. To check their use we use the following query:
```sql
PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT (COUNT(?s) AS ?triples)
WHERE{
{?s rdf:type rdf:List }
UNION
{?s rdf:type rdf:Statement}
UNION
{?s rdf:type rdf:Alt}
UNION
{?s rdf:type rdf:Bag}
UNION
{?s rdf:type rdf:Seq}
UNION
{?s rdf:type rdf:Container}
UNION
{?s rdf:subject ?o}
UNION
{?s rdf:predicate ?o}
UNION
{?s rdf:object ?o}
UNION
{?s rdfs:member ?o}
UNION
{?s rdf:first ?o}
UNION
{?s rdf:rest ?o}
UNION
{?s rdf:_’[0-9]+’}
}
```
If the query returns even just one result, it means we have
a triple that declares the use of RDF structures and therefore
we attribute a value of 1 to the data (i.e. they are used), 0 otherwise.


### **Representational-consistency**
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

### Understandability

#### **Number of labels**
For the calculation of this metric we execute the following query on the SPARQL endpoint
```sql
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
}
```
Once we have obtained the $numLabel$ value we apply the following formula to quantize the metric:

$$
m_{label} = \frac{numLabel}{T_{KG}} * 100
$$

#### **Presence of examples**
We check if in the KG resources provided there are some examples of SPAQRL query or other examples on how to use the KG. To obtain this type of data we simply need to analyze the "resources" field within the metadata and search for resources that have the *example* tag. The metric is quantized by assigning 1 if there are examples, 0 otherwise.

#### **URIs regex**
To obtain the URIs regex we follow the same steps that we have illustred [here](#number-of-entities).

#### **Vocabularies**
For the calculation of this metric we use the same method illustred [here](#vocabularies).

---

### **Interpretability**

#### **Number of blank nodes**
To count the number of nodes we use the following query:
```sql
SELECT (COUNT(?bnode) AS ?triples)
WHERE { ?bnode ?p ?o
FILTER (isBlank(?bnode))}
```
The query output is the number of blank nodes in the KG, and is used to understand the incidence of blank nodes compared to other resources.

---
#### **RDF structures**
For the calculation of this metric we use the same method described [here](#use-of-rdf-structures).

---
### Versatility

#### **Languages**
To check if there are different languages supported (and this is indicated), we use the following query:

```sql
SELECT DISTINCT ?triples
WHERE{
?s ?p ?o.
BIND(LANG(?o) as ?triples)
}
```
---

#### **Serialization formats**
We calculate this metric bby using two different methods: the first is to look for triples with *void:feature* predicate within the VoID file, the second one involves executing the following query on the SPARQL endpoint:

```sql
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
SELECT DISTINCT ?o
WHERE{
{?s void:feature ?o}
UNION
{?s dcat:mediaType ?o}
}
```

---

#### **Access to the KG**
In this metric we insert the available links to access to the KG, only if this links are online. The metric is then quantized by giving value 1 in the case there is at least one working access method, 0 otherwise.