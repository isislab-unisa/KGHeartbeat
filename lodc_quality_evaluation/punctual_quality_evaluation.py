import pandas as pd
import os
import csv
import ast
import requests
from xml.etree import ElementTree

class PunctualQualityEvaluation:
    def __init__(self, analysis_file_path,separator = ','):
        '''
            Loads the contents of the csv file containing the analysis data into memory.

            :param analysis_file_path: Path to the file that contains the quality data to be evaluated
            :param separator: separator used in the analysis file (by default is ',')
        '''
        self.analysis_data = pd.read_csv(analysis_file_path,sep=separator)

    def group_by_value(self,metric):
        '''
            Group by values in a column.

            :param metric: The metric for which you want to group by the measured value
        '''
        group_by = self.analysis_data[metric].value_counts()
        self.write_data_on_csv(metric,group_by)

        return group_by
    
    def count_elements_by_type(self,metric):
        '''
            Counts the occourences of the differents type of values for a specific metric if the values is a list.

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
            except Exception:
                continue
        df = pd.DataFrame(values.items())
        self.write_data_on_csv('serial',df,False)
    
    def accessibility_stats(self):
        '''
            Evaluate accessibility metrics.
        '''

        all_up = self.analysis_data[(self.analysis_data['SPARQL availability'] == True) & (self.analysis_data['RDF dump availability'] == True) & (self.analysis_data['VoID availability'] == 'VoID file available') & (self.analysis_data['Common accepted Media Type'] == True)].shape[0]
        all_down = self.analysis_data[(self.analysis_data['SPARQL availability'] != True) & (self.analysis_data['RDF dump availability'] != True) & (self.analysis_data['VoID availability'] != 'VoID file available')].shape[0]
        only_sparql = self.analysis_data[(self.analysis_data['SPARQL availability'] == True) & (self.analysis_data['RDF dump availability'] != True) & (self.analysis_data['VoID availability'] != 'VoID file available')].shape[0]
        only_dump = self.analysis_data[(self.analysis_data['SPARQL availability'] != True) & (self.analysis_data['RDF dump availability'] == True) & (self.analysis_data['VoID availability'] != 'VoID file available') & (self.analysis_data['Common accepted Media Type'] == True)].shape[0]
        only_void = self.analysis_data[(self.analysis_data['SPARQL availability'] != True) & (self.analysis_data['RDF dump availability'] != True) & (self.analysis_data['VoID availability'] == 'VoID file available')].shape[0]
        sparql_dump = self.analysis_data[(self.analysis_data['SPARQL availability'] == True) & (self.analysis_data['RDF dump availability'] == True) & (self.analysis_data['VoID availability'] != 'VoID file available') & (self.analysis_data['Common accepted Media Type'] == True)].shape[0]
        sparql_void = self.analysis_data[(self.analysis_data['SPARQL availability'] == True) & (self.analysis_data['RDF dump availability'] != True) & (self.analysis_data['VoID availability'] == 'VoID file available')].shape[0]
        dump_void = self.analysis_data[(self.analysis_data['SPARQL availability'] != True) & (self.analysis_data['RDF dump availability'] == True) & (self.analysis_data['VoID availability'] == 'VoID file available') & (self.analysis_data['Common accepted Media Type'] == True)].shape[0]
        sparql_dump_down = self.analysis_data[(self.analysis_data['SPARQL availability'] != True) & (self.analysis_data['RDF dump availability'] != True)].shape[0]
        sparql_or_dump_UP = self.analysis_data[(self.analysis_data['SPARQL availability'] == True) | (self.analysis_data['RDF dump availability'] == True) & (self.analysis_data['Common accepted Media Type'] == True)].shape[0]

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

        with open('./punctual/availability_stats.csv', mode='w', newline='') as file:
            writer = csv.writer(file)
            
            # Write key as column
            writer.writerow(result.keys())
            
            # Write value as row
            writer.writerow(result.values())

    def write_data_on_csv(self, metric, pandas_df,index=True):
        '''
            Write evaluation data into a CSV file.

            :param metric: The name of the metric evaluated, used as filename.
            :param pandas_df: pandas df to write in the csv file.
        '''
        here = os.path.dirname(os.path.abspath(__file__))
        save_path = os.path.join(here,f'./evaluation_results/{metric}_evaluation-punctual.csv')
        pandas_df.to_csv(save_path,index=index)

    def compare_column(self,column_to_compare,sparql_av=False):
        '''
            Extract the value of n columns to compare the values.

            :param column_to_compare: array of strings, each string corresponds to the name of the column you want to extract from the dataframe.
            :param sparql_av: if set to true, only KGs with active sparql endpoint will be considered in the comparison
        '''
        if sparql_av == True:
            filtered_df = self.analysis_data[self.analysis_data["Sparql endpoint"] == "Available"]
            partitionated_df = filtered_df[column_to_compare]
        else:
            partitionated_df = self.analysis_data[column_to_compare]

        self.write_data_on_csv(f'Comparison-column_{column_to_compare}',partitionated_df,index=False)
    
    def get_kgs_available_with_license(self):
        '''
            Extract KGs that have at least one SPARQL endpoint, RDF dump or VoID file available along with a license.
        ''' 

        df = self.analysis_data[
            (
                (self.analysis_data['SPARQL availability'] == True) | 
                (self.analysis_data['RDF dump availability'] == True) | 
                (self.analysis_data['VoID availability'] == 'VoID file available')
            ) &
            (
                (self.analysis_data['License (metadata)'] != '-') | 
                (self.analysis_data['License machine redeable (query)'] != '-')
            )
        ]

        self.write_data_on_csv('availability_and_license',df)
    
    def check_machine_redeable_resolution(self,links):
        '''
            Check if the link return a machine-redeable common accepted format.

            :param links: list of links to run the test on.
        '''
        headers_list = [
            {'Accept': 'application/json'},         # JSON
            {'Accept': 'application/xml'},          # XML
            {'Accept': 'application/rdf+xml'},      # RDF/XML
        ]

        for link in links:
            for headers in headers_list:
                try:
                    response = requests.get(link, headers=headers)
                    if response.status_code == 200:
                    
                        content_type = response.headers.get('Content-Type', '').lower()

                        if 'application/json' in content_type:
                            try:
                                content = response.json()
                                print(f"JSON available for {link}")
                            except ValueError:
                                continue
                        
                        elif 'application/xml' in content_type or 'text/xml' in content_type:
                            try:
                                content = ElementTree.fromstring(response.content)
                                print(f"XML available for {link}")
                            except ElementTree.ParseError:
                                continue
                        
                        elif 'application/rdf+xml' in content_type:
                            try:
                                content = ElementTree.fromstring(response.content)
                                print(f"RDF available for {link}")
                            except ElementTree.ParseError:
                                continue
                        
                        elif 'text/html' in content_type:
                            print(f"ONLY HTML for {link}")
                    else:
                        print(f"Errore during request: {response.status_code}")
                except requests.RequestException as e:
                    print(f"Errore durante la richiesta con header {headers}: {e}")
    
    def generate_stats(self,metrics,output_filename,only_sparql_up=True):
        '''
            Calculate the minimum, maximum, q1, median, q3 and mean for the given metrics.

            :param metrics: array of string with the column name of the metrics to evaluate.
            :param output_filename: name of the csv file in which write the output.
            :param only_sparql_up: boolean that if True, evalute the metrics given only on KGs with SPARQL endpoint online.
        
        '''
        data = []
        data.append(['Dimension', 'Min', 'Q1', 'Median', 'Q3', 'Max', 'Mean'])  
        for metric in metrics:
            #Exclude KG with SPARQL endpoint offline or not indicated
            if only_sparql_up:
                df = self.analysis_data[(self.analysis_data["Sparql endpoint"] == "Available")] 
            else:
                df = self.analysis_data

            df.loc[:,metric] = pd.to_numeric(df[metric], errors='coerce')
            min_value = df[metric].min()
            q1_value = df[metric].quantile(0.25)
            median_value = df[metric].median()
            q3_value = df[metric].quantile(0.75)
            max_value = df[metric].max()
            mean_value = df[metric].mean()

            if metric == 'Representational-Consistency score':
                metric = 'Interoperability'
            if metric == 'Representational-Conciseness score':
                metric = 'Rep.-Conc.'
            if metric == 'Understandability score':
                metric = 'Underst.'
            evaluation = [metric.split(' ')[0],min_value, q1_value, median_value, q3_value, max_value, mean_value]
            data.append(evaluation)
            
        here = os.path.dirname(os.path.abspath(__file__))
        save_path = os.path.join(here,f'./evaluation_results/punctual/{output_filename}.csv')
        with open(save_path, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(data)

    def calculate_min_max_mean(self):
        '''
            Calcuate the minimum, maximum and the mean of the mean value of a specific metric over time.
        '''
        min_value = self.analysis_data['Mean'].min()
        max_value = self.analysis_data['Mean'].max()
        mean_value = self.analysis_data['Mean'].mean()

        result = {
            "Min" : min_value,
            "Max" : max_value,
            "Mean" : mean_value
        }

        return result

c = PunctualQualityEvaluation('./evaluation_results/over_time/extensional_conciseness.csv')
#c.generate_stats(['Availability score','Licensing score','Interlinking score','Performance score','Accuracy score','Consistency score','Conciseness score',
#                   'Verifiability score','Reputation score','Believability score','Currency score','Volatility score','Completeness score','Amount of data score','Representational-Consistency score','Representational-Conciseness score',
#                   'Understandability score','Interpretability score','Versatility score','Security score'],'metrics_stats_punctual')
#c.generate_stats(['U1-value','CS2-value','IN3-value','RC1-value','RC2-value','N4-value','Deprecated classes/properties used'],'to_compare_with_luzzu')
print(c.calculate_min_max_mean())