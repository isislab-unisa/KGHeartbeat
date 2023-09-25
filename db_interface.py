import pymongo
from datetime import date
import utils

class DBinterface():
    def __init__(self):
        #TODO: use environment variable to construct the connection string
        self.client = pymongo.MongoClient("mongodb://gabrieleT:KGHeartbeat2023@localhost:27017")
        self.db = self.client["KGHeartbeatDB"]
        self.collection = self.db['quality_analysis_data'] 
    
    def insert_quality_data(self,kg_quality):
        today_date = date.today()
        today_date_str = today_date.strftime("%Y-%m-%d")

        filter_query = {'kg_id' : kg_quality.extra.KGid}
        results = self.collection.find(filter_query).sort("analysis_date",pymongo.DESCENDING)
        try:
            most_recent_document = results[0]
        except:
            most_recent_document = None

        #This is done for performance reason, we only store in the most recent analysis all the triples for a specific quality metric, in the old analysis we save only the number 
        #TODO: controllo nel caso SPARQL endpoint e VoID file sono offline, altrimenti inseriremo in modo errato sempre 1 come vecchio valore, se non era disp. nell'ultima analisi, saltiamo la cancellazione del valore. Il controllo è da fare sul vecchio document.
        #TODO: per fare il controllo sopra è necessario inserire esplicitamente un campo che indichi se VoID file è disponibile (è nel campo extra)
        if most_recent_document:
            old_uri_regex = utils.to_list(most_recent_document['Representational'][2]['Understandability']['regexUri'])
            most_recent_document['Representational'][2]['Understandability']['regexUri'] = len(old_uri_regex)
            
            old_serializationFormats = utils.to_list(most_recent_document['Representational'][4]['Versatility']['serializationFormats'])
            most_recent_document['Representational'][4]['Versatility']['serializationFormats'] = len(old_serializationFormats)

            newvalues = { "$set": {
            'Representational.2.Understandability.regexUri': len(old_uri_regex),
            'Representational.4.Versatility.serializationFormats': len(old_serializationFormats)
            }}

            self.collection.update_one({'kg_id' : kg_quality.extra.KGid, 'analysis_date' : most_recent_document['analysis_date']}, newvalues)

            '''
            if isinstance(old_uri_regex,str):
                old_uri_regex = old_uri_regex.split(';')
            if isinstance(old_uri_regex,list) and isinstance(kg_quality.understendability.regexUri,list):
                diff_new_uri_regex = list(set(new_uri_regex) - set(old_uri_regex))
                kg_quality.understendability.regexUri = diff_new_uri_regex
            '''
                
        obj_to_store = {
            "kg_id" : kg_quality.extra.KGid,
            "kg_name": kg_quality.believability.title,
            "analysis_date" : today_date_str,
            "Accessibility": [{"Availability" : kg_quality.availability.__dict__,'VoID_availability' : kg_quality.extra.voidAvailability},{"Licensing" : kg_quality.licensing.__dict__}, {"Interlinking" :kg_quality.interlinking.to_dict()}, 
                              {"Security" : kg_quality.security.__dict__}, {"Performance" : kg_quality.performance.__dict__}],
            "Intrinsic": [{"Accuracy" : kg_quality.accuracy.__dict__}, {"Consistency" : kg_quality.consistency.__dict__}, {"Conciseness" : kg_quality.conciseness.__dict__}],
            "Trust": [{"Reputation" : kg_quality.reputation.to_dict()}, {"Believability" : kg_quality.believability.__dict__}, {"Verifiability" : kg_quality.verifiability.to_dict()}],
            "Dataset dynamicity" : [{"Currency" : kg_quality.currency.__dict__}, {"Volatility" : kg_quality.volatility.__dict__}],
            "Contextual": [{"Completeness" : kg_quality.completeness.__dict__}, {"Amount of data" : kg_quality.amountOfData.__dict__}],
            "Representational" : [{"Representational-conciseness" : kg_quality.rConciseness.__dict__}, {"Representational-consistency" : kg_quality.rConsistency.__dict__}, {"Understandability" : kg_quality.understendability.__dict__}, 
                                  {"Interpretability" : kg_quality.interpretability.__dict__}, {"Versatility" : kg_quality.versatility.__dict__}]
        }
        result = self.collection.insert_one(obj_to_store)
        self.client.close()

        return result
