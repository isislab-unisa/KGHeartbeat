class Performance:
    def __init__(self,minLatency,maxLantency,averageLatency,sDLatency,percentile25L,percentile75L,medianL,minThroughput,maxThrougput,averageThroughput,sDThroughput,percentile25T,percentile75T,medianT):
        self.minLatency = minLatency
        self.maxLatency = maxLantency
        self.averageLatency = averageLatency
        self.sDLatency = sDLatency
        self.minThroughput = minThroughput
        self.maxThroughput = maxThrougput
        self.averageThroughput = averageThroughput
        self.sDThroughput = sDThroughput
        self.percentile25L = percentile25L
        self.percentile75L = percentile75L
        self.medianL = medianL
        self.percentile25T = percentile25T
        self.percentile75T = percentile75T
        self.medianT = medianT
    
    def getPerformance(self):
        return f"-Performance\n   Minimum latency:{self.minLatency}\n   25th percentile latency:{self.percentile25L}\n   Median latency:{self.medianL}\n   75th percentile latency:{self.percentile75L}\n   Maximum latency:{self.maxLatency}\n   Average latency:{self.averageLatency}\n   Standard deviation of latency:{self.sDLatency}\n   Minimum throughput:{self.minThroughput}\n   25th percentile throughput:{self.percentile25T}\n   Median throughput:{self.medianT}\n   75th percentile throughput:{self.percentile75T}\n   Maximum throughput:{self.maxThroughput}\n   Average throughput:{self.averageThroughput}\n   Standard deviation of throughput:{self.sDThroughput}\n"