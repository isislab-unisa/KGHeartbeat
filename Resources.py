class Resources:
    def __init__(self,url,title,description,status,format,type):
        self.url = url
        self.title = title
        self.description = description
        self.status = status
        self.format = format
        self.type = type

    def otherResources(self):
        return f"Url:{self.url}, Title:{self.title}, Description:{self.description}, Format:{self.format}, Type:{self.type}, status:{self.status}"

    

