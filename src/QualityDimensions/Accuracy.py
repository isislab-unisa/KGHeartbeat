class Accuracy:
    def __init__(self,emptyAnn,wSA,malformedDataType,FPvalue,IFPvalue):
        self.emptyAnn = emptyAnn
        self.wSA = wSA
        self.malformedDataType = malformedDataType
        self.FPvalue = FPvalue
        self.IFPvalue = IFPvalue


    def getAccuracy(self):
        return f"-Accuracy\n   Triples with empty annotation problem:{self.emptyAnn}\n   Triples with white space in annotation(at the beginning or at the end):{self.wSA}\n   Triples with malformed data type literals problem:{self.malformedDataType}\n   Functional property with incosistent value:{self.FPvalue}\n   Invalid usage of inverse-functional properties:{self.IFPvalue}\n"