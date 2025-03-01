class Availability:
    def __init__(self,sparqlEndpoint,RDFDumpM,RDFDumpQ,inactiveLinks,uriDef):
        self.sparqlEndpoint = sparqlEndpoint
        self.RDFDumpM = RDFDumpM
        self.RDFDumpQ = RDFDumpQ
        self.inactiveLinks = inactiveLinks
        self.uriDef = uriDef
    
    def getAvailability(self):
        return f"-Availability\n   Sparql endpoint:{self.sparqlEndpoint}\n   Availability of RDF dump (metadata):{self.RDFDumpM}\n   Availability of RDF dump (query):{self.RDFDumpQ}\n   Inactive links:{self.inactiveLinks}\n   Uri deferenceability:{self.uriDef}\n"