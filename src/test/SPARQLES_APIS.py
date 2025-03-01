import requests
def get_endpoint_info(url):
    try:
        response = requests.get(f'https://sparqles.demo.openlinksw.com/api/endpoint/info?uri={url}')   
        if response.status_code == 200:
            response = response.json()
            if len(response) == 0:
                return 'KG not found on SPARQLES'
            else:
                enpoint_status = response[0].get('availability').get('upNow')
                return enpoint_status
        else:
            print("Connection failed to SPARQLES")
            return False
    except:
        print('Connection failed to SPARQLES')
        return False
    
def get_void_availability(url):
    try:
        response = requests.get(f"https://sparqles.demo.openlinksw.com/api/endpoint/info?uri={url}")
        if response.status_code == 200:
            response = response.json()
            if len(response) == 0:
                return 'KG not found on SPARQLES'
            else:
                void_list = response[0].get('discoverability').get('VoIDDescription')
                for el in void_list:
                    void_status = el.get('value')
                    if void_status == True:
                        return True
                return False
        else:
            print("Connection failed to SPARQLES")
            return False
    except:
        print('Connection failed to SPARQLES')
        return False

def get_all_sparql_link():
    try:
        response = requests.get("https://sparqles.demo.openlinksw.com/api/endpoint/list")
        if response.status_code == 200:
            response = response.json()
            if len(response) == 0:
                return []
            else:
                sparqles_links = []
                for kg in response:
                    datasets = kg['datasets']
                    sparqles_links.append(datasets[0]['uri'])
                return sparqles_links
        else:
            return []
    except:
        return []