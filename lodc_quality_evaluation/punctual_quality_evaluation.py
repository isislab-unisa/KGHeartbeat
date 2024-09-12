import pandas as pd
import os
import csv
import ast

class PunctualQualityEvaluation:
    def __init__(self, analysis_file_path):
        '''
            Loads the contents of the csv file containing the analysis data into memory.

            :param analysis_file_path: Path to the file that contains the quality data to be evaluated
        '''
        self.analysis_data = pd.read_csv(analysis_file_path)

    def group_by_value(self,metric):
        '''
            Counts the differents license type from the metadata.

            :param metric: The metric for which you want to group by the measured value
        '''
        group_by = self.analysis_data[metric].value_counts()
        self.write_data_on_csv(metric,group_by)

        return group_by
    
    def count_elements_by_type(self,metric):
        '''
            Counts the occourences of the differents type of values for a specific metric 

            :param metric: The metric for which you want to count the different types of value
        '''
        values = {}
        for list_string in self.analysis_data[metric]:
            try:
                list_elements = ast.literal_eval(list_string)
                if isinstance(list_elements, list):
                    for el in list_elements:
                        if el in values:
                            values[el] += 1
                        else:
                            values[el] = 1
            except Exception as error:
                #print(error)
                continue
        
        df = pd.DataFrame(values.items())
        self.write_data_on_csv('serial',df,False)
    
    def accessibility_stats(self):
        '''
            Evaluate accessibility metrics.
        '''

        all_up = self.analysis_data[(self.analysis_data['Sparql endpoint'] == 'Available') & (self.analysis_data['Availability of RDF dump (metadata)'] == 1) & (self.analysis_data['Availability VoID file'] == 'VoID file available')].shape[0]
        all_down = self.analysis_data[(self.analysis_data['Sparql endpoint'] != 'Available') & (self.analysis_data['Availability of RDF dump (metadata)'] != 1) & (self.analysis_data['Availability VoID file'] != 'VoID file available')].shape[0]
        only_sparql = self.analysis_data[(self.analysis_data['Sparql endpoint'] == 'Available') & (self.analysis_data['Availability of RDF dump (metadata)'] != 1) & (self.analysis_data['Availability VoID file'] != 'VoID file available')].shape[0]
        only_dump = self.analysis_data[(self.analysis_data['Sparql endpoint'] != 'Available') & (self.analysis_data['Availability of RDF dump (metadata)'] == 1) & (self.analysis_data['Availability VoID file'] != 'VoID file available')].shape[0]
        only_void = self.analysis_data[(self.analysis_data['Sparql endpoint'] != 'Available') & (self.analysis_data['Availability of RDF dump (metadata)'] != 1) & (self.analysis_data['Availability VoID file'] == 'VoID file available')].shape[0]
        sparql_dump = self.analysis_data[(self.analysis_data['Sparql endpoint'] == 'Available') & (self.analysis_data['Availability of RDF dump (metadata)'] == 1) & (self.analysis_data['Availability VoID file'] != 'VoID file available')].shape[0]
        sparql_void = self.analysis_data[(self.analysis_data['Sparql endpoint'] == 'Available') & (self.analysis_data['Availability of RDF dump (metadata)'] != 1) & (self.analysis_data['Availability VoID file'] == 'VoID file available')].shape[0]
        dump_void = self.analysis_data[(self.analysis_data['Sparql endpoint'] != 'Available') & (self.analysis_data['Availability of RDF dump (metadata)'] == 1) & (self.analysis_data['Availability VoID file'] == 'VoID file available')].shape[0]
        sparql_dump_down = self.analysis_data[(self.analysis_data['Sparql endpoint'] != 'Available') & (self.analysis_data['Availability of RDF dump (metadata)'] != 1)].shape[0]
        sparql_or_dump_UP = self.analysis_data[(self.analysis_data['Sparql endpoint'] == 'Available') | (self.analysis_data['Availability of RDF dump (metadata)'] == 1)].shape[0]

        result = {
            "SPARQL, Dump and VoID online" : all_up,
            "Only SPARQL endpoint online" : only_sparql,
            "Only Dump available" : only_dump,
            "Only VoID file online" : only_void,
            "SPARQL and Dump online" : sparql_dump,
            "SPARQL and VoID online" : sparql_void,
            "Dump and VoID online" : dump_void,
            "SPARQL and dump offline" : sparql_dump_down,
            "SPARQL, Dump and VoID offline" : all_down,
            "SPARQL or Dump online" : sparql_or_dump_UP
        }

        print(result)

        return result

    def write_data_on_csv(self, metric, pandas_df,index=True):
        '''
            Write evaluation data into a CSV file.

            :param metric: The name of the metric evaluated, used as filename.
            :param pandas_df: pandas df to write in the csv file.
        '''
        pandas_df.to_csv(f'{metric}_evaluation-punctual.csv',index=index)

c = PunctualQualityEvaluation('./quality_data/2024-09-01.csv')
v = c.accessibility_stats()
