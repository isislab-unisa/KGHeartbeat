from ctypes import util
from dataclasses import replace
import datetime
from html import entities
from operator import sub
import re
import socket
from string import whitespace
from tabnanny import check
import time
from xml.dom.minidom import Document
from xml.parsers import expat
import json
from rdflib import VOID
import requests
from KnowledgeGraph import KnowledgeGraph
from QualityDimensions.Accuracy import Accuracy
from QualityDimensions.Availability import Availability
from QualityDimensions.Believability import Believability
from QualityDimensions.Completeness import Completeness
from QualityDimensions.Conciseness import Conciseness
from QualityDimensions.Consistency import Consistency
from QualityDimensions.Currency import Currency
from QualityDimensions.Extra import Extra
from QualityDimensions.Interlinking import Interlinking
from QualityDimensions.Interpretability import Interpretability
from QualityDimensions.Licensing import Licensing
from QualityDimensions.Performance import Performance
from QualityDimensions.RepresentationalConciseness import RepresentationalConciseness
from QualityDimensions.RepresentationalConsistency import RepresentationalConsistency
from QualityDimensions.Reputation import Reputation
from QualityDimensions.Security import Security
from QualityDimensions.Understendability import Understendability
from QualityDimensions.Verifiability import Verifiability
from QualityDimensions.Versatility import Versatility
from QualityDimensions.Volatility import Volatility
from Sources import Sources
from bloomfilter import BloomFilter
import utils
from API import Aggregator
from API import LOVAPI
from SPARQLWrapper import *
from SPARQLWrapper import SPARQLExceptions
from urllib.error import HTTPError, URLError
import urllib.request
import query
import numpy
import Graph
import networkx as nx
import VoIDAnalyses
import QualityDimensions.AmountOfData
import ssl
import score
from score import Score
import os

