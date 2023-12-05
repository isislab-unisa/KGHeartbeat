---
#
# By default, content added below the "---" mark will appear in the home page
# between the top bar and the list of recent posts.
# To change the home page layout, edit the _layouts/home.html file.
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
#
layout: home
---
<table>
    <thead>
        <tr>
        <th colspan="5" style="text-align: center;">Accessibility</th>
        </tr>
        <tr>
            <th colspan="1" style="text-align: center;">Metric</th>
            <th colspan="1" style="text-align: center;">Ref</th>
        </tr>
        <tr>
            <th colspan="5" style="text-align: center;">Availability</th>
        </tr>
    </thead>
        <tr>
            <td rowspan="8">Accessibility of the SPARQL endpoint</td>
            <td rowspan="8"><a href="https://bit.ly/4a4xRA6">https://bit.ly/4a4xRA6</a></td>
            <td colspan="4"><i>Checking whether the server responds to a SPARQL query</i></td>
        </tr>
        <tr>
            <td>Input</td>
            <td colspan="3">Metadata</td>
        </tr>
        <tr>
            <td rowspan="1">Algorithm</td>
            <td colspan="3">
            <a href="https://isislab-unisa.github.io/KGHeartbeat/quality_dimensions/availability#sparql-endpoint">Availability/SPARQL-endpoint</a>
            </td>
        <tr>
            <td rowspan="3">Output</td>
            <td>0</td>
            <td colspan="3">The SPARQL endpoint is offline.</td>
        </tr>
        <tr>
            <td>1</td>
            <td colspan="3">The SPARQL endpoint is online.</td>
        </tr>
        <tr>
            <td>-1</td>
            <td colspan="3">The SPARQL endpoint is missing.</td>
        </tr>
</table>
