import sys
sys.path.append('../')
import query
import utils
from API import Aggregator, AGAPI
import SPARQLES_APIS
from xml.dom.minidom import Document
import json
import VoIDAnalyses
from SPARQLWrapper import SPARQLExceptions

if __name__ == '__main__':
    sparqles_kgs = SPARQLES_APIS.get_all_sparql_link()
    kgh_ids = AGAPI.getIdByName('')

    passed = 0
    failed = 0

    with open(f"void_file_test_output.txt",'a') as file:  
        for id in kgh_ids:
            
            metadata = Aggregator.getDataPackage(id)
            kg_resources = utils.toObjectResources(utils.insertAvailability(Aggregator.getOtherResources(id)))
            sparql_url = Aggregator.getSPARQLEndpoint(id)

            file.write(f"--- Testing {sparql_url} ---\n")

            #SPARQLES Test
            sparqles_void_result = SPARQLES_APIS.get_void_availability(sparql_url)
            if sparqles_void_result == 'KG not found on SPARQLES':
                #Skip this KG if isn't available on SPARQLES, we consider only KG available on both tools
                continue

            #KGHeartBeat Test
            url_void = utils.getUrlVoID(kg_resources)
            print(url_void)
            if isinstance(url_void,str):
                try:
                    kgh_result = VoIDAnalyses.parseVoID(url_void)
                    kgh_result = True
                except:
                    try:
                        kgh_result = VoIDAnalyses.parseVoIDTtl(url_void)
                        kgh_result = True
                    except:
                        kgh_result = False
            else:
                continue
            
            if kgh_result == sparqles_void_result:
                passed += 1
            else:
                file.write(f"KGHeartBeat results: {kgh_result}\n")
                file.write(f"SPARQLES result: {sparqles_void_result}")
                failed += 1

            file.flush()
    
        file.write(f"Failures: {failed}")
        file.write(f"Passed: {passed}")
        file.write(f"Total KGs tested: {failed + passed}")
        





    
