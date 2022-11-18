class ExternalLink:
    def __init__(self,nameKG,value):
        self.nameKG = nameKG
        self.value = value

    def getExternalLink(self):
        return f"Name:{self.nameKG} Value:{self.value}"
    
    def getListExLinks(listExLinks):
        listLinks = []
        for i in range(len(listExLinks)):
            link = listExLinks[i]
            listLinks.append(f'Name:{link.nameKG}, value:{link.value}')
        return listLinks  
