import json

def createConfiguration():
    with open('configuration.json','w') as f:
        print("The json file is created")
        data = {}
        name = []
        id = []
        #name.append('museum')
        data["name"] = name
        data["id"] = id
        json.dump(data,f)