from ExternalLink import ExternalLink


class Interlinking:
    def __init__(self,degreeConnection,clustering,centrality,sameAs,externalLinks,skosMapping):
        self.degreeConnection = degreeConnection
        self.clustering = clustering
        self.centrality = centrality
        self.sameAs = sameAs
        self.externalLinks = externalLinks
        self.skosMapping = skosMapping
    
    def getInterlinking(self):
        return f"-Interlinking\n   Degree of connection:{self.degreeConnection}\n   Clustering coefficient:{self.clustering}\n   Centrality:{self.centrality}\n   Number of samAs chains:{self.sameAs}\n   External links:{ExternalLink.getListExLinks(self.externalLinks)}  Skos mapping:{self.externalLinks}\n"

    def to_dict(self):
        if not isinstance(self.degreeConnection,int):
            self.degreeConnection = "Can't retrieve this information, missing metadata"
        return  {
            "Degree-of-connection" : self.degreeConnection,
            "Clustering" : self.clustering,
            "Centrality" : self.centrality,
            "sameAs" : self.sameAs,
            "External-Links": ExternalLink.getListExLinks(self.externalLinks),
            "Skos-mapping": self.skosMapping
        }