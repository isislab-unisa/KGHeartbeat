from ExternalLink import ExternalLink


class Reputation:
    def __init__(self,externalLinks,pageRank):
        self.externalLinks = externalLinks
        self.pageRank = pageRank
    
    def getReputation(self):
        return f"-Reputation\n   External links:{ExternalLink.getListExLinks(self.externalLinks)}\n   PageRank:{self.pageRank}\n"
    
    def to_dict(self):
        return {
            "External-Links" : ExternalLink.getListExLinks(self.externalLinks),
            "PageRank" : self.pageRank
        }