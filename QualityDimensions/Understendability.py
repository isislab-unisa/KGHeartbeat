class Understendability:
    def __init__(self,numLabel,percentageLabel,regexUri,vocabularies,example,name,description,sources):
        self.numLabel = numLabel
        self.percentageLabel = percentageLabel
        self.regexUri = regexUri
        self.vocabularies = vocabularies
        self.example = example
        self.name = name
        self.description = description
        self.sources = sources
    
    def getUnderstendability(self):
        return f"-Understendability\n   Number of labels/comments present on the data:{self.numLabel}\n   Percentage of triples with labels:{self.percentageLabel}\n   Regex uri:{self.regexUri}\n   Vocabularies:{self.vocabularies}\n   Presence of example:{self.example}\n"