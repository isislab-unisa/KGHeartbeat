class Consistency:
    def __init__(self,deprecated,disjointClasses,triplesMP,triplesMC,oHijacking,undefinedClass,undefinedProperties):
        self.deprecated = deprecated
        self.disjointClasses = disjointClasses
        self.triplesMP = triplesMP 
        self.triplesMC = triplesMC
        self.oHijacking = oHijacking
        self.undefinedClass = undefinedClass
        self.undefinedProperties = undefinedProperties

    def getConsistency(self):
        return f"-Consistency\n   Deprecated classes/properties used:{self.deprecated}\n   Entities as member of disjoint class:{self.disjointClasses}\n   Triples with misplaced property problem:{self.triplesMP}\n   Triples with misplaced class problem:{self.triplesMC}\n   Ontology Hijacking problem:{self.oHijacking}\n   Undefined class used without declaration:{self.undefinedClass}\n   Undefined properties used without declaration:{self.undefinedProperties}\n"