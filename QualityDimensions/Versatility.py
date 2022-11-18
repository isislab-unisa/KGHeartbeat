class Versatility:
    def __init__(self,languagesQ,languagesM,serializationFormats,sparqlEndpoint,availabilityDownloadQ,availabilityDownloadM):
        self.languagesQ = languagesQ
        self.languagesM = languagesM
        self.serializationFormats = serializationFormats
        self.sparqlEndpoint = sparqlEndpoint
        self.availabilityDownloadQ = availabilityDownloadQ
        self.availabilityDownloadM = availabilityDownloadM
    
    def getVersatility(self):
        return f"-Versatility\n   Languages (query):{self.languagesQ}\n   Languages (metadata):{self.languagesM}\n   Serialization formats:{self.serializationFormats}\n   Sparql endpoint:{self.sparqlEndpoint}\n   Availability for download (query):{self.availabilityDownloadQ}\n   Availability for download (metadata):{self.availabilityDownloadM}\n"