# Test
1. [Comparative test with SPARQLES](#comparative-test-with-sparqles)
2. [Comparative test with LUZZU](#comparative-test-with-luzzu)




## Comparative test with SPARQLES
- [How the test was performed](#how-the-test-was-performed-sparqles)
- [How to reproduce the test](#how-to-reproduce-the-test-sparqles)
- [Test results](#test-results-sparqles)


## How the test was performed (SPARQLES)
Given the scarcity of working tools to be able to compare the result of our analyses, we used [SPARQLES](https://sparqles.demo.openlinksw.com) which is a tool used to verify the availability of the SPARQL endpoint and the VoID file. We found it particularly useful to use it as the quality of a KG is strongly influenced by the availability of the SPARQL endpoint and the VoID file, because almost all quality metrics are calculated by recovering data present in the KG and the related metadata, which are therefore accessible by executing appropriate SPARQL queries. The test was therefore performed by comparing the state of the SPARQL endpoint. The three output files that you can consult to verify the outcome of the test are [test_output.txt](./test_output.txt) (contains the total number of KGs for which the test for the SPARQL endpoint availability was passed and failed), [test_console_output.txt](./test_console_output.txt) (contains the test result obtained from KGHeartBeat and SPARQLES for every KG tested) and lastley [void_file_test_output](./void_file_test_output.txt) contains the total number of KGs for which the test for the VoID file availability was passed and failed.
The test may take a few minutes to run as to check the availability of the SPARQL endpoint with the SPARQLES API we need the SPARQL endpoint link of the KG (also for the VoID file availability). When our tool analyzes all the KGs automatically discoverable, it recovers them by obtaining only the IDs and not directly the SPARQL endpoint link (this is done in another phase during the analysis), therefore an initial phase is necessary where for each ID we must execute a query on Datahub and LODCloud to obtain the corresponding link to the SPARQL endpoint, only at the end of this phase we can proceed with the test, therefore the time of the initial phase can be influenced by the rate limit imposed on GET requests on DataHub and LODCloud.

## How to reproduce the test (SPARQLES)
To reproduce the test simply run the ```analyses_test.py``` script:
```
python analyses_test.py > output.txt
python void_availability_test.py
```
Saving the output to a file is useful for checking the result obtained for each tested KG.

## Test results (SPARQLES)

### SPARQL endpoint availability

|Total KGs Tested|Passed|Failures|
|---|---|---|
|377|322|55|

Failures means that the result between SPARQLES and KG Heartbeat is different.
For the 55 KGs for which the result was different, we analyzed the result in depth and we obtained that:
- For 37 KGs, we have that for KGHeartBeat are **online** and for SPARQLES are **offline**. We then checked manually by visiting the SPARQL endpoint link and running the same query as KGHeartBeat did. We found that for all 37 KGs for which our tool detected the SPARQL endpoint online, it was actually online and responding to queries. The reason why SPARQLES detects them offline could be due to the fact that they have an invalid SSL certificate (in fact in our manual check the problem was notified by the browser), this is a problem we have encountered with all the 30 KGs coming from the bio2rdf domain (link in the form: https://yyyy.bio2rdf.org/sparql). In our application, we solve this problem by using the [skipCheckSSL](https://github.com/isislab-unisa/KGHeartbeat/blob/55df26ddf6be91f70d1fa5db86518297ff0c4568/utils.py#L952) function from [utils.py](../utils.py) in the [analyses.py](../analyses.py) module. 
Instead, for the following endpoints that were offline for SPARQLES and online for KGHeartBeat, the problem seems to be that any automatic redirects on HTTPS are ignored (N.B. by trying to change HTTP to HTTPS manually in the link, the result on SPARQLES is that no KG is found with that link), in fact for all this 6 KGs an automatic redirect is done :
    - http://digitale.bncf.firenze.sbn.it/openrdf-workbench/repositories/NS/query
    - http://es.dbpedia.org/sparql
    - http://rdf.muninn-project.org/sparql
    - http://lod.sztaki.hu/sparql
    - http://id.ndl.go.jp/auth/ndla/
    - http://id.ndl.go.jp/auth/ndlsh/

    The redirect is fully supported by KGHeartBeat.
    
    The last KG for which you get a value **offline** on SPARQLES and **online** on KGHeartBeat is as follows
    - https://data.gov.cz/sparql
    
    For the latter we have not found a valid reason why it fails on SPARQLES but not on our tool (and the SPARQL endpoint is actually working).

- For 18 KGs we have that are **online** for SPARQLES but **offline** for KGHeartBeat. By carrying out a manual check, we have actually verified that for 13 KGs these are actually unreachable and are offline, it is not clear why SPARQLES shows them as active. The 13 KGs are as follows:
    - http://tsu.eagle-i.net/sparqler/sparql
    - http://psm.eagle-i.net/sparqler/sparql
    - http://hawaii.eagle-i.net/sparqler/sparql
    - http://alaska.eagle-i.net/sparqler/sparql
    - http://jsu.eagle-i.net/sparqler/sparql
    - http://ohsu.eagle-i.net/sparqler/sparql
    - http://upr.eagle-i.net/sparqler/sparql
    - http://tuskegee.eagle-i.net/sparqler/sparql
    - http://xula.eagle-i.net/sparqler/sparql
    - http://xula.eagle-i.net/sparqler/sparql
    - http://uccaribe.eagle-i.net/sparqler/sparql   
    - http://msm.eagle-i.net/sparqler/sparql
    - http://utep.eagle-i.net/sparqler/sparql

    For the following 5 KG we incorrectly obtain that they are **offline** from our tool and are **online** for SPARQLES, but they are correctly functioning:
    - https://semanticweb.cs.vu.nl/verrijktkoninkrijk/yasgui/index.html
    - http://dbtune.org/bbc/peel/sparql/
    - http://dbtune.org/classical/sparql/
    - http://dbtune.org/jamendo/sparql/
    - http://id.sgcb.mcu.es/sparql (for this the problem is that the query result is not returned as JSON or XML, but as HTML code and there is no way to force the format change, therefore it is not working from our tool).

In the following table for **Total KGs manually checked** we mean only those that showed different results between SPARQLES and KGHeartBeat.

|False Negatives|False Positive|Total KGs manually checked |
|---|---|---|
|5|0|55|

As future work we will improve the tool to adjust the result on these 5 KGs and we will plan a new execution of the test to verify the result obtained.

### VoID file availability (SPARQLES)

For the test only KG that are measured by both applications are considered.

|Total KGs Tested|Passed|Failures|
|---|---|---|
|55|29|26|

Failures means that the result between SPARQLES and KG Heartbeat is different.
For the 26 KGs for which the result was different, we analyzed the result in depth and we obtained that:

- For 26 KGs, the result from KGHeartBeat is that the VoID file is **online** and for SPARQLES **offline**. By manual check we found that the VoID file is **online** and our tool correctly recover it and parse it to extract the metadata about the KG.

- For 1 KG, the result from KGHeartBeat is that the VoID file is **offline** and for SPARQLES **online**. The only one case is for the following KG: http://vocab.nerc.ac.uk/sparql/

|False Negatives|False Positive|Total KGs manually checked |
|---|---|---|
|1|0|27|


# Comparative test with LUZZU
- [How the test was performed](#how-the-test-was-performed)
- [How to reproduce the test](#how-to-reproduce-the-test)
- [Test results](#test-results)

## How the test was performed (LUZZU)
To date, the LUZZ tool appears to be non-functional; however, by analyzing KGs pages related to the language sub-cloud on [https://lod-cloud.net](https://lod-cloud.net), it is possible to see some metrics calculated with LUZZU. Specifically these metrics are: *SPARQL availability*, *License*, *number of triples* and *Interlinking completeness*. The test output data are in the csv file [here](./kghb_vs_luzzu_llod.csv). For each metric both the value from LUZZU and KGHeartBeat is computed and saved, for every KGs in the linguistic linked open data.

## How to reproduce the test (LUZZU)
To reproduce the test, the KGHeartBeat API must be installed.
```
pip install kgheartbeat

python3 kghb_luzzu_test.py
```
Upon completion of the script execution, a csv file will be created in the current directory containing the test result.

## Test results (LUZZU)
A brief summary table of the test result is given below

### SPARQL endpoint
|SPARQL Endpoint (same result)| SPARQL Endpoint (different result)|
|----|----|
|115|27|

### License Machine-Redeable (MR)
|MR License (same result)| MR License (different result)|
|----|----|
|41|101|

⚠️ The result here is very unbalanced because the returned license format is different (LUZZU return a URL to the license, KGHeartBeat extracts the specific license attached at the predicate)

### Number of triples
|Number of triples (same result)| Number of triples (different result)|
|----|----|
|108|34|

⚠️ KGHeartBeat, if present, returns the number of triples using a sparql query (if online endpoint, if offline uses the information in the metadata), for LUZZU it is not specified whether if the data comes from a query or from the metadata

### Interlinking completeness
| Interlinking completeness (same result) | Interlinking completeness|
|-----|-----|
| 8 | 134 |

⚠️ This calculation includes the use of triples in the KG, which oftentimes for KGHeartbeat is higher (probably the number is more up-to-date), same thing happens for triples that are connected with other KGs (linked triples are used in the ratio to calculate the interlinking completeness, [see here for other details](https://isislab-unisa.github.io/KGHeartbeat/quality_dimensions/completeness)
