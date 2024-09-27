import pandas as pd
import os
import requests
import csv
import ast
from collections import Counter

class QualityEvaluationOT:
    def __init__(self,analysis_results_path,output_file='evaluation-over-time'):
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

        self.analysis_results_files = sorted(self.analysis_results_files)

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
                print("Missing KGs from KGHeartBeat analysis: ", len(missing_identifiers))
                print(file_path)

                df['KG id'] = df['KG id'].astype(str).str.strip()
                df_filtered = df[df['KG id'].isin(identifiers)]

                df_filtered.to_csv(f"filtered/{filename}",index=False)

    def extract_only_lodc_single_file(self,analysis_results_path):
        '''
            Extract only KGs from LODCloud from the csv output from KGHeartBeat.

            :param analysis_results_path: path to csv where to discard the KGs.
        '''
        response = requests.get("https://lod-cloud.net/versions/latest/lod-data.json")
        kgs = response.json()
        print("Number of KG from LODCloud:", len(kgs))
        identifiers = [data['identifier'] for key, data in kgs.items()]
        if '.csv' in analysis_results_path:
            df = pd.read_csv(analysis_results_path)

            identifiers_in_csv = set(df['KG id'].unique())
            missing_identifiers = set(identifiers) - identifiers_in_csv
            print("Missing KGs from KGHeartBeat analysis: ", missing_identifiers)

            df['KG id'] = df['KG id'].astype(str).str.strip()
            df_filtered = df[df['KG id'].isin(identifiers)]

            df_filtered.to_csv(f"filtered/{analysis_results_path}.csv",index=False)

    def stats_over_time(self, metrics,only_sparql_up=True):   
        '''
            For every analysis, calculate the min, max, median, mean, q1, q3 for the specified metrics by considering all KGs in the file.
            Then the data are stored in a csv file

            :param metrics: string array that contains the exact column name of the csv file for which you want to enter statistics
            :param sparql_availability: boolean if true, consider in statistics, only KGs with an active SPARQL endpoint, if false, all will be considered.
        '''
        # loop through every file and calculate data for a boxplot
        for metric in metrics:
            data = []
            print(f"Evaluating the {metric} metric\n")
            data.append(['Analysis date', 'Min', 'Q1', 'Median', 'Q3', 'Max', 'Mean'])
            for file_path in self.analysis_results_files:
                df = pd.read_csv(file_path)

                #Exclude KG with SPARQL endpoint offline or not indicated
                if(only_sparql_up == True):
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

            here = os.path.dirname(os.path.abspath(__file__))
            save_path = os.path.join(here,f'{self.output_file}/{metric}.csv')
            with open(save_path, mode='w', newline='') as file:
                writer = csv.writer(file)
                writer.writerows(data)
    
    def add_category_score(self):
        """
            Add a the category score in the original CSV returned by KGHeartBeat, the value is calculated as the sum of the scores for that category, divided by the number of dimensions for that category.
        """
        categories = {
            "Intrinsic score" : {
                "Accuracy score" : 0,
                "Interlinking score" : 0,
                "Consistency score" : 0,
                "Conciseness score" : 0,
            },
            "Dataset dynamicity score" : {
                "Currency score" : 0,
                "Volatility score" : 0,
            },
            "Trust score" : {
                "Verifiability score" : 0,
                "Reputation score" : 0,
                "Believability score" : 0,
            },
            "Contextual score" : {
                "Completeness score" : 0,
                "Amount of data score" : 0,
            },
            "Representational score" : {
                "Representational-Consistency score": 0,
                "Representational-Conciseness score" : 0,
                "Understandability score" : 0,
                "Interpretability score" : 0,
                "Versatility score" : 0
            },
            "Accessibility score": {
                "Availability score" : 0,
                "Licensing score" : 0,
                "Security score" : 0,
                "Performance score" : 0,
            }
        }

        for file_path in self.analysis_results_files:
            df = pd.read_csv(file_path)
            for key in categories:
                category = categories[key]
                dimensions_in_cat = category.keys()
                df[key] = df[dimensions_in_cat].sum(axis=1) / len(dimensions_in_cat)
            
            df.to_csv(file_path,index=False)
    
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

        here = os.path.dirname(os.path.abspath(__file__))
        save_path = os.path.join(here,f'{self.output_file}/P1.csv')
        with open(save_path, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(data)
    
    def evaluate_integer_metrics(self,metric,new_column_name):
        '''
            Evaluates the quality of metrics that have list as their value.
            
            :param metric the metric name to evaluate.
            :param new_column_name the column name in which insert the number of elements in the measured meatric.
        '''
        data = []
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
        
        here = os.path.dirname(os.path.abspath(__file__))
        save_path = os.path.join(here,f'{self.output_file}/{metric}.csv')
        with open(save_path, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(data)
    
    def evaluate_conciseness(self):
        '''
            Evaluate the extensional conciseness metric.
        '''
        data = []
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
        
        here = os.path.dirname(os.path.abspath(__file__))
        save_path = os.path.join(here,f'{self.output_file}/extensional_conciseness.csv')
        with open(save_path, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(data)
    
    def classify_sparql_endpoint_availability(self,column_name='Sparql endpoint'):
        '''
            Analyze the SPARQL endpoint availabilty over time, Classifying the behavior into:
                - Always online
                - Always not specified
                - Always offline
                - Swinging

            :param column_name: string that is the column name which contains the SPARQL endpoint status.
        '''
        # Load CSV into one dataframe
        
        df_list = [pd.read_csv(file, usecols=['KG id', 'Sparql endpoint','SPARQL endpoint URL']) for file in self.analysis_results_files]
        df = pd.concat(df_list, ignore_index=True)

        df[column_name] = df[column_name].str.strip()

        # Classify the status of every KG kg_id
        def classify_kg_status(sub_df):
            unique_statuses = sub_df[column_name].unique()
            if len(unique_statuses) == 1:
                return unique_statuses[0]
            else:
                return 'Alternating'

        # group by kg_id and use the classification function
        status_df = df.groupby('KG id').apply(classify_kg_status).reset_index(name='Status')

        # Count how many available, offline and laternating
        status_counts = status_df['Status'].value_counts().reset_index()
        status_counts.columns = ['Status', 'Count']

        status_counts.to_csv('./evaluation_results/over_time/availability_over_time.csv',index=False)

        return status_df, status_counts, df
    
    def calculate_percentage_of_availability_swinging_sparql(self,df, status_df, column_name='Sparql endpoint'):
        '''
            Calculate the percentage of SPARQL endpoint availability for every KGs analyzed.

            :param df: the dataframe with all the data quality calculated over time aggregated togheter.
            :param status_df: dataframe with the "Status" column, which contains the SPARQL endpoint status for every KGs analyzed over time
        '''
        # Filter for alternating KG ids
        alternating_kg_ids = status_df[status_df['Status'] == 'Alternating']['KG id']
        
        # Calculate the availability percentage for each alternating KG id
        availability_percentages = []
        availability_percentage_by_kgid = {}
        for kg_id in alternating_kg_ids:
            kg_df = df[df['KG id'] == kg_id]
            total_count = len(kg_df)
            available_count = len(kg_df[kg_df[column_name] == 'Available'])
            availability_percentage = (available_count / total_count) * 100
            availability_percentages.append(availability_percentage)
            availability_percentage_by_kgid[kg_id] = availability_percentage

        # Calculate the overall average availability percentage for all alternating KG ids
        overall_average_availability_percentage = df[df['KG id'].isin(alternating_kg_ids) & (df[column_name] == 'Available')].shape[0] / df[df['KG id'].isin(alternating_kg_ids)].shape[0] * 100

        stats = {
            'min': min(availability_percentages) if availability_percentages else 0,
            'max': max(availability_percentages) if availability_percentages else 0,
            'median': pd.Series(availability_percentages).median() if availability_percentages else 0,
            'q1': pd.Series(availability_percentages).quantile(0.25) if availability_percentages else 0,
            'q3': pd.Series(availability_percentages).quantile(0.75) if availability_percentages else 0,
            'std': pd.Series(availability_percentages).std() if availability_percentages else 0,
            'mean': pd.Series(availability_percentages).mean() if availability_percentages else 0,
            'overall_average': overall_average_availability_percentage
        }

        return stats,availability_percentage_by_kgid
    
    def group_by_availability_percentage(self,availability_percentage_by_kgid):
        '''
            Groub by percentage of SPARQL endpoint availability

            :param availability_percentage_by_kgid: dict with the percentace of SPARQL endpoint availability for every KG analyzed.
        '''
        grouped_counts = Counter(availability_percentage_by_kgid.values())

        df = pd.DataFrame(grouped_counts.items(), columns=['Percentage of availability', 'Number of KGs'])

        df.to_csv('./evaluation_results/over_time/percentage_of_availability.csv', index=False)


q = QualityEvaluationOT('./filtered/','./evaluation_results/filtered/')

status_df, status_counts, combined_df  = q.analyze_kg_status()
stats, availability_percentage_by_kgid = q.calculate_alternating_availability(combined_df,status_df)
q.group_by_availability_percentage(availability_percentage_by_kgid)