class Currency:
    def __init__(self,creationDate, modificationDate,percentageUpData,timePassed,historicalUp):
        self.creationDate = creationDate
        self.modificationDate = modificationDate
        self.percentageUpData = percentageUpData
        self.timePassed = timePassed
        self.historicalUp = historicalUp

    
    def to_dict(self):
        return {
            "creationDate" : str(self.creationDate),
            "modificationDate" : str(self.modificationDate),
            "percentageUpData" : str(self.percentageUpData),
            "timePassed" : str(self.timePassed),
            "historicalUp" : str(self.historicalUp),
        }

    def getCurrency(self):
        return f"-Currency\n   Cretion date:{self.creationDate}\n   Modification date:{self.modificationDate}\n   Percentage of data updated:{self.percentageUpData}\n   Time elapsed from data creation to the last modification:{self.timePassed} days\n   Historical updates:{self.historicalUp}\n"