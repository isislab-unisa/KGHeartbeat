import unittest
import sys
sys.path.append('../')
import query
import utils
from API import Aggregator, AGAPI
import SPARQLES_APIS
from xml.dom.minidom import Document
import json
import VoIDAnalyses

class AnalysesTestCase(unittest.TestCase):
    '''
    def setUp(self) -> None:
        self.metadata = Aggregator.getDataPackage(self.KGid)
        self.accessUrl = Aggregator.getSPARQLEndpoint(self.KGid)
        self.resources = utils.toObjectResources(Aggregator.getOtherResources(self.KGid))
    '''
    def test_sparql_av(self):
        print(self.kg_url)
        kgh_result = query.checkEndPoint(self.kg_url)
        if isinstance(kgh_result,Document):
            kgh_result = True
        else:
            kgh_result = False
        sparqles_result = SPARQLES_APIS.get_endpoint_info(self.kg_url)

        self.assertEqual(kgh_result, sparqles_result)

    '''
    def test_void_av(self):
        url_void = utils.getUrlVoID(self.resources)
        if isinstance(url_void,str):
            try:
                kgh_result = VoIDAnalyses.parseVoID(url_void)
            except:
                kgh_result = False
        else:
            kgh_result = False
        sparqles_result = SPARQLES_APIS.get_void_availability(self.accessUrl)

        self.assertEqual(kgh_result,sparqles_result)
    '''

if __name__ == '__main__':

    sparqles_kgs = SPARQLES_APIS.get_all_sparql_link()
    kgh_ids = AGAPI.getIdByName('')

    kgh_sparql_links = []
    for id in kgh_ids:
        metadata = Aggregator.getDataPackage(id)
        sparql_url = Aggregator.getSPARQLEndpoint(id)
        kgh_sparql_links.append(sparql_url)

    kgh_set = set(kgh_sparql_links)
    sparqles_set = set(sparqles_kgs)

    common_kgs = list(kgh_set & sparqles_set)
    failures = 0
    passed = 0
    for kg_url in common_kgs:
        loader = unittest.TestLoader()
        suite = loader.loadTestsFromTestCase(AnalysesTestCase)

        for test_case in suite._tests:
            test_case.kg_url = kg_url
            
        
        with open(f"test_output.txt",'a') as file:
            file.write(f"--- Testing {kg_url} ---")
            test_runner = unittest.TextTestRunner(stream=file, verbosity=2)
            result = test_runner.run(suite)
            failures += len(result.failures) + len(result.errors)
    
    with open(f"test_output.txt",'a') as file:
        file.write(f"Failures: {failures}\n")
        file.write(f"Total KGs tested: {len(common_kgs)}")
