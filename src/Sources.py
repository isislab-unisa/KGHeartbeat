class Sources:
    def __init__(self,web,name,email):
        self.web = web
        self.name = name
        self.email = email
    
    def sourcesKG(self):
        return f" Sources: web:{self.web}, name:{self.name}, email:{self.email}"
    
    def to_dict(self):
        return {
            "web" : self.web,
            "name" : self.name,
            "email" : self.email
        }