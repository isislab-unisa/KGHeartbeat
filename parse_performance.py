import re
import numpy as np
import json

def extract_time_for_kg(file_path):
    max_time = 0
    max_time_line = ""

    time_data = []
    with open(file_path, 'r') as file:
        lines = file.readlines()

        for line in lines:
            match = re.search(r'--- Analysis for (.+?) took (\d+\.\d+)s', line)
            if match:
                analysis_name = match.group(1)
                analysis_time = float(match.group(2))
                time_data.append(analysis_time)
                '''    
                if analysis_time > max_time:
                    max_time = analysis_time
                    max_time_line = line.strip()
                '''
    
    return time_data

def parse_time_for_dimensions(file_path, metric):
    metric_times = {}
    metric_times_list = []

    with open(file_path, 'r') as file:
        
        lines = file.readlines()

        for line in lines:
            if metric in line:
                # Trova la riga contenente la metrica desiderata
                parts = line.split('took ')
                if len(parts) >= 2:
                    # Estrai il tempo di esecuzione dalla parte successiva a "took"
                    time_str = parts[1].split('s')[0]
                    try:
                        time_seconds = float(time_str)

                        metric_times[metric] = time_seconds
                        metric_times_list.append(time_seconds)
                    except ValueError:
                        print(f"Errore nella conversione del tempo per la metrica {metric}")

    return metric_times,metric_times_list

def time_for_dimensions(file_path):
    # Definire il dizionario per memorizzare i tempi per ogni KG e dimensione
    kg_analysis_info = {}
    # Aprire il file e leggere le righe
    with open(file_path, 'r') as file:
        for riga in file:
            try:
            # Estrarre il nome del KG
                kg_name = riga.split('for ')[1].split('took')[0].strip()
                parti = riga.strip().split('|')
                dimension = parti[0]
                dimension = dimension.strip()
                analysis_time_metric = parti[1].split('took')[1].strip()
                time_str = analysis_time_metric.split('s')[0]
                time_seconds = float(time_str)
                if not kg_name in kg_analysis_info:
                    kg_analysis_info[kg_name] = {}
                if dimension == '':
                    kg_analysis_info[kg_name]['total_analysis_time'] = time_seconds
                else:
                    if dimension in kg_analysis_info[kg_name]:
                        kg_analysis_info[kg_name][dimension] += time_seconds
                    else:
                        kg_analysis_info[kg_name][dimension] = time_seconds
            except Exception as e:
                pass

        with open('output.json', 'w',encoding='utf-8') as outfile:
            json.dump(kg_analysis_info, outfile, indent=4)


def dimension_statistic(file_path):
    availability_values = []
    interlinking_values = []
    license_values = []
    security_values = []
    performance_values = []
    accuracy_values = []
    consistency_values = []
    conciseness_values = []
    reputation_values = []
    believability_values = []
    verifiability_values = []
    currency_values = []
    timeliness_values = []
    completeness_values = []
    amount_values = []
    rep_conc_values = []
    interop_values = []
    under_values = []
    interp_values = []
    versatility_values = []
    with open(file_path, "r") as file:
        kgh_performance = json.load(file)
        for key, value in kgh_performance.items():
            if 'Availability' in value:
                availability_values.append(value.get('Availability'))
            if 'Interlinking' in value:
                interlinking_values.append(value.get('Interlinking'))
            if 'License' in value:
                license_values.append(value.get('License'))
            if 'Security' in value:
                security_values.append(value.get('Security'))
            if 'Performance' in value:
                performance_values.append(value.get('Performance'))
            if 'Accuracy' in  value:
                accuracy_values.append(value.get('Accuracy'))
            if 'Consistency' in value:
                consistency_values.append(value.get('Consistency'))
            if 'Conciseness' in value:
                conciseness_values.append(value.get('Conciseness'))
            if 'Verifiability' in value:
                verifiability_values.append(value.get('Verifiability'))
            if 'Currency' in value:
                currency_values.append(value.get('Currency'))
            if 'Timeliness' in value:
                timeliness_values.append(value.get('Timeliness'))
            if 'Amount of data' in value:
                amount_values.append(value.get('Amount of data'))
            if 'Rep.Conc.' in value:
                rep_conc_values.append(value.get('Rep.Conc.'))
            if 'Interpretability' in value:
                interp_values.append(value.get('Interpretability'))
            if 'Understandability' in value:
                under_values.append(value.get('Understandability'))
            if 'Interoperability' in value:
                interop_values.append(value.get('Interoperability'))
            if 'Versatility' in value:
                versatility_values.append(value.get('Versatility'))

    minimum = float(min(interlinking_values))
    q1 = np.percentile(interlinking_values,25)
    q2 = np.percentile(interlinking_values,50)
    q3 = np.percentile(interlinking_values, 75)
    maximum = max(interlinking_values)
    mean = sum(interlinking_values) / len(interlinking_values)

    print(f"min:{minimum:.2f}, lower_quartile:{q1:.2f}, mean:{mean:.2f}, median: {q2:.2f}, upper_quartile: {q3:.2f}, max: {maximum:.2f}")



def category_statistic(file_path):
    accessibility_values = []
    intrinsic_values = []
    trust_values = []
    dataset_dym_values = []
    contextual_values = []
    representatioanl_values = []
    with open(file_path, "r") as file:
        kgh_performance = json.load(file)
        for key, value in kgh_performance.items():
            if 'Accessibility' in value:
                accessibility_values.append(value.get('Accessibility'))
            if 'Intrinsic' in value:
                intrinsic_values.append(value.get('Intrinsic'))
            if 'Trust' in value:
                trust_values.append(value.get('Trust'))
            if 'DatasetDym' in value:
                dataset_dym_values.append(value.get('DatasetDym'))
            if 'Contextual' in value:
                contextual_values.append(value.get('Contextual'))
            if 'Representational' in  value:
                representatioanl_values.append(value.get('Representational'))

    minimum = float(min(representatioanl_values))
    q1 = np.percentile(representatioanl_values,25)
    q2 = np.percentile(representatioanl_values,50)
    q3 = np.percentile(representatioanl_values, 75)
    maximum = max(representatioanl_values)
    mean = sum(representatioanl_values) / len(representatioanl_values)

    print(f"min:{minimum:.2f}, lower_quartile:{q1:.2f}, median:{q2:.2f}, upper_quartile: {q3:.2f}, max: {maximum:.2f}")



file_path = "performance.txt" 

#time_for_dimensions(file_path)
file_path = 'output_category.json'
category_statistic(file_path)


#print(parse_time_for_dimensions(file_path,'PageRank'))

'''
time_data = extract_time_for_kg(file_path)

min = min(time_data)
q1 = np.percentile(time_data,25)
q2 = np.percentile(time_data,50)
q3 = np.percentile(time_data, 75)
max = max(time_data)
mean = sum(time_data) / len(time_data)

print(f"min:{min}, q1:{q1}, mean: {mean}, median:{q2}, q3:{q3}, max:{max}")
'''