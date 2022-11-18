import json
import os
import string
import networkx as nx
from API import AGAPI
from API import Aggregator
import utils
from networkx.readwrite import json_graph
import re

def buildGraph():
    allKg = AGAPI.getAllKg()
    idList = []
    G = nx.Graph()
    for i in range(len(allKg)):
        element = allKg[i]
        id = element.get('id')
        idList.append(id)
    for j in range(len(idList)):
        externalLinks = Aggregator.getExternalLinks(idList[j])
        exLinksObj = utils.toObjectExternalLinks(externalLinks)
        print(idList[j])
        if isinstance(exLinksObj,list) and len(exLinksObj) > 0:
            for k in range(len(exLinksObj)):
                link = exLinksObj[k]
                value = str(link.value)
                value = re.sub("[^\d\.]", "",value)
                if value == '':
                    value = 0
                value = int(value)
                G.add_edge(idList[j],link.nameKG,weight=value)
    #pos = nx.spring_layout(G, k=0.8)
    #nx.draw(G,pos,with_labels=True,width=0.4,node_size=400)
    #plt.show()
    return G

def getPageRank(graph,idKg):
    pr = nx.pagerank(graph)
    return pr.get(idKg)

def getDegreeOfConnection(graph,idKg):
    degree = graph.degree(nbunch=idKg)
    return degree

def getCentrality(graph,idKg):
    degreeCentrality = nx.degree_centrality(graph)
    return degreeCentrality.get(idKg)

def getClusteringCoefficient(graph,idKG):
    clusteringCoefficient = nx.clustering(graph,idKG)
    return clusteringCoefficient

def getSubgraph(graph,nodeList):
    subG = graph.subgraph(nodeList)
    return subG

def storeAsJSON(subG):
    here = os.path.dirname(os.path.abspath(__file__))
    subGfile = os.path.join(here,'./Graphs Visualization JS/subGraph.json')
    with open(subGfile,'w',encoding="utf-8") as f:
        f.write(json.dumps(json_graph.node_link_data(subG)))

def storeEdges(graph,nodelist):
    here = os.path.dirname(os.path.abspath(__file__))
    save_path = os.path.join(here,'./Graphs Visualization JS/Subgraphs')
    for i in range(len(nodelist)):
        newFilename = re.sub(r'[\\/*?:"<>|]',"",nodelist[i])
        remove_punctuation_map = dict((ord(char), None) for char in '\/*?:"<>|')
        newFilename = newFilename.translate(remove_punctuation_map)
        remove_punctuation_map = dict((ord(char), None) for char in string.punctuation)
        newFilename = newFilename.translate(remove_punctuation_map)
        completeName = os.path.join(save_path, newFilename+".txt")
        e = graph.edges(nodelist[i])
        e = str(e)
        e = e.replace('(','[')
        e = e.replace(')',']')
        e = e.replace("'",'"')
        with open(completeName,'w',encoding="utf-8") as f:
            f.write(e)

