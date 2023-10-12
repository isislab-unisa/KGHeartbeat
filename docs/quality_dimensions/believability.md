---
title: Trust category
---

## Believability

1. [Title](#title)
2. [Description](#description)
3. [Sources](#sources)
4. [Reliable provider](#reliable-provider)
5. [Trust value](#trust-value)

#### **Title**
To recover the title, we simply analyze the KG metadata, in
in particular the “title” field.

---

#### **Description**
The description however, as with the title, can be recovered
from the metadata and is present in the “Description” field.

---

#### **Sources**
By KG source we mean all relevant information from the provider. It is a field present within the metadata and is structured as a list of values containing: the web address, name and provider email. The field has the key “sources”.

---

#### Reliable provider
The presence in a list of reliable providers is verified by recovering the keywords associated with the KG. These are present in the metadata in the "keyword" field. Among the many values it contains,
there is also the one relating to the provider. Then, the list is traversed and each value is compared with a list of providers deemed reliable. Since there is still no a list of reliable provider in the LOD panorama, we build this list by including the most well-known providers in the panorama of LOD. The list can be seen in the following table and is not to be considered exhaustive and definitive.
|Provider|
|---|
|Wikipedia|
|Government|
|Bioportal|
|Bio2RDF|
|Academic|

---

#### **Trust value**
It is a score which is between 0 and 1 which helps the KG user to understand how much information about the believability is available.
In fact, this value is calculated as a weighted average based on how many of the following values are present: name, description, URL and presence in the reliable provider list. For each of these values, if the KG has it, 1 is assigned, otherwise 0. The sum is made and then divided by 4. The value obtained will be the trust value of the dataset.
