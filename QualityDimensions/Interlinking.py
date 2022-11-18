from ExternalLink import ExternalLink


class Interlinking:
    def __init__(self,degreeConnection,clustering,centrality,sameAs,externalLinks):
        self.degreeConnection = degreeConnection
        self.clustering = clustering
        self.centrality = centrality
        self.sameAs = sameAs
        self.externalLinks = externalLinks
    
    def getInterlinking(self):
        return f"-Interlinking\n   Degree of connection:{self.degreeConnection}\n   Clustering coefficient:{self.clustering}\n   Centrality:{self.centrality}\n   Number of samAs chains:{self.sameAs}\n   External links:{ExternalLink.getListExLinks(self.externalLinks)}\n"