import os
from pathlib import Path
import pymongo
from datetime import date
import json
import utils


def insert_json_file(file_path):
    client = pymongo.MongoClient("mongodb://gabrieleT:KGHeartbeat2023@localhost:27017")
    db = client["KGHeartbeatDB"]
    collection = db['quality_analysis_data'] 

    with open(file_path, "r") as file:
        data = json.load(file)

    kg_id = data['kg_id']
    filter_query = {'kg_id' : kg_id}
    results = collection.find(filter_query).sort("analysis_date",pymongo.DESCENDING)
    try:
        most_recent_document = results[0]
    except:
        most_recent_document = None

    if most_recent_document:
        old_uri_regex = utils.to_list(most_recent_document['Representational'][2]['Understandability']['regexUri'])
        old_serializationFormats = utils.to_list(most_recent_document['Representational'][4]['Versatility']['serializationFormats'])
        old_publishers = utils.to_list(most_recent_document['Trust'][2]['Verifiability']['publisher'])
        old_new_vocabs = utils.to_list(most_recent_document['Representational'][1]['Representational-consistency']['newVocab'])
        old_new_terms = utils.to_list(most_recent_document['Representational'][1]['Representational-consistency']['useNewTerms'])
        old_license_q = utils.to_list(most_recent_document['Accessibility'][1]['Licensing']['licenseQuery'])
        old_vocabs = utils.to_list(most_recent_document['Trust'][2]['Verifiability']['vocabularies'])
        old_history = utils.to_list(most_recent_document['Dataset dynamicity'][0]['Currency']['historicalUp'])
        #altrimenti da erroneamente come lunghezza 1 che è il messaggio endpoint offline e non il vero valore
        newvalues = { "$set": {
        'Representational.2.Understandability.regexUri': len(old_uri_regex) if len(old_uri_regex) > 1 else most_recent_document['Representational'][2]['Understandability']['regexUri'],
        'Representational.4.Versatility.serializationFormats': len(old_serializationFormats) if len(old_serializationFormats) > 1 else most_recent_document['Representational'][4]['Versatility']['serializationFormats'],
        'Trust.2.Verifiability.publisher':  len(old_publishers) if len(old_publishers) > 1 else most_recent_document['Trust'][2]['Verifiability']['publisher'],
        'Representational.1.Representational-consistency.newVocab' : len(old_new_vocabs) if len(old_new_vocabs) > 1 else most_recent_document['Representational'][1]['Representational-consistency']['newVocab'],
        'Representational.1.Representational-consistency.useNewTerms' : len(old_new_terms) if len(old_new_terms) > 1 else most_recent_document['Representational'][1]['Representational-consistency']['useNewTerms'],
        'Accessibility.1.Licensing.licenseQuery' : len(old_license_q) if len(old_license_q) > 1 else most_recent_document['Accessibility'][1]['Licensing']['licenseQuery'],
        'Trust.2.Verifiability.vocabularies' : len(old_vocabs) if len(old_vocabs) > 1 else most_recent_document['Trust'][2]['Verifiability']['vocabularies'],
        'Dataset dynamicity.0.Currency.historicalUp' : len(old_history) if len(old_history) > 1 else most_recent_document['Dataset dynamicity'][0]['Currency']['historicalUp']
        }}
        collection.update_one({'kg_id' : kg_id, 'analysis_date' : most_recent_document['analysis_date']}, newvalues)

    result = collection.insert_one(data)
    client.close()

    return result

here = os.path.dirname(os.path.abspath(__file__))
analysis_folder = os.path.join(here,'./Analysis results')
json_path = os.path.join(analysis_folder,'./json_files')
p = Path(json_path)
files = list(p.glob('*.json'))
for file in files:
    file_name = file.stem
    filename = str(file_name)
    insert_json_file(json_path + '/' +file_name +'.json')