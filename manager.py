from datetime import date
import json
import os
import pickle
import Configuration
import networkx as nx
from API import AGAPI
import Graph
import analyses
from JsonValidator import JsonValidator
from OutputCSV import OutputCSV
from score import Score
import utils
import gc
import time
import fromCSV_to_KG 

useDB = False
try : 
    import pymongo
    from db_interface import DBinterface
    useDB = True
except: 
    useDB = False

try: #GET THE CONFIGURATION FILE AND CHEK IF IT IS VALID
    here = os.path.dirname(os.path.abspath(__file__))
    configFile = os.path.join(here,'configuration.json')
    with open(configFile,'r') as f:
        input = json.load(f)
    validator = JsonValidator(input)
    result = validator.validateJson()
    #result = JsonValidator.validate(input)
    if result:
        print(input)
        print("Given data JSON is Valid")
    else:
        print(input)
        print("Given JSON data is invalid")
except  FileNotFoundError:
    Configuration.createConfiguration()   #IF THE FILE DOESN'T EXISTS, WE CREATING IT 
    try:
        with open('configuration.json','r') as f:
            input = json.load(f)
    except:
        print('Error')
        quit()

start = time.time()

toAnalyze = []
id = input.get('id')
tuple_id = []

for input_id in id:
    tuple_id.append((input_id,''))

name = input.get('name')
for i in range(len(name)): #IF NAME IS INDICATED WE RECOVER THE ID OF ALL KG FOUND
    kgFound = AGAPI.getIdByName(name[i])
    print(f"Number of KG found with keyword {name[i]}:{len(kgFound)}")
    toAnalyze = toAnalyze + kgFound

if (len(id) == 0) and (len(name) == 0): #SPECIAL INPUT, WE ANALYZE ALL KG DISCOVERABLE
    kgFound = AGAPI.getIdByName('')
    print(f"Number of KG found: {len(kgFound)}")
    toAnalyze = toAnalyze + kgFound

toAnalyze = toAnalyze + tuple_id
toAnalyze = list(dict.fromkeys(toAnalyze)) #CLEAN THE LIST FROM DUPLICATES

try: #CHECK IF THE FILE WITH THE GRAPH OF KNOWLEDGE GRAPH IS PRESENT
    here = os.path.dirname(os.path.abspath(__file__))
    gFile = os.path.join(here,'GraphOfKG.gpickle') #GET PATH OF CURRENT WORKING DIRECTORY
    infile = open(gFile,'rb')
    graph = pickle.load(infile)
    infile.close()
except FileNotFoundError:   
    graph = Graph.buildGraph() #CREATION OF THE GRAPH OF KNOWLEDGE GRAPH
    here = os.path.dirname(os.path.abspath(__file__))
    gFile = os.path.join(here,'GraphOfKG.gpickle') #GET PATH OF CURRENT WORKING DIRECTORY
    outfile = open(gFile,'wb')
    pickle.dump(graph,outfile) #STORE IT ON DISK
    outfile.close()

#PREPARING THE CSV FILE IN OUTPUT
filename = date.today()
filename = str(filename)
OutputCSV.writeHeader(filename)
OutputCSV.writeHeader(filename,include_dimensions=True)

for i in range(len(toAnalyze)):
    start_analysis = time.time()
    kg = analyses.analyses(toAnalyze[i][0],filename,toAnalyze[i][1])
    score = Score(kg,20)
    totalScore,normalizedScore = score.getWeightedDimensionScore(1)
    totalScore = "%.3f"%totalScore
    normalizedScore = "%.3f"%normalizedScore
    totalScore = float(totalScore)
    normalizedScore = float(normalizedScore)
    kg.extra.score = totalScore
    kg.extra.normalizedScore = normalizedScore
    kg.extra.scoreObj = score
    end_analysis = time.time()
    utils.write_time(toAnalyze[i][0],end_analysis-start_analysis,'--- Analysis','INFO',filename)
    csv = OutputCSV(kg,toAnalyze)
    csv_with_dim = OutputCSV(kg,toAnalyze)
    csv.writeRow(filename)
    csv_with_dim.writeRow(filename,include_dimensions=True)
    print(f"KG score: {kg.extra.score}")
    if(useDB == True):
        mongo_interface = DBinterface()
        mongo_interface.insert_quality_data(kg,score)
    del csv
    del kg
    gc.collect()
    #print(kg.getQualityKG()) #PRINT THE KG QUALITY ON THE COMAND LINE

end = time.time()
save_path = os.path.join(here,'./Analysis results')
with open(f'{save_path}/performance-{filename}.txt','a') as file:
        file.write(f'\n--- Total time for analysis:{end-start}s ---')
        file.write(f'\n--- Total time for analysis:{(end-start) / 3600} hours ---')
        file.write(f'\n--- Total time for analysis:{(end-start) / 3600} hours ---')


fromCSV_to_KG.convert_to_kg_code_from_llm(filename + '_with_dimensions')
