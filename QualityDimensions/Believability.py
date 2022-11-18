class Believability:
    def __init__(self,title,description,URI,reliableProvider,trustValue):
        self.title = title
        self.description = description
        self.URI = URI
        self.reliableProvider = reliableProvider
        self.trustValue = trustValue

    def getBelievability(self):
        return f"-Believability\n   KG title:{self.title}\n   Description:{self.description}\n   Dataset URL:{self.URI}\n   Is on a trusted provider list:{self.reliableProvider}\n   Trust value:{self.trustValue}\n"
