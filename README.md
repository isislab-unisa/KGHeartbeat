# KGHeartBeat
KGHeartBeat is a tool that can help you to analyze the quality of all Knowledge Graphs automatically recoverable from [Linked Open data Cloud (LODC)](https://lod-cloud.net) and [DataHub](https://old.datahub.io/) (the tool can easily be extended to include other KGs aggregators).
- [KGHeartbeat](#kgheartbeat)
    - [Quality metrics covered](#quality-metrics-covered)
    - [Examples](#examples)
    - [License](#license)

- [How To Use KGHeartbeat?](#how-to-use-kgheartbeat)
    - [Dependencies](#dependencies)
    - [Input configuration](#input-configuration)
    - [Results](#results)
    -  [Look directly the quality](#look-directly-the-quality)

## Quality metrics covered
Below is a graph showing the quality dimensions covered by KGHeartbeat and the percentage of metrics measured in each of them.

![Quality metrics covered by KGHeartbeat](quality_metrics.png)

## Examples
1. [How to choose the right KG to create an application that uses Cultural Heritage data.](#1-how-to-choose-the-right-kg-to-create-an-application-that-uses-cultural-heritage-data)
2. [What are the best 10 KGs in terms of Trust and Dataset dynamicity?](#2-what-are-the-best-10-kgs-in-terms-of-trust-and-dataset-dynamicity)
3. [What are the best KGs for automatic consumption?](#3-what-are-the-best-kgs-for-automatic-consumption)

### 1. How to choose the right KG to create an application that uses Cultural Heritage data.
We can filter the Knowledge Graphs to analyze using appropriate keywords to exclude those that do not interest us. For example we can use the following keywords: museum, library, archive, cultur, heritage, bibliotec, natural, biodiversity, geodiversity. Then the configuration.json file will be configured as follows:
```
{"name": ["museum", "library", "archive", "cultur", "heritage", "bibliotec" "natural", "biodiversity", "geodiversity"], "id": []}
```
Our tool in this case give us the following output:
```
Number of KG found with keyword cultur:118
Connection to API successful and data recovered
Number of KG found with keyword heritage:50
Connection to API successful and data recovered
Number of KG found with keyword bibliotec:18
Connection to API successful and data recovered
Number of KG found with keyword natural:67
Connection to API successful and data recovered
Number of KG found with keyword biodiversity:11
Connection to API successful and data recovered
Number of KG found with keyword geodiversity:0
```
And then the analysis phase begins (Be careful, given the large number of KGs, this may take a long time to complete, depending on the load of the servers hosting the KG and your internet connection). At the end of the analysis we will be able to visualize the quality of the KGs analyzed through the csv file produced in the [Analysis results](/Analysis%20results/) folder, having as its name the date of execution of the analysis.


### 2. What are the best 10 KGs in terms of Trust and Dataset dynamicity?



### 3. What are the best KGs for automatic consumption?

## License
KGHeartbeat is licensed under the [MIT License](https://opensource.org/license/mit/).

# How to Use KGHeartBeat
This section provides an overview about the use of KGHeartbeat and how it can be extended.
To follow the next steps, clone the project with the following command
```
git clone https://github.com/isislab-unisa/KGHeartbeat.git
```

## Dependencies
First of all, install all dependencies from the project root:
```
pip install -r requirements.txt
```
## Input configuration
From the [KG-quality-analysis/configuration.json](configuration.json) file, you can choose the Knowledge Graph to analyze. You can analyze it by using a list of keywords or ids. In the example below, all the Knowledge Graphs that have the keywords *"museum"* will be analyzed.
```
{"name": ["museum"], "id": []}
```
Or, by a list of ids like this:
```
{"name": [], "id": ["dbpedia","taxref-ld"]}
```
If instead, you want to analyze all the Knowledge Graphs automatically discoverable from [LODCloud](https://lod-cloud.net/) and [DataHub](https://old.datahub.io/):
```
{"name": [], "id": []}
```
After the input configuration, to execute the analysis simply launch form the main directory of the project:
```
python3 manager.py
```
## Results
The results of the analysis will be inserted in a .csv file in the *"Analysis results"* directory, along with a .log file containing any errors that occurred during the measurement. Each line of the csv file representa a KG, and on the columns we find the different quality metrics analyzed.

## Look directly the quality
An analysis of all automatically discoverable Knowledge Graphs is done weekly by a computer in the [ISISLab laboratory](https://www.isislab.it/). Here it is possible to view directly the quality through charts and tables: [KGHeartBeat-WebApp](http://www.isislab.it:12280/kgheartbeat/)

## How include a new quality metric?
If you want to include a new quality metric, you need to include the calculation inside the [analyses.py](analyses.py) module. If this new metric requires the use of a new query on the SPARQL endpoint, you can add a new query in the [query.py](query.py) module and call it from the [analyses.py](analyses.py) module .Then, based on the quality dimension to which it belongs, modify the related class in the [QualityDimensions](/QualityDimensions/) folder, or create a new class if this belongs to a new dimension. If you created a new dimension for the new metric, it must be included in the [KnowledgeGraph.py](KnowledgeGraph.py) class. Then instantiate the classes in the [analyses.py](analyses.py) to assign the value obtained from the new quality metric. If you want also to see this new metric in the csv file given in output, you need to edit the [OutputCSV.py](OutputCSV.py) module appropriately. Essentially you have to include a new header, having as name the nameof the new metric and then recall the value of the metric from the [KnowledgeGraph.py](KnowledgeGraph.py) object appropriately constructed in the [analyses.py](analyses.py) module.