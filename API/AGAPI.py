import requests

def getMetadati(idKG):
    url = 'https://kgs-search-engine.herokuapp.com/brutalSearch?keyword=%s'%idKG
    try:
        response = requests.get(url)    
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
    url = 'https://kgs-search-engine.herokuapp.com/brutalSearch?keyword='
    try:
        response = requests.get(url)    
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
    url = 'https://kgs-search-engine.herokuapp.com/brutalSearch?keyword=%s'%keyword
    try:
        response = requests.get(url)    
        if response.status_code == 200:
            print("Connection to API successful and data recovered")
            response = response.json()
            results = response.get('results')
            kgfound = []
            for i in range(len(results)):
                d = results[i]
                id = d.get('id')
                kgfound.append(id)
            return kgfound
        else:
            print("Connection failed")
            return False
    except:
        print('Connection failed')
        return False
