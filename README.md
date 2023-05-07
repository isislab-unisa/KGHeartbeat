# KGHeartbeat
**Credits**: Gabriele Tuozzo, Maria Angela Pellegrino.
## Introduction
Python application that automatically analyzes the quality of Knowledge Graphs available on LODCloud and DataHUB. The **quality categories** analyzed by the application are:
- Accessibility
- Intrinsic
- Trust
- Dataset dynamicity
- Contextual
- Representational

Each of these categories is made up of quality dimensions. Overall, the tool analyzes 23 different **quality dimensions**, without the need of iteraction with the user.
## How to use
### Dependencies
First of all, install all dependencies:
```
pip install -r requirements.txt
```
### Input configuration
From the [KG-quality-analysis/configuration.json](configuration.json) file, you can choose the Knowledge Graph to analyze. You can analyze it by using a list of keywords or ids. In the example below, all the Knowledge Graphs that have keywords *museum* will be analyzed.
```
{"name": ["museum"], "id": []}
```
Or, by a list of ids with this:
```
{"name": [], "id": ["dbpedia","taxref-ld"]}
```
If instead, you want to analyze all the Knowledge Graphs automatically discoverable from [LODCloud](https://lod-cloud.net/) and [DataHub](https://old.datahub.io/):
```
{"name": [], "id": []}
```
### Start of the analysis
After the input configuration, to execute the analysis simply launch form the main directory of the project:
```
python manager.py
```
### Results
The results of the analysis will be inserted in a csv file in the *"Analysis results"* directory.
## Look directly the quality
An analysis of all automatically discoverable Knowledge Graphs is done weekly by a computer in the [ISISLab laboratory](https://www.isislab.it/). Here it is possible to view directly the quality through graphs and tables: [KG-quality-analysis-visualization](https://kg-quality-analysis-visualization.com/)
