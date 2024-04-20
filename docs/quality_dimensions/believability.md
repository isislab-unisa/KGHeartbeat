---
title: Trust category
---

## Believability

1. [meta-information about the identity of information provider](#meta-information-about-the-identity-of-information-provider)

### Meta-information about the identity of information provider

#### Trust value
For this metric a trust value is computated.It is calculated as a weighted average based on the presence of 4 key values for identifying provider information, these key values are:

1. KG name (from metadata, VoID file or SPARQL endpoint)
2. Description (from metadata, VoID file or SPARQL endpoint)
3. Provider URL (from metadata, VoID file or SPARQL endpoint)
4. Check if a provider is in a list of reliable providers (details below)

The presence in a list of reliable providers is verified by recovering the keywords associated with the KG. These are present in the metadata in the "keyword" field. Among the many values it contains,
there is also the one relating to the provider. Then, the list is traversed and each value is compared with a list of providers deemed reliable. Since there is still no a list of reliable provider in the LOD panorama, we build this list by including the most well-known providers in the panorama of LOD. The list can be seen in the following table and is not to be considered exhaustive and definitive.
<table>
    <tr>
        <th>Provider</th>
    </tr>
    <tr>
        <td>Wikipedia</td>
    </tr>
    <tr>
        <td>Government</td>
    </tr>
     <tr>
        <td>Bioportal</td>
    </tr>
     <tr>
        <td>Bio2RDF</td>
    </tr>
     <tr>
        <td>Academic</td>
    </tr>
</table>
The 4 key values are added together and then divided by 4, so the value assigned to this metric will be in the range [0,1].

---

