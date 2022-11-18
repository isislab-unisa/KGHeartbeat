class Volatility:
    def __init__(self,frequency):
        self.frequency = frequency
    
    def getVolatility(self):
        return f"-Volatility\n   Dataset update frequency:{self.frequency}\n"