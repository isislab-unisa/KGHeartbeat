class RepresentationalConciseness:
    def __init__(self,urisLenghtSA,urisLenghtSSd,minLengthS,percentile25LengthS,medianLengthS,percentile75LengthS,maxLengthS,urisLenghtOA,urisLenghtOSd,minLengthO,percentile25LengthO,medianLengthO,percentile75LengthO,maxLengthO,urisLenghtPA,urisLenghtPSd,minLengthP,percentile25LengthP,medianLengthP,percentile75LengthP,maxLengthP,RDFStructures):
        self.urisLenghtSA = urisLenghtSA
        self.urisLenghtSSd = urisLenghtSSd
        self.urisLenghtOA = urisLenghtOA
        self.urisLenghtOSd = urisLenghtOSd
        self.urisLenghtPA = urisLenghtPA
        self.urisLenghtPSd = urisLenghtPSd
        self.minLengthS = minLengthS
        self.percentile25LengthS = percentile25LengthS
        self.medianLenghtS = medianLengthS
        self.percentile75LengthS = percentile75LengthS
        self.maxLengthS = maxLengthS
        self.minLengthO = minLengthO
        self.percentile25LengthO = percentile25LengthO
        self.medianLenghtO = medianLengthO
        self.percentile75LengthO = percentile75LengthO
        self.maxLengthO = maxLengthO
        self.minLengthP = minLengthP
        self.percentile25LengthP = percentile25LengthP
        self.medianLenghtP = medianLengthP
        self.percentile75LengthP = percentile75LengthP
        self.maxLengthP = maxLengthP
        self.RDFStructures = RDFStructures
    
    def getRepresentationalConciseness(self):
        return f"-Representational conciseness\n   Average length of URIs (subject):{self.urisLenghtSA}\n   Standard deviation of URIs length (subject):{self.urisLenghtSSd}\n   Min length URI (subject):{self.minLengthS}\n   25th percentile length URIs (subject):{self.percentile25LengthS}\n   Median length URIs (subject):{self.medianLenghtS}\n   75th percentile length URIs (subject):{self.percentile25LengthS}\n   Max length URIs (subject):{self.maxLengthS}\n   Average lenght of URIs (predicate):{self.urisLenghtPA}\n   Standard deviation of URIs lenght (predicate):{self.urisLenghtPSd}\n   Min length URI (predicate):{self.minLengthP}\n   25th percentile length URIs (predicate):{self.percentile25LengthP}\n   Median length URIs (predicate):{self.medianLenghtP}\n   75th percentile length URIs (predicate):{self.percentile25LengthP}\n   Max length URIs (predicate):{self.maxLengthP}\n   Average length of URIs (object):{self.urisLenghtOA}\n   Standard deviation of URIs lenght (object):{self.urisLenghtOSd}\n   Min length URI (object):{self.minLengthO}\n   25th percentile length URIs (object):{self.percentile25LengthO}\n   Median length URIs (object):{self.medianLenghtO}\n   75th percentile length URIs (object):{self.percentile25LengthO}\n   Max length URIs (object):{self.maxLengthO}\n   Use RDF structures:{self.RDFStructures}\n "
