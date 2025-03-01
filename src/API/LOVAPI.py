import mmap
import os
import re
from xml.dom.minidom import Notation
import rdflib
import requests
from rdflib import Graph

def log_in_out(func):
    from time import perf_counter
    def decorated_func(*args, **kwargs):
        start_time = perf_counter()
        print("Doing ", func.__name__)
        result = func(*args, **kwargs)
        end_time = perf_counter()
        execution_time = end_time - start_time
        print('{0} took {1:.8f}s to execute'.format(func.__name__, execution_time))
        return result

    return decorated_func

def autocompleteTerm(term):
    url = 'https://lov.linkeddata.es/dataset/lov/api/v2/term/autocomplete?q=%s'%term
    try:
        h = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36'}
        response = requests.get(url,headers=h)
        if response.status_code == 200:
            jsonResult = response.json()
            return jsonResult
        elif response.status_code == 404:
            print('Error in running the query on LOV')
            return False 
    except:
        print('Failed to connect to Linked Open Vocabularies')
        return False

def autocompleteVocab(vocab):
    url = 'https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/autocomplete?q=%s'%vocab
    try:
        response = requests.get(url)
        if response.status_code == 200:
            jsonResult = response.json()
            return jsonResult
        elif response.status_code == 404:
            print('Error in running the query on LOV')
            return False 
    except:
        print('Failed to connect to Linked Open Vocabularies')
        return False

def getAllVocab():
    url = 'https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/list'
    try:
        response = requests.get(url)
        if response.status_code == 200:
            jsonResult = response.json()
            return jsonResult
        elif response.status_code == 404:
            print('Error in running the query on LOV')
            return False 
    except:
        print('Failed to connect to Linked Open Vocabularies')
        return False

def findVocabulary(vocab):
    vocabularies = getAllVocab()
    for i in range(len(vocabularies)):
        d = vocabularies[i]
        nsp = d.get('nsp')
        uri = d.get('uri')
        if nsp == vocab:
            return True
        if uri == vocab:
            return True
    return False

def searchTerm(term):
    d = {}
    with open('lov.txt', 'r',encoding='utf-8') as f:
        for line in f.readlines():
            (key,val) = line.split(" ")
            d[int(key)] = val
    print(d)

@log_in_out
def searchTermsList(terms):
    here = os.path.dirname(os.path.abspath(__file__))
    lov1 = os.path.join(here,'lov1.txt')
    lov2 = os.path.join(here,'lov2.txt')
    newTerms = []
    with open(lov1, 'r',encoding='utf-8') as f1:
        with open(lov2, 'r',encoding='utf-8') as f2:
            data1 = set(f1.read().splitlines())
            data2 = set(f2.read().splitlines())
            for i in range(len(terms)):
                if terms[i] not in data1 and terms[i] not in data2:
                    newTerms.append(terms[i])
    return newTerms


def searchTermsOH(terms):
    with open('lov.txt', 'r',encoding='utf-8') as f:
        data = set(f.read().splitlines())
        for i in range(len(terms)):
            if terms[i] in data:
                return True
        return False
             