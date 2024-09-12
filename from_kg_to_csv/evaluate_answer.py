from rdflib import Graph


class EvaluateKG:
    def __init__(self,kg_from_llm,model_used = 'Not specified'):
        self.kg_from_llm = kg_from_llm
        self.model_used = model_used
        self.knowledge_graph = None
        self.stats = {}

    def count_uri(self,position_in_triple,uri_to_find):
        count = 0
        if position_in_triple == 's':
            for s,p,o in self.knowledge_graph:
                if str(s) == str(uri_to_find):
                    count += 1
            return count
        elif position_in_triple == 'p':
            for s,p,o in self.knowledge_graph:
                if str(p) == str(uri_to_find):
                    count += 1
            return count
        elif position_in_triple == 'o':
            for s,p,o in self.knowledge_graph:
                if str(o) == str(uri_to_find):
                    count += 1
            return count


    def execute_evaluation(self, expected_kg, expected_dimensions, expected_metrics):
        try:
            g = Graph()
            g.parse(data=self.kg_from_llm, format="turtle")
            self.knowledge_graph = g
        except:
            evaluated_kg_statistics = {
                'model_used' : self.model_used,
                'syntax_error' : True

            }
            return evaluated_kg_statistics
        
        number_of_kg = self.count_uri('o','http://www.w3.org/ns/dcat#Dataset')
        number_of_dimension = self.count_uri('o','http://www.w3.org/ns/dqv#Dimension')
        number_of_metric = self.count_uri('o','http://www.w3.org/ns/dqv#Metric')

        #Thi is to penalize the LLM that include KG and dimensions not in the CSV (allucination)
        if (number_of_kg > expected_kg):
            number_of_kg = 0
        if (number_of_dimension > expected_dimensions):
            number_of_dimension = 0
        
        covered_kg = (number_of_kg/expected_kg) * 100
        covered_dimensions = (number_of_dimension/expected_dimensions) * 100
        covered_metrics = (number_of_metric/expected_metrics) * 100

        self.stats = {
            'model_used' : self.model_used,
            'number_of_kgs' : number_of_kg,
            'number_of_dimension' : number_of_dimension,
            'number_of_metric' : number_of_metric,
            'syntax_error' : False,
            'percentage_covered_kgs' : covered_kg,
            'percentage_covered_dimensions' : covered_dimensions,
            'percentage_covered_metrics' : covered_metrics
        }


    def find_the_best_answer(evaluated_kgs_list):
        best_kg = None
        best_score = -1
        for evaluated_kg in evaluated_kgs_list:
            stats = evaluated_kg.stats
            if stats['syntax_error'] == False:
                score = (
                    stats['percentage_covered_kgs'] +
                    stats['percentage_covered_dimensions'] +
                    stats['percentage_covered_metrics']
                )

                if score > best_score:
                    best_score = score
                    best_kg = evaluated_kg

        return best_kg

#Test

'''
kg = EvaluateKG(ttl_string)
kg2 = EvaluateKG(ttl_string)
st1 = kg.execute_evaluation(1,4,3)
st2 = kg2.execute_evaluation(1,4,10)

print(find_the_best_answer([st1,st2]))
'''