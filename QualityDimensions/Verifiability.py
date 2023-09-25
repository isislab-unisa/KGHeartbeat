

from Sources import Sources


class Verifiability:
    def __init__(self,vocabularies,authorQ,authorM,contributor,publisher,sources,sign):
        self.vocabularies = vocabularies
        self.authorQ = authorQ
        self.authorM = authorM
        self.contributor = contributor
        self.publisher = publisher
        self.sources = sources
        self.sign = sign
    
    def getVerifiability(self):
        return f"-Verifiability\n   Vocabularies:{self.vocabularies}\n   Author (query):{self.authorQ}\n   Author (metadata):{self.authorM}\n   Contributor:{self.contributor}\n   Publisher:{self.publisher}\n  {Sources.sourcesKG(self.sources)}\n   Signature on the KG:{self.sign}\n"
    
    def to_dict(self):
        return {
            "vocabularies" : self.vocabularies,
            "author-Query" : self.authorQ,
            "autho-Meta" : self.authorM,
            "contributor" : self.contributor,
            "publisher" : self.publisher,
            "sources" : self.sources.to_dict(),
            "sign" : self.sign
        }