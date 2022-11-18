from rdflib import RDF


class Interpretability:
    def __init__(self,numBN,RDFStructures):
        self.numBN = numBN
        self.RDFStructures = RDFStructures

    def getInterpretability(self):
        return f"-Interpretability:\n   Number of blank nodes:{self.numBN}\n   Uses RDF structures:{self.RDFStructures}\n"