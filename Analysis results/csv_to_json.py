import csv 
import json
from pathlib import Path
import os
import sys
import re
import string

maxInt = sys.maxsize
while True:
    # decrease the maxInt value by factor 10 
    # as long as the OverflowError occurs.
    try:
        csv.field_size_limit(maxInt)
        break
    except OverflowError:
        maxInt = int(maxInt/10)

def full_csv():
    here = os.path.dirname(os.path.abspath(__file__))
    p = Path(here)
    files = [file for file in p.glob('*.csv') if '_with_dimensions.csv' not in file.name]
    for file in files:
        file_name = file.stem
        filename = str(file_name)
        with open(filename + '.csv',encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for rows in csv_reader:

                old_analysis = False
                try:
                    rows['Availability score']
                    rows['Age of data']
                except KeyError:
                    old_analysis = True
        
                kg_id = rows['KG id']
                if kg_id == 'dbpedia_' or kg_id == 'santillanaguidedataset_':
                    continue
                kg_id = re.sub(r'[\\/*?:"<>|]',"",kg_id)
                remove_punctuation_map = dict((ord(char), None) for char in '\/*?:"<>|')
                kg_id = kg_id.translate(remove_punctuation_map)
                remove_punctuation_map = dict((ord(char), None) for char in string.punctuation)
                kg_id = kg_id.translate(remove_punctuation_map)
                kg_id = kg_id.replace(" ","")

                if(old_analysis == False):
                    data = {
                        "kg_id" : kg_id,
                        "kg_name" : rows['KG name'],
                        "analysis_date" : filename,
                        "Accessibility": [{"Availability" : {"sparqlEndpoint" : rows['Sparql endpoint'] , 'RDFDumpM': rows['Availability of RDF dump (metadata)'] , 'RDFDumpQ' : rows['Availability of RDF dump (query)'], 'inactiveLinks' : rows['Inactive links'], 'uriDef' : rows['URIs Deferenceability'], 'voidAvailability' : rows['Availability VoID file']}},
                                        {"Licensing" : {"licenseMetadata" : rows['License machine redeable (metadata)'],'licenseQuery' : rows['License machine redeable (query)'],'licenseHR' : rows['License human redeable']}}, 
                                        {"Interlinking" :{'degreeConnection' : rows['Degree of connection'], 'clustering' : rows['Clustering coefficient'], 'centrality' : rows['Centrality'],'sameAs' : rows['Number of samAs chains'], 'skos-mapping': rows.get('SKOS mapping properties','missing data')}}, 
                                        {"Security" : {'useHTTPS' : rows['Use HTTPS'], 'requiresAuth' : rows['Requires authentication']}}, 
                                        {"Performance" : {"minLatency" : rows['Minimum latency'], 'maxLantency' : rows['Maximum latency'], 'averageLatency' : rows['Average latency'], 'sDLatency' : rows['Standard deviation of latency'], 'minThroughput' : rows['Minimum throughput'], 'maxThrougput' : rows['Maximum throughput'], 'averageThroughput' : rows['Average throughput'], 'sDThroughput' : rows[' Standard deviation of throughput'], 'percentile25L' : rows['25th percentile latency'], 'percentile75L' : rows['75th percentile latency'], 'medianL' : rows['Median latency'], 'percentile25T' : rows['25th percentile throughput'], 'percentile75T' : rows['75th percentile throughput'], 'medianT' : rows['Median throughput']}}],
                        "Intrinsic": [{"Accuracy" : {'emptyAnn' : rows['Triples with empty annotation problem'], 'wSA' : rows['Triples with white space in annotation(at the beginning or at the end)'], 'malformedDataType' : rows['Triples with malformed data type literals problem'],'FPvalue' : rows['Functional properties with inconsistent values'], 'IFPvalue' : rows['Invalid usage of inverse-functional properties']}}, 
                                    {"Consistency" : {'deprecated' : rows['Deprecated classes/properties used'], 'disjointClasses' : rows['Entities as member of disjoint class'], 'triplesMP' : rows['Triples with misplaced property problem'], 'triplesMC' : rows['Triples with misplaced class problem'], 'oHijacking' : rows['Ontology Hijacking problem'], 'undefinedClass' : rows['Undefined class used without declaration'],'undefinedProperties' : rows['Undefined properties used without declaration']}}, 
                                    {"Conciseness" : {'exC' : rows['Extensional conciseness'], 'intC' : rows['Intensional conciseness']}}],
                        "Trust": [{"Reputation" : {'pageRank' : rows['PageRank']}}, 
                                {"Believability" : {'title' : rows['KG name'], 'description' : rows['Description'], 'URI' : rows['Dataset URL'], 'reliableProvider': rows['Is on a trusted provider list'],'trustValue' : rows['Trust value']}}, 
                                {"Verifiability" : {'vocabularies' : rows['Vocabularies'], 'authorQ' : rows['Author (query)'], 'authorM' : rows['Author (metadata)'], 'contributor' : rows['Contributor'], 'publisher' : rows['Publisher'], 'sources' : rows['Sources'],'sign' : rows['Signed']}}],
                        "Dataset dynamicity" : [{"Currency" : {'creationDate' : rows['Age of data'], 'modificationDate' : rows['Modification date'], 'percentageUpData' : rows['Percentage of data updated'], 'timePassed' : rows['Time elapsed since last modification'], 'historicalUp' : rows['Historical updates']}}, 
                                                {"Volatility" : {'frequency' : rows['Dataset update frequency']}}],
                        "Contextual": [{"Completeness" : {'numTriples' : rows[' Number of triples'], 'numTriplesL': rows['Number of triples linked'], 'interlinkingC' : rows['Interlinking completeness']}}, 
                                    {"Amount of data" : {'numTriplesM' : rows[' Number of triples (metadata)'], 'numTriplesQ' : rows['Number of triples (query)'], 'numEntities' : rows['Number of entities'], 'numProperty' : rows['Number of property'], 'entitiesRe' : rows['Number of entities counted with regex']}}],
                        "Representational" : [{"Representational-conciseness" : {'urisLenghtSA' : rows['Average length of URIs (subject)'], 'urisLenghtSSd' : rows['Standard deviation lenght URIs (subject)'], 'urisLenghtOA' : rows['Average length of URIs (object)'], 'urisLenghtOSd' : rows['Standard deviation lenght URIs (object)'], 'urisLenghtPA' : rows['Average length of URIs (predicate)'], 'urisLenghtPSd' : rows['Standard deviation lenght URIs (predicate)'], 'minLengthS' : rows['Min length URIs (subject)'], 'percentile25LengthS' : rows['25th percentile length URIs (subject)'], 'medianLengthS' : rows['Median length URIs (subject)'], 'percentile75LengthS' : rows['75th percentile length URIs (subject)'], 'maxLengthS' : rows['Max length URIs (subject)'], 'minLengthO' : rows['Min length URIs (object)'], 'percentile25LengthO' : rows['25th percentile length URIs (object)'], 'medianLengthO' : rows['Median length URIs (object)'], 'percentile75LengthO' : rows['75th percentile length URIs (object)'], 'maxLengthO' : rows['Max length URIs (object)'], 'minLengthP' : rows['Min length URIs (predicate)'], 'percentile25LengthP' : rows['25th percentile length URIs (predicate)'], 'medianLengthP' : rows['Median length URIs (predicate)'], 'percentile75LengthP' : rows['75th percentile length URIs (predicate)'], 'maxLengthP' : rows['Max length URIs (predicate)'], 'RDFStructures' : rows['Use RDF structures']}}, 
                                            {"Representational-consistency" : {'newVocab' : rows['New vocabularies defined in the dataset'], 'useNewTerms' : rows['New terms defined in the dataset']}}, 
                                            {"Understandability" : {'numLabel' : rows['Number of labels/comments present on the data'], 'percentageLabel' : rows[' Percentage of triples with labels'], 'regexUri' : rows['Regex uri'], 'vocabularies' : rows['Vocabularies'],'example' : rows['Presence of example']}}, 
                                            {"Interpretability" : {'numBN' : rows['Number of blank nodes'], 'RDFStructures' : rows['Uses RDF structures']}}, 
                                            {"Versatility" : {'languagesQ' : rows['Languages (query)'], 'languagesM' : rows['Languages (metadata)'], 'serializationFormats' : rows['Serialization formats'], 'sparqlEndpoint' : rows['SPARQL endpoint URL'], 'availabilityDownloadQ' : rows['Availability of RDF dump (query)'], 'availabilityDownloadM' : rows['Availability of RDF dump (metadata)']}}],
                        "Score": {"totalScore" : rows['Score'], "normalizedScore" : rows['Normalized score'], "availabilityScoreValue": rows['Availability score'], "licensingScoreValue" : rows['Licensing score'],"interlinkingScoreValue" : rows['Interlinking score'],
                                "performanceScoreValue": rows['Performance score'],"accuracyScoreValue" : rows['Accuracy score'],"consistencyScoreValue" : rows['Consistency score'],"concisenessScoreValue" : rows['Conciseness score'],"verifiabilityScoreValue" : rows['Verifiability score'],"reputationScoreValue" : rows['Reputation score'],
                                "believabilityScoreValue" : rows['Believability score'],"currencyScoreValue" : rows['Currency score'],"volatilityScoreValue" : rows['Volatility score'],"completenessScoreValue" : rows['Completeness score'],"amountScoreValue" : rows['Amount of data score'],"repConsScoreValue" : rows['Representational-Consistency score'],
                                "repConcScoreValue" : rows['Representational-Conciseness score'],"understScoreValue" : rows['Understandability score'],"interpretabilityScoreValue" : rows['Interpretability score'],"versatilityScoreValue" : rows['Versatility score'],"securityScoreValue" : rows['Security score']},
                        "Extra": {"sparql_link" : rows['SPARQL endpoint URL'], "rdf_dump_link": rows['URL for download the dataset'], "external_links": rows['External links']}
                    }
                else:
                    data = {
                        "kg_id" : kg_id,
                        "kg_name" : rows['KG name'],
                        "analysis_date" : filename,
                        "Accessibility": [{"Availability" : {"sparqlEndpoint" : rows['Sparql endpoint'] , 'RDFDumpM': rows['Availability of RDF dump (metadata)'] , 'RDFDumpQ' : rows['Availability of RDF dump (query)'], 'inactiveLinks' : rows['Inactive links'], 'uriDef' : rows['URIs Deferenceability'], 'voidAvailability' : rows['Availability VoID file']}},
                                        {"Licensing" : {"licenseMetadata" : rows['License machine redeable (metadata)'],'licenseQuery' : rows['License machine redeable (query)'],'licenseHR' : rows['License human redeable']}}, 
                                        {"Interlinking" :{'degreeConnection' : rows['Degree of connection'], 'clustering' : rows['Clustering coefficient'], 'centrality' : rows['Centrality'],'sameAs' : rows['Number of samAs chains'], 'skos-mapping': rows.get('SKOS mapping properties','missing data')}}, 
                                        {"Security" : {'useHTTPS' : rows['Use HTTPS'], 'requiresAuth' : rows['Requires authentication']}}, 
                                        {"Performance" : {"minLatency" : rows['Minimum latency'], 'maxLantency' : rows['Maximum latency'], 'averageLatency' : rows['Average latency'], 'sDLatency' : rows['Standard deviation of latency'], 'minThroughput' : rows['Minimum throughput'], 'maxThrougput' : rows['Maximum throughput'], 'averageThroughput' : rows['Average throughput'], 'sDThroughput' : rows[' Standard deviation of throughput'], 'percentile25L' : rows['25th percentile latency'], 'percentile75L' : rows['75th percentile latency'], 'medianL' : rows['Median latency'], 'percentile25T' : rows['25th percentile throughput'], 'percentile75T' : rows['75th percentile throughput'], 'medianT' : rows['Median throughput']}}],
                        "Intrinsic": [{"Accuracy" : {'emptyAnn' : rows['Triples with empty annotation problem'], 'wSA' : rows['Triples with white space in annotation(at the beginning or at the end)'], 'malformedDataType' : rows['Triples with malformed data type literals problem'],'FPvalue' : rows['Functional properties with inconsistent values'], 'IFPvalue' : rows['Invalid usage of inverse-functional properties']}}, 
                                    {"Consistency" : {'deprecated' : rows['Deprecated classes/properties used'], 'disjointClasses' : rows['Entities as member of disjoint class'], 'triplesMP' : rows['Triples with misplaced property problem'], 'triplesMC' : rows['Triples with misplaced class problem'], 'oHijacking' : rows['Ontology Hijacking problem'], 'undefinedClass' : rows['Undefined class used without declaration'],'undefinedProperties' : rows['Undefined properties used without declaration']}}, 
                                    {"Conciseness" : {'exC' : rows['Extensional conciseness'], 'intC' : rows['Intensional conciseness']}}],
                        "Trust": [{"Reputation" : {'pageRank' : rows['PageRank']}}, 
                                {"Believability" : {'title' : rows['KG name'], 'description' : rows['Description'], 'URI' : rows['Dataset URL'], 'reliableProvider': rows['Is on a trusted provider list'],'trustValue' : rows['Trust value']}}, 
                                {"Verifiability" : {'vocabularies' : rows['Vocabularies'], 'authorQ' : rows['Author (query)'], 'authorM' : rows['Author (metadata)'], 'contributor' : rows['Contributor'], 'publisher' : rows['Publisher'], 'sources' : rows['Sources'],'sign' : rows['Signed']}}],
                        "Dataset dynamicity" : [{"Currency" : {'creationDate' : rows.get('Creation date','-'), 'modificationDate' : rows['Modification date'], 'percentageUpData' : rows['Percentage of data updated'], 'timePassed' : rows['Time elapsed since last modification'], 'historicalUp' : rows['Historical updates']}}, 
                                                {"Volatility" : {'frequency' : rows['Dataset update frequency']}}],
                        "Contextual": [{"Completeness" : {'numTriples' : rows[' Number of triples'], 'numTriplesL': rows['Number of triples linked'], 'interlinkingC' : rows['Interlinking completeness']}}, 
                                    {"Amount of data" : {'numTriplesM' : rows[' Number of triples (metadata)'], 'numTriplesQ' : rows['Number of triples (query)'], 'numEntities' : rows['Number of entities'], 'numProperty' : rows['Number of property'], 'entitiesRe' : rows['Number of entities counted with regex']}}],
                        "Representational" : [{"Representational-conciseness" : {'urisLenghtSA' : rows['Average length of URIs (subject)'], 'urisLenghtSSd' : rows['Standard deviation lenght URIs (subject)'], 'urisLenghtOA' : rows['Average length of URIs (object)'], 'urisLenghtOSd' : rows['Standard deviation lenght URIs (object)'], 'urisLenghtPA' : rows['Average length of URIs (predicate)'], 'urisLenghtPSd' : rows['Standard deviation lenght URIs (predicate)'], 'minLengthS' : rows['Min length URIs (subject)'], 'percentile25LengthS' : rows['25th percentile length URIs (subject)'], 'medianLengthS' : rows['Median length URIs (subject)'], 'percentile75LengthS' : rows['75th percentile length URIs (subject)'], 'maxLengthS' : rows['Max length URIs (subject)'], 'minLengthO' : rows['Min length URIs (object)'], 'percentile25LengthO' : rows['25th percentile length URIs (object)'], 'medianLengthO' : rows['Median length URIs (object)'], 'percentile75LengthO' : rows['75th percentile length URIs (object)'], 'maxLengthO' : rows['Max length URIs (object)'], 'minLengthP' : rows['Min length URIs (predicate)'], 'percentile25LengthP' : rows['25th percentile length URIs (predicate)'], 'medianLengthP' : rows['Median length URIs (predicate)'], 'percentile75LengthP' : rows['75th percentile length URIs (predicate)'], 'maxLengthP' : rows['Max length URIs (predicate)'], 'RDFStructures' : rows['Use RDF structures']}}, 
                                            {"Representational-consistency" : {'newVocab' : rows['New vocabularies defined in the dataset'], 'useNewTerms' : rows['New terms defined in the dataset']}}, 
                                            {"Understandability" : {'numLabel' : rows['Number of labels/comments present on the data'], 'percentageLabel' : rows[' Percentage of triples with labels'], 'regexUri' : rows['Regex uri'], 'vocabularies' : rows['Vocabularies'],'example' : rows['Presence of example']}}, 
                                            {"Interpretability" : {'numBN' : rows['Number of blank nodes'], 'RDFStructures' : rows['Uses RDF structures']}}, 
                                            {"Versatility" : {'languagesQ' : rows['Languages (query)'], 'languagesM' : rows['Languages (metadata)'], 'serializationFormats' : rows['Serialization formats'], 'sparqlEndpoint' : rows['SPARQL endpoint URL'], 'availabilityDownloadQ' : rows['Availability of RDF dump (query)'], 'availabilityDownloadM' : rows['Availability of RDF dump (metadata)']}}],
                        "Score": {"totalScore" : rows['Score']},
                        "Extra": {"sparql_link" : rows['SPARQL endpoint URL'], "rdf_dump_link": rows['URL for download the dataset'], "external_links": rows['External links']}
                    }

                with open('json_files/' + kg_id + ' ' + filename + '.json','w',encoding='utf-8') as jsonFile:
                    jsonFile.write(json.dumps(data, indent=4))

def splitted_csv():
    here = os.path.dirname(os.path.abspath(__file__))
    here = os.path.join(here,'./splitted')
    p = Path(here)
    files = list(p.glob('*.csv'))
    for file in files:
        file_name = file.stem
        filename = str(file_name)
        path = os.path.join(here,filename)
        with open(path + '.csv',encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for rows in csv_reader:
                kg_id = filename
                if kg_id == 'dbpedia_' or kg_id == 'santillanaguidedataset_':
                    continue
                try: 
                    data = {
                        "kg_id" : kg_id,
                        "kg_name" : rows['KG name'],
                        "analysis_date" : rows['Date'],
                        "Accessibility": [{"Availability" : {"sparqlEndpoint" : rows['SPARQL endpoint'] , 'RDFDumpM': rows['RDF dump'], 'inactiveLinks' : rows['Inactive links']}},
                                        {"Licensing" : {"licenseMetadata" : rows['License Machine-Redeable'],"licenseQuery" : rows['License MR'],'licenseHR' : rows['License Human-Redeable']}}, 
                                        {"Interlinking" :{'degreeConnection' : rows['Degree of connection'], 'clustering' : rows['Clustring coefficient'], 'centrality' : rows['Centrality'],'sameAs' : rows['Number of sameAs chains']}}, 
                                        {"Security" : {'useHTTPS' : rows['Use HTTPS'], 'requiresAuth' : rows['Requires auth']}}, 
                                        {"Performance" : {"minLatency" : rows['Min latency'], 'maxLantency' : rows['Max latency'], 'minThroughput' : rows['Min TP'], 'maxThrougput' : rows['Max TP'], 'percentile25L' : rows['25th percentile latency'], 'percentile75L' : rows['75th percentile latency'], 'medianL' : rows['Median latency'], 'percentile25T' : rows['25th percentile TP'], 'percentile75T' : rows['75th percentile TP'], 'medianT' : rows['Median TP']}}],
                        "Intrinsic": [{"Accuracy" : {'emptyAnn' : rows['Number of void label'], 'wSA' : rows['Number of whitespace label'], 'malformedDataType' : rows['Number of malformed datatype'],'FPvalue' : rows['FP'], 'IFPvalue' : rows['IFP']}}, 
                                    {"Consistency" : {'deprecated' : rows['Deprecated class/property'], 'disjointClasses' : rows['Disjoint class'], 'triplesMP' : rows['Misplaced property'], 'triplesMC' : rows['Misplaced class'], 'oHijacking' : rows['Ontology hijacking'], 'undefinedClass' : rows['Undefined class'],'undefinedProperties' : rows['Undefined property']}}, 
                                    {"Conciseness" : {'exC' : rows['Extensional conciseness'], 'intC' : rows['Intensional conciseness']}}],
                        "Trust": [{"Reputation" : {'pageRank' : rows['PageRank']}}, 
                                {"Believability" : {'title' : rows['KG name'], 'description' : rows['Description'], 'URI' : rows['Url'], 'reliableProvider': rows['Reliable'],'trustValue' : rows['Trust value']}}, 
                                {"Verifiability" : {'vocabularies' : rows['Vocabularies'], 'authorM' : rows['Authors'], 'contributor' : rows['Contributors'], 'publisher' : rows['Publishers'], 'sources' : rows['Sources'],'sign' : rows['Signed']}}],
                        "Dataset dynamicity" : [{"Currency" : {'creationDate' : rows['Creation date'], 'modificationDate' : rows['Modification date'], 'timePassed' : rows['Time since last modification'], 'historicalUp' : rows['HistoricalUp']}}, 
                                                {"Volatility" : {'frequency' : rows['Dataset update frequency']}}],
                        "Contextual": [{"Completeness" : {'numTriples' : rows['Number of triples'], 'numTriplesL': rows['Number of triples linked'], 'interlinkingC' : rows['Interlinking completeness']}}, 
                                    {"Amount of data" : {'numTriplesM' : rows['Number of triples'], 'numEntities' : rows['Number of entities'], 'numProperty' : rows['Number of property']}}],
                        "Representational" : [{"Representational-conciseness" : {'minLengthS' : rows['Min length URIs (subject)'], 'percentile25LengthS' : rows['25th percentile length URIs (subject)'], 'medianLengthS' : rows['Median length URIs (subject)'], 'percentile75LengthS' : rows['75th percentile length URIs (subject)'], 'maxLengthS' : rows['Max length URIs (subject)'], 'minLengthO' : rows['Min length URIs (object)'], 'percentile25LengthO' : rows['25th percentile length URIs (object)'], 'medianLengthO' : rows['Median length URIs (object)'], 'percentile75LengthO' : rows['75th percentile length URIs (object)'], 'maxLengthO' : rows['Max length URIs (object)'], 'minLengthP' : rows['Min length URIs (predicate)'], 'percentile25LengthP' : rows['25th percentile length URIs (predicate)'], 'medianLengthP' : rows['Median length URIs (predicate)'], 'percentile75LengthP' : rows['75th percentile length URIs (predicate)'], 'maxLengthP' : rows['Max length URIs (predicate)'], 'RDFStructures' : rows['RDF structures']}}, 
                                            {"Representational-consistency" : {'newVocab' : rows['New vocabularies defined'], 'useNewTerms' : rows['New terms defined']}}, 
                                            {"Understandability" : {'numLabel' : rows['Number of label'], 'regexUri' : rows['Uri regex'], 'vocabularies' : rows['Vocabularies'],'example' : rows['Presence of example']}}, 
                                            {"Interpretability" : {'numBN' : rows['Number of blank nodes'], 'RDFStructures' : rows['RDF structures']}}, 
                                            {"Versatility" : {'languages_merged' : rows['Languages'],'serializationFormats' : rows['Serialization formats'], 'sparqlEndpoint' : rows['SPARQL endpoint'], 'availabilityRDFD_merged' : rows['RDF dump']}}],
                        "Score": {"totalScore" : rows['Score']},
                        "Extra":{"sparql_link" : rows['Link SPARQL endpoint'],"rdf_dump_link" : rows['Link for download the dataset']}
                    }
                    with open('json_files/' + kg_id + rows['Date'] + '.json','w',encoding='utf-8') as jsonFile:
                        jsonFile.write(json.dumps(data, indent=4))
                except:
                    continue
            
splitted_csv()
full_csv()