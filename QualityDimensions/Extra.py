class Extra:
    def __init__(self,KGid,endpointUrl,downloadUrl,numTriplesUpdated,classes,properties,uriList,allTerms,subjectLi,undefinedProperties,undefinedClass,triplesMC,triplesMP,deprecated,score,limited,offlineDumps,urlVoid,voidAvailability,minTPNoOff,meanTPNoOff,maxTPNoOff,devSNoOff):
        self.KGid = KGid
        self.endpointUrl = endpointUrl
        self.downloadUrl = downloadUrl
        self.numTriplesUpdated = numTriplesUpdated
        self.classes = classes
        self.properties = properties
        self.uriList = uriList
        self.allTerms = allTerms
        self.subjectLi = subjectLi
        self.undefinedProperties = undefinedProperties
        self.undefinedClass = undefinedClass
        self.triplesMC = triplesMC
        self.triplesMP = triplesMP
        self.deprecated = deprecated 
        self.score = score
        self.limited = limited
        self.offlineDumps = offlineDumps
        self.urlVoid = urlVoid
        self.voidAvailability = voidAvailability
        self.minTPNoOff = minTPNoOff
        self.meanTPNoOff = meanTPNoOff
        self.maxTPNoOff = maxTPNoOff
        self.devSNoOff = devSNoOff
    
    def getExtra(self):
        return f"-Extra:\n   Knowledge Graph ID:{self.KGid}\n   SPARQL endpoint URL:{self.endpointUrl}\n   Links for download dataset:{self.downloadUrl}\n   Number of triples updated:{self.numTriplesUpdated}\n   Score:{self.score}\n   Limited:{self.limited}\n"
