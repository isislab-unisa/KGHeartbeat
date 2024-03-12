# From CSV to KG with the LLMs
If you are interested to have the data quality computed by KGHeartBeat as a Knowledge Graph, here it is described how it can be obtained by using LLMs (in this example **chatGPT 3.5** will be used), starting from the csv returned by KGHeartBeat and by using the [Data Quality Vocabulary Ontology](https://www.w3.org/TR/vocab-dqv/) in TTL format.
The csv with the data quality used in this examples are available in the [Full](./Full/) folder and in the [Light](./Light/) folder, so as to allow reproducibility of the example. In this example, we use the CSV in the Light folder because the full csv returned by KGHearBeat contains a lot of data due to the presence of several columns populated with a list of values, such as the list of used vocabularies. We needed to replace the original versions of CSV returned by
KGHeartBeat with a light version replacing lists with their size, this is to avoid the character limit of chatGPT.
We consider 3 use case as example.
 1. [Single Dimension, Multiple Metrics: the Availability Case](#single-dimension-multiple-metrics-the-availability-case).
 2. [Single Dimension Category, Multiple Dimensions and Multiple Metrics: the Trust Case](#single-dimension-category-multiple-dimensions-and-multiple-metrics-the-trust-case).
 3. [Different dimensions categories cases](#different-dimensions-categories-cases).
---

 ## Single Dimension, Multiple Metrics: the Availability Case
### Input to chatGPT
Consider the following csv entitled "only-availability.csv": *PASTE CSV FILE CONTENT*

Consider the following ontology in ttl format entitled "dqv.ttl": *PASTE ONTOLOGY IN TTL FORMAT*

Can you model the "only-availability.csv" file content according to the "dqv.ttl" ontology and return the resulting triples in rdf format?

### ChatGPT output
```rdf
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix vann:    <http://purl.org/vocab/vann/> .
@prefix foaf:    <http://xmlns.com/foaf/0.1/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix qb:      <http://purl.org/linked-data/cube#> .
@prefix daq:     <http://purl.org/eis/vocab/daq#> .
@prefix voaf:    <http://purl.org/vocommons/voaf#> .
@prefix oa:      <http://www.w3.org/ns/oa#> .
@prefix duv:     <http://www.w3.org/ns/duv#> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix dqv:     <http://www.w3.org/ns/dqv#> .

# Define individuals for each knowledge graph
:d1 a dqv:QualityMeasurementDataset;
    rdfs:label "Czech statistical classification of economic activities in the European Community (CZ-NACE)" .

:d2 a dqv:QualityMeasurementDataset;
    rdfs:label "DBpedia in French" .

:d3 a dqv:QualityMeasurementDataset;
    rdfs:label "EEA Reporting Obligations Database" .

:d4 a dqv:QualityMeasurementDataset;
    rdfs:label "Institutions of public power of the Czech Republic" .

:d5 a dqv:QualityMeasurementDataset;
    rdfs:label "List of Czech data boxes" .

:d6 a dqv:QualityMeasurementDataset;
    rdfs:label "Open Data from the Italian National Research Council" .

:d7 a dqv:QualityMeasurementDataset;
    rdfs:label "TAXREF-LD: Linked Data French Taxonomic Register" .

:d8 a dqv:QualityMeasurementDataset;
    rdfs:label "Tourpedia" .

:d9 a dqv:QualityMeasurementDataset;
    rdfs:label "URIBurner" .

:d10 a dqv:QualityMeasurementDataset;
    rdfs:label "tags2con delicious" .

# Define quality dimensions
:dqv:precision a dqv:Dimension;
    skos:prefLabel "Precision" .

# Define quality metrics (using general terms, since specific metrics are not provided)
:dqv:metric1 a dqv:Metric;
    rdfs:label "Availability_sparqlEndpoint" .

:dqv:metric2 a dqv:Metric;
    rdfs:label "Availability_RDFDumpM" .

:dqv:metric3 a dqv:Metric;
    rdfs:label "Availability_RDFDumpQ" .

:dqv:metric4 a dqv:Metric;
    rdfs:label "Availability_inactiveLinks" .

:dqv:metric5 a dqv:Metric;
    rdfs:label "Availability_uriDef" .

:dqv:metric6 a dqv:Metric;
    rdfs:label "Availability_voidAvailability" .

:dqv:metric7 a dqv:Metric;
    rdfs:label "totalScore" .

:dqv:metric8 a dqv:Metric;
    rdfs:label "normalizedScore" .

:dqv:metric9 a dqv:Metric;
    rdfs:label "availabilityScoreValue" .

# Define quality measurements for each knowledge graph
:d1_measure a dqv:QualityMeasurement;
    dqv:isMeasurementOf :dqv:metric1;
    dqv:value "Available" .

:d1_measure2 a dqv:QualityMeasurement;
    dqv:isMeasurementOf :dqv:metric2;
    dqv:value "-1" .

# (Repeat similar patterns for other metrics and knowledge graphs)

# Link quality measurements to their corresponding datasets
:d1 dqv:hasQualityMeasurement :d1_measure, :d1_measure2 .

# (Repeat similar patterns for other knowledge graphs and quality measurements)

# Define additional triples based on your specific needs and details from the ontology.

```
We can improve the quality of the obtained RDF by specifying how the columns are structured. Suppose we are only interested to DBpedia in French. 

### Input to chatGPT
Considering that all the columns listed in the "only_availability.csv" file having the name starting with "availability_" are metrics of the availability dimension which is one of the accessibility dimensions, the column entitle "availabilityScoreValue" is the value corresponding to the availability dimension, and you can ignore the other columns ending with score,  can you model the data contained in "only_availability.csv" file and related to the KG entitled "DBpedia in French" according to the "dqv.ttl" ontology and return the complete and detailed set of resulting triples in rdf format both reporting the score of the availability dimension and detailing all the metrics' measurements?

### ChatGPT output
```rdf
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix vann:    <http://purl.org/vocab/vann/> .
@prefix foaf:    <http://xmlns.com/foaf/0.1/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix qb:      <http://purl.org/linked-data/cube#> .
@prefix daq:     <http://purl.org/eis/vocab/daq#> .
@prefix voaf:    <http://purl.org/vocommons/voaf#> .
@prefix oa:      <http://www.w3.org/ns/oa#> .
@prefix duv:     <http://www.w3.org/ns/duv#> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix dqv:     <http://www.w3.org/ns/dqv#> .

# Define individuals for the DBpedia in French knowledge graph
:dbpediafr a dqv:QualityMeasurementDataset;
    rdfs:label "DBpedia in French" .

# Define quality dimensions
:dqv:accessibility a dqv:Dimension;
    skos:prefLabel "Accessibility" .

:dqv:availability a dqv:Dimension;
    skos:prefLabel "Availability" ;
    rdfs:subClassOf dqv:accessibility .

# Define quality metrics for the DBpedia in French knowledge graph
:dbpediafr_metric1 a dqv:Metric;
    rdfs:label "availability_sparqlEndpoint" ;
    rdfs:subClassOf dqv:accessibility .

:dbpediafr_metric2 a dqv:Metric;
    rdfs:label "availability_RDFDumpM" ;
    rdfs:subClassOf dqv:accessibility .

:dbpediafr_metric3 a dqv:Metric;
    rdfs:label "availability_RDFDumpQ" ;
    rdfs:subClassOf dqv:accessibility .

:dbpediafr_metric4 a dqv:Metric;
    rdfs:label "availability_inactiveLinks" ;
    rdfs:subClassOf dqv:accessibility .

:dbpediafr_metric5 a dqv:Metric;
    rdfs:label "availability_uriDef" ;
    rdfs:subClassOf dqv:accessibility .

:dbpediafr_metric6 a dqv:Metric;
    rdfs:label "availability_voidAvailability" ;
    rdfs:subClassOf dqv:accessibility .

# Define availability dimension with its value
:dbpediafr_availability a dqv:QualityMeasurement;
    dqv:isMeasurementOf dqv:availability;
    dqv:value "0.915" .

# Define quality measurements for each metric
:dbpediafr_measure1 a dqv:QualityMeasurement;
    dqv:isMeasurementOf :dbpediafr_metric1;
    dqv:value "Available" .

:dbpediafr_measure2 a dqv:QualityMeasurement;
    dqv:isMeasurementOf :dbpediafr_metric2;
    dqv:value "1" .

:dbpediafr_measure3 a dqv:QualityMeasurement;
    dqv:isMeasurementOf :dbpediafr_metric3;
    dqv:value "True" .

:dbpediafr_measure4 a dqv:QualityMeasurement;
    dqv:isMeasurementOf :dbpediafr_metric4;
    dqv:value "False" .

:dbpediafr_measure5 a dqv:QualityMeasurement;
    dqv:isMeasurementOf :dbpediafr_metric5;
    dqv:value "0.66" .

:dbpediafr_measure6 a dqv:QualityMeasurement;
    dqv:isMeasurementOf :dbpediafr_metric6;
    dqv:value "VoID file offline" .

# Link quality measurements to the DBpedia in French dataset
:dbpediafr dqv:hasQualityMeasurement :dbpediafr_availability, :dbpediafr_measure1, :dbpediafr_measure2, :dbpediafr_measure3, :dbpediafr_measure4, :dbpediafr_measure5, :dbpediafr_measure6 .

# Define additional triples based on your specific needs and details from the ontology.
```
---

 ## Single Dimension Category, Multiple Dimensions and Multiple Metrics: the Trust Case
### Input to chatGPT
Consider the following csv entitled "only-related-to-trust.csv": *PASTE CSV FILE CONTENT*

Consider the following ontology in ttl format entitled "dqv.ttl": PASTE ONTOLOGY IN TTL FORMAT

Let's consider that the csv file contains all dimensions concerning the trust category and for each dimension, the file details its metrics. To distinguish metrics and dimension, consider that all the file column names follow the pattern of DIMENSION_METRIC. With these premises, can you model the data contained in csv file according to the "dqv.ttl" ontology and return the complete and detailed set of resulting triples in rdf format?

### chatGPT output
```rdf
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dqv:     <http://www.w3.org/ns/dqv#> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .

<http://example.org/resource/cznace> a dqv:QualityMeasurement ;
    dqv:computedOn <http://example.org/resource/cznace/dataset> ;
    dqv:hasQualityMetadata <http://example.org/resource/cznace/metadata> .

<http://example.org/resource/cznace/metadata> a dqv:QualityMetadata ;
    dqv:hasQualityAnnotation <http://example.org/resource/cznace/annotation> .

<http://example.org/resource/cznace/annotation> a dqv:QualityAnnotation ;
    dqv:hasQualityMeasurement <http://example.org/resource/cznace/measurement> .

<http://example.org/resource/cznace/measurement> a dqv:QualityMeasurement ;
    dqv:isMeasurementOf <http://example.org/resource/cznace/reputationPageRank> ;
    dqv:value "None" .

<http://example.org/resource/cznace/reputationPageRank> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/cznace/reputationDimension> ;
    dqv:value "None" .

<http://example.org/resource/cznace/reputationDimension> a dqv:Dimension ;
    dqv:inCategory <http://example.org/resource/cznace/trustCategory> ;
    dqv:value "Czech statistical classification of economic activities in the European Community (CZ-NACE)" .

<http://example.org/resource/cznace/trustCategory> a dqv:Category ;
    dqv:value "Czech statistical classification of economic activities in the European Community (CZ-NACE)" .
```
It correctly recognizes category, dimensions and metrics. However, it stops to a single metric and to a single KG. 

### Input to chatGPT
Considering that the csv file contains all dimensions concerning the trust category and for each dimension, the file details its metrics. To distinguish metrics and dimension, consider that all the file column names follow the pattern of DIMENSION_METRIC. All the column names ending with ScoreValue represent the score attached to the dimension reported as prefix of the column name. 
With these premises, can you model the data contained in csv file related to the KG entitled "DBpedia in French" according to the "dqv.ttl" ontology and return the complete and detailed set of resulting triples in rdf format both reporting the score of all the dimensions and detailing all their metrics' measurements?

### ChatGPT output
```
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dqv:     <http://www.w3.org/ns/dqv#> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .

# Resource URIs
<http://example.org/resource/dbpediafr> a dqv:QualityMeasurement ;
    dqv:computedOn <http://example.org/resource/dbpediafr/dataset> ;
    dqv:hasQualityMetadata <http://example.org/resource/dbpediafr/metadata> .

<http://example.org/resource/dbpediafr/metadata> a dqv:QualityMetadata ;
    dqv:hasQualityAnnotation <http://example.org/resource/dbpediafr/annotation> .

<http://example.org/resource/dbpediafr/annotation> a dqv:QualityAnnotation ;
    dqv:hasQualityMeasurement <http://example.org/resource/dbpediafr/measurement> .

<http://example.org/resource/dbpediafr/measurement> a dqv:QualityMeasurement ;
    dqv:isMeasurementOf <http://example.org/resource/dbpediafr/reputationPageRank> ;
    dqv:value "0.0009152178830736873" .

<http://example.org/resource/dbpediafr/reputationPageRank> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/reputationDimension> ;
    dqv:value "DBpedia in French" .

<http://example.org/resource/dbpediafr/reputationDimension> a dqv:Dimension ;
    dqv:inCategory <http://example.org/resource/dbpediafr/trustCategory> ;
    dqv:value "Reputation" .

<http://example.org/resource/dbpediafr/trustCategory> a dqv:Category ;
    dqv:value "Trust" .

# Add similar triples structure for other dimensions and metrics related to DBpedia in French...

Please, add similar triples structure for other dimensions and metrics related to DBpedia in French
```

### Input to chatGPT
Let's focus on the Believability dimension. Can you provide with a complete rdf concerning the KG entitled "DBpedia in French" modeling it according to the "dqv.ttl" ontology and return the complete and detailed set of resulting triples in rdf format both reporting the score of all the dimensions and detailing all their metrics' measurements?

### ChatGPT output
```
# Believability Dimension
<http://example.org/resource/dbpediafr/believabilityScoreValue> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/believabilityDimension> ;
    dqv:value "0.0009152178830736873" .

<http://example.org/resource/dbpediafr/believabilityDimension> a dqv:Dimension ;
    dqv:inCategory <http://example.org/resource/dbpediafr/trustCategory> ;
    dqv:value "Believability" .

# Believability Metrics
<http://example.org/resource/dbpediafr/believability_titleScoreValue> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/believability_titleDimension> ;
    dqv:value "Czech statistical classification of economic activities in the European Community (CZ-NACE)" .

<http://example.org/resource/dbpediafr/believability_titleDimension> a dqv:Dimension ;
    dqv:inCategory <http://example.org/resource/dbpediafr/trustCategory> ;
    dqv:value "Believability_title" .

<http://example.org/resource/dbpediafr/believability_descriptionScoreValue> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/believability_descriptionDimension> ;
    dqv:value "Czech statistical classification of economic activities in the European Community (CZ-NACE)" .

<http://example.org/resource/dbpediafr/believability_descriptionDimension> a dqv:Dimension ;
    dqv:inCategory <http://example.org/resource/dbpediafr/trustCategory> ;
    dqv:value "Believability_description" .

<http://example.org/resource/dbpediafr/believability_URIScoreValue> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/believability_URIDimension> ;
    dqv:value "https://linked.opendata.cz/zdroje/datové-sady/čsú/číselníky/cz-nace" .

<http://example.org/resource/dbpediafr/believability_URIDimension> a dqv:Dimension ;
    dqv:inCategory <http://example.org/resource/dbpediafr/trustCategory> ;
    dqv:value "Believability_URI" .
```

### Input to chatGPT
Please, complete it
### chatGPT output

```rdf
# Believability Metrics (continued)
<http://example.org/resource/dbpediafr/believability_reliableProviderScoreValue> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/believability_reliableProviderDimension> ;
    dqv:value "True" .

<http://example.org/resource/dbpediafr/believability_reliableProviderDimension> a dqv:Dimension ;
    dqv:inCategory <http://example.org/resource/dbpediafr/trustCategory> ;
    dqv:value "Believability_reliableProvider" .

<http://example.org/resource/dbpediafr/believability_trustValueScoreValue> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/believability_trustValueDimension> ;
    dqv:value "1.0" .

<http://example.org/resource/dbpediafr/believability_trustValueDimension> a dqv:Dimension ;
    dqv:inCategory <http://example.org/resource/dbpediafr/trustCategory> ;
    dqv:value "Believability_trustValue" .
```

### Input to chatGPT
Please, complete it
### chatGPT output
```rdf
# Believability Metrics (continued)
<http://example.org/resource/dbpediafr/believabilityScoreValue> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/believabilityDimension> ;
    dqv:value "0.0009152178830736873" .

<http://example.org/resource/dbpediafr/believabilityDimension> a dqv:Dimension ;
    dqv:inCategory <http://example.org/resource/dbpediafr/trustCategory> ;
    dqv:value "Believability" .

# Now, let's add the Believability dimension with its score
<http://example.org/resource/dbpediafr/trustCategory/believability> a dqv:Category ;
    rdfs:label "Believability" .

<http://example.org/resource/dbpediafr/trustCategory/believabilityScoreValue> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/trustCategory/believability> ;
    dqv:value "0.0009152178830736873" .

# Finally, add the Quality Measurement Dataset
<http://example.org/resource/dbpediafr/qualityMeasurementDataset> a dqv:QualityMeasurementDataset ;
    dqv:hasQualityMeasurement <http://example.org/resource/dbpediafr/believabilityDimension> ,
        <http://example.org/resource/dbpediafr/believability_reliableProviderDimension> ,
        <http://example.org/resource/dbpediafr/believability_trustValueDimension> ,
        ... (add URIs for other dimensions and metrics under Believability) ;
    dqv:computedOn <http://example.org/resource/dbpediafr> 
```

### Input to chatGPT
Let's focus on the currency dimension. can you provide with a complete rdf concerning the KG entitled "DBpedia in French" modeling it according to the "dqv.ttl" ontology and return the complete and detailed set of resulting triples in rdf format both reporting the score of all the dimensions and detailing all their metrics' measurements?
### ChatGPT output
```
# Currency Metrics
<http://example.org/resource/dbpediafr/currency_creationDate> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/currencyDimension> ;
    dqv:value "2024-01-28" .

<http://example.org/resource/dbpediafr/currency_modificationDate> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/currencyDimension> ;
    dqv:value "2024-01-28" .

<http://example.org/resource/dbpediafr/currency_percentageUpData> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/currencyDimension> ;
    dqv:value "6.33299407140442e-05%" .

<http://example.org/resource/dbpediafr/currency_timePassed> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/currencyDimension> ;
    dqv:value "242" .

# Currency Dimension
<http://example.org/resource/dbpediafr/currencyDimension> a dqv:Dimension ;
    dqv:inCategory <http://example.org/resource/dbpediafr/trustCategory> ;
    dqv:value "Currency" .

# Currency Category with its score
<http://example.org/resource/dbpediafr/trustCategory/currency> a dqv:Category ;
    rdfs:label "Currency" .

<http://example.org/resource/dbpediafr/trustCategory/currencyScoreValue> a dqv:Metric ;
    dqv:inDimension <http://example.org/resource/dbpediafr/trustCategory/currency> ;
    dqv:value "0.13325" .

# Quality Measurement Dataset
<http://example.org/resource/dbpediafr/qualityMeasurementDataset> a dqv:QualityMeasurementDataset ;
    dqv:hasQualityMeasurement <http://example.org/resource/dbpediafr/currencyDimension> ,
        <http://example.org/resource/dbpediafr/currency_creationDate> ,
        <http://example.org/resource/dbpediafr/currency_modificationDate> ,
        <http://example.org/resource/dbpediafr/currency_percentageUpData> ,
        <http://example.org/resource/dbpediafr/currency_timePassed> ,
        ... (add URIs for other dimensions and metrics under Currency) ;
    dqv:computedOn <http://example.org/resource/dbpediafr> .

```

 ## Different dimensions categories cases

### Input to ChatGPT
Consider the following csv entitled "all-metrics-lite.csv": *PASTE CSV FILE CONTENT*

Consider the following ontology in ttl format entitled "dqv.ttl": *PASTE ONTOLOGY IN TTL FORMAT* 

Considering that the csv file pasted before contains scores attached to diffents dimensions and metrics. To distinguish metrics and dimension, consider that all the file column names follow the pattern of DIMENSION_METRIC. All the column names ending with ScoreValue represent the score attached to the dimension reported as prefix of the column name. 
With these premises, can you model the data contained in csv file related to the KG entitled "DBpedia in French" according to the "dqv.ttl" ontology and return the complete and detailed set of resulting triples in rdf format both reporting the score of all the dimensions and detailing all their metrics' measurements?

### ChatGPT output
```rdf

@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix dqv:     <http://www.w3.org/ns/dqv#> .
@prefix qb:      <http://purl.org/linked-data/cube#> .

# Assume DBpedia in French dataset URI
<http://example.org/DBpediaInFrench> a qb:DataSet.

# Sample triples for dimensions and metrics scores
<http://example.org/DBpediaInFrench/measurement1> a dqv:QualityMeasurement;
    dqv:computedOn <http://example.org/DBpediaInFrench>;
    dqv:isMeasurementOf <http://www.w3.org/ns/dqv#precision>;
    dqv:value "0.8"^^xsd:decimal.

<http://example.org/DBpediaInFrench/measurement2> a dqv:QualityMeasurement;
    dqv:computedOn <http://example.org/DBpediaInFrench>;
    dqv:isMeasurementOf <http://www.w3.org/ns/dqv#recall>;
    dqv:value "0.9"^^xsd:decimal.

# Add similar triples for other dimensions and metrics...

# Sample triples for metrics
<http://www.w3.org/ns/dqv#precision> a dqv:Metric;
    rdfs:label "Precision"@en;
    dqv:inDimension <http://www.w3.org/ns/dqv#dimension1>;
    # Add other relevant properties...

<http://www.w3.org/ns/dqv#recall> a dqv:Metric;
    rdfs:label "Recall"@en;
    dqv:inDimension <http://www.w3.org/ns/dqv#dimension2>;
    # Add other relevant properties...

# Add similar triples for other metrics...

# Sample triples for dimensions
<http://www.w3.org/ns/dqv#dimension1> a dqv:Dimension;
    rdfs:label "Dimension1"@en;
    dqv:inCategory <http://www.w3.org/ns/dqv#category1>;
    # Add other relevant properties...

<http://www.w3.org/ns/dqv#dimension2> a dqv:Dimension;
    rdfs:label "Dimension2"@en;
    dqv:inCategory <http://www.w3.org/ns/dqv#category1>;
    # Add other relevant properties...

# Add similar triples for other dimensions...

# Sample triples for categories
<http://www.w3.org/ns/dqv#category1> a dqv:Category;
    rdfs:label "Category1"@en;
    # Add other relevant properties...

# Add similar triples for other categories..
```

# Considerations
ChatGPT returns a useful skeleton for modeling the CSV content according to the data quality vocabulary requiring a minimum
explanation of the CSV header to distinguish metrics’ and dimensions’ scores and automatically
inferring the ontology structure, without requiring any clarification. However, the more data
available in terms of metrics and KGs, the more the skeleton only reports the structure that
must be manually replicated for each metric and KG observed. ChatGPT automatically returns a skeleton of the RDF triples inferring patterns to model metrics and KG assessment that must be manually completed by end-users. According
to the level of details in describing metrics, ChatGPT correctly model data quality categories,
dimensions and metrics.