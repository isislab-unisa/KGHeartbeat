class Security:
    def __init__(self,useHTTPS,requiresAuth):
        self.useHTTPS = useHTTPS
        self.requiresAuth = requiresAuth
    
    def getSecurity(self):
        return f"-Security\n   Use HTTPS:{self.useHTTPS}\n   Requires authentication:{self.requiresAuth}\n"