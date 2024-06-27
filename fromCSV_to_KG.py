import pandas as pd
from rdflib import Graph, URIRef, Literal, Namespace
from rdflib.namespace import RDF, RDFS, XSD, DCTERMS, FOAF
import os


def convert_to_kg(filename):
    # Define namespaces
    DQV = Namespace("http://www.w3.org/ns/dqv#")
    DCAT = Namespace("http://www.w3.org/ns/dcat#")
    SDMX = Namespace("http://purl.org/linked-data/sdmx/2009/attribute#")
    SDMX_CODE = Namespace("http://purl.org/linked-data/sdmx/2009/code#")

    # Read the CSV file
    df = pd.read_csv(f"./Analysis results/{filename}.csv")

    analysis_date = filename.split('_')[0]

    # Initialize graph
    g = Graph()

    # Bind namespaces
    g.bind("dqv", DQV)
    g.bind("dcat", DCAT)
    g.bind("sdmx", SDMX)
    g.bind("sdmx-code", SDMX_CODE)
    g.bind("dcterms", DCTERMS)
    g.bind("foaf", FOAF)

    # Define some common URIs
    vocabulary_uri = URIRef("http://www.w3.org/ns/dqv")
    g.add((vocabulary_uri, RDF.type, URIRef("http://purl.org/vocommons/voaf#Vocabulary")))
    g.add((vocabulary_uri, DCTERMS.title, Literal("Data Quality Vocabulary", lang="en")))
    g.add((vocabulary_uri, DCTERMS.description, Literal("The Data Quality Vocabulary (DQV) is seen as an extension to DCAT to cover the quality of the data...", lang="en")))
    g.add((vocabulary_uri, DCTERMS.created, Literal("2015-12-17", datatype=XSD.date)))
    g.add((vocabulary_uri, DCTERMS.modified, Literal("2016-08-26", datatype=XSD.date)))
    g.add((vocabulary_uri, DCTERMS.publisher, URIRef("http://www.w3.org/data#W3C")))
    g.add((vocabulary_uri, DCTERMS.type, URIRef("http://purl.org/adms/assettype/Ontology")))

    # Process each row in the dataframe
    for _, row in df.iterrows():
        kg_name = row['kg_name']
        kg_id = row['kg_id']
        dataset_uri = URIRef(f"http://example.org/dataset/{kg_id}")

        g.add((dataset_uri, RDF.type, DCAT.Dataset))
        g.add((dataset_uri, DCTERMS.title, Literal(kg_name)))
        g.add((dataset_uri, DCTERMS.identifier, Literal(kg_id)))
        g.add((dataset_uri, DCTERMS.date, Literal(analysis_date, datatype=XSD.date)))

        # Iterate over columns to generate quality measurements
        for column in df.columns:
            if column in ['kg_name', 'kg_id']:
                continue
            
            if '_' in column:
                dimension, metric = column.split('_', 1)
                dimension_uri = URIRef(f"http://example.org/dimension/{dimension}")
                metric_uri = URIRef(f"http://example.org/metric/{metric}")
                observation_uri = URIRef(f"http://example.org/observation/{kg_id}/{column}")

                
                # Add dimension and metric to graph
                g.add((dimension_uri, RDF.type, DQV.Dimension))
                g.add((dimension_uri, RDFS.label, Literal(dimension, lang="en")))
                g.add((metric_uri, RDF.type, DQV.Metric))
                g.add((metric_uri, RDFS.label, Literal(metric, lang="en")))
                g.add((metric_uri, DQV.inDimension, dimension_uri))

                # Add observation to graph
                g.add((observation_uri, RDF.type, DQV.QualityMeasurement))
                g.add((observation_uri, DQV.isMeasurementOf, metric_uri))
                g.add((observation_uri, DQV.computedOn, dataset_uri))

                value = row[column]
                if isinstance(value, str):
                    try:
                        value = float(value.replace(',', '.'))
                    except ValueError:
                        pass

                if isinstance(value, float):
                    g.add((observation_uri, DQV.value, Literal(value, datatype=XSD.double)))
                elif isinstance(value, int):
                    g.add((observation_uri, DQV.value, Literal(value, datatype=XSD.integer)))
                elif isinstance(value, bool):
                    g.add((observation_uri, DQV.value, Literal(value, datatype=XSD.boolean)))
                else:
                    g.add((observation_uri, DQV.value, Literal(value, datatype=XSD.string)))

            # Process score columns
            else:
                score_uri = URIRef(f"http://example.org/score/{column}")
                score_observation_uri = URIRef(f"http://example.org/observation/{kg_id}/{column}")

                g.add((score_uri, RDF.type, DQV.Metric))
                g.add((score_uri, RDFS.label, Literal(column, lang="en")))

                g.add((score_observation_uri, RDF.type, DQV.QualityMeasurement))
                g.add((score_observation_uri, DQV.isMeasurementOf, score_uri))
                g.add((score_observation_uri, DQV.computedOn, dataset_uri))

                score_value = row[column]
                if isinstance(score_value, str):
                    try:
                        score_value = float(score_value.replace(',', '.'))
                    except ValueError:
                        pass

                if isinstance(score_value, float):
                    g.add((score_observation_uri, DQV.value, Literal(score_value, datatype=XSD.double)))
                elif isinstance(score_value, int):
                    g.add((score_observation_uri, DQV.value, Literal(score_value, datatype=XSD.integer)))
                elif isinstance(score_value, bool):
                    g.add((score_observation_uri, DQV.value, Literal(score_value, datatype=XSD.boolean)))
                else:
                    g.add((score_observation_uri, DQV.value, Literal(score_value, datatype=XSD.string)))

    # Serialize the graph to a file
    g.serialize(destination=f"./Analysis results/{filename.split('_')[0]}.ttl", format="turtle")
    os.remove(f'./Analysis results/{filename}.csv')