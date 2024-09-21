import pandas as pd
import os
import seaborn as sns
import matplotlib.pyplot as plt

class GenerateCharts:

    def __init__(self,evaluation_results_path,charts_output = './charts') -> None:
        '''
            Creates a list of CSV files that are to be parsed.

            :param evaluations_results_path: path to the folder that contains the evaluation results csv files.
            :param charts_output: path to the folder in which to place the generated graphs.

        '''
        self.analysis_results_files = []
        self.output_file = charts_output
        # Get all csv filename from the dir
        for filename in os.listdir(evaluation_results_path):
            if '.csv' in filename:
                file_path = os.path.join(evaluation_results_path, filename)
                self.analysis_results_files.append(file_path)    
        

    def generate_boxplots_over_time(self, range='M'):
        '''
            Generates different boxplot, one for each metric, having the date as the x-axis and each box is measurement.

            :param range: Time data selection interval, e.g., monthly(M), quarterly(Q), all (A).
        '''

        for file in self.analysis_results_files:
            metric_analyzed = os.path.splitext(os.path.basename(file))[0]

            df = pd.read_csv(file)

            df['Analysis date'] = pd.to_datetime(df['Analysis date'])
            df = df.sort_values(by='Analysis date')

            if range != 'A':
                df_filtered = df.groupby(df['Analysis date'].dt.to_period(range)).first()
            else:
                df_filtered = df

            df_melted = df_filtered.melt(id_vars='Analysis date', value_vars=['Min', 'Q1', 'Median', 'Q3', 'Max'], 
                var_name='Statistic', value_name='Value')
            
            plt.figure(figsize=(10, 9))
            sns.boxplot(x='Analysis date', y='Value', hue='Analysis date', data=df_melted)
            plt.xticks(rotation=45)
            plt.title(metric_analyzed)
            plt.xlabel('Date')
            plt.ylabel('Values')
            plt.savefig(self.output_file + '/' + metric_analyzed)
    
    def generate_boxplots_punctual(self,input_file):
        '''
            Generate a box for a specific metric for a punctual analysis.

            :param input_file: filename of the file that contains the evaluation data about the metric.
        '''
        df = pd.read_csv(input_file)

        df_melted = df.melt(id_vars='Dimension', value_vars=['Min', 'Q1', 'Median', 'Q3', 'Max'], 
                var_name='Statistic', value_name='Value')

        sns.set_context("talk", font_scale=1.7)
        plt.figure(figsize=(55, 35))
        sns.boxplot(x='Dimension', y='Value', hue='Dimension', data=df_melted)
        plt.xticks(rotation=90)
        plt.title('Quality dimension evaluation')
        plt.xlabel('Dimension',ha='center')
        plt.ylabel('Values')
        plt.savefig('test')

    def generate_combined_boxplot_over_time(self, time_period_range, dimensions_to_exclude):
        """
            Creates a boxplot where on the x-axis is time and and for each measurement, a box for each metric.

            :param time_period_range: Time data selection interval, e.g., monthly(M), quarterly(Q), all (A).
            :param dimensions_to_exclude: Array pf strings that contains the name of the metrics to exclude from the boxplot.
        
        """
        dfs = []
        for file in self.analysis_results_files:
            df = pd.read_csv(file)
            dimension_name = os.path.splitext(os.path.basename(file))[0]
            dimension_name = dimension_name.split(' ')[0]
            if dimension_name in dimensions_to_exclude:
                continue
            
            if dimension_name == 'Representational-Consistency':
                dimension_name = 'Interoperability'
            if dimension_name == 'Representational-Conciseness':
                dimension_name = 'Rep.-Conc.'
            if dimension_name == 'Understandability':
                dimension_name = 'Underst.'

            df["Dimension"] = dimension_name

            df['Analysis date'] = pd.to_datetime(df['Analysis date'])
            df = df.sort_values(by='Analysis date')
            if time_period_range != 'A':
                df_filtered = df.groupby(df['Analysis date'].dt.to_period(time_period_range)).first()
            else:
                df_filtered = df

            dfs.append(df_filtered)

        data = pd.concat(dfs)

        melted_data = pd.melt(
            data, 
            id_vars=['Analysis date', 'Dimension'], 
            value_vars=['Min', 'Q1', 'Median', 'Q3', 'Max'], 
            var_name='Statistic', 
            value_name='Value'
        )

        plt.figure(figsize=(25, 9))
        sns.boxplot(x='Analysis date', y='Value', hue='Dimension', data=melted_data)

        plt.xticks(rotation=45)
        plt.xlabel("Analysis Date")
        plt.ylabel("Value")
        plt.title("Quality data for each metric")

        plt.legend(bbox_to_anchor=(1.01, 1), loc='best', borderaxespad=0.)
        
        plt.savefig(f'{self.output_file}/dimensions_over_time')
    
charts = GenerateCharts('./evaluation_results/over_time/')
charts.generate_combined_boxplot_over_time('M',['Accuracy'])
    
