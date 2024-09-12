import pandas as pd
import os
import requests
import csv
import ast

class QualityEvaluationOT:
    def __init__(self,analysis_results_path,output_file):
        '''
            Creates a list of CSV files that are to be parsed

            :param analysis_results_path: path to the folder that contains the analysis csv files
            :param output_file: Name of the file in which to save the result of the quality assessment
        '''
        self.analysis_results_files = []
        self.output_file = output_file
        # Get all csv filename from the dir
        for filename in os.listdir(analysis_results_path):
            if '.csv' in filename:
                file_path = os.path.join(analysis_results_path, filename)
                self.analysis_results_files.append(file_path)

    def load_all_csv_as_one(self,metrics_to_select):
        '''
            Load all csv file in memory as one dataframe.

            :param metrics_to_select: Array of columns to select from the csv fiels.
        '''
        df_list = [pd.read_csv(file, usecols=metrics_to_select) for file in self.analysis_results_files]
        csv_data = pd.concat(df_list, ignore_index=True)
        
        return csv_data
    
    def extract_only_lodc(self,analysis_results_path):
        '''
            Extract only KGs from LODCloud from the csv output from KGHeartBeat.

            :param analysis_results_path: path to csv where to discard the KGs.
        '''
        response = requests.get("https://lod-cloud.net/versions/latest/lod-data.json")
        kgs = response.json()
        print("Number of KG from LODCloud:", len(kgs))
        identifiers = [data['identifier'] for key, data in kgs.items()]
        # Iterate throught all the csv and create a new csv with only the KGs from LODCloud
        for filename in os.listdir(analysis_results_path):
            if '.csv' in filename:
                file_path = os.path.join(analysis_results_path, filename)
                df = pd.read_csv(file_path)

                identifiers_in_csv = set(df['KG id'].unique())
                missing_identifiers = set(identifiers) - identifiers_in_csv
                print("Missing KGs from KGHeartBeat analysis: ", missing_identifiers)

                df['KG id'] = df['KG id'].astype(str).str.strip()
                df_filtered = df[df['KG id'].isin(identifiers)]

                df_filtered.to_csv(f"filtered/{filename}.csv",index=False)
    
    def stats_over_time(self, metrics):   
        '''
            For every analysis, calculate the min, max, median, mean, q1, q3 for the specified metrics by considering all KGs in the file.
            Then the data are stored in a csv file

            :param metrics: string array that contains the exact column name of the csv file for which you want to enter statistics
        '''
        data = []
        # loop through every file and calculate data for a boxplot
        for metric in metrics:
            print(f"Evaluating the {metric} metric\n")
            data.append([metric])
            data.append(['Analysis date', 'Min', 'Q1', 'Median', 'Q3', 'Max', 'Mean'])
            for file_path in self.analysis_results_files:
                df = pd.read_csv(file_path)

                #Exclude KG with SPARQL endpoint offline or not indicated
                df = df[(df["Sparql endpoint"] == "Available")]

                df[metric] = pd.to_numeric(df[metric], errors='coerce')
                min_value = df[metric].min()
                q1_value = df[metric].quantile(0.25)
                median_value = df[metric].median()
                q3_value = df[metric].quantile(0.75)
                max_value = df[metric].max()
                mean_value = df[metric].mean()

                evaluation = [os.path.basename(file_path).split('.')[0],min_value, q1_value, median_value, q3_value, max_value, mean_value]
                data.append(evaluation)

        with open(f'{self.output_file}.csv', mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(data)
    
    def evaluate_provenance_info(self):
        '''
            Evaluate the provenance metrics by checking if an author or a publisher is indicated in the KG.
        '''
        data = []
        data.append(['Provenance'])
        data.append(['Analysis date', 'Min', 'Q1', 'Median', 'Q3', 'Max', 'Mean'])
        for file_path in self.analysis_results_files:
            df = pd.read_csv(file_path)
            df['P1'] = df.apply(lambda row: 1 if (row['Author (metadata)'] != 'False' or (row['Publisher'] != '-' and row['Publisher'] != '[]' and row['Publisher'] != 'absent')) else 0, axis=1)
        
            df['P1'] = pd.to_numeric(df['P1'], errors='coerce')
            min_value = df['P1'].min()
            q1_value = df['P1'].quantile(0.25)
            median_value = df['P1'].median()
            q3_value = df['P1'].quantile(0.75)
            max_value = df['P1'].max()
            mean_value = df['P1'].mean()

            evaluation = [os.path.basename(file_path).split('.')[0],min_value, q1_value, median_value, q3_value, max_value, mean_value]
            data.append(evaluation)
        
        with open(f'{self.output_file}.csv', mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(data)
    
    def evaluate_integer_metrics(self,metric,new_column_name):
        '''
            Evaluates the quality of metrics that have integers as their value.
            
            :param metric the metric name to evaluate.
            :param new_column_name the column name in which insert the number of elements in the measured meatric.
        '''
        data = []
        data.append([metric])
        data.append(['Analysis date', 'Min', 'Q1', 'Median', 'Q3', 'Max', 'Mean'])
        for file_path in self.analysis_results_files:
            df = pd.read_csv(file_path)
            for idx, list_string in enumerate(df[metric]):
                try:
                    list_elements = ast.literal_eval(list_string)
                    if isinstance(list_elements, list):
                        df.at[idx, new_column_name] = len(list_elements)
                except Exception as error:
                   continue
            
            df[new_column_name] = pd.to_numeric(df[new_column_name], errors='coerce')
            min_value = df[new_column_name].min()
            q1_value = df[new_column_name].quantile(0.25)
            median_value = df[new_column_name].median()
            q3_value = df[new_column_name].quantile(0.75)
            max_value = df[new_column_name].max()
            mean_value = df[new_column_name].mean()

            evaluation = [os.path.basename(file_path).split('.')[0],min_value, q1_value, median_value, q3_value, max_value, mean_value]
            data.append(evaluation)
        
        with open(f'{self.output_file}.csv', mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(data)
    
    def evaluate_conciseness(self):
        '''
            Evaluate the extensional conciseness metric.
        '''
        data = []
        data.append(['Extensional conciseness'])
        data.append(['Analysis date', 'Min', 'Q1', 'Median', 'Q3', 'Max', 'Mean'])
        for file_path in self.analysis_results_files:
            df = pd.read_csv(file_path)
            for idx, value in enumerate(df['Extensional conciseness']):
                conc_value = value.split(' ')[0]
                df.at[idx, 'CN2'] = conc_value
            
            df['CN2'] = pd.to_numeric(df['CN2'], errors='coerce')
            min_value = df['CN2'].min()
            q1_value = df['CN2'].quantile(0.25)
            median_value = df['CN2'].median()
            q3_value = df['CN2'].quantile(0.75)
            max_value = df['CN2'].max()
            mean_value = df['CN2'].mean()

            evaluation = [os.path.basename(file_path).split('.')[0],min_value, q1_value, median_value, q3_value, max_value, mean_value]
            data.append(evaluation)

        with open(f'{self.output_file}.csv', mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(data)





q = QualityEvaluationOT('./quality_data','quality_evaluation_over_time')
#q.stats_over_time(['Deprecated classes/properties used','Invalid usage of inverse-functional properties','','Entities as member of disjoint class'])
#q.evaluate_provenance_info()
q.evaluate_conciseness()