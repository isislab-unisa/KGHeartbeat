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
            <th colspan="5" style="text-align: center;">Interlinking</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="8">Availability</td>
            <td rowspan="8"></td>
            <td colspan="4"><i>Checking whether the server responds to a SPARQL query</td>
        </tr>
        <tr>
            <td>Input</td>
            <td colspan="3">Metadata</td>
        </tr>
        <tr>
            <td rowspan="1">Algorithm</td>
            <td colspan="3">[query SPARQL](./quality_dimensions/availability.md#sparql-endpoint)</td>
        <tr>
            <td rowspan="3">Output</td>
            <td>0</td>
            <td colspan="3">The SPARQL endpoint is offline</td>
        </tr>
        <tr>
            <td>1</td>
            <td colspan="3">The SPARQL endpoint is online</td>
        </tr>
        <tr>
            <td>-1</td>
            <td colspan="3">The SPARQL endpoint is missing.</td>
        </tr>
    </tbody>
</table>
