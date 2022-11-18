class Licensing:
    def __init__(self,licenseMetadata,licenseQuery,licenseHR):
        self.licenseMetadata = licenseMetadata
        self.licenseQuery = licenseQuery
        self.licenseHR = licenseHR

    def getLicensing(self):
        return f"-Licensing\n   License machine redeable (metadata):{self.licenseMetadata}\n   License machine redeable (query):{self.licenseQuery}\n   License human redeable:{self.licenseHR}\n"