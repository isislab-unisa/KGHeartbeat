class RepresentationalConsistency:
    def __init__(self,newVocab,useNewTerms):
        self.newVocab = newVocab
        self.useNewTerms = useNewTerms
    def getRepresentationalConsistency(self):
        return f"-Representational consistency\n   New vocabularies defined in the dataset:{self.newVocab}\n   Dataset define new terms:{self.useNewTerms}\n"