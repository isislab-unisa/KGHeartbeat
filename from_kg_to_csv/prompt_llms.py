import os
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAI
from langchain.memory import ConversationBufferMemory
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_vertexai import ChatVertexAI

load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')
huggin_face_token = os.getenv('HUGGIN_FACE_TOKEN')
gemini_key = os.getenv('GOOGLE_AI')

class PromptLLMS:
    def __init__(self, prompt_template, csv_title, csv_content, ontology_content, kg_example = False):
        self.prompt_template = prompt_template
        self.csv_title = csv_title
        self.csv_content = csv_content
        self.ontology_content = ontology_content
        self.kg_example = kg_example

    def execute_on_gemini(self):
        gemini = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=gemini_key,memory=ConversationBufferMemory())
        chain = self.prompt_template | gemini

        if self.kg_example == False:
            result =  chain.invoke({"csv_title": self.csv_title, "csv_content": self.csv_content, "ontology_content" : self.ontology_content})
        else:
            result =  chain.invoke({"csv_title": self.csv_title, "csv_content": self.csv_content, "ontology_content" : self.ontology_content, "kg_example" : self.kg_example})

        return result.content
    
    def execute_on_gpt_4(self, one_shot = False):
        gpt_4 = OpenAI(model="davinci-002",openai_api_key=openai_api_key)
        chain = self.prompt_template | gpt_4

        if self.kg_example == False:
            result =  chain.invoke({"csv_title": self.csv_title, "csv_content": self.csv_content, "ontology_content" : self.ontology_content})
        else:
            result =  chain.invoke({"csv_title": self.csv_title, "csv_content": self.csv_content, "ontology_content" : self.ontology_content, "kg_example" : self.kg_example})

        return result

    def execute_on_ollama(self,model_name,api_url):
        ollama = ChatOllama(model=model_name,base_url=api_url,memory=ConversationBufferMemory())
        chain = self.prompt_template | ollama
        
        if self.kg_example == False:
            result =  chain.invoke({"csv_title": self.csv_title, "csv_content": self.csv_content, "ontology_content" : self.ontology_content})
        else:
            result =  chain.invoke({"csv_title": self.csv_title, "csv_content": self.csv_content, "ontology_content" : self.ontology_content, "kg_example" : self.kg_example})

        return result