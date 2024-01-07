import sys
sys.path.append('../')
import utils
from API import Aggregator, AGAPI
import SPARQLES_APIS
import VoIDAnalyses

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
            if(sparql_url == 'False' or sparql_url == False):
                continue

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

            file.write(f"--- Testing {sparql_url} ---\n")
            if kgh_result == sparqles_void_result:
                passed += 1
                file.write(f"Passed\n")
            else:
                file.write(f"Failed\n")
                file.write(f"KGHeartBeat results: {kgh_result}\n")
                file.write(f"SPARQLES result: {sparqles_void_result}\n")
                failed += 1

            file.flush()
    
        file.write(f"Failures: {failed}\n")
        file.write(f"Passed: {passed}\n")
        file.write(f"Total KGs tested: {failed + passed}\n")
        





    
