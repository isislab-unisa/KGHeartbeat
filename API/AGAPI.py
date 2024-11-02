import requests
import os
import json
import utils

def getMetadati(idKG):
    url = 'http://www.isislab.it:12280/kgsearchengine/brutalSearch?keyword=%s'%idKG
    try:
        response = requests.get(url,verify=False)    
        if response.status_code == 200:
            response = response.json()
            results = response.get('results')
            return results
        else:
            print("Connection failed to AGAPI")
            return False
    except:
        print('Connection failed to AGAPI')
        return False

def getAllKg():
    url = 'http://www.isislab.it:12280/kgsearchengine/brutalSearch?keyword='
    try:
        response = requests.get(url,verify=False)    
        if response.status_code == 200:
            print("Connection to API successful and data recovered")
            response = response.json()
            results = response.get('results')
            return results
        else:
            print("Connection failed")
            return False
    except:
        print('Connection failed')
        return False

def getSparqlEndpoint(metadata):
    if isinstance(metadata,dict):
        sparqlInfo = metadata.get('sparql')
        if not sparqlInfo:
            return False
        accessUrl = sparqlInfo.get('access_url')
        return accessUrl

def getNameKG(metadata):
    if isinstance(metadata,dict):
        title = metadata.get('title')
        return title
    else: 
        return False

def getIdByName(keyword):
    url = 'http://www.isislab.it:12280/kgsearchengine/brutalSearch?keyword=%s'%keyword
    try:
        response = requests.get(url,verify=False)    
        if response.status_code == 200:
            utils.update_local_kgs_spnapshot()
            print("Connection to API successful and data recovered")
            response = response.json()
            results = response.get('results')
            kgfound = []
            for i in range(len(results)):
                d = results[i]
                id = d.get('id')
                name = d.get('title')
                kgfound.append((id,name))
            return kgfound
        else:
            try: 
                return utils.load_kgs_metadata_from_snap()
            except:
                return False 
    except:
        try: 
            return utils.load_kgs_metadata_from_snap()
        except:
            return False
        
