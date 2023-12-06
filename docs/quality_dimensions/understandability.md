---
title: Representational category
---

## Understandability
1. [Human-readable labelling of classes, properties and entities by providing rdfs:label](#human-readable-labelling-of-classes-properties-and-entities-by-providing-rdfslabel)
2. [Indication of metadata about a dataset](#indication-of-metadata-about-a-dataset)
3. [Indication of an exemplary SPARQL query](#indication-of-an-exemplary-sparql-query)
4. [Indication of a regular expression that matches the URIs of a dataset](#indication-of-a-regular-expression-that-matches-the-uris-of-a-dataset)
5. [Indication of the vocabularies used in the dataset](#indication-of-the-vocabularies-used-in-the-dataset)

#### **Human-readable labelling of classes, properties and entities by providing rdfs:label**
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
m_{label} = \frac{numLabel}{|T_{KG}|} * 100
$$

#### **Indication of an exemplary SPARQL query**
We check if in the KG resources provided there are some examples of SPAQRL query or other examples on how to use the KG. To obtain this type of data we simply need to analyze the "resources" field within the metadata and search for resources that have the *example* tag. The metric is quantized by assigning 1 if there are examples, 0 otherwise.

#### **Indication of a regular expression that matches the URIs of a dataset**
To obtain the URIs regex we follow the same steps that we have illustred [here](./amount_of_data#number-of-entities). To quantize the metric, if a regex is indicated, we assign 1 to this metric, 0 otherwise.

#### **Indication of the vocabularies used in the dataset**
For the calculation of this metric and quantization we use the same method illustred [here](./verifiability#vocabularies).


### **Indication of metadata about a dataset**

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
