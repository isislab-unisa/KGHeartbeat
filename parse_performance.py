import re
import numpy as np

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


file_path = "performance.txt" 
print(parse_time_for_dimensions(file_path,'PageRank'))
'''
time_data = extract_time_for_kg(file_path)

min = min(time_data)
q1 = np.percentile(time_data,25)
q2 = np.percentile(time_data,50)
q3 = np.percentile(time_data, 75)
max = max(time_data)

print(min,q1,q2,q3,max)
'''