def analyses(idKG):

    utils.skipCheckSSL() #IGNORE THE ERROR  [SSL: CERTIFICATE_VERIFY_FAILED] 
    available = False
    isHTML = False
    absent = False
    restricted = False
    void = False
    internalError = False
    queryNotSupported = False

    metadata = Aggregator.getDataPackage(idKG)
    nameKG = Aggregator.getNameKG(metadata)
    accessUrl = Aggregator.getSPARQLEndpoint(idKG) 

    print(accessUrl)
    print('\n')

    if accessUrl == False: #CHECK IF THE SPARQL END POINT LINK IS IN THE METADATA
        endpoint = 'Endpoint absent in the metadata'
        absent = True
        available = False
    else:
        try:
            result = query.checkEndPoint(accessUrl)
            if isinstance(result,bytes):
                newUrl = utils.checkRedirect(accessUrl) #IF WE GET HTML IN THE RESPONSE, CHECK IF THE ENDPOINT IS NOW AT ANOTHER ADDRESS
                result = query.checkEndPoint(newUrl)
                if isinstance(result,bytes):
                     endpoint = 'Warning the result of endpoint is HTML'
                     available = False
                else:
                    endpoint = 'Available'
                    available = True
                    accessUrl = newUrl
            else:
                endpoint = 'Available'
                available = True
        except(HTTPError,URLError,SPARQLExceptions.EndPointNotFound,socket.gaierror) as response: #IF THERE IS ONE OF THESE EXCEPTION, ENDPOINT IS OFFLINE
            endpoint = response
            available = False
        except SPARQLExceptions.EndPointInternalError as response: #QUERY NOT SUPPORTED
            endpoint = response
        except(json.JSONDecodeError, SPARQLExceptions.QueryBadFormed,expat.ExpatError) as response: # NO AUTOMATICALLY (?), Error decoding the response
            endpoint = response
            available = False
        except(SPARQLExceptions.Unauthorized) as response: #RESTRICTED ACCCESS TO THE ENDPOINT
            endpoint = 'restricted access to the endpoint'
            available = False
            restricted = True
        except:
            endpoint = 'offline'
            available = False
        
    
    if available == False and absent == False:  
        try: 
            newUrl = utils.checkRedirect(accessUrl) #TEST OF ACCESS TO THE ENDPOINT IN CASE OF REDIRECT ON ADDRESS
            if newUrl != accessUrl:
                result = query.checkEndPoint(newUrl)
                if isinstance(result,Document) or isinstance(result,dict):
                    accessUrl = newUrl
                    available = True
                    endpoint = 'Available'
        except(HTTPError,URLError,SPARQLExceptions.EndPointNotFound,socket.gaierror) as response: 
            available = False
        except SPARQLExceptions.EndPointInternalError as response: 
            endpoint = response
        except(json.JSONDecodeError, SPARQLExceptions.QueryBadFormed,expat.ExpatError) as response:
            endpoint = response
            available = False
        except(SPARQLExceptions.Unauthorized) as response:
            endpoint = 'restricted access to the endpoint'
            available = False
            restricted = True
        except:
            endpoint = 'offline'
            available = False
    
    #GET THE SOURCE OF THE DATASET
    sources = Aggregator.getSource(metadata)
    if sources == False:
        sourcesC = Sources('absent','absent','absent')
    else:
        sourcesC = Sources(sources.get('web','Absent'),sources.get('name','Absent'),sources.get('email','Absent'))
    
    if available == False and absent == False and sourcesC.web != 'absent': #TRY TO ACCESS AT THE SPARQL ENDPOINT ADDING \sparql AT THE END OF THE DATASET URL
        try:
            newUrl = sourcesC.web + '/sparql'
            result = query.checkEndPoint(newUrl)
            if isinstance(result,Document) or isinstance(result,dict):
                accessUrl = newUrl
                available = True
                endpoint = 'Available'
                print(accessUrl)
        except(HTTPError,URLError,SPARQLExceptions.EndPointNotFound,socket.gaierror) as response: #IF THERE IS ONE OF THESE EXCEPTION, ENDPOINT IS OFFLINE
            endpoint = response
            available = False
        except SPARQLExceptions.EndPointInternalError as response: #QUERY NOT SUPPORTED
            endpoint = response
        except(json.JSONDecodeError, SPARQLExceptions.QueryBadFormed,expat.ExpatError) as response: # NO AUTOMATICALLY (?), Error decoding the response
            endpoint = response
            available = False
        except(SPARQLExceptions.Unauthorized) as response: #RESTRICTED ACCCESS TO THE ENDPOINT
            endpoint = 'restricted access to the endpoint'
            available = False
            restricted = True
        except:
            endpoint = 'offline'
            available = False
    
    #GET NUMBERS OF TRIPLES FROM METADATA
    triplesM = Aggregator.getTriples(metadata)
    try:
        triplesM = int(triplesM)
    except ValueError:
        triplesM = 0
     
    #GET OTHER RESOURCES OF THE DATASET
    resourcesDH = Aggregator.getOtherResources(idKG)
    
    #CHECK THE AVAILABILITY OF THE URL IN THE RESOURCES LIST AND ADDING A FIELD STATUS. STATUS = ACTIVE IF THE URL IS ONLINE, STATUS = OFFLINE IF THE URL IS OFFLINE
    resourcesDH = utils.insertAvailability(resourcesDH)

    #CHECK AVAILABILITY FOR DOWNLOAD OF THE DATASET
    downloadUrl = [] 
    offlineDump = []
    availableDownload = utils.checkAvailabilityForDownload(resourcesDH)
    downloadUrl = downloadUrl + utils.getLinkDownload(resourcesDH)
    offlineDump = offlineDump + utils.getLinkOfflineDump(resourcesDH)

    otResources = utils.toObjectResources(resourcesDH) #CREATING A LIST OF RESOURCES OBJECT

    #CHECK THE AVAILABILITY OF VOID FILE
    urlV = utils.getUrlVoID(otResources)
    voidStatus = ''
    if isinstance(urlV,str):
        print(urlV)
        try:
            voidFile = VoIDAnalyses.parseVoID(urlV)
            void = True
            voidStatus = 'VoID file available'
        except:
            try:
                voidFile = VoIDAnalyses.parseVoIDTtl(urlV)
                void = True
                voidStatus = 'VoID file available'
            except:
                void = False 
                voidStatus = 'VoID file offline'
    if void == False and not isinstance(urlV,str) and sourcesC.web != 'absent' and sourcesC.web != 'Absent':
        urlV = sourcesC.web + '/.well-known/void'
        try:
            voidFile = VoIDAnalyses.parseVoID(urlV)
            void = True
            voidStatus = 'VoID file available'
            print(urlV)
        except:
            try:
                voidFile = VoIDAnalyses.parseVoIDTtl(urlV)
                void = True
                voidStatus = 'VoID file available'
            except:
                void = False
                voidStatus = 'VoID file offline'
    if not isinstance(urlV,str):
        voidStatus = 'VoID file absent'
    
    print('SPARQL endpoint availability: %s'%available)

    if available == True:    #IF ENDOPOINT IS ONLINE WE GET ALL NECESSARY INFORMATION FROM THE ENDPOINT

         #TRY TO GET ALL TRIPLES (IMPORTANT FOR CALCULATING VARIOUS METRICS)
        allTriples = []
        try:
            allTriples = query.getAllTriplesSPO(accessUrl)
        except:
            allTriples = 'Could not process formulated query on indicated endpoint'
        
        #GET LATENCY (MIN-MAX-AVERAGE)
        try:
            latency = query.testLatency(accessUrl)     
            sumLatency = sum(latency)
            av = sumLatency/len(latency)
            minL = min(latency)
            maxL = max(latency)
            standardDeviation = numpy.std(latency)
            sumLatency = str(sumLatency)
            percentile25L = numpy.percentile(latency,25)
            percentile75L = numpy.percentile(latency,75)
            medianL = numpy.median(latency)
            av = "%.3f"%av
            av = str(av)
            minL = "%.3f"%minL
            minL = str(minL)
            maxL = "%.3f"%maxL
            maxL = str(maxL)
            standardDeviation = "%.3f"%standardDeviation
            standardDeviation = str(standardDeviation)
            sumLatency = sumLatency.replace('.',',')
            av = av.replace('.',',')
            minL = minL.replace('.',',')
            maxL = maxL.replace('.',',')
            standardDeviation = standardDeviation.replace('.',',')
            percentile25L = "%.3f"%percentile25L
            medianL = "%.3f"%medianL
            percentile75L = "%.3f"%percentile75L
            percentile25L = str(percentile25L)
            percentile75L = str(percentile75L)
            medianL = str(medianL)
            percentile25L = percentile25L.replace('.',',')
            percentile75L = percentile75L.replace('.',',')
            medianL = medianL.replace('.',',')
           
        except urllib.error.HTTPError as response:
            responseStr = str(response)
            av = responseStr
            minL = responseStr
            maxL = responseStr
            standardDeviation = responseStr
            percentile25L = responseStr
            percentile75L = responseStr
            medianL = responseStr
        except SPARQLExceptions.QueryBadFormed:
            responseStr = 'Query Not Supported'
            av = responseStr
            minL = responseStr
            maxL = responseStr
            standardDeviation = responseStr
            percentile25L = responseStr
            percentile75L = responseStr
            medianL = responseStr
        except SPARQLExceptions.EndPointInternalError:
            responseStr = 'Endpoint internal error'
            av = responseStr
            minL = responseStr
            maxL = responseStr
            standardDeviation = responseStr
            percentile25L = responseStr
            percentile75L = responseStr
            medianL = responseStr
        except:
            responseStr = 'Could not process formulated query on indicated endpoint'
            av = responseStr
            minL = responseStr
            maxL = responseStr
            standardDeviation = responseStr
            percentile25L = responseStr
            percentile75L = responseStr
            medianL = responseStr
        #GET THE TRIPLES WITH A QUERY
        try:
            triplesQuery = query.getNumTripleQuery(accessUrl)   
        except urllib.error.HTTPError as response:
            responseStr = str(response)
            triplesQuery = responseStr
        except(SPARQLExceptions.QueryBadFormed,SPARQLExceptions.EndPointInternalError) as response:
            response = str(response)
            response = response.rstrip()
            triplesQuery = response
        except:
            triplesQuery = 'Could not process formulated query on indicated endpoint.'

        #CHECK IF RESULTS FROM SPARQL ENDPOINT IS LIMITED
        if isinstance(allTriples,list) and isinstance(triplesQuery,int):
            if len(allTriples) < triplesQuery:
                limited = True
            else:
                limited = False
        else:
            limited = 'impossible to verify'

        #CHECK IF NEW TERMS ARE DECLARED IN THE DATASET
        newTermsD = []
        triplesO = []
        try:
            objectList = []
            triplesO = query.getAllTypeO(accessUrl)
            newTermsD = LOVAPI.searchTermsList(triplesO)
        except:
            newTermsD = 'Could not process formulated query on indicated endpoint'

        #GET THE LANGUAGE OF KG
        try:
            languages = query.getLangugeSupported(accessUrl)  
        except urllib.error.HTTPError as response:
            languages = response
        except (SPARQLExceptions.QueryBadFormed,SPARQLExceptions.EndPointNotFound) as response:
            response = str(response)
            response = response.rstrip()
            languages = response
        except:
            languages = 'Could not process formulated query on indicated endpoint.'

        #GET THE NUMBER OF THE BLANK NODE
        try:
            numBlankNode = query.numBlankNode(accessUrl)  
        except urllib.error.HTTPError as response:
            responseStr = str(response)
            numBlankNode = responseStr.rstrip().strip
        except (SPARQLExceptions.QueryBadFormed,SPARQLExceptions.EndPointInternalError) as response:
            response = str(response)
            response = response.rstrip().strip()
            numBlankNode = response
        except:
            numBlankNode = 'Could not process formulated query on indicated endpoint.'
        
        #CHECK IF SPARQL ENDPOINT USE HTTPS
        try:
            isSecure = utils.checkhttps(accessUrl)
            if isSecure != True:
                isSecure = True  
        except:  #IF WE GET A SPARQL QUERY ON URL WITH HTTPS AND GET AN EXCEPTION THEN ENDPOINT ISN'T AVAILABLE ON HTTPS
            isSecure = False
        
        #CHECK IF IT USES RDF STRUCTURES    
        try:
            RDFStructures = query.checkRDFDataStructures(accessUrl)
        except:
            RDFStructures = 'Could not process formulated query on indicated endpoint.'
        
        #CHECK IF THERE ARE DIFFERENT SERIALISATION FORMATS
        try:
            formats = query.checkSerialisationFormat(accessUrl)   #CHECK IF THE LINK IS ONLINE
        except:
            formats = 'Could not process formulated query on indicated endpoint.'
        
        #CHECK IF IN THE DATASET IS INDICATED THE LINK TO DONWLOAD THE DATASET
        try:
            urlList = query.checkDataDump(accessUrl)
            if isinstance(urlList,list):
                availableDump = utils.checkAvailabilityListResources(urlList)
                urlsDump = utils.getActiveDumps(urlList)
                urlsInactive = utils.getInactiveDumps(urlList)
                downloadUrl = downloadUrl + urlsDump
                offlineDump = offlineDump + urlsInactive
            else:
                availableDump = 'absent'
        except:
            availableDump = 'Could not process formulated query on indicated endpoint.'
        
        #CHEK IF THERE IS AN INDICATION OF A LICENSE MACHINE REDEABLE
        try:
            licenseMr = query.checkLicenseMR2(accessUrl)
            if isinstance(licenseMr,list):
                licenseMr = licenseMr[0]
        except:
            licenseMr = 'Could not process formulated query on indicated enpdoint'
        
        #CHECK IF THERE IS AN INDICATION OF A LICENSE HUMAN REDEABLE
        try:
            licenseHr = query.checkLicenseHR(accessUrl)
        
        except (SPARQLExceptions.QueryBadFormed,SPARQLExceptions.EndPointInternalError) as response:
            licenseHr = response
        except:
            licenseHr = 'Could not process formulated query on indicated enpdoint'
        
        #CHECK NUMBER OF PROPERTY
        try:
            numProperty = query.numberOfProperty(accessUrl)
        except:
            numProperty = 'Could not process formulated query on indicated enpdoint'
        
        #GET NUMBER OF TRIPLES WITH LABEL
        try:
            numLabel = query.getNumLabel(accessUrl)
        except:
            numLabel = 'Could not process formulated query on indicated enpdoint'
        
        #GET THE REGEX OF THE URLs USED
        regex = []
        try:
            regex = query.checkUriRegex(accessUrl)
        except:
            regex = 'Could not process formulated query on indicated enpdoint'
        
        #CHECK IF IS INDICATED A URI SPACE INSTEAD OF A REGEX AND WE TRAFORM IT TO REGEX
        try:    
            pattern = query.checkUriPattern(accessUrl)  
            if isinstance(pattern,list):
                for i in range(len(pattern)): 
                    newRegex = utils.trasforrmToRegex(pattern[i])
                    regex.append(newRegex)
        except:
            pattern = 'Could not process formulated query on indicated enpdoint'
        
        #GET THE VOCABULARIES OF THE KG
        try:
            vocabularies = query.getVocabularies(accessUrl)
        except:
            vocabularies = 'Could not process formulated query on indicated enpdoint'
        
        #GET THE AUTHOR OF THE DATASET WITH A QUERY
        try:
            authorQ = query.getCreator(accessUrl)
        except:
            authorQ = 'Could not process formulated query on indicated enpdoint'
        
        #GET THE PUBLISHERS OF THE DATASET
        try:
            publisher = query.getPublisher(accessUrl)
        except:
            publisher = 'Could not process formulated query on indicated enpdoint'
        
        #GET THE THROUGHPUT
        try:
            countList = utils.getThroughput(accessUrl)
            minThroughput = min(countList)
            maxThroughput = max(countList)
            sumThroughput = sum(countList)
            averageThroughput = sumThroughput/len(countList)
            standardDeviationT = numpy.std(countList)
            percentile25T = numpy.percentile(countList,25)
            percentile75T = numpy.percentile(countList,75)
            medianT = numpy.median(countList)
            percentile25T = str(percentile25T)
            percentile25T = percentile25T.replace('.',',')
            percentile75T = str(percentile75T)
            percentile75T = percentile75T.replace('.',',')
            medianT = str(medianT)
            medianT = medianT.replace('.',',')
            standardDeviationT = str(standardDeviationT)
            standardDeviationT = standardDeviationT.replace('.',',')
            averageThroughput = str(averageThroughput)
            averageThroughput = averageThroughput.replace('.',',')
        except:
            errorResponse = 'Could not process formulated query on indicated enpdoint'
            minThroughput = errorResponse
            maxThroughput = errorResponse
            averageThroughput = errorResponse
            standardDeviationT = errorResponse
            percentile25T = errorResponse
            percentile75T = errorResponse
            medianT = errorResponse

        #GET THE THROUGHPUT NO OFFSET
        try:
            countListNoOff = utils.getThroughputNoOff(accessUrl)
            minThroughputNoOff = min(countListNoOff)
            maxThroughputNoOff = max(countListNoOff)
            sumThroughputNoOff = sum(countListNoOff)
            averageThroughputNoOff = sumThroughput/len(countListNoOff)
            standardDeviationTNoOff = numpy.std(countListNoOff)
            standardDeviationTNoOff = str(standardDeviationT)
            standardDeviationTNoOff = standardDeviationT.replace('.',',')
            averageThroughputNoOff = str(averageThroughput)
            averageThroughputNoOff = averageThroughput.replace('.',',')
        except:
            errorResponseNoOff = 'Could not process formulated query on indicated enpdoint'
            minThroughputNoOff = errorResponseNoOff
            maxThroughputNoOff = errorResponseNoOff
            averageThroughputNoOff = errorResponseNoOff
            standardDeviationTNoOff = errorResponseNoOff

       #GET NUMBER OF ENTITIES
        try:
            numEntities = query.getNumEntities(accessUrl)
        except:
            numEntities = 'Could not process formulated query on indicated enpdoint'

        #GET NUMBER OF ENTITIES WITH REGEX
        try:
            if len(regex) > 0:
                entitiesRe = 0
                for i in range(len(regex)):
                    entitiesRe = entitiesRe + query.getNumEntitiesRegex(accessUrl,regex[i])
            else:
                entitiesRe = 'insufficient data'
        except Exception as e:
             entitiesRe = e
        
        if not(isinstance(entitiesRe,int)) or entitiesRe == 0: #IF CONTROL WITH SPARQL ENDPOINT FAILS WE COUNT THE ENTITY BY RECOVERING ALL THE TRIPLES
            try:
                if isinstance(allTriples,list) and isinstance(regex,list):
                    if len(regex) > 0:
                        entitiesRe = 0
                        for i in range(len(regex)):
                            r = regex[i]
                            for j in range(len(allTriples)):
                                s = allTriples[j].get('s')
                                valueS = s.get('value')
                                if utils.checkString(r,valueS) == True:
                                    entitiesRe = entitiesRe + 1
                        entitiesRe = str(entitiesRe)
                        entitiesRe = entitiesRe + f" (out of {len(allTriples )} triples considered)"
                    else:
                        entitiesRe = 'Insufficient data'
                else:
                    entitiesRe = 'Insufficient data'
            except Exception as e:
                entitiesRe = str(e)
        
        #GET THE CONTRIBUTORS OF THE DATASET
        try:
            contributors = query.getContributors(accessUrl)
        except:
            contributors = 'Could not process formulated query on indicated enpdoint'
        
        #GET THE NUMBER OF sameAs CHAINS
        try:
            numberSameAs = query.getSameAsChains(accessUrl)
        except:
            numberSameAs = 'Could not process formulated query on indicated enpdoint'
        
        #GET THE DATASET UPDATE FREQUENCY
        try:
            frequency = query.getFrequency(accessUrl)
        except:
            frequency = 'Could not process formulated query on indicated enpdoint'
        
        #GET THE CREATION DATE
        try:
            creationDate = query.getCreationDateMin(accessUrl)
            if creationDate == False or creationDate == '':
                creationDate = query.getCreationDate(accessUrl)
        except:
            try:
                creationDate = query.getCreationDate(accessUrl)
            except:
                creationDate = 'Could not process formulated query on indicated endpoint'

        #GET THE LAST MODIFICATION DATE OF THE DATASET
        try:
            modificationDate = query.getModificationDateMax(accessUrl)
            if modificationDate == False or modificationDate == '':
                modificationDate = query.getModificationDate(accessUrl)
        except:
            try:
                modificationDate = query.getModificationDate(accessUrl)
            except:
                modificationDate = 'Could not process formulated query on indicated endpoint'

        #GET HISTORICAL UPDATES
        historicalUp = []
        try:
            historicalUp = []
            dateUpdates = query.getDateUpdates(accessUrl)
            if isinstance(dateUpdates,list):
                newL = list(set(dateUpdates))
                newL.sort(key=lambda date: datetime.datetime.strptime(date,"%Y-%m-%d"))
                for i in newL:
                    i = str(i)
                    num = query.getNumUpdatedData(accessUrl,i)
                    valueUp = f"{i}|{num}"
                    valueUp = valueUp.strip()
                    historicalUp.append(valueUp)                    
        except Exception as e:
            historicalUp = 'Could not process formulated query on indicated endpoint'
            print(e)

        #GET THE NUMBER OF TRIPLES UPDATED
        try:
            numTriplesUpdated = query.getNumUpdatedData(accessUrl,modificationDate)
        except:
            numTriplesUpdated = 'Could not process formulated query on indicated endpoint'

        #URI LENGHT CALCULATION (SUBJECT)
        try:
            lenghtList = []
            for i in range(len(allTriples)):
                s = allTriples[i].get('s')
                uri = s.get('value')
                if utils.checkURI(uri) == True:
                    lenghtList.append(len(uri))  
            sumLenghts = sum(lenghtList)
            avLenghts = sumLenghts/len(lenghtList) 
            avLenghts = str(avLenghts)
            avLenghts = avLenghts.replace('.',',')
            avLenghts = avLenghts + f" (out of {len(allTriples)} triples considered)"
            standardDeviationL = numpy.std(lenghtList)
            standardDeviationL = str(standardDeviationL)
            standardDeviationL = standardDeviationL.replace('.',',')
            minLenghtS = min(lenghtList)
            maxLenghtS = max(lenghtList)
            medianLenghtS = numpy.median(lenghtList)
            percentile25LenghtS = numpy.percentile(lenghtList,25)
            percentile75LenghtS = numpy.percentile(lenghtList,75)
            minLenghtS = str(minLenghtS)
            maxLenghtS = str(maxLenghtS)
            medianLenghtS = str(medianLenghtS)
            percentile25LenghtS = str(percentile25LenghtS)
            percentile75LenghtS = str(percentile75LenghtS)
            minLenghtS = minLenghtS.replace('.',',')
            maxLenghtS = maxLenghtS.replace('.',',')
            medianLenghtS = medianLenghtS.replace('.',',')
            percentile25LenghtS = percentile25LenghtS.replace('.',',')
            percentile75LenghtS = percentile75LenghtS.replace('.',',')
        except :
            errorMessage = 'Could not process formulated query on indicated endpoint'
            standardDeviationL = errorMessage
            avLenghts = errorMessage
            minLenghtS = errorMessage
            maxLenghtS = errorMessage
            medianLenghtS = errorMessage
            percentile25LenghtS = errorMessage
            percentile75LenghtS = errorMessage

        #URI LENGHT CALCULATION (OBJECT)
        allUri = []
        try:
            uriListO = query.getAllObject(accessUrl)
            lenghtListO = []
            for i in range(len(uriListO)):
                uriO = uriListO[i]
                if utils.checkURI(uriO) == True:
                    lenghtListO.append(len(uriO))
            sumLenghtsO = sum(lenghtListO)
            avLenghtsO = sumLenghtsO/len(lenghtListO) 
            avLenghtsO = str(avLenghtsO)
            avLenghtsO = avLenghtsO.replace('.',',')
            avLenghtsO = avLenghtsO+f" (out of {len(uriListO)} triples considered)"
            standardDeviationLO = numpy.std(lenghtListO)
            standardDeviationLO = str(standardDeviationLO)
            standardDeviationLO = standardDeviationLO.replace('.',',')
            minLenghtO = min(lenghtListO)
            maxLenghtO = max(lenghtListO)
            medianLenghtO = numpy.median(lenghtListO)
            percentile25LenghtO = numpy.percentile(lenghtListO,25)
            percentile75LenghtO = numpy.percentile(lenghtListO,75)
            minLenghtO = str(minLenghtO)
            maxLenghtO = str(maxLenghtO)
            medianLenghtO = str(medianLenghtO)
            percentile25LenghtO = str(percentile25LenghtO)
            percentile75LenghtO = str(percentile75LenghtO)
            minLenghtO = minLenghtO.replace('.',',')
            maxLenghtO = maxLenghtO.replace('.',',')
            medianLenghtO = medianLenghtO.replace('.',',')
            percentile25LenghtO = percentile25LenghtO.replace('.',',')
            percentile75LenghtO = percentile75LenghtO.replace('.',',')
        except:
            errorMessage = 'Could not process formulated query on indicated endpoint'
            uriListO = errorMessage
            avLenghtsO = errorMessage
            standardDeviationLO = errorMessage
            minLenghtO = errorMessage
            maxLenghtO = errorMessage
            medianLenghtO = errorMessage
            percentile25LenghtO = errorMessage
            percentile75LenghtO = errorMessage

        #URI LENGHT CALCULATION (PREDICATE)
        try:
            uriListP = query.getAllPredicate2(accessUrl)
            lenghtListP = []
            for i in range(len(uriListP)):
                uriP = uriListP[i]
                if utils.checkURI(uriP) == True:
                    lenghtListP.append(len(uriP))
            sumLenghtsP = sum(lenghtListP)
            avLenghtsP = sumLenghtsP/len(lenghtListP) 
            avLenghtsP = str(avLenghtsP)
            avLenghtsP = avLenghtsP.replace('.',',')
            avLenghtsP = avLenghtsP+f" (out of {len(uriListP)} triples considered)"
            standardDeviationLP = numpy.std(lenghtListP)
            standardDeviationLP = str(standardDeviationLP)
            standardDeviationLP = standardDeviationLP.replace('.',',')
            minLenghtP = min(lenghtListP)
            maxLenghtP = max(lenghtListP)
            medianLenghtP = numpy.median(lenghtListP)
            percentile25LenghtP = numpy.percentile(lenghtListP,25)
            percentile75LenghtP = numpy.percentile(lenghtListP,75)
            minLenghtP = str(minLenghtP)
            maxLenghtP = str(maxLenghtP)
            medianLenghtP = str(medianLenghtP)
            percentile25LenghtP = str(percentile25LenghtP)
            percentile75LenghtP = str(percentile75LenghtP)
            minLenghtP = minLenghtP.replace('.',',')
            maxLenghtP = maxLenghtP.replace('.',',')
            medianLenghtP = medianLenghtP.replace('.',',')
            percentile25LenghtP = percentile25LenghtP.replace('.',',')
            percentile75LenghtP = percentile75LenghtP.replace('.',',')

        except:
            errorMessage = 'Could not process formulated query on indicated endpoint'
            uriListP = errorMessage
            avLenghtsP = errorMessage
            standardDeviationLP = errorMessage
            minLenghtP = errorMessage
            maxLenghtP = errorMessage
            medianLenghtP = errorMessage
            percentile25LenghtP = errorMessage
            percentile75LenghtP = errorMessage

        #A LIST OF ALL URIs IS REQUIRED TO CALCULATE THE SCORE
        if isinstance(allTriples,list) and isinstance(uriListP,list) and isinstance(uriListO,list):
            uriListS = []
            for i in range(len(allTriples)):
                s = allTriples[i].get('s')
                uri = s.get('value')
                uriListS.append(uri)
            allUri = uriListO + uriListP + uriListS
        
        #CHECK IF EXISTING VOCABULARIES ARE RE-USED IN THE DATASET
        try:
            newVocab = []
            if isinstance(vocabularies,list):
                for i in range(len(vocabularies)):
                    vocab = vocabularies[i]
                    result = LOVAPI.findVocabulary(vocab)
                    if result == False:
                        newVocab.append(vocab)
        except:
            newVocab = 'Could not process formulated query on indicated endpoint'
        
        #CHECK USE OF DEPRECATED CLASSES AND PROPERTIES
        try:
            deprecated = query.getDeprecated(accessUrl)
        except:
            deprecated = 'Could not process formulated query on indicated endpoint'
        
        #CHECK FOR FUNCTIONAL PROPERTIES WITH INCONSISTENT VALUE
        try:
            violationFP = []
            triplesFP = query.getFP(accessUrl)
            for triple in triplesFP:
                s = triple.get('s')
                subject1 = s.get('value')
                o = triple.get('o')
                obj1 = o.get('value')
                for triple2 in triplesFP:
                    s = triple2.get('s')
                    subject2 = s.get('value')
                    o = triple2.get('o')
                    obj2 = o.get('value')
                    if subject1 == subject2 and obj1 != obj2:
                        violationFP.append(triple)
            FPvalue = 1.0 - (len(violationFP)/triplesQuery)
        except:
            FPvalue = '-'
        
        #CHECK FOR INVALID USAGE OF INVERSE-FUNCTIONAL PROPERTIES
        try:
            violationIFP = []
            triplesIFP = query.getIFP(accessUrl)
            for triple in triplesIFP:
                s = triple.get('s')
                subject1 = s.get('value')
                o = triple.get('o')
                obj1 = o.get('value')
                for triple2 in triplesIFP:
                    s = triple2.get('s')
                    subject2 = s.get('value')
                    o = triple2.get('o')
                    obj2 = o.get('value')
                    if obj1 == obj2 and subject1 != subject2:
                        violationIFP.append(triple)
            IFPvalue = 1.0 - (len(violationIFP)/triplesQuery)
        except:
            IFPvalue = '-'
        
        #CHECK IF THERE ARE EMPTY ANNOTATION AS LABEL/COMMENT
        labels = []
        try:
            labels = query.getLabel(accessUrl)
            emptyAnnotation = 0
            for i in range(len(labels)):
                obj = labels[i]
                if utils.checkURI(obj) == False:
                    if obj == '':
                        emptyAnnotation = emptyAnnotation + 1
            emptyAnnotation = 1.0 - (emptyAnnotation/len(labels))
        except:
            emptyAnnotation = 'Could not process formulated query on indicated endpoint'
        
        #CHECK IF TRIPLES HAVE A WHITE SPACE ANNOTATION PROBLEM
        try:
            wSP = []
            for i in range(len(labels)):
                obj = labels[i]
                if utils.checkURI(obj) == False:
                    if obj != obj.strip():
                        wSP.append(obj)
            numWSP = 1.0 - (len(wSP)/len(labels))
        except:
            numWSP = 'Could not process formulated query on indicated endpoint'

        #CHECK IF TRIPLES HAVE A MALFORMED DATA TYPE LITERALS PROBLEM
        try:
            malformedTriples = []
            if isinstance(allTriples,list):
                for i in range(len(allTriples)):
                    obj = allTriples[i].get('o')
                    value = obj.get('value')
                    if utils.checkURI(value) == False:
                        dataType = obj.get('datatype')
                        if isinstance(dataType,str):
                            regex = utils.getRegex(dataType)
                            if regex is not None:
                                result = utils.checkString(regex,value)
                                if result == False:
                                    malformedTriples.append(obj)
                numMalformedTriples = 1.0 - (len(malformedTriples)/len(allTriples))
            else:
                numMalformedTriples = 'Could not process formulated query on indicated endpoint'
        except:
            numMalformedTriples = 'Could not process formulated query on indicated endpoint'

        #CHECK FOR ENTITIES MEMBER OF A DISJOINT CLASS
        try:
            numDisjoint = query.getDisjoint(accessUrl)
        except:
            numDisjoint = 'Could not process formulated query on indicated endpoint'
        
        #CHECK FOR TRIPLES WITH MISPLACED PROPERTY PROBLEM
        classes = []
        try:
            misplacedProperty = []
            classes = query.getAllClasses(accessUrl)
            if isinstance(classes,list):
                for predicate in query.getAllPredicate(accessUrl):
                    result = utils.checkURI(predicate)
                    if result == True:
                        classes.sort()
                        r = utils.binarySearch(classes,0,len(classes)-1,predicate)
                        if r != -1:
                            misplacedProperty.append(predicate)
                        #for j in range(len(classes)):
                            #if p == classes[j]:
                                #misplacedProperty.append(p)
            else:
                misplacedProperty = 'insufficient data'
        except Exception as e:
            misplacedProperty = e

        #CHECK FOR TRIPLES WITH MISPLACED CLASS PROBLEM
        properties = []
        try:
            misplacedClass = []
            properties = query.getAllProperty(accessUrl)
            found = False
            if isinstance(allTriples,list) and isinstance(properties,list):
                properties.sort()
                for i in range(len(allTriples)):
                    o = allTriples[i].get('o')
                    valueO = o.get('value')
                    s = allTriples[i].get('s')
                    valueS = s.get('value')
                    result = utils.checkURI(valueS)
                    if result == True:
                        r = utils.binarySearch(properties,0,len(properties)-1,valueS)
                        if r != -1:
                            found = True
                        #for j in range(len(properties)):
                            #if valueS == properties[j]:
                                #print(properties[j])
                                #found = True
                    resultO = utils.checkURI(valueO)
                    if found == False and resultO == True:
                        r2 = utils.binarySearch(properties,0,len(properties)-1,valueO)
                        if r2 != -1:
                            found = True
                        #for k in range(len(properties)):
                            #if valueS == properties[k]:
                                #found = True
                    if found == True:
                        misplacedClass.append(valueS)
                        found = False
            else:
                misplacedClass = 'insufficient data'
        except TimeoutError:
            misplacedClass = 'Timeout'
        except:
            misplacedClass = 'Could not process formulated query on indicated endpoint'
        
        #CHECK THE TRIPLES WITH ONTOLOGY HIJACKING PROBLEM
        allType = []
        try:
            allType = query.getAllType(accessUrl)
            triplesOH = False
            if isinstance(allType,list):
                triplesOH = LOVAPI.searchTermsList(allType)
                if len(triplesOH) > 0:
                    hijacking = True
                else:
                    hijacking = False
            else:
                hijacking = 'Impossible to retrieve the terms defined in the dataset'
        except:
            hijacking = 'Could not process formulated query on indicated endpoint'
        
        #CHECK USE OF UNDEFINED CLASS
        try:
            toSearch = []
            found = False
            for i in range(len(allTriples)):
                s = allTriples[i].get('s')
                s = s.get('value')
                allType.sort()
                r = utils.binarySearch(allType,0,len(allType)-1,s)
                if r != -1:
                    found = True
                    break
                #for j in range(len(rdfTS)):
                    #sType = rdfTS[j]
                    #if s == sType:
                        #found = True
                        #break
                if found == False:
                    result = utils.checkURI(s)
                    if result == True:
                        toSearch.append(s)
                found = False
            undClasses = LOVAPI.searchTermsList(toSearch)
        except:
            undClasses = 'Could not process formulated query on indicated endpoint'
        
        #CHECK USE OF UNDEFINED PROPERTY
        try:
            toSearch = []
            found = False
            for predicate in query.getAllPredicate(accessUrl):
                properties.sort()
                r = utils.binarySearch(properties,0,len(properties)-1,predicate)
                if r != -1:
                    found = True
                    break
                #for j in range(len(listP)):
                    #p2 = listP[j]
                    #if p == p2:
                        #found = True
                        #break
                if found == False:
                    result = utils.checkURI(predicate)
                    if result == True:
                        toSearch.append(predicate)
                found = False
            undProperties = LOVAPI.searchTermsList(toSearch)
        except :
            undProperties = 'Could not process formulated query on indicated endpoint'

                #CALCULATION OF THE EXTENSIONAL CONCISENESS
        try:
            tripleList = []
            duplicate = []
            if isinstance(allTriples,list):
                if len(allTriples)> 0:    
                    for i in range(len(allTriples)):
                        s = allTriples[i].get('s')
                        p = allTriples[i].get('p')
                        o = allTriples[i].get('o')
                        subject = s.get('value')
                        predicate = p.get('value')
                        object = o.get('value')
                        triple = subject + predicate + object
                        tripleList.append(triple)
                    bloomF = BloomFilter(len(tripleList),0.05)
                    print("Size of bit array:{}".format(bloomF.size))
                    print("False positive Probability:{}".format(bloomF.fp_prob))
                    print("Number of hash functions:{}".format(bloomF.hash_count))
                    for i in range(len(tripleList)):
                        found = bloomF.check(tripleList[i])
                        if found == False:
                            bloomF.add(tripleList[i])
                        elif found == True:
                            duplicate.append(tripleList[i])

                    if len(allTriples) > 0:
                        exC = 1.0 - (len(duplicate)/len(allTriples)) # From: Evaluating the Quality of the LOD Cloud: An Empirical Investigation (Ruben Verborgh)
                        exC = str(exC)
                        exC = exC + f" (out of {len(allTriples)} triples considered)"
                    else:
                        exC = 'insufficient data'
                else:
                    exC = 'No triples retrieved from the endpoint'
            else:
                exC = 'insufficient data'
        except:
            exC = 'Could not process formulated query on indicated endpoint'
        
        #CALCULATION OF INTENSIONAL CONCISENESS
        try:
            triplePropList = []
            duplicateP = []
            count = 0
            for prop in query.getAllPropertySP(accessUrl):
                s = prop.get('s')
                p = prop.get('p')
                subP = s.get('value')
                predP = p.get('value')
                tripleProp = subP + predP
                triplePropList.append(tripleProp)
                count = count+1
            bloomF2 = BloomFilter(len(triplePropList),0.05)
            for j in range(len(triplePropList)):
                found = bloomF2.check(triplePropList[j])
                if found == False:
                    bloomF2.add(triplePropList[j])
                elif found == True:
                    duplicateP.append(triplePropList[j])
            
            if count > 0:
                intC = 1.0 - (len(duplicateP)/count)
                intC = str(intC)
                intC = intC + f" (out of {count} triples considered)"
            else:
                intC = 'insufficient data'
        except:
            intC = 'Could not process formulated query on indicated endpoint'
        
        #CHECK IF THERE IS A SIGNATURE ON THE KG
        try:
            sign = query.getSign(accessUrl)
            if isinstance(sign,int):
                if sign > 0:
                    signedKG = True
                else:
                    signedKG = False
            else:
                signedKG = False
        except:
            signedKG = 'Could not process formulated query on indicated endpoint'

        #CHECK THE URIs DEFERENTIABILITY (TEST MADE ON 5000 TRIPLES SELECTED RANDOMLY)
        '''
        try:
            defCount = 0
            uriCount = 0
            uris = Query.getUris(accessUrl) #QUERY THAT GET 5000 RANDOM URI FROM THE ENDPOINT 
            for uri in uris:
                if utils.checkURI(uri) == True:
                    uriCount = uriCount + 1
                    try:
                        response = requests.get(uri,headers={"Accept":"application/rdf+xml"},stream=True)
                        if response.status_code == 200:
                            defCount = defCount +1
                    except:
                        continue
            if uriCount > 0:        
                defValue = defCount / uriCount
            else:
                defValue = 'No uri retrieved from the endpoint'
        except: #IF QUERY FAILS (BECUASE SPARQL 1.1 IS NOT SUPPORTED) TRY TO CHECK THE DEFERETIABILITY BY FILTERING THE TRIPLES RECOVERED FOR OTHER CALCULATION (IF THEY ARE BEEN RECOVERED)
            try:
                uriCount = 0
                defCount = 0
                for i in range(5000):
                    s = allTriples[i].get('s')
                    value = s.get('value')
                    if utils.checkURI(value):
                        uriCount = uriCount + 1
                        try:
                            response = requests.get(value,headers={"Accept":"application/rdf+xml"},stream=True)
                            if response.status_code == 200:
                                defCount = defCount +1
                        except:
                            continue
                if uriCount > 0:
                    defValue = defCount / uriCount
                else:
                    defValue = 'No uri found'
            except:
                defValue = 'Could not process formulated query on indicated endpoint'
        '''
                
    #IF SPARQL ENDPOINT ISN'T AVAILABLE WE SKIP ALL TEST WITH THE SPARQL QUERY
    else:
        if restricted == True:
            errorMessage = 'Restricted access to the endpoint'
            accessUrl = ''
        elif isHTML == True:
            errorMessage = 'Warning the result of endpoint is HTML'
        elif absent == True:
            errorMessage = 'endpoint absent'
        else:
            errorMessage = 'endpoint offline'

    #GET THE LICENSE 
    license = Aggregator.getLicense(metadata)

    #GET THE AUTHOR OF THE DATASET
    author = Aggregator.getAuthor(metadata)
    
    #CHECK FOR INACTIVE LINKS
    inactiveLink = False
    for i in range(len(otResources)):
        if otResources[i].status == 'offline':
            inactiveLink = True
    
    #CHECK FOR THE EXAMPLE
    example = False
    for j in range(len(otResources)):
        if isinstance(otResources[j].format,str):
            if 'example' in otResources[j].format:
                example = True
        if isinstance(otResources[j].title,str):
            if 'example' in otResources[j].title:
                example = True

    #GET EXTERNAL LINKS OF THE DATASET
    externalLinks = Aggregator.getExternalLinks(idKG)
    exLinksObj = utils.toObjectExternalLinks(externalLinks)
    triplesL = 0
    for i in range(len(exLinksObj)):
        link = exLinksObj[i]
        value = link.value
        value = str(link.value)
        value = re.sub("[^\d\.]", "",value)
        try:
            value = int(value)
            triplesL = triplesL + value
        except:
            continue
        
    
    #READIUNG THE GRAPH OF KG 
    here = os.path.dirname(os.path.abspath(__file__))
    gFile = os.path.join(here,'GraphOfKG.gpickle')
    graph = nx.read_gpickle(gFile)

    #PAGERANK CALCULATION
    pageRank = Graph.getPageRank(graph,idKG)
    pageRank = str(pageRank)
    pageRank = pageRank.replace('.',',')

    #CALCULATION OF THE DEGREE OF CONNECTION
    degree = Graph.getDegreeOfConnection(graph,idKG)
    
    #CALCULATION OF THE CENTRALITY
    centrality = Graph.getCentrality(graph,idKG)
    if isinstance(centrality,float):
        centrality = "%.3f"%centrality
        centrality = str(centrality)
        centrality = centrality.replace('.',',')


    #CALCULATION OF CLUSTERING COEFFICIENT
    clusteringCoefficient = Graph.getClusteringCoefficient(graph,idKG)
    if isinstance(clusteringCoefficient,float):
        clusteringCoefficient = "%.3f"%clusteringCoefficient
        clusteringCoefficient = str(clusteringCoefficient)
        clusteringCoefficient = clusteringCoefficient.replace('.',',')
    
    #GET THE DESCRIPTION OF THE CONTENT OF KG
    description = Aggregator.getDescription(metadata)    
    if available != True:  #IF ENDPOINT ISN'T AVAILABLE, WE TRY TO OBTAIN SOME INFO FROM THE VoID FILE IF IS INDICATED IN THE METADATA AND IS ONLINE
        if void == True:
            try:
                voidFile = VoIDAnalyses.parseVoID(urlV)
                if void is not None:
                    void = True
                    vocabularies = VoIDAnalyses.getVocabularies(voidFile)
                    creationDate = VoIDAnalyses.getCreationDate(voidFile)
                    modificationDate = VoIDAnalyses.getModificationDate(voidFile)
                    availableDump = VoIDAnalyses.getDataDump(voidFile)
                    licenseMr = VoIDAnalyses.getLicense(voidFile)
                    authorQ = VoIDAnalyses.getCreators(voidFile)
                    publisher = VoIDAnalyses.getPublishers(voidFile)
                    numEntities = VoIDAnalyses.getNumEntities(voidFile)
                    frequency = VoIDAnalyses.getFrequency(voidFile)
                    contributors = VoIDAnalyses.getContributors(voidFile)
                    regex = VoIDAnalyses.getUriRegex(voidFile)
                    formats = VoIDAnalyses.getSerializationFormats(voidFile)
                    languages = VoIDAnalyses.getLanguage(voidFile)
                else:
                    void = False
            except:
                try:
                    voidFile = VoIDAnalyses.parseVoIDTtl(urlV)
                    if void is not None:
                        void = True
                        vocabularies = VoIDAnalyses.getVocabularies(voidFile)
                        creationDate = VoIDAnalyses.getCreationDate(voidFile)
                        modificationDate = VoIDAnalyses.getModificationDate(voidFile)
                        availableDump = VoIDAnalyses.getDataDump(voidFile)
                        licenseMr = VoIDAnalyses.getLicense(voidFile)
                        authorQ = VoIDAnalyses.getCreators(voidFile)
                        publisher = VoIDAnalyses.getPublishers(voidFile)
                        numEntities = VoIDAnalyses.getNumEntities(voidFile)
                        frequency = VoIDAnalyses.getFrequency(voidFile)
                        contributors = VoIDAnalyses.getContributors(voidFile)
                        regex = VoIDAnalyses.getUriRegex(voidFile)
                        formats = VoIDAnalyses.getSerializationFormats(voidFile)
                        languages = VoIDAnalyses.getLanguage(voidFile)
                    else:
                        void = False
                except:
                    void = False
        else:
            void = False           
    else:
        void = False
    
    #CHECK IF EXISTING VOCABULARIES ARE RE-USED IN THE DATASET
    try:
        newVocab = []
        if isinstance(vocabularies,list):
            for i in range(len(vocabularies)):
                vocab = vocabularies[i]
                result = LOVAPI.findVocabulary(vocab)
                if result == False:
                    newVocab.append(vocab)
    except:
        newVocab = 'Could not process formulated query on indicated endpoint'

    #GET THE LANGUAGE OF THE KG FROM THE METADATA
    try:
        languageM = Aggregator.getExtrasLanguage(idKG)
    except:
        languageM = 'absent'

    #CHECK IF THE KG IS IN A LIST OF RELIABLE PROVIDERS
    try:
        providers = ['wikipedia','government','bioportal','bio2RDF','academic']
        keywords = Aggregator.getKeywords(idKG)
        if any(x in keywords for x in providers):
            believable = True
        else:
            believable = False
    except:
        believable = 'absent' 

    if sources == False:
        sourcesC = Sources('absent','absent','absent')
    else:
        sourcesC = Sources(sources.get('web','Absent'),sources.get('name','Absent'),sources.get('email','Absent'))

    valueN = 0
    valueD = 0
    valueUrl = 0
    valuePr = 0
    if isinstance(nameKG,str):
        if nameKG != '' and nameKG != 'Absent' and nameKG != 'absent':
            valueN = 1
    if isinstance(description,str):
        if description != '' and description != False and description != 'Absent':
            valueD = 1
    if isinstance(sourcesC.web,str):
        if sourcesC.web != '' and sourcesC.web !='Absent' and sourcesC.web != 'absent':
            valueUrl = 1
    if believable == True:
        valuePr = 1
    
    if valueN == 0 and valueD == 0 and valueUrl == 0 and valuePr == 0:
        trustValue = -1

    trustValue = (valueN+valueD+valueUrl+valuePr)/4
    trustValue = str(trustValue)
    trustValue = trustValue.replace('.',',')

        
    
    if idKG == False:
        idKG = ''
    if accessUrl == False:
        accessUrl = ''
    if nameKG == False:
        nameKG = ''
    
    if available == True:
        availability = Availability(endpoint,availableDownload,availableDump,inactiveLink,0)
        performance = Performance(minL,maxL,av,standardDeviation,percentile25L,percentile75L,medianL,minThroughput,maxThroughput,averageThroughput,standardDeviationT,percentile25T,percentile75T,medianT)
        amount = QualityDimensions.AmountOfData.AmountOfData(triplesM,triplesQuery,numEntities,numProperty,entitiesRe)
        volatility = Volatility(frequency)
        licensing = Licensing(license,licenseMr,licenseHr)
        verifiability = Verifiability(vocabularies,authorQ,author,contributors,publisher,sourcesC,signedKG)
        versatility = Versatility(languages,languageM,formats,endpoint,availableDump,availableDownload)
        security = Security(isSecure,restricted)
        rConciseness = RepresentationalConciseness(avLenghts,standardDeviationL,minLenghtS,percentile25LenghtS,medianLenghtS,percentile75LenghtS,maxLenghtS,avLenghtsO,standardDeviationLO,minLenghtO,percentile25LenghtO,medianLenghtO,percentile75LenghtO,maxLenghtO,avLenghtsP,standardDeviationLP,minLenghtP,percentile25LenghtP,medianLenghtP,percentile75LenghtP,maxLenghtP,RDFStructures)
        rConsistency = RepresentationalConsistency(newVocab,newTermsD)
        interpretability = Interpretability(numBlankNode,RDFStructures)
        interlinking = Interlinking(degree,clusteringCoefficient,centrality,numberSameAs,exLinksObj)
        conciseness = Conciseness(exC,intC)
        FPvalue = (str(FPvalue)).replace('.',',')
        IFPvalue = (str(IFPvalue)).replace('.',',')
        emptyAnnotation = (str(emptyAnnotation)).replace('.',',')
        numWSP = (str(numWSP)).replace('.',',') 
        numMalformedTriples = (str(numMalformedTriples)).replace('.',',')
        accuracy = Accuracy(emptyAnnotation,numWSP,numMalformedTriples,FPvalue,IFPvalue)
        if isinstance(numDisjoint,int):
            try:
                numEntities = int(numEntities)
                if numEntities > 0:
                    disjointValue = numDisjoint/numEntities
                else:
                    disjointValue = 'insufficient data'
            except :
                disjointValue = 'insufficient data'
            
            if isinstance(disjointValue,str):
                try:
                    entitiesRe = int(entitiesRe)
                    if entitiesRe > 0:
                        disjointValue = numDisjoint/entitiesRe
                    else:
                        disjointValue = 'insufficient data'
                except :
                    disjointValue = 'insufficient data'

            if len(classes) + len(properties) > 0 :
                deprecatedV = 1.0 - (len(deprecated)/(len(classes) + len(properties)))
            else:
                deprecatedV = 'insufficient data'
            
            if isinstance(triplesQuery,int):
                if triplesQuery > 0:
                    if isinstance(undClasses,list):
                        undefCV = 1.0 - (len(undClasses)/triplesQuery)
                    else:
                        undefCV = 'Unable to retrieve classes from the endpoint'
                    if isinstance(undProperties,list):
                        undefPV = 1.0 - (len(undProperties)/triplesQuery)
                    else:
                        undefPV = 'Unable to retrieve properties from the endpoint'
                    if isinstance(misplacedClass,list):
                        mispCV = 1.0 - (len(misplacedClass)/triplesQuery)
                    else:
                        mispCV = 'Unable to retrieve properties from the endpoint'
                    if isinstance(misplacedProperty,list):
                        mispPV = 1.0 - (len(misplacedProperty)/triplesQuery)
                    else:
                        mispPV = 'Unable to retrieve properties from the endpoint'
                    consistency = Consistency(deprecatedV,disjointValue,mispPV,mispCV,hijacking,undefCV,undefPV)
                else:
                    consistency = Consistency(deprecatedV,disjointValue,'insufficient data','insufficient data',hijacking,'insufficient data','insufficient data')
            else:
                consistency = Consistency(deprecatedV,disjointValue,'insufficient data','insufficient data',hijacking,'insufficient data','insufficient data')
        else:
            if isinstance(classes,list) and isinstance(properties,list):
                if len(classes) + len(properties) > 0 :
                    if isinstance(deprecated,list):
                        deprecatedV = 1.0 - (len(deprecated)/(len(classes) + len(properties)))
                    else:
                        deprecatedV = 'insufficient data'
                else:
                    deprecatedV = 'insufficient data'
            else:
                    deprecatedV = 'insufficient data'

            if isinstance(triplesQuery,int):
                if triplesQuery > 0:
                    if isinstance(undClasses,list):
                        undefCV = 1.0 - (len(undClasses)/triplesQuery)
                    else:
                        undefCV = 'Unable to retrieve classes from the endpoint'
                    if isinstance(undProperties,list):
                        undefPV = 1.0 - (len(undProperties)/triplesQuery)
                    else:
                        undefPV = 'Unable to retrieve properties from the endpoint'
                    if isinstance(misplacedClass,list):
                        mispCV = 1.0 - (len(misplacedClass)/triplesQuery)
                    else:
                        mispCV = 'Unable to retrieve classes from the endpoint'
                    if isinstance(misplacedProperty,list):
                        mispPV = 1.0 - (len(misplacedProperty)/triplesQuery)
                    else:
                        mispPV = 'unable to retrieve properties from the endpoint'
                    consistency = Consistency(deprecatedV,'insufficient data',mispPV,mispCV,hijacking,undefCV,undefPV)
                else:
                    consistency = Consistency(deprecatedV,'insufficient data','insufficient data','insufficient data',hijacking,'insufficient data','insufficient data')
            else:
                consistency = Consistency(deprecatedV,'insufficient data','insufficient data','insufficient data',hijacking,'insufficient data','insufficient data')
        
        if isinstance(triplesQuery,int) and isinstance(numTriplesUpdated,int):
            percentageUp = (numTriplesUpdated/triplesQuery) * 100
            percentageUp = str(percentageUp)
            percentageUp = percentageUp +"%"
        elif isinstance(triplesM,int) and isinstance(numTriplesUpdated,int):
            if triplesM > 0:
                percentageUp = (numTriplesUpdated/triplesM) * 100
                percentageUp = str(percentageUp)
                percentageUp = percentageUp +"%"
            else:
                percentageUp = 'insufficient data'
        else:
            percentageUp = 'insufficient data'
        if isinstance(triplesQuery,int) and isinstance(triplesL,int) and triplesQuery > 0:
            iCompleteness = (triplesL/triplesQuery)
            iCompleteness = "%.2f"%iCompleteness
            completeness = Completeness(triplesQuery,triplesL,iCompleteness)
        else:
            completeness = Completeness(triplesQuery,triplesL,"insufficient data")
        if isinstance(numLabel,int) and isinstance(triplesQuery,int) and triplesQuery > 0: 
            percentageLabel = (numLabel/triplesQuery) * 100
            percentageLabel = "%.2f"%percentageLabel
            percentageLabel = str(percentageLabel)
            percentageLabel = percentageLabel + "%"
            understendability = Understendability(numLabel,percentageLabel,regex,vocabularies,example)
        elif isinstance(numLabel,int) and isinstance(triplesM,int) and triplesM > 0:
            percentageLabel = (numLabel/triplesM) * 100
            percentageLabel = "%.2f"%percentageLabel
            percentageLabel = str(percentageLabel)
            percentageLabel = percentageLabel + "%"
            understendability = Understendability(numLabel,percentageLabel,regex,vocabularies,example) 
        else:
            understendability = Understendability(numLabel,'insufficient data',regex,vocabularies,example)
        if isinstance(creationDate,str) and isinstance(modificationDate,str):
            try:
                creationDate = datetime.datetime.strptime(creationDate, "%Y-%m-%d").date()
                today = datetime.date.today()
                todayFormatted = today.strftime("%Y-%m-%d")
                todayDate =  datetime.datetime.strptime(todayFormatted, "%Y-%m-%d").date()
                modificationDate = datetime.datetime.strptime(modificationDate, "%Y-%m-%d").date()
                delta = (todayDate - modificationDate).days
                currency = Currency(creationDate,modificationDate,percentageUp,delta,historicalUp)
            except ValueError:
                currency = Currency(creationDate,modificationDate,percentageUp,'insufficient data',historicalUp)
        else:
            currency = Currency(creationDate,modificationDate,percentageUp,'insufficien data',historicalUp)
    elif void == True:
        availability = Availability(errorMessage,availableDownload,availableDump,inactiveLink,errorMessage)
        performance = Performance(errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage)
        amount = QualityDimensions.AmountOfData.AmountOfData(triplesM,errorMessage,numEntities,errorMessage,errorMessage)
        volatility = Volatility(frequency)
        licensing = Licensing(license,licenseMr,errorMessage)
        verifiability = Verifiability(vocabularies,authorQ,author,contributors,publisher,sourcesC,errorMessage)
        versatility = Versatility(errorMessage,languageM,formats,errorMessage,availableDump,availableDownload)
        security = Security(errorMessage,errorMessage)
        rConciseness = RepresentationalConciseness(errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage)
        rConsistency = RepresentationalConsistency(newVocab,errorMessage)
        understendability = Understendability(errorMessage,'insufficient data',regex,errorMessage,example)
        interpretability = Interpretability(errorMessage,errorMessage)
        interlinking = Interlinking(degree,clusteringCoefficient,centrality,errorMessage,exLinksObj)
        if isinstance(creationDate,str) and isinstance(modificationDate,str):
            try:
                creationDate = datetime.datetime.strptime(creationDate, "%Y-%m-%d").date()
                today = datetime.date.today()
                todayFormatted = today.strftime("%Y-%m-%d")
                todayDate =  datetime.datetime.strptime(todayFormatted, "%Y-%m-%d").date()
                modificationDate = datetime.datetime.strptime(modificationDate, "%Y-%m-%d").date()
                delta = (todayDate - modificationDate).days
                currency = Currency(creationDate,modificationDate,'insufficient data',delta,'insufficient data')
            except ValueError:
                currency = Currency(creationDate,modificationDate,'insufficient data','insufficient data','insufficient data')
        else:
            currency = Currency(creationDate,modificationDate,'insufficient data','insufficien data','insufficient data')
        consistency = Consistency(errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage)
        conciseness = Conciseness(errorMessage,errorMessage)
        accuracy = Accuracy(errorMessage,errorMessage,errorMessage,errorMessage,errorMessage)
        if isinstance(triplesM,int) and isinstance(triplesL,int) and triplesM > 0:
            iCompleteness = (triplesL/triplesM)
            iCompleteness = "%.2f"%iCompleteness
            completeness = Completeness(triplesM,triplesL,iCompleteness)
        else:
            completeness = Completeness(triplesM,triplesL,0)
    else:
        availability = Availability(errorMessage,availableDownload,errorMessage,inactiveLink,errorMessage)
        performance = Performance(errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage)
        amount = QualityDimensions.AmountOfData.AmountOfData(triplesM,errorMessage,errorMessage,errorMessage,errorMessage)
        volatility = Volatility(errorMessage)
        licensing = Licensing(license,errorMessage,errorMessage)
        verifiability = Verifiability(errorMessage,errorMessage,author,errorMessage,errorMessage,sourcesC,errorMessage)
        versatility = Versatility(errorMessage,languageM,errorMessage,errorMessage,errorMessage,availableDownload)
        security = Security(errorMessage,errorMessage)
        rConciseness = RepresentationalConciseness(errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage)
        rConsistency = RepresentationalConsistency(errorMessage,errorMessage)
        understendability = Understendability(errorMessage,'insufficient data',errorMessage,errorMessage,example)
        interpretability = Interpretability(errorMessage,errorMessage)
        interlinking = Interlinking(degree,clusteringCoefficient,centrality,errorMessage,exLinksObj)
        currency = Currency(errorMessage,errorMessage,'insufficient data','insufficien data','insufficient data')
        consistency = Consistency(errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage)
        conciseness = Conciseness(errorMessage,errorMessage)
        accuracy = Accuracy(errorMessage,errorMessage,errorMessage,errorMessage,errorMessage)
        if isinstance(triplesM,int) and isinstance(triplesL,int) and triplesM > 0:
            iCompleteness = (triplesL/triplesM)
            iCompleteness = "%.2f"%iCompleteness
            completeness = Completeness(triplesM,triplesL,iCompleteness)
        else:
            completeness = Completeness(triplesM,triplesL,0)

    reputation = Reputation(exLinksObj,pageRank)
    believability = Believability(nameKG,description,sourcesC.web,believable,trustValue)
    
    downloadUrl = list(dict.fromkeys(downloadUrl))
    
    #PREPARING DATA FOR SCORE CALCULATION
    if available == True:
            if isinstance(allTriples,list):
                uriListS = []
                for triple in allTriples:
                    if len(allTriples) > 0: #CREATING A LIST OF ALL SUBJECTS
                        s = triple.get('s')
                        value = s.get('value')
                        uriListS.append(value)
                if isinstance(numTriplesUpdated,int):
                    extra = Extra(idKG,accessUrl,downloadUrl,numTriplesUpdated,classes,properties,allUri,triplesO,uriListS,undProperties,undClasses,misplacedClass,misplacedProperty,deprecated,0,limited,offlineDump,urlV,voidStatus,minThroughputNoOff,averageThroughputNoOff,maxThroughputNoOff,standardDeviationTNoOff) #EXTRA OBJ CONTAINS ALL INFORMATION FOR SCORE CALCULATION AND OTHER USEFUL INFORMATION
                else:
                    extra = Extra(idKG,accessUrl,downloadUrl,'insufficient data',classes,properties,allUri,triplesO,uriListS,undProperties,undClasses,misplacedClass,misplacedProperty,deprecated,0,limited,offlineDump,urlV,voidStatus,minThroughputNoOff,averageThroughputNoOff,maxThroughputNoOff,standardDeviationTNoOff)
            else:
                uriListS = []
                extra = Extra(idKG,accessUrl,downloadUrl,'insufficient data',classes,properties,allUri,triplesO,uriListS,undProperties,undClasses,misplacedClass,misplacedProperty,deprecated,0,limited,offlineDump,urlV,voidStatus,minThroughputNoOff,averageThroughputNoOff,maxThroughputNoOff,standardDeviationTNoOff)
    else:
        classes = []
        properties = []
        allUriCount = 0
        triplesO = []
        uriListS = []
        extra = Extra(idKG,accessUrl,downloadUrl,'insufficient data',classes,properties,allUriCount,triplesO,0,errorMessage,errorMessage,errorMessage,errorMessage,errorMessage,0,errorMessage,offlineDump,urlV,voidStatus,errorMessage,errorMessage,errorMessage,errorMessage)

    KGQ = KnowledgeGraph(availability,currency,versatility,security,rConciseness,licensing,performance,amount,volatility,interlinking,consistency,reputation,believability,verifiability,completeness,rConsistency,understendability,interpretability,conciseness,accuracy,extra)

    return KGQ