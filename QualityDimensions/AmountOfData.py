class AmountOfData:
    def __init__(self,numTriplesM,numTriplesQ,numEntities,numProperty,entitiesRe):
        self.numTriplesM = numTriplesM
        self.numTriplesQ = numTriplesQ
        self.numEntities = numEntities
        self.numProperty = numProperty
        self.entitiesRe = entitiesRe
    
    def getAmountOfData(self):
        return f"-Amount of data\n   Number of triples (metadata):{self.numTriplesM}\n   Number of triples (query):{self.numTriplesQ}\n   Number of entities:{self.numEntities}\n   Number of entities counted with regex:{self.entitiesRe}\n   Number of property:{self.numProperty}\n"