import requests
from kgheartbeat import KnowledgeGraph
import json
import csv

# URL of the JSON file
url = "https://lod-cloud.net/lod-data.json"

# Fetch the JSON data
response = requests.get(url)
lod_data = response.json()

# Extract elements with domain "linguistics"
linguistics_data = [value for key, value in lod_data.items() if "domain" in value and value["domain"] == "linguistics"]

sparql_passed = 0
sparql_failed = 0
triples_passed = 0
triples_failed = 0
license_passed = 0
license_failed = 0
intercmp_passed = 0
intercmp_failed = 0

with open('kghb_vs_luzzu_llod.csv', 'w', newline='') as file_csv:
    csv_writer = csv.writer(file_csv)
    csv_writer.writerow(['KG id', 'KG name','luzzu_sparql','kghb_sparql','luzzu_triples','kghb_triples','luzzu_license','kghb_license', 'luzzu_interlinking_completeness','kghb_interlinking_completeness'])
    for linguistig_kg in linguistics_data:
        kghb_obj = KnowledgeGraph(linguistig_kg['_id'])
        kghb_numtriples = kghb_obj.getNumTriples()
        kghb_license = kghb_obj.getLicenseMR()
        kghb_sparql = kghb_obj.checkEndpointAv()

        try:
            kghb_interlcmp = kghb_obj.getInterlinkingComp()
        except:
            kghb_interlcmp = '-'
        
    
        luzzu_numtriples = linguistig_kg.get('triples','-')
        luzzu_license = linguistig_kg.get('license','-')
        try:
            luzzu_sparql = linguistig_kg['sparql'][0]['status']
        except:
            luzzu_sparql = '-'

        luzzu_linked_triples = 0
        try:
            for link in linguistig_kg['links']:
                luzzu_linked_triples += int(link.get('value',0))
        except:
            luzzu_interlcmp = '-'
        
        if luzzu_sparql != 'OK':
            luzzu_sparql = False

        if luzzu_sparql == 'OK' and kghb_sparql == True:
            sparql_passed += 1
        elif luzzu_sparql == kghb_sparql:
            sparql_passed += 1
        else:
            sparql_failed += 1
        
        if luzzu_license == kghb_license:
            license_passed += 1
        else:
            license_failed += 1

        try:
            luzzu_linked_triples = int(luzzu_linked_triples)
            luzzu_numtriples = int(luzzu_numtriples)
            luzzu_interlcmp = luzzu_linked_triples / luzzu_numtriples
        except:
            luzzu_interlcmp = '-'

        try:
            if int(luzzu_numtriples) == int(kghb_numtriples):
                triples_passed += 1
            else:
                triples_failed += 1
        except:
            triples_failed += 1

        if kghb_interlcmp == 'Insufficient data':
            kghb_interlcmp = '-'

        if luzzu_interlcmp == kghb_interlcmp:
            intercmp_passed += 1
        else:
            intercmp_failed += 1

        print(luzzu_interlcmp)
        csv_writer.writerow([linguistig_kg['_id'],linguistig_kg['title'],luzzu_sparql,kghb_sparql,luzzu_numtriples,kghb_numtriples,luzzu_license,kghb_license,luzzu_interlcmp,kghb_interlcmp])

print(f'SPARQL passed: {sparql_passed}, SPARQL failed: {sparql_failed}, License passed: {license_passed}, License failed: {license_failed}, Triples passed: {triples_passed}, Triples failed: {triples_failed}, Interlinking completeness passed:{intercmp_passed}, Interlinking completeness failed:{intercmp_failed}')
