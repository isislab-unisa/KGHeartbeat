---
#
# By default, content added below the "---" mark will appear in the home page
# between the top bar and the list of recent posts.
# To change the home page layout, edit the _layouts/home.html file.
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
#
layout: home
---
# Introduction
Little introduction

# Index
1. [Accessibility](#accessibility)  
    1.1 [Availability](#availability)  
    1.2 [Licensing](#licensing)  
    1.3 [Interlinking](#interlinking)  
    1.4 [Security](#security)

---

## Accessibility

### Availability
1. [SPARQL endpoint](#sparql-endpoint)
2. [RDF Dump](#rdf-dump)
3. [URIs dereferenciability](#uris-dereferenciability)
4. [Inactive links](#inactive-links)

#### **SPARQL endpoint**
A simple query is run on the sparql endpoint to test whether it is online or offline.
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

### Licensing
### Interlinking
### Security
### Performance

## Intrinsic

### Accuracy
### Consistency
### Conciseness

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