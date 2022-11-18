class Conciseness:
    def __init__(self,exC,intC):
        self.exC = exC
        self.intC = intC
    

    def getConciseness(self):
        return f"-Conciseness\n   Extensional conciseness:{self.exC}\n   Intensional conciseness:{self.intC}\n"