from langchain_core.prompts import PromptTemplate
from prompt_llms import PromptLLMS
from evaluate_answer import EvaluateKG


csv_path = './Light/only-availability.csv'
ontology_path = './dqv.ttl'
kg_as_example_path = './Full/cz-nace-full.ttl'

# Read and transform the csv file into text
with open(csv_path) as f:
    csv_text = f.read() + '\n'

# Read and trasfromt the ttl ontology into text
with open(ontology_path) as f:
    ttl_text = f.read() + '\n'

# Read and trasform the ttl KG in a string
with open(kg_as_example_path) as f:
    kg_as_example = f.read() + '\n'

#Zero-shot Prompting
zero_shot_prompt = PromptTemplate(
    input_variables=["csv_title","csv_content","ontology_content"],
    template='''Consider the following csv entitled {csv_title}: {csv_content} \n
                Consider the following ontology in ttl format entitled 'dqv.ttl':{ontology_content} \n
                Considering that the csv file pasted before contains scores attached
                to diffents dimensions and metrics . To distinguish metrics and
                dimension , consider that all the file column names follow the pattern
                of DIMENSION_METRIC . All the column names ending with ScoreValue
                represent the score attached to the dimension reported as prefix of
                the column name. With this premises, can you model the {csv_title} file content according to the dqv.ttl ontology and return the resulting triples in rdf format? 
                Return me only ttl code, don't add more \n
    '''
)

#One-shot Prompting
one_shot_prompt = PromptTemplate(
    input_variables=["csv_title","csv_content","ontology_content","kg_example"],
    template='''Consider the following csv entitled "{csv_title}".csv: {csv_content} \n
    Consider the following ontology in ttl format entitled "dqv.ttl": {ontology_content} \n
    Let's consider that the CSV file contains all dimensions concerning the trust category and for each dimension, the file details its metrics. To distinguish metrics and dimension, consider that all the file column names follow the pattern of DIMENSION_METRIC. 
    With these premises, can you model the data contained in csv file according to the "dqv.ttl" ontology and return the complete and detailed set of resulting triples in rdf format? Below I show you an example for cz-nace, do the same for the remaining KGs in the CSV file: \n
    {kg_example}
    \n  Return me only ttl code, don't add more.
    '''
)

llms = PromptLLMS(zero_shot_prompt,'only_availability',csv_text,ttl_text,kg_as_example_path)
kg_generated_gemini = llms.execute_on_gemini()
kg_generated_gemini = kg_generated_gemini.replace('`','')
print(kg_generated_gemini)

parsed_kg_gemini = EvaluateKG(kg_generated_gemini,'Gemini 1.5 pro')
evaluation_result = parsed_kg_gemini.execute_evaluation(10,1,6)

print(evaluation_result)