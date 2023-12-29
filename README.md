# KGHeartBeat
KGHeartBeat is a tool that can help you to analyze the quality of all Knowledge Graphs automatically recoverable from [Linked Open data Cloud (LODC)](https://lod-cloud.net) and [DataHub](https://old.datahub.io/) (the tool can easily be extended to include other KGs aggregators).
- [KGHeartbeat](#kgheartbeat)
    - [Repository structure](#repository-structure)
    - [Quality metrics covered](#quality-metrics-covered)
    - [Examples](#examples)
    - [Test](#test)
    - [License](#license)

- [How To Use KGHeartbeat?](#how-to-use-kgheartbeat)
    - [Dependencies](#dependencies)
    - [Input configuration](#input-configuration)
    - [Results](#results)
    -  [Look directly the quality](#look-directly-the-quality)

## Repository structure
```
KG-HeartBeat
    | - Analysis results/       Directory with KGs data quality obtained from measurement.
        |- YYYY-MM-DD.csv     
    | - API/                   
        |- AGAPI                Interface to KnowledgeGraph search engine.
        |- Aggregator.py        Brings together all the metadata for the KG from the various services used.
        |- DataHubAPI.py        Module to retrieve KGs metadata from DataHub.
        |- LODCloudAPI.py       Module to retrieve KGs metadata from LODCloud.
        |- LOVAPI.py            Module used to retrieve standard vocabularies and terms from LOV.
    | - db_files/
        |- docker-compose.yml   File to create a MongoDB container to contain the analysis data (useful only for the Web-App)     
        |- docker-entrypoint-initdb.d
           |- init-mongo.js     Script to create DB and collection.
    | - docs/                   Contains file related to the documentation.
    | - examples/               Contains example on how to use KGHeartBeat
    | - QualityDimensions       All classes representing the measured quality dimensions.
        |- AmountOfData.py
        |- Availability.py
        |- Believability.py
        ...
        ...
        ...
    | - test/                   Folder containing files and scripts relating to the test
        |- analyses_test.py     Script to run the test 
        |- SPARQLES_APIS.py     Module used as interface to the SPARQLES API.
        |- test_output.txt      File containing the result of the test performed.
    | - WebApp/                 Directory that contains all the files needed to boot locally KGHeartBeat Web-App.
    | - analyses.py             Module that calculates all quality metrics.
    | - bloomfilter.py          Class used to istantiate the Bloom-Filter structure.
    | - Configuration.py        Module used to create the configration.json file if isn't available.
    | - db_interface.py         Allows you to insert new quality data into the DB.
    | - ExternalLink.py         Class used to model the external links of a KG.
    | - Graph.py  Module        Used to build the graph with all the KGs and to calculate all the interlinking dimension metric.
    | - InputValidator.py       Abstract class to validate the input.
    | - JsonValidator.py        Class that implements the validation of JSON files in input.
    | - KnowledgeGraph.py       Class that contains the quality data of for the KG.
    | - manager.py              Module responsible for orchestrating the application and calling the various modules for analysis.
    | - MetricsOutput.py        Abstract class to return output from the application.
    | - OutputCSV.py            Class used to shape the output in CSV format.
    | - query.py                Contains all the queries needed to calculate quality metrics.
    | - Resources.py            Class used to aggregate all resources available for the analyzed KG.
    | - score.py                Class that calculates the score for each quality dimension analyzed and the total score
    | - Sources.py              Class with all info related to the KG sources.
    | - utils.py                Aggregates all useful functions for calculating quality metrics.
    | - VoIDAnalyses.py         Module used for parsing and extracting all useful information from the VoID file

```
![architecture](/architecture.png)



## Quality metrics covered
Below is a graph showing the quality dimensions covered by KGHeartbeat and the percentage of metrics measured in each of them.

![Quality metrics covered by KGHeartbeat](quality_metrics.png)

## Examples
1. [What are the best KGs for automatic consumption in the context of cultural heritage?](./examples/README.md#1-what-are-the-best-kgs-for-automatic-consumption-in-the-context-of-cultural-heritage)
2. [What are the best 10 KGs in terms of Trust and Dataset dynamicity?](./examples/README.md#2-what-are-the-best-10-kgs-in-terms-of-trust-and-dataset-dynamicity)
3. [What are the best KGs in the context of Linguistic Linked Open Data?](./examples/README.md#3-what-are-the-best-kgs-in-the-context-of-linguistic-linked-open-data)

## Test
The test was performed by comparing KGHeartBeat with [SPARQLES](https://sparqles.demo.openlinksw.com/). For more info about the test and the result go to the [test readme](./test/README.md).

## License
KGHeartbeat is licensed under the [MIT License](https://opensource.org/license/mit/).

# How to Use KGHeartBeat
This section provides an overview about the use of KGHeartbeat and how it can be extended.
To follow the next steps, clone the project with the following command
```
git clone https://github.com/isislab-unisa/KGHeartbeat.git
```

## Dependencies
For the execution of the project it is recommended to create a Python Virtual Environment, so from the project root directory run the following commands:
```
pip install virtualenv
python<version> -m venv <virtual-environment-name>
source env/bin/activate 
// or for Windows users
env/Scripts/activate.bat //In CMD
env/Scripts/Activate.ps1 //In Powershel
```
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
<a name="all-kgs-conf"></a>
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
