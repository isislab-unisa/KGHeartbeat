class Completeness:
    def __init__(self,numTriples,numTriplesL,interlinkingC):
        self.numTriples = numTriples
        self.numTriplesL = numTriplesL
        self.interlinkingC = interlinkingC
    
    def getCompleteness(self):
        return f"-Completeness\n   Number of triples:{self.numTriples}\n   Number of triples linked:{self.numTriplesL}\n   Interlinking completeness:{self.interlinkingC}%\n"