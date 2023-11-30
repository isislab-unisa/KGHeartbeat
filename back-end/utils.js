const fs = require('fs');

function flat_data(quality_data,quality_dimensions){
  for(let i = 0; i<quality_dimensions.length; i++){
    quality_dimensions[i] = quality_dimensions[i].charAt(0).toUpperCase() + quality_dimensions[i].slice(1);
  }
    const flatData = quality_data.map(entry => {
        const flatEntry = { ...entry }; 
  
        for(let i = 0; i<quality_dimensions.length; i++){
            if (flatEntry[quality_dimensions[i]]) {
                for (const key in flatEntry[quality_dimensions[i]]) {
                    flatEntry[`${quality_dimensions[i]}_${key}`] = flatEntry[quality_dimensions[i]][key];
                }
                delete flatEntry[quality_dimensions[i]]; 
            }
        }
        

        return flatEntry;
    });
    return flatData
}

function filterUniqueObjects(list) {
    const uniqueObjects = [];
  
    list.forEach(obj => {
      // Check if an object with the same kg_id and analysis_date already exists
      const existingObject = uniqueObjects.find(
        o => o.kg_id === obj.kg_id && o.analysis_date === obj.analysis_date
      );
  
      // If not, add the object to the uniqueObjects list
      if (!existingObject) {
        uniqueObjects.push(obj);
      }
    });
  
    return uniqueObjects;
  }

  function readFileContent(filePath, callback){
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}

function csv_to_json(csv_data,filename){
  let converted_json_data = []
  let kgs_id = []
  for(let i = 0; i<csv_data.length; i++){
    rows = csv_data[i];
    const kg_id = rows['KG id'];
    const timestamp = Date.now();
    const random_string = Math.random().toString(36).substring(2, 6); 
    const new_kgs_id = timestamp + random_string + '|' + kg_id
    kgs_id.push({id : new_kgs_id})
    const converted_json = {
        "kg_id": new_kgs_id,
        "kg_name": rows['KG name'],
        "user_uploaded" : true,
        "analysis_date": filename,
        "Accessibility": [{"Availability" : {"sparqlEndpoint" : rows['Sparql endpoint'] , 'RDFDumpM': rows['Availability of RDF dump (metadata)'] , 'RDFDumpQ' : rows['Availability of RDF dump (query)'], 'inactiveLinks' : rows['Inactive links'], 'uriDef' : rows['URIs Deferenceability'], 'voidAvailability' : rows['Availability VoID file']}},
                          {"Licensing" : {"licenseMetadata" : rows['License machine redeable (metadata)'],'licenseQuery' : rows['License machine redeable (query)'],'licenseHR' : rows['License human redeable']}}, 
                          {"Interlinking" :{'degreeConnection' : rows['Degree of connection'], 'clustering' : rows['Clustering coefficient'], 'centrality' : rows['Centrality'],'sameAs' : rows['Number of samAs chains']}}, 
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
    };
    converted_json_data.push(converted_json)
  }

  return [converted_json_data,kgs_id]
}

module.exports = {flat_data, filterUniqueObjects, readFileContent,csv_to_json}