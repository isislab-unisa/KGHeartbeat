from datetime import date
import utils 
import time
import query
import pandas as pd
import ast
import re

AVAILABILITY_METRICS = 4
LICENSING_METRICS = 2
INTERLINKING_METRICS = 4
SECURITY_METRICS = 2
PERFORMANCE_METRICS = 2
ACCURACY_METRICS = 5
CONSISTENCY_METRICS = 5
CONCISENESS_METRICS = 2
VERIFIABILITY_METRICS = 6
REPUTATION_METRICS = 1
BELIEVABILITY_METRICS = 1
CURRENCY_METRICS = 2
VOLATILITY_METRICS = 1
COMPLETENESS_METRICS = 1
AMOUNT_METRICS = 3
REP_CONS_METRICS = 2
REP_CONC_METRICS = 2
UNDERSTANDABILITY_METRICS = 4
INTERPRETABILITY_METRICS = 2
VERSATILITY_METRICS = 3
DIMENSION_NUMER = 20


class RecalculateScore:
    def __init__(self, csv_file_path, dimensions_number):
        self.kgs_quality_data = pd.read_csv(csv_file_path)
        self.dimensionNumber = dimensions_number
        self.availabilityScoreValue = 0
        self.licensingScoreValue = 0
        self.interlinkingScoreValue = 0
        self.performanceScoreValue = 0
        self.accuracyScoreValue = 0
        self.consistencyScoreValue = 0
        self.concisenessScoreValue = 0
        self.verifiabilityScoreValue = 0
        self.reputationScoreValue = 0
        self.believabilityScoreValue = 0
        self.currencyScoreValue = 0
        self.volatilityScoreValue = 0
        self.completenessScoreValue = 0
        self.amountScoreValue = 0
        self.repConsScoreValue = 0
        self.repConcScoreValue = 0
        self.understScoreValue = 0
        self.interpretabilityScoreValue = 0
        self.versatilityScoreValue = 0
        self.securityScoreValue = 0
        self.totalScore = 0
        self.normalizedScore = 0
        self.labelValue = 0
        self.misplacedValue = 0
        self.undefValue = 0
        self.uriValue = 0
        self.rdfValue = 0
        self.blankValue = 0
        self.vocabsValue = 0
        self.tpValue = 0
        self.latencyValue = 0

    def availabilityScore(self,weight):
        for index, row in self.kgs_quality_data.iterrows():
            if row['Sparql endpoint'] == 'Available':
                url = 1
            else:
                url = 0
            if row['Availability of RDF dump (metadata)'] in [1,'1','True',True] or row['Availability of RDF dump (query)'] in ['True', True,1,'1']:
                dump = 1
            else:
                dump = 0 
            if row['Inactive links'] in [True,'True']:
                inactive = 0
            else:
                inactive = 1
            try:
                defValue = float(row['URIs Deferenceability'])
            except:
                defValue = 0

            avaliability_score = ((url + dump + inactive + defValue) * weight) / AVAILABILITY_METRICS
            self.kgs_quality_data.loc[index,'Availability score'] = avaliability_score
            
    def licensingScore(self,weight):
        for index, row in self.kgs_quality_data.iterrows():
            
            if row['License machine redeable (metadata)'] not in ['false',False,'False','License not specified - notspecified -']:
                mr = 1
            elif row['License machine redeable (query)'] not in ['-','absent',False,'False']:
                mr = 1
            else: 
                mr = 0
            
            if row['License human redeable'] not in ['-','False',False]:
                hrV = 1
            else:
                hrV = 0
            
            licensing_score = ((mr+hrV) * weight ) / LICENSING_METRICS
            self.kgs_quality_data.loc[index,'Licensing score'] = licensing_score
    
    def interlinkingScore(self,weight):
        for index, row in self.kgs_quality_data.iterrows():

            try:
                sameAs = int(row['Number of samAs chains'])
                triples = int(row['Number of triples (query)'])
                if triples > 0  and triples >= sameAs:
                    sameAsV = sameAs/triples
                else:
                    sameAsV = 0
            except (ValueError,TypeError):
                sameAsV = 0

            # try:
            #     skosMapping = int(row['SKOS mapping properties'])
            #     triples = int(row['Number of triples (query)'])
            #     if triples > 0 and triples >= skosMapping:
            #         skosMappingV = skosMapping / triples
            #     else:
            #         skosMappingV = 0
            # except (ValueError,TypeError):
            #     skosMappingV = 0

            try: 
                clustering = float(row['Clustering coefficient'])
            except (ValueError, TypeError):
                clustering = 0
            
            try:
                centrality = float(row['Centrality'])
            except (ValueError, TypeError):
                centrality = 0
            
            try:
                if(int(row['Number of triples (query)']) > float(row['Interlinking completeness'])):
                    exLinks = float(row['Interlinking completeness'])
                else:
                   exLinks = 0
            except (ValueError, TypeError):
                exLinks = 0

            interlinking_score = ((sameAsV + clustering + centrality + exLinks) * weight) / INTERLINKING_METRICS
            self.kgs_quality_data.loc[index,'Interlinking score'] = interlinking_score

    def securityScore(self,weigth):
        for index, row in self.kgs_quality_data.iterrows():
            https = row['Use HTTPS']
            if https in ['True',True]:
                secure = 1
            else:
                secure = 0
        
            auth = row['Requires authentication']
            if auth in [True,'True']:
                authV = 0
            else:
                authV = 1
            
            security_score = ((secure + authV) * weigth) / SECURITY_METRICS
            self.kgs_quality_data.loc[index,'Security score'] = security_score
    
    def performanceScore(self,weight):
        for index, row in self.kgs_quality_data.iterrows():
            count = 0
            start_time = time.time()
            if row['Sparql endpoint'] == 'Available':
                while (time.time() - start_time) < 1:
                    try:
                        query.TPQuery(row['SPARQL endpoint URL'],count)
                        count = count +1
                    except:
                        tp = 0.0
                if count >= 5:
                    tp = 1.0
                else:
                    tp = count / 200
                
                latency = []
                try:
                    for i in range(10):
                        query.checkEndPoint(row['SPARQL endpoint URL'])
                        start = time.time()  
                        latencyValue = (time.time() - start)
                        latency.append(latencyValue)
                    if latency[0] < 1:
                        latencyV = 1.0
                    else:
                        sumLatency = sum(latencyValue)
                        meanLatency = sumLatency/len(latencyValue)
                        latencyV = 1000 / meanLatency
                except:
                    latencyV = 0.0
                self.tpValue = tp
                self.latencyValue = latencyV
                performance_score = ((tp + latencyV) * weight) / PERFORMANCE_METRICS
            else:
                performance_score = 0

            performance_score = ((tp + latencyV) * weight) / PERFORMANCE_METRICS
            self.kgs_quality_data.loc[index,'Performance score'] = performance_score

    def accuracyScore(self,weight):
        for index, row in self.kgs_quality_data.iterrows():
            
            try:
                voidLabel = float(row['Triples with empty annotation problem'].replace(',','.'))
            except ValueError:
                voidLabel = 0
            
            try:
                whitespace = float(row['Triples with white space in annotation(at the beginning or at the end)'].replace(',','.'))
            except ValueError:
                whitespace = 0
            
            try:
                malformedDT = float(row['Triples with malformed data type literals problem'].replace(',','.'))
            except ValueError:
                malformedDT = 0
            
            try:
                FPValue = float(row['Functional properties with inconsistent values'].replace(',','.'))
            except ValueError:
                FPValue = 0
            
            try:
                IFPValue = float(row['Invalid usage of inverse-functional properties'].replace(',','.'))
            except ValueError:
                IFPValue = 0
            
            accuracy_score = ((voidLabel + whitespace + malformedDT + FPValue + IFPValue) * weight) / ACCURACY_METRICS
            self.kgs_quality_data.loc[index,'Accuracy score'] = accuracy_score
            
    def concisenessScore(self, weight):
        for index, row in self.kgs_quality_data.iterrows():
            try:
                intC = row['Intensional conciseness']
                intC = intC.split(' ',1)
                intC = float(intC[0])
            except ValueError:
                intC = 0
            
            try:
                exC = row['Extensional conciseness']
                exC = exC.split(' ',1)
                exC = float(exC[0])
            except ValueError:
                exC = 0
            
            conciseness_score = ((intC + exC) * weight) / CONCISENESS_METRICS
            self.kgs_quality_data.loc[index,'Conciseness score'] = conciseness_score
            
    def verifiabilityScore(self, weight):
        for index, row in self.kgs_quality_data.iterrows():
            
            try:
                vocabs = ast.literal_eval(row['Vocabularies'])  
                if isinstance(vocabs, list):
                    if len(vocabs) > 0:
                        vocabsV = 1
                    else: 
                        vocabsV = 0
                else:
                    vocabsV = 0
            except:
                vocabsV = 0
            
            try:
                authorsM = row['Author (metadata)']
                if authorsM not in ['False',False]:
                    authorV = 1
                else:
                    authorV = 0
            except:
                try:
                    authorsQ = ast.literal_eval(row['Author (query)'])
                    if isinstance(authorsQ,list):
                        if len(authorsQ) > 0:
                            authorV = 1
                        else:
                            authorV = 0
                    else:
                        authorV = 0
                except:
                    authorV = 0

            try:
                publishers = ast.literal_eval(row['Publisher'])
                if isinstance(publishers,list):
                    if len(publishers) > 0:
                        pubV = 1
                    else:
                        pubV = 0
                else:
                    pubV = 0
            except:
                pubV = 0

            try:
                contribs = ast.literal_eval(row['Contributor'])
                if isinstance(contribs,list):
                    if len(contribs) > 0:
                        contribsV = 1
                    else:
                        contribsV = 0
                else:
                    contribsV = 0
            except:
                contribsV = 0
            
            sign = row['Signed']
            if sign in ['True',True]:
                signV = 1
            else:
                signV = 0
            
            sources = row['Sources']
            srcV = 0
            web_pattern = r"Web:(\S+)"
            name_pattern = r"Name:([\w\s]+)"
            email_pattern = r"Email:([\w\.-]+@[\w\.-]+)"
            web_match = re.search(web_pattern, sources)
            name_match = re.search(name_pattern, sources)
            email_match = re.search(email_pattern, sources)

            web = web_match.group(1) if web_match else None
            name = name_match.group(1) if name_match else None
            email = email_match.group(1) if email_match else None
            if web != 'absent':
                srcV = srcV + 0.33
            if name != 'absent Email' and name != 'absent':
                srcV = srcV + 0.33
            if email != 'absent' and email is not None:
                srcV = srcV + 0.33

            verifiability_score = ((vocabsV + authorV + pubV + contribsV + srcV + signV) * weight) / VERIFIABILITY_METRICS
            self.kgs_quality_data.loc[index,'Verifiability score'] = verifiability_score
    
    def reputationScore(self, weight):
        for index, row in self.kgs_quality_data.iterrows():
            try:
                pr = row['PageRank']
                pr = pr.replace(',','.')
                pr = float(pr)
                prV = pr / 10.00
            except:
                prV = 0
            
            reputation_score = (prV * weight) / REPUTATION_METRICS
            self.kgs_quality_data.loc[index,'Reputation score'] = reputation_score
        
    def believabilityScore(self,weight):
        for index, row in self.kgs_quality_data.iterrows():
            trustV = row['Trust value'].replace(',','.')
            trustV = float(trustV) 

            believability_score = (trustV * weight) / BELIEVABILITY_METRICS
            self.kgs_quality_data.loc[index,'Believability score'] = believability_score
    
    def currencyScore(self,weight):
        for index, row in self.kgs_quality_data.iterrows():
            age_of_data = row['Age of data']
            if isinstance(age_of_data,date) or (isinstance(age_of_data,str) and age_of_data != '-') or isinstance(age_of_data,int):
                cV = 1
            else:
                cV = 0
            
            modification_date = row['Modification date']
            if isinstance(modification_date,date) or (isinstance(modification_date,str)and modification_date != '-'):
                mV = 1
            else:
                mV = 0
            
            currency_score = ((cV + mV) * weight) / CURRENCY_METRICS
            self.kgs_quality_data.loc[index,'Currency score'] = currency_score

    def volatilityScore(self,weight):
        for index, row in self.kgs_quality_data.iterrows():
            try:
                frequency = ast.literal_eval(row['Dataset update frequency'])  
                if isinstance(frequency,list):
                    if len(frequency) > 0:
                        freqV = 1
                    else:
                        freqV = 0
                elif isinstance(frequency,str) and frequency in ['http:','https:']:
                    freqV = 1
                else:
                    freqV = 0
            except:
                freqV = 0
        
            volatility_score = (freqV * weight) / VOLATILITY_METRICS
            self.kgs_quality_data.loc[index,'Volatility score'] = volatility_score
    
    def completenessScore(self,weight):
        for index, row in self.kgs_quality_data.iterrows():
            try:
                if(int(row['Number of triples (query)']) > float(row['Interlinking completeness'])):
                    interC = float(row['Interlinking completeness'])
                else:
                    interC = 0
            except:
                interC = 0
            
            completeness_score = (interC * weight) / COMPLETENESS_METRICS
            self.kgs_quality_data.loc[index,'Completeness score'] = completeness_score
    
    def amountScore(self,weigth):
        for index, row in self.kgs_quality_data.iterrows():
            try:
                numT = int(row['Number of triples (query)'])
                triplesV = 1
            except (ValueError, TypeError):
                triplesV = 0
            
            try:
                numT = int(row[' Number of triples (metadata)'])
                triplesV = 1
            except (ValueError, TypeError):
                triplesV = 0
            
            try:
                numERe = int(row['Number of entities counted with regex'])
                entitiesV = 1
            except (ValueError,TypeError):
                entitiesV = 0

            if entitiesV == 0: 
                try:
                    numE = int(row['Number of entities'])
                    entitiesV = 1
                except (ValueError, TypeError):
                    entitiesV = 0
            
            try:
                numProp = int(row['Number of property'])
                numPropV = 1
            except (ValueError, TypeError):
                numPropV = 0
            
            amount_score = ((triplesV + entitiesV + numPropV ) * weigth) / AMOUNT_METRICS
            self.kgs_quality_data.loc[index,'Amount of data score'] = amount_score

    def versatilityScore(self,weight):
        for index, row in self.kgs_quality_data.iterrows():
            try:
                serializationF = ast.literal_eval(row['Serialization formats'])
                if isinstance(serializationF,list):
                    if len(serializationF) > 0:
                        seriValue = 1
                    else:
                        seriValue = 0
                else:
                    seriValue = 0
            except:
                seriValue = 0
            
            try:
                languages = ast.literal_eval(row['Languages (query)'])
                if isinstance(languages, list):
                    if len(languages) > 0:
                        langsV = 1
                    else:
                        langsV = 0
                else:
                    langsV = 0
            except:
                langsV = 0

            try:
                if row['Sparql endpoint'] == 'Available' and (row['Availability of RDF dump (metadata)'] in [1,'1','True',True] or row['Availability of RDF dump (query)'] in ['True', True,1,'1']):
                    accessibilityV = 1
                else:
                    accessibilityV = 0
            except:
                accessibilityV = 0
            
            versatility_score = ((seriValue + langsV + accessibilityV) * weight) / VERSATILITY_METRICS
            self.kgs_quality_data.loc[index,'Versatility score'] = versatility_score
    
    def write_data_on_csv(self):
        self.kgs_quality_data.to_csv('./Analysis results/2023-11-27_edited.csv',index=False)
                
d = RecalculateScore('./Analysis results/2023-11-27.csv',20)
d.availabilityScore(1)
d.licensingScore(1)
d.interlinkingScore(1)
d.securityScore(1)
#d.performanceScore(1)
d.accuracyScore(1)
d.concisenessScore(1)
d.verifiabilityScore(1)
d.reputationScore(1)
d.believabilityScore(1)
d.currencyScore(1)
d.volatilityScore(1)
d.completenessScore(1)
d.amountScore(1)
d.versatilityScore(1)
d.write_data_on_csv()