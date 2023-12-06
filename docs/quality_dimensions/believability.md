---
title: Trust category
---

## Believability

1. [meta-information about the identity of information provider](#meta-information-about-the-identity-of-information-provider)

### Meta-information about the identity of information provider

#### Reliable provider
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
The value assigned to this metric will be 1 if the provider is in the list of trusted providers, 0 otherwise
---

