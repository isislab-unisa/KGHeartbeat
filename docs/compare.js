function compare(ids,metrics){ 
    document.getElementById('checkbox').style.display = 'none'
    document.getElementById('compare-btn').style.display = 'none'
    document.getElementById('metrics').style.display = 'block'
    document.getElementById('reliablePr').style.display = 'block'
    document.getElementById('container-btn').style.display = 'none'
    document.getElementById('cont-back2').style.display = 'block'
    switch(metrics.value){
        case 'Believability':
            hideDiv()
            document.getElementById('wrapT').style.display = 'inline-block'
            var div = document.getElementById('wrapBeliev')
            div.style.display = 'block'
            tableTrust = document.createElement('table')
            tableTrust.id = 'tabTrust'
            trB = document.createElement('tr')
            thName = document.createElement('th')
            thName.innerHTML = 'KG name'
            trB.appendChild(thName)
            thTrust = document.createElement('th')
            thHelp = document.createElement('th')
            thHelp.innerHTML = '<a href="#popupBeliev" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
            thTrust.innerHTML = 'Trust value'
            trB.appendChild(thTrust)
            trB.appendChild(thHelp)
            tableTrust.appendChild(trB)
            for(var i = 0; i< ids.length; i++){
                tr = document.createElement('tr')
                drawBeliev(ids[i],tr)
                tableTrust.appendChild(tr)
              }

              if(div.children.length <= 0){
                div.appendChild(tableTrust)
            }
            
            break;

        case 'Availability':
            hideDiv()
            divsE = []
            divsR = []
            var divTabAv = document.getElementById('containerAvSPARQL')
            var divTabDump = document.getElementById('containerAvDump')
            divTabDump.style.display = 'inline-block'
            divTabAv.style.display = 'inline-block'
            divTab = document.getElementById('containerInactiveL')
            divTab.style.display = 'block'
            document.getElementById('exportSPARQL-btn').style.display = 'block'
            document.getElementById('exportDump-btn').style.display = 'block'
            document.getElementById('exportIanctive-btn').style.display = 'block'
            /* ACTIVATE WHEN DATA ABOUT URIs DEREFERENCEABILITY IS AVAILABLE
            divTabDef = document.getElementById('containerDef')
            divTabDef.style.display = 'block'
            document.getElementById('exportDef-btn').style.display = 'block'
            */
            //CHART FOR SPARQL ENDPOINT AVAILABILITY
            /*
            const chart = Highcharts.chart('availability1', {
                title: {
                    style:{
                        fontSize:'28px',
                        fontWeight:'bold'
                    },
                    text: 'Availability of SPARQL endpoint',
                },
                subtitle:{
                    text: '1: Online; 0: Offline; -1: Absent'
                },
                yAxis: {
                    min: -1,
                    max: 1,
                    allowDecimals: false,
                        title: {
                            text: 'Status'
                        }
                },
                xAxis: {
                    tickInterval:  7 * 24 * 3600 * 1000,
                    startOnTick: true,
                    startOfWeek: 0,
                    type:'datetime',
                },
                rangeSelector: {
                    enabled:true
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                },
                plotOptions: {
                    series: {
                        pointInterval: 7 * 24 * 3600 * 1000,
                        label: {
                            connectorAllowed: false
                        },
                      }
                },
                tooltip:{
                    shared: true,
                },
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            });

              //CHART FOR RDF DUMP AVAILABILITY
            const chart2 = Highcharts.chart('availability2', {
                title: {
                    style:{
                    fontSize:'28px',
                    fontWeight:'bold'
                    },
                    text: 'Availability of RDF dump',
                },
                yAxis: {
                    min: -1,
                    max: 1,
                    title: {
                        text: 'Status'
                    }
                },
                xAxis: {
                    tickInterval:  7 * 24 * 3600 * 1000,
                    startOnTick: true,
                    startOfWeek: 0,
                    type:'datetime',
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                },
                rangeSelector: {
                    enabled:true
                },
                plotOptions: {
                    pointInterval: 7 * 24 * 3600 * 1000,
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                    }
                },
                tooltip:{
                        shared: true,
                },
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            });

            const chart3 = Highcharts.chart('containerDef', {
                title: {
                    style:{
                        fontSize:'28px',
                        fontWeight:'bold'
                    },
                    text: 'URIs deferenceability',
                },
                subtitle: {
                    text:'The test is done based on 5000 triples',
                    style:{
                        fontSize:'20px'
                    }
                },
                yAxis: {
                    allowDecimals: true,
                        title: {
                            text: 'Value'
                        },
                        min:0,
                        max: 1.5,
                    plotLines: [{ 
                        width:2,
                        value: 1,
                        color: '#28FF49',
                        label: { 
                            style:{
                                color:'#0090eacc',
                                fontSize:'15px',
                                fontWeight:'bold'
                            },
                        text: 'Best value: 1', // Content of the label. 
                        align: 'left', // Positioning of the label. 
                        }
                    }],
                },
                xAxis: {
                    type:'datetime',
                },
                rangeSelector: {
                    enabled:true
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                      }
                },
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            });
            */ 
            tableSPARQL = document.createElement('table')
            tableDump = document.createElement('table')
            tableDef = document.createElement('table')
            tableSPARQL.id = 'tabAvSPARQL'
            tableDump.id = 'tabAvRdf'
            tableDef.id = 'tabDef'
            titleSPARQL = document.createElement('p')
            titleDump = document.createElement('p')
            titleDef = document.createElement('p')
            titleSPARQL.innerHTML = 'SPARQL endpoint status'
            titleSPARQL.id = 'titleS'
            titleDef.id = 'titleDef'
            titleDef.innerHTML = 'URIs dereferenceability'
            titleDump.innerHTML = 'RDF dump status'
            titleDump.id = 'titleDump'
            $(document).ready(function() {
                $.ajax({
                    type: "GET",
                    url: './CSVforJS/wp.csv',
                    dataType: "text",
                    async: false,
                    success: function(data) {processData(data)}
                });
                function processData(data){
                    analysisDate = []
                    var lines = data.trim().split('\n');
                    var lastLine = lines[lines.length - 1].split(',');
                    for(var i = 1; i<lines.length; i++){
                        line = lines[i].split(',')
                        analysisDate.push(line[0])
                    }
                    tr1 = document.createElement('tr')
                    tr2 = document.createElement('tr')
                    tr3 = document.createElement('tr')
                    tdName = document.createElement('th')
                    tdName2 = document.createElement('th')
                    tdName3 = document.createElement('th')
                    tdName.innerHTML = 'KG name'
                    tdName2.innerHTML = 'KG name'
                    tdName3.innerHTML = 'KG name'
                    tr1.appendChild(tdName)
                    tr2.appendChild(tdName2)
                    tr3.appendChild(tdName3)
                    for(var i=0; i<analysisDate.length; i++){
                        tdDate = document.createElement('th')
                        tdDate2 = document.createElement('th')
                        tdDate3 = document.createElement('th')
                        tdDate.innerHTML = analysisDate[i]
                        tdDate2.innerHTML = analysisDate[i]
                        tdDate3.innerHTML = analysisDate[i]
                        tr1.appendChild(tdDate)
                        tr2.appendChild(tdDate2)
                        tr3.appendChild(tdDate3)
                    }
                    tableSPARQL.appendChild(tr1)
                    tableDump.appendChild(tr2)
                    tableDef.appendChild(tr3)
                }
            });

            table = document.createElement('table') //DYNAMIC CREATIO OF INACTIVE LINKS TABLE
            table.className = "center"
            table.style.marginTop = '45px'
            table.id = 'tabInactiveLinks'
            tableRow = document.createElement('tr')
            th1 = document.createElement('th')
            th2 = document.createElement('th')
            th1.innerHTML = 'KG name'
            th2.innerHTML = 'Inactive links'
            tableRow.appendChild(th1)
            tableRow.appendChild(th2)
            table.appendChild(tableRow)

            for(var i = 0; i<ids.length;i++){
                //drawEndpoint(ids[i],chart)  //FOR EVERY KG SELECTED WE DRAW A SERIES ON THE GRAPH
                //drawDump(ids[i],chart2)
                trTab1 = document.createElement('tr')
                drawAvailabilitySPARQL(ids[i],trTab1)
                //drawDef(ids[i],chart3)
                trTab2 = document.createElement('tr')
                drawAvailabilityDump(ids[i],trTab2)
                trTab3 = document.createElement('tr')
                drawDef(ids[i],trTab3)
                tr = document.createElement('tr')
                drawTabIanctive(ids[i],tr)
                table.appendChild(tr)
                tableSPARQL.appendChild(trTab1)
                tableDump.appendChild(trTab2)
                tableDef.appendChild(trTab3)
            }
            if(divTab.children.length <= 0)
                divTab.appendChild(table)
                
            if(divTabAv.children.length <= 1){
                divTabAv.appendChild(titleSPARQL)
                divTabAv.appendChild(tableSPARQL)
            }
            if(divTabDump.children.length <= 1){
                divTabDump.appendChild(titleDump)
                divTabDump.appendChild(tableDump)
            }
            if(divTabDef.children.length <= 1){
                divTabDef.appendChild(titleDef)
                divTabDef.appendChild(tableDef)
            }


            break;

        case 'Licensing':
            hideDiv()
            document.getElementById('exportLic-btn').style.display = 'block'
            var div = document.getElementById('wrapLic')
            div.style.display = 'inline-block'
            table = document.createElement('table')
            table.className = "center"
            table.id = 'tableLic'
            table.style.marginTop = '45px'
            tableRow = document.createElement('tr')
            tableCell1 = document.createElement('th')
            tableCell2 = document.createElement('th')
            tableCell3 = document.createElement('th')
            tableCell4 = document.createElement('th')
            tableCell1.innerHTML = 'KG name'
            tableCell2.innerHTML = 'License Machine-redeable'
            tableCell3.innerHTML = 'License Human-Redeable'
            tableCell4.innerHTML = 'License (metadati)'
            table.appendChild(tableRow)
            tableRow.appendChild(tableCell1)
            tableRow.appendChild(tableCell4)
            tableRow.appendChild(tableCell2)
            tableRow.appendChild(tableCell3)
            for(var i = 0; i< ids.length; i++){  //IF DIV HAS NO OTHER CHILDREN ADD THE TABLE (TO PREVENT THE ADDITION OF MULTIPLE TABLES)
                tableRow = document.createElement('tr')
                table.appendChild(tableRow)
                drawLic(ids[i],tableRow)
            }
            if(div.children.length <= 0) //IF DIV 
                div.appendChild(table)

            break;

        case 'Interlinking':
            hideDiv()
            document.getElementById('exportInt-btn').style.display = 'block'
            div = document.getElementById('interlinking');
            divTab = document.getElementById('wrap-tableInt');
            div.style.display = 'block'
            divTab.style.display = 'block'
            divTab.style.marginTop = '45px'
            divTab.style.marginBottom = '10px'
            $(document).ready(function() {
                $.ajax({
                    type: "GET",
                    url: 'subGraph.json',
                    dataType: "text",
                    success: function(data) {processData(data)}
                });
                function processData(data){
                    const obj = JSON.parse(data);
                    linksArr = obj.links
                    data = []
                     
                    linksArr.forEach(function(point){
                    for(var i = 0; i<ids.length; i++){  //CREATING THE ARRAY WITH DATA FOR THE INDUCTED GRAPH
                        fnPointS = convertToValidFilename(point.source)
                        fnPointT = convertToValidFilename(point.target)
                        selectedId = ids[i].trim();
                        if(selectedId === fnPointS || selectedId === fnPointT){
                            data.push([point.source,point.target])
                        }
                    }
                    });
                    network =Highcharts.chart({
                        chart:{
                            type : 'networkgraph',
                            renderTo: div,
                          },
                          title: {
                              style:{
                                  fontSize:'30px',
                                  fontWeight:'bold'
                              },
                              text: 'Interlinking',
                          },
                          subtitle: {
                            style:{
                                fontSize:'18px',
                            },
                            align: 'center',
                            text: 'Induced graph starting from the selected nodes.'
                        },
                          plotOptions: {
                              networkgraph: {
                                  keys: ['from', 'to'],
                                  layoutAlgorithm: {
                                      enableSimulation: true,
                                      integration: 'euler',
									    linkLength: 50,

                                  }
                              }
                          },
                          tooltip: {
                            formatter: function() {
                                for(var i = 0; i<fullName.length;i++){
                                    id = fullName[i].trim().slice(0, fullName[i].indexOf(' '))
                                    filename = this.point.name.replaceAll('[\\/*?:"<>|]','')
                                    filename = filename.replaceAll('-','')
                                    filename = filename.replaceAll(' ','')
                                    filename = filename.toLowerCase()
                                    if(id == filename){
                                        name = fullName[i].trim().slice(fullName[i].indexOf(' '));
                                        lastIndex = name.lastIndexOf(" ");
                                        name = name.substring(0,lastIndex);
                                        n = fullName[i].lastIndexOf(" ");
                                        score = fullName[i].substring(n+1)
                                        score = score.trim()
                                        score = parseFloat(score)
                                        var text = '<b>KG name:</b> ' + name + '<br>' 
                                        //+'<b>Score:</b>' + score;
                                        return text
                                    }
                                    else{
                                        text = this.point.name	
                                    }
                                }
                              return text;
                            }
                          },
                          series: [{
                              dataLabels: {
                                  enabled: true,
                                  linkFormat: ''
                              },
                              id: 'Graph',
                              marker: {
                                  radius: 20,
                              },
                              data: data,
                          }]
                    });
                }

                Highcharts.addEvent(
                    Highcharts.Series,
                    'afterSetOptions',
                    function (e) {
                            let nodeCounts = {};
                            //count connections for each From or To node
                            e.options.data.forEach(function (link) {
                                nodeCounts[link[0]] = (nodeCounts[link[0]] || 0) + 1;
                                nodeCounts[link[1]] = (nodeCounts[link[1]] || 0) + 1;
                            });
                
                            let radiusFactor = 2; //radius multiplier to graphically enlarge nodes
                            //map each nodeCount to a node object setting the radius
                
                            $(document).ready(function() {
                                $.ajax({
                                    type: "GET",
                                    url: 'KGid.txt',
                                    dataType: "text",
                                    async: false,
                                    success: function(data) {processData(data)}
                                });
                                function processData(data){
                                    fullName = data.trim().split("\n");
                            }
                            e.options.nodes = Object.keys(nodeCounts).map(function (id) {      
                                for(var i = 0; i<fullName.length;i++){
                                    idTxt = fullName[i].trim().slice(0, fullName[i].indexOf(' '))
                                    filename = id.replaceAll('[\\/*?:"<>|]','')
                                    filename = filename.replaceAll('-','')
                                    filename = filename.replaceAll(' ','')
                                    filename = filename.toLowerCase()
                                    if(filename == idTxt){
                                        n = fullName[i].lastIndexOf(" ");
                                        score = fullName[i].substring(n+1)
                                        score = score.trim()
                                        score = parseFloat(score)
                                        color = '#07C8F9'
                                        if(nodeCounts[id] <= 20){
                                            color = '#07C8F9'
                                            break;
                                        }
                                        else if (nodeCounts[id] <= 40){
                                            color = '#09A6F3'
                                            break;
                                        }
                                        else if(nodeCounts[id] <= 60){
                                            color = '#0A85ED'
                                            break;
                                        }
                                        else if(nodeCounts[id] <= 80){
                                            color = '#0C63E7'
                                            break;
                                        }
                                        else if(nodeCounts[id] > 100){
                                            color = '#0D41E1'
                                            break;
                                        }
                                    } else {
                                        color = '#ccf9ff'
                                    }
                                    if(nodeCounts[id]>50)
                                        nodeCounts[id] = 50
                                }
                                return {
                                    id: id,
                                    marker: {   radius: nodeCounts[id] * radiusFactor },
                                    color: color
                                };
                        });
                        })
                    }    
                    );	
                    
            }); 
            table = document.createElement('table') //DYNAMIC CREATIO OF INTERLINKING TABLE
            table.className = "center"
            table.style.marginTop = '45px'
            table.id = 'tabInt'
            tableRow = document.createElement('tr')
            th1 = document.createElement('th')
            th2 = document.createElement('th')
            th3 = document.createElement('th')
            th4 = document.createElement('th')
            th5 = document.createElement('th')
            th6 = document.createElement('th')
            th7 = document.createElement('th')
            th7.innerHTML = '<a href="#popupInter" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
            th1.innerHTML = 'KG name'
            th2.innerHTML = 'Number of sameAs chains'
            th3.innerHTML = 'Degree of connection'
            th4.innerHTML = 'Clustering coefficient'
            th5.innerHTML = 'Centrality'
            th6.innerHTML = 'PageRank'
            table.appendChild(tableRow)
            tableRow.appendChild(th1)
            tableRow.appendChild(th2)
            tableRow.appendChild(th3)
            tableRow.appendChild(th4)
            tableRow.appendChild(th5)
            tableRow.appendChild(th6)
            tableRow.appendChild(th7)

            for(var i = 0; i< ids.length; i++){
                tableRow = document.createElement('tr')
                table.appendChild(tableRow)
                drawTableInt(ids[i],tableRow)
            }
            if(divTab.children.length <= 0)
                divTab.appendChild(table)
                
            break;
            
        case 'Security':
            hideDiv()
            document.getElementById('exportSec-btn').style.display = 'block'
            var div = document.getElementById('wrapSec')
            div.style.display = 'block'
            table = document.createElement('table')
            table.className = 'center'
            table.id = 'tabSec'
            tableRow = document.createElement('tr')
            th1 = document.createElement('th')  //DYNAMIC BUILDING OF SECURITY TABLE
            th2 = document.createElement('th')
            th3 = document.createElement('th')
            th1.innerHTML = 'KG name'
            th2.innerHTML = 'Use HTTPS on the SPARQL endpoint'
            th3.innerHTML = 'Requires authentication to do query'
            table.appendChild(tableRow)
            tableRow.appendChild(th1)
            tableRow.appendChild(th2)
            tableRow.appendChild(th3)
            for(var i = 0; i< ids.length; i++){
                tableRow = document.createElement('tr')
                table.appendChild(tableRow)
                drawTableSec(ids[i],tableRow)
            }
            if(div.children.length <= 0)
                div.appendChild(table)
            break;
            
        case 'Performance':
            hideDiv()
            divL = document.getElementById('performanceL')
            divT = document.getElementById('performanceT')
            divL.style.display = 'block'
            divT.style.display = 'block'
            //CHART FOR LATENCY
            const chartL = Highcharts.chart({
                chart: {
                    renderTo:divL,
                    type: 'boxplot'
                },
                title: {
                    style:{
                        fontSize:'30px',
                        fontWeight:'bold'
                    },
                    text: 'Latency'
                },
                subtitle: {
                    style:{
                        fontSize:'24px'
                    }
                },
                rangeSelector: {
                    enabled:true
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                },
                xAxis: {
                    tickInterval:  7 * 24 * 3600 * 1000,
                    type:'datetime',
                },
                yAxis: {
                    title: {
                        text: 'Observations'
                    },
                    type:'logarithmic',
                },
                plotOptions: {
                    series: {
                        pointIntervalUnit: 'month'
                    }
                },
            });
              //CHART FOR THROUGHPUT
            const chartT = Highcharts.chart({
                chart: {
                    renderTo:divT,
                    type: 'boxplot'
                },
                title: {
                    style:{
                        fontSize:'30px',
                        fontWeight:'bold'
                    },
                    text: 'Throughput'
                },
                subtitle: {
                    style:{
                    fontSize:'24px'
                    }
                },
                rangeSelector: {
                    enabled:true
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                },
                xAxis: {
                    tickInterval:  7 * 24 * 3600 * 1000,
                    type:'datetime',
                },
                yAxis: {
                    title: {
                        text: 'Observations'
                    },
                    type:'logarithmic',
                },
                plotOptions: {
                    series: {
                        pointInterval: 7 * 24 * 3600 * 1000,
                        label: {
                            connectorAllowed: false
                        },
                      }
                },
            });
            for(var i = 0; i<ids.length;i++){
                drawLatency(ids[i],chartL)
            }
            for(var i = 0; i <ids.length; i++){
                drawTP(ids[i],chartT)
            }
            break;
            
        case 'Accuracy':
            hideDiv()
            document.getElementById('wrapSwitchAcc').style.display = 'block'
            div = document.getElementById('accuracy')
            div.style.display = 'block'
            node = document.getElementById('numTriplesLimit')
            while (node.hasChildNodes()) {    //in order not to have duplicate alerts if we click again
                node.removeChild(node.lastChild);
            }
            if(!document.getElementById('typeAcc').checked){
                const chartAcc = Highcharts.chart({ //CHART FOR ACCURACY (CHANGE OVER TIME)
                    chart: {
                        renderTo: div,
                        type: 'column'
                    }, 
                    title: {
                        style:{
                        fontSize:'30px',
                        fontWeight:'bold'
                    },
                        text: 'Accuracy'
                    },
                    rangeSelector: {
                        enabled:true
                    },
                    xAxis: {
                        type:'datetime',
                    },
                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: 'Number of triples'
                        },
                        stackLabels: {
                            enabled: true,
                            formatter: function() {
                                return this.stack;
                            }
                        },
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        },
                        plotLines: [{ 
                            width:2,
                            value: 5,
                            color: '#28FF49',
                            label: { 
                                style:{
                                    color:'#0090eacc',
                                    fontSize:'15px',
                                    fontWeight:'bold'
                                },
                            text: 'Best value:5', // Content of the label. 
                            align: 'left', // Positioning of the label. 
                            }
                        }],
                    },
                    tooltip: {
                        style: {
                            fontSize: '16px',
                            fontWeight: 'bold',
                        },
                        formatter: function () {
                            return '<b>' + this.series.options.id + '</b><br/>' +
                                this.series.name + ': ' + this.y + '<br/>' +
                                'Total: ' + this.point.stackTotal;
                        }
                    },
                    legend:{
                        enabled: true
                    },
                    plotOptions: {
                        series:{
                            minPointLength:3
                        },
                        column: {
                            stacking: 'normal'
                        }
                    },
                    series:[{
                        name : 'Empty label',
                        id: 'empty',
                        color: '#7CA9F4'
                    },
                    {
                    name : 'Label with whitespace at the beginning or the end',
                    id: 'whitespace',
                    color:'#00ff83',
                    },
                    {
                    name : 'Literal with datatype problem',
                    id: 'literal',
                    color:'#ffc100',
                    },
                    {
                    name : 'FP',
                    id: 'fp',
                    color:'	#ff5863',
                    },
                    {
                    name : 'IFP',
                    id: 'ifp',
                    color:'#555555',
                    }]  
                });
                for(var i = 0; i<ids.length; i++){
                    drawAccuracy(ids[i],chartAcc)
                }
            }
            else{
                document.getElementById('labelDatAcc').style.display = 'block'
                const chartAcc2 = Highcharts.chart(div, {
                    chart: {
                        polar: true,
                        type: 'line'
                    },
                    title: {
                        style:{
                            fontSize:'30px',
                            fontWeight:'bold'
                        },
                        text: 'Accuracy'
                    },
                    pane: {
                        size: '95%'
                    },
                
                    xAxis: {
                        categories: ['Void label', 'Whitespace Problem', 'Literal datatype problem',
                            'FP', 'IFP'],
                        lineWidth: 0,
                        tickmarkPlacement: 'on',
                    },
                
                    yAxis: {
                        gridLineInterpolation: 'polygon',
                        lineWidth: 0,
                        min: 0,
                        max: 1,
                        plotLines: [{ 
                            width:2,
                            value: 1,
                            color: '#28FF49',
                            label: { 
                                style:{
                                    color:'#0090eacc',
                                    fontSize:'15px',
                                    fontWeight:'bold'
                                },
                            text: 'Best value: 1', // Content of the label. 
                            align: 'left', // Positioning of the label. 
                            }
                        }],
                    },
                    tooltip: {
                        shared: true,
                    },
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'
                    }, 
                });
                for(var i = 0; i<ids.length; i++){
                    drawSingleAcc(ids[i],chartAcc2)
                }
            }
            break;
            
        case'Consistency':
            hideDiv()
            document.getElementById('wrapSwitchCons').style.display = 'block'
            document.getElementById('wrapTab-cons').style.display = 'block'
            document.getElementById('exportCons-btn').style.display = 'block'
            div = document.getElementById('consistency')
            div.style.display = 'block'
            divTab = document.getElementById('wrapTab-cons')
            node = document.getElementById('numTriplesLimitCons')
            while (node.hasChildNodes()) {    //in order not to have duplicate alerts if we click again
                node.removeChild(node.lastChild);
            }
            if(document.getElementById('typeCons').checked){
                document.getElementById('labelDatCons').style.display = 'block'
                chartCons = Highcharts.chart('consistency', {
                    chart: {
                        polar: true,
                        type: 'line'
                    },
                    title: {
                        style:{
                            fontSize:'30px',
                            fontWeight:'bold'
                        },
                        text: 'Consistency'
                    },
                
                    pane: {
                        size: '95%'
                    },
                
                    xAxis: {
                        categories: ['Undef.Cls', 'Undef. Prp.', 'Deprecated Cls./Prp.',
                            'Misspl. Cls', 'Misspl. Prp.'],
                        lineWidth: 0,
                        tickmarkPlacement: 'on',
                    },
                
                    yAxis: {
                        gridLineInterpolation: 'polygon',
                        lineWidth: 0,
                        min: 0,
                        max: 1,
                        plotLines: [{ 
                            width:2,
                            value: 1,
                            color: '#28FF49',
                            label: { 
                                style:{
                                    color:'#0090eacc',
                                    fontSize:'15px',
                                    fontWeight:'bold'
                                },
                            text: 'Best value: 1', // Content of the label. 
                            align: 'left', // Positioning of the label. 
                            }
                        }],
                    },
                    tooltip:{
                        shared:true
                    },
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                    layout: 'horizontal'
                                },
                                pane: {
                                    size: '70%'
                                }
                            }
                        }]
                    }    
                });

                for(var i = 0; i<ids.length; i++){
                    drawSingleCons(ids[i],chartCons)
                }  
            }
            else{
                document.getElementById('labelDatCons').style.display = 'none'
                const chartCons = Highcharts.chart({  //CONSISTENCY CHART (BY DAY)
                    chart: {
                        renderTo: div,
                        type: 'column'
                    },
                    title: {
                        style:{
                            fontSize:'30px',
                            fontWeight:'bold'
                        },
                        text: 'Consistency'
                    },

                    rangeSelector: {
                        enabled:true
                    },
            
                    xAxis: {
                        type:'datetime',
                    },
            
                    yAxis: {
                        stackLabels: {
                            enabled: true,
                            formatter: function() {
                                return this.stack;
                            }
                        },
                        title: {
                            text: 'Number of triples'
                        },
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        },
                        plotLines: [{ 
                            width:2,
                            value: 5,
                            color: '#28FF49',
                            label: { 
                                style:{
                                    color:'#0090eacc',
                                    fontSize:'15px',
                                    fontWeight:'bold'
                                },
                            text: 'Best value:5', // Content of the label. 
                            align: 'left', // Positioning of the label. 
                            }
                        }],
                    },
                    tooltip: {
                        style: {
                            fontSize: '16px',
                            fontWeight: 'bold',
                        },
                        formatter: function () {
                            return '<b>' + this.series.options.id + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                        }
                    },
                    legend:{
                        enabled: true
                    },
                    plotOptions: {
                    series:{
                        minPointLength:3
                    },
                        column: {
                        stacking: 'normal'
                        }
                    },
                    series:[{
                        name: 'Undefined class',
                        id: 'undefC',
                        color: '#2f7ed8',
                    },
                    {
                        name: 'Undefined property',
                        id: 'undefP',
                        color: '#f28f43',
                    },
                    {
                        name: 'Deprecated class/properies',
                        id: 'deprec',
                        color:'#c42525',
                    },
                    {
                        name: 'Misplaced propery',
                        id: 'misP',
                        color: '#a6c96a',
                    },
                    {
                        name: 'Misplaced class',
                        id: 'misC',
                        color:'#0eff00',
                    }]
                });
                for(var i=0; i<ids.length; i++){
                    drawConsistency(ids[i],chartCons)
                }
            }
            if(divTab.children.length > 0)
                document.getElementById('tabCons').remove()
            table = document.createElement('table')
            table.className = "center"
            table.style.marginTop = '45px'
            table.id = 'tabCons'
            tableRow = document.createElement('tr')  //DYNAMIC BUILDING OF CONSISTENCY TABLE
            th = document.createElement('th')
            th1 = document.createElement('th')
            th2 = document.createElement('th')
            th3 = document.createElement('th')
            th.innerHTML = 'KG name'
            th1.innerHTML = 'Ontology hijacking'
            th2.innerHTML = 'Entity as member of disjoint class'
            th3.innerHTML = '<a href="#popupCons" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
            table.appendChild(tableRow)
            tableRow.appendChild(th)
            tableRow.appendChild(th2)
            tableRow.appendChild(th1)
            tableRow.appendChild(th3)
            for(var i = 0; i<ids.length;i++){
                tr2 = document.createElement('tr')
                table.appendChild(tr2)
                drawTabCons(ids[i],tr2)
            }
            if(divTab.children.length == 0)
                divTab.appendChild(table)
            
            break;

        case 'Verifiability':
            hideDiv()
            document.getElementById('exportVerif-btn').style.display = 'block'
            div = document.getElementById('verifiability')
            div.style.display = 'block'
            table = document.createElement('table')
            tr = document.createElement('tr')
            table.appendChild(tr)
            table.id = 'tableVer'
            table.className = 'center' //DYNAMIC BUILDING OF VERIFIABILITY TABLE
            th1 = document.createElement('th')
            th2 = document.createElement('th')
            th3 = document.createElement('th')
            th4 = document.createElement('th')
            th5 = document.createElement('th')
            th6 = document.createElement('th')
            th7 = document.createElement('th')
            th1.innerHTML = 'KG name'
            th2.innerHTML = 'Vocabularies'
            th3.innerHTML = 'Authors'
            th4.innerHTML = 'Publishers'
            th5.innerHTML = 'Contributors'
            th6.innerHTML = 'Sources'
            th7.innerHTML = 'Signed'
            tr.appendChild(th1)
            tr.appendChild(th2)
            tr.appendChild(th3)
            tr.appendChild(th4)
            tr.appendChild(th5)
            tr.appendChild(th6)
            tr.appendChild(th7)
            for(var i = 0; i<ids.length;i++){
                tr1 = document.createElement('tr')
                drawVerifiability(ids[i],tr1)
                table.appendChild(tr1)
            }
            if(div.children.length == 0){
                div.appendChild(table)
            }
            break;
            
        case 'Volatility':
            hideDiv()
            document.getElementById('exportVol-btn').style.display = 'block'
            div = document.getElementById('volatility')
            div.style.display = 'block'
            table = document.createElement('table')
            table.className = 'center'
            table.id = 'tabVol'
            tr1 = document.createElement('tr')  //DYNAMIC BUILDING OF VOLATILITY TABLE
            th1 = document.createElement('th')
            th1.innerHTML = 'KG name'
            th2 = document.createElement('th')
            th2.innerHTML = 'Dataset update frequency'
            tr1.appendChild(th1)
            tr1.appendChild(th2)
            table.appendChild(tr1)
            for(var i = 0; i<ids.length; i++){
                tr = document.createElement('tr')
                drawVolatility(ids[i],tr)
                table.appendChild(tr)
            }
            if(div.children.length == 0){
                div.appendChild(table)
            }
            break;

        case 'Currency':
            hideDiv()
            div = document.getElementById('currency')
            div.style.display = 'block'
            document.getElementById('historyCurr').style.display = 'block'
            document.getElementById('exportCurr-btn').style.display = 'block'
            table = document.createElement('table')
            table.className = 'center'
            table.id = 'currTb'
            tr = document.createElement('tr')  //DTNAMIC BUILDING OF CURRENCY TABLE
            th1 = document.createElement('th')
            th2 = document.createElement('th')
            th3 = document.createElement('th')
            th4 = document.createElement('th')
            th5 = document.createElement('th')
            th6 = document.createElement('th')
            th1.innerHTML = 'KG name'
            th2.innerHTML = 'Creation date'
            th3.innerHTML = 'Modification date'
            th4.innerHTML = 'Number of triples updated'
            th5.innerHTML = 'Percentage of data updated'
            th6.innerHTML = 'Time elapsed since last modification'
            tr.appendChild(th1)
            tr.appendChild(th2)
            tr.appendChild(th3)
            tr.appendChild(th4)
            tr.appendChild(th5)
            tr.appendChild(th6)
            table.appendChild(tr)
            for(var i = 0; i< ids.length; i++){
                tr = document.createElement('tr')
                drawCurrency(ids[i],tr)
                table.appendChild(tr)
            }
            if(div.children.length == 0){
                div.appendChild(table)
            }
            const historyCurr = Highcharts.chart({ //HISTORICAL UPDATE CHART
                chart: {
                    renderTo:'historyCurr',
                    type: 'line'
                },
                title: {
                    style:{
                        fontSize:'30px',
                        fontWeight:'bold'
                    },
                    text: 'Historical updates'
                },
        
                rangeSelector: {
                    selected: 0,
                    enabled:true
                },
                xAxis: {
                    type:'datetime',
                },
                yAxis: {
                    type:'logarithmic',
                    title: {
                        text: 'no. triples'
                    },
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    },
                    series: {
                        marker: {
                            enabled: true
                        }
                    },
                },
            });
            for(var i = 0; i<ids.length; i++){
                drawHistoryCurr(ids[i],historyCurr)
            }
            break;

        case 'Conciseness':
            hideDiv()
            document.getElementById('wrapSwitchConc').style.display = 'block'
            div = document.getElementById('conciseness')
            div.style.display = 'block'
            node = document.getElementById('numTriplesLimitConc')
            while (node.hasChildNodes()) {    //in order not to have duplicate alerts if we click again
                node.removeChild(node.lastChild);
            }
            if(!document.getElementById('typeConc').checked){
                document.getElementById('labelDatConci').style.display = 'none'
                document.getElementById('concisenessTab').style.display = 'none'
                const chartConc = Highcharts.chart({  //CONSICENESS CHART (CHANGE OVER TIME)
                    chart: {
                        renderTo: div,
                        type: 'column'
                    },
    
                    title: {
                        style:{
                            fontSize:'30px',
                            fontWeight:'bold'
                        },
                        text: 'Conciseness'
                    },

                    rangeSelector: {
                        enabled:true
                    },
                
                    xAxis: {
                        type:'datetime',
                    },
                
                    yAxis: {
                        plotLines: [{ 
                            width:4,
                            value: 2,
                            color: '#0090eacc',
                            label: { 
                                style:{
                                    color:'#0090eacc',
                                    fontSize:'15px',
                                    fontWeight:'bold'
                                },
                                text: 'Best value', // Content of the label. 
                                align: 'left', // Positioning of the label. 
                            }
                        }],
                        min:0,
                        max:2,
                        stackLabels: {
                            enabled: true,
                            formatter: function() {
                                return this.stack;
                            }
                        },
                        title: {
                            text: 'Concisenss'
                        },
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    },
                    tooltip: {
                        style: {
                            fontSize: '16px',
                            fontWeight: 'bold',
                        },
                        formatter: function () {
                                return '<b>' + this.series.options.id + '</b><br/>' +
                                    this.series.name + ': ' + this.y + '<br/>' +
                                    'Total: ' + this.point.stackTotal;
                        }
                    },
                    legend:{
                        enabled: true,
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: true,
                                crop:false,
                                overflow:'none',
                            }
                        }
                    },
                    series:[
                    {
                        id:'intC',
                        name: 'Intensional conciseness',
                        color:'#0086ad'
                    },
                    {
                    id:'exC',
                    name: 'Extensional conciseness',
                    color:'#ff9a00'
                    },
                    ]
                });
                for(var i=0; i<ids.length; i++){
                    drawConciseness(ids[i],chartConc)
                }
            }
            else{
                if(document.getElementById('concisenessTab').children.length > 0 )
                    document.getElementById('concTab').remove()
                document.getElementById('labelDatConci').style.display = 'block' //DYNAMIC BUILDING OF CONCISENESS TABLE (BY DAY)
                document.getElementById('exportConc-btn').style.display = 'block'
                div.style.display = 'none'
                document.getElementById('concisenessTab').style.display = 'block'
                table = document.createElement('table')
                table.className = 'center'
                table.id = 'concTab'
                tr = document.createElement('tr')
                th1 = document.createElement('th')
                th2 = document.createElement('th')
                th3 = document.createElement('th')
                th4 = document.createElement('th')
                th1.innerHTML = 'KG name'
                th2.innerHTML = 'Extensional conciseness'
                th3.innerHTML = 'Intensional conciseness'
                th4.innerHTML = '<a href="#popupConc" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
                tr.appendChild(th1)
                tr.appendChild(th2)
                tr.appendChild(th3)
                tr.appendChild(th4)
                table.appendChild(tr)
                for(var i = 0; i<ids.length;i++){
                    tr2 = document.createElement('tr')
                    drawConcisenessTab(ids[i],tr2)
                    table.appendChild(tr2)
                }
                if(document.getElementById('concisenessTab').children.length == 0){
                    divT = document.getElementById('concisenessTab')
                    divT.appendChild(table)
                }
            }
            break;
            
        case 'Completeness':
            hideDiv()
            document.getElementById('wrapSwitchComp').style.display = 'block'
            if(!document.getElementById('typeComp').checked){
                document.getElementById('exportComp-btn').style.display = 'none'
                document.getElementById('wrap-compTab').style.display = 'none'
                document.getElementById('completeness').style.display = 'block'
                const chartComp =  Highcharts.chart('completeness', { //COMPLETENESS CHART (CHANGE OVER TIME)
                    title: {
                        style:{
                            fontSize:'28px',
                            fontWeight:'bold'
                        },
                        text: 'Interlinking completeness',
                    },
                    yAxis: {
                        min:0,
                        max: 1,
                        allowDecimals: false,
                        title: {
                            text: 'Status'
                        },
                        plotLines: [{ 
                            width:2,
                            value: 1,
                            color: '#28FF49',
                            label: { 
                                style:{
                                    color:'#0090eacc',
                                    fontSize:'15px',
                                    fontWeight:'bold'
                                },
                            text: 'Best value: 1', // Content of the label. 
                            align: 'left', // Positioning of the label. 
                            }
                        }],
                    },
                    xAxis: {
                        type:'datetime',
                    },
                    rangeSelector: {
                        enabled:true
                    },
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                    },
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            },
                        }
                    },
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                }
                            }
                        }]
                    }
                });
                for(var i = 0; i<ids.length; i++){
                    drawCompleteness(ids[i],chartComp)
                }
            } 
            else{
                if(document.getElementById('wrap-compTab').children.length > 0)
                    document.getElementById('compTab').remove()
                document.getElementById('labelDatComp').style.display = 'block'
                document.getElementById('completeness').style.display = 'none'
                document.getElementById('exportComp-btn').style.display = 'block'
                divTab = document.getElementById('wrap-compTab')
                divTab.style.display = 'block'
                table = document.createElement('table')
                table.className = 'center'
                table.id = 'compTab'
                tr = document.createElement('tr')  //DYNAMIC BUILDING COMPLETENESS TAB (BY DAY)
                th = document.createElement('th')
                th1 = document.createElement('th')
                th2 = document.createElement('th')
                th3 = document.createElement('th')
                th4 = document.createElement('th')
                th5 = document.createElement('th')
                th.innerHTML = 'KG name'
                th1.innerHTML = 'Number of triples'
                th2.innerHTML = 'Number of triples linked'
                th3.innerHTML = 'Interlinking completeness'
                th4.innerHTML = 'Percentage of triples linked'
                th5.innerHTML = '<a href="#popupCompl" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
                tr.appendChild(th)
                tr.appendChild(th1)
                tr.appendChild(th2)
                tr.appendChild(th3)
                tr.appendChild(th4)
                tr.appendChild(th5)
                table.appendChild(tr)
                for(var i = 0; i<ids.length; i++){
                    tr2 = document.createElement('tr')
                    drawCompletenessTab(ids[i],tr2)
                    table.appendChild(tr2)
                }
                if(divTab.children.length == 0)
                    divTab.appendChild(table)
            }
            break;
                
        case 'Amount':
            hideDiv()
            document.getElementById('wrapSwitchAmount').style.display = 'block'
            divAmount = document.getElementById('amountOfData')
            divAmount.style.display = 'block'
            if(!document.getElementById('typeAmount').checked){
                const chartAmount = Highcharts.chart({  //AMOUNT OF DATA CHART (CHANGE OVER TIME)
                    chart: {
                        renderTo: divAmount,
                        type: 'column'
                    },
                
                    title: {
                        style:{
                        fontSize:'30px',
                        fontWeight:'bold'
                        },
                        text: 'Amount of data'
                    },
                    rangeSelector: {
                        enabled:true
                    },
                
                    xAxis: {
                        type:'datetime',
                    },
                
                    yAxis: {
                        stackLabels: {
                            enabled: true,
                            formatter: function() {
                                return this.stack;
                            }
                        },
                        title: {
                            text: 'Amount of data'
                        },
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    },
                    tooltip: {
                        style: {
                            fontSize: '16px',
                            fontWeight: 'bold',
                        },
                        formatter: function () {
                                return '<b>' + this.series.options.id + '</b><br/>' + //KG NAME WHEN OVER IT WITH MOUSE
                                    this.series.name + ': ' + this.y + '<br/>'
                            
                        }
                    },
                    legend:{
                        enabled: true
                    },
                    series: [
                        {
                            name: 'entities',
                            id: 'entities',
                            color: '#00ff83'
                        },
                        {
                            name: 'properties',
                            id: 'properties',
                            color: '#404552'
                        },
                        {
                            name: 'triples',
                            id: 'triples',
                            color: '#7CA9F4'
                        },
                    ],
                    plotOptions: {
                    series:{
                        minPointLength:3
                    },
                        column: {
                            stacking: 'normal'
                        }
                    },
                });
                for(var i = 0; i<ids.length; i++){
                    drawAmount(ids[i],chartAmount)
                }
            }
            else{
                document.getElementById('labelDatAmount').style.display = 'block'
                const chartAmount = Highcharts.chart({ //AMOUNT OF DATA CHART (BY DAY)
                    chart: {
                        renderTo: divAmount,
                        type: 'column'
                    }, 
                    title: {
                        style:{
                            fontSize:'30px',
                            fontWeight:'bold'
                        },
                        text: 'Amount of data'
                    },
                    xAxis: {
                        type:'datetime',
                    },
            
                    yAxis: {
                        stackLabels: {
                        enabled: true,
                        formatter: function() {
                                return this.stack;
                        }
                        },
                        title: {
                            text: 'Amount of data'
                        },
                    },
                    tooltip: {
                        style: {
                            fontSize: '16px',
                            fontWeight: 'bold',
                        },
                        formatter: function () {
                            return '<b>' + this.series.options.id + '</b><br/>' + //KG NAME WHEN OVER IT WITH MOUSE
                                this.series.name + ': ' + this.y + '<br/>'
                            
                        }
                    },
                    series: [
                    {
                        name: 'entities',
                        id: 'entities',
                        color: '#00ff83'
                    },
                    {
                        name: 'properties',
                        id: 'properties',
                        color: '#404552'
                    },
                    {
                        name: 'triples',
                        id: 'triples',
                        color: '#7CA9F4'
                    },
                    ],

                    legend:{
                        enabled: true
                    },
                    plotOptions: {
                        series:{
                            minPointLength:3
                        },
                        column: {
                            stacking: 'normal'
                        }
                    },
                });
                for(var i = 0; i<ids.length; i++){
                    drawSingleAmount(ids[i],chartAmount)
                }
            }
            break;
                
        case 'RepresentationalConciseness':
            hideDiv()
            document.getElementById('wrap-repConc').style.display = 'block'
            const chartS = Highcharts.chart({ //REP. CONCISENESS BOXPLOT
                chart: {
                    renderTo:'lengthS',
                    type: 'boxplot'
                },
                title: {
                    style:{
                        fontSize:'30px',
                        fontWeight:'bold'
                    },
                    text: 'URIs length (subject)'
                },
                subtitle: {
                    style:{
                        fontSize:'24px'
                    }
                },
        
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                },
            
                xAxis: {
                    type:'datetime',
                },
            
                yAxis: {
                    plotLines: [{
                        value: 80,
                        color: 'red',
                        width: 1,
                        label: {
                            text: 'Optimal value: 80',
                            align: 'center',
                            style: {
                                color: 'gray'
                            }
                        }
                    }],
                    title: {
                        text: 'Observations'
                    },
                },
            });

            const chartP = Highcharts.chart({
                chart: {
                    renderTo:'lengthP',
                    type: 'boxplot'
                } ,
                title: {
                    style:{
                        fontSize:'30px',
                        fontWeight:'bold'
                    },
                    text: 'URIs length (predicate)'
                },
        
                subtitle: {
                    style:{
                        fontSize:'24px'
                    }
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                },
            
                xAxis: {
                    type:'datetime',
                },
            
                yAxis: {
                    plotLines: [{
                        value: 80,
                        color: 'red',
                        width: 1,
                        label: {
                            text: 'Optimal value: 80',
                            align: 'center',
                            style: {
                                color: 'gray'
                            }
                        }
                    }],
                    title: {
                        text: 'Observations'
                    },
                },
            });
            const chartO = Highcharts.chart({
                chart: {
                    renderTo:'lengthO',
                    type: 'boxplot'
                },
                title: {
                    style:{
                        fontSize:'30px',
                        fontWeight:'bold'
                    },
                    text: 'URIs length (object)'
                },
    
                subtitle: {
                    style:{
                        fontSize:'24px'
                    }
                },
    
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                },
        
                xAxis: {
                    type:'datetime',
                },
        
                yAxis: {
                    plotLines: [{
                        value: 80,
                        color: 'red',
                        width: 1,
                        label: {
                            text: 'Optimal value: 80',
                            align: 'center',
                        style: {
                            color: 'gray'
                        }
                        }
                    }],
                title: {
                    text: 'Observations'
                },
                },
            });
            for(var i = 0; i<ids.length; i++){
                drawLengthS(ids[i],chartS)
            }
            for(var i = 0; i<ids.length; i++){
                drawLengthP(ids[i],chartP)
            }
            for(var i = 0; i<ids.length; i++){
                drawLengthO(ids[i],chartO)
            } 

            break;
            
        case 'RepresentationalConsistency':
            hideDiv()
            divTab = document.getElementById('wrap-repCons')
            document.getElementById('exportRepCons-btn').style.display = 'block'
            divTab.style.display = 'block'
            table = document.createElement('table')
            table.className = 'center'
            table.id = 'tabRepCons'
            tr = document.createElement('tr')  //DYNAMIC BUILDING OF REP. CONDIDTENCY TABLE
            th1 = document.createElement('th')
            th2 = document.createElement('th')
            th3 = document.createElement('th')
            th4 = document.createElement('th')
            th1.innerHTML = 'KG name'
            th2.innerHTML = 'New vocabularies defined in the dataset'
            th3.innerHTML = 'New terms defined in the dataset'
            th4.innerHTML = '<a href="#popupRepCons" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
            table.appendChild(tr)
            tr.appendChild(th1)
            tr.appendChild(th2)
            tr.appendChild(th3)
            tr.appendChild(th4)
            for(var i = 0; i<ids.length; i++){
                tr2 = document.createElement('tr')
                drawRepCons(ids[i],tr2)
                table.appendChild(tr2)
            }
            if(divTab.children.length == 0){
                divTab.appendChild(table)
            }
            break;

        case 'Understendability':
            hideDiv()
            document.getElementById('wrapSwitchUnd').style.display = 'block'
            document.getElementById('wrap-tabUnd2').style.display = 'block'
            document.getElementById('exportUnd2').style.display = 'block'
            if(!document.getElementById('typeUnd').checked){
                document.getElementById('wrap-tabUnd').style.display = 'none'
                document.getElementById('understendability').style.display = 'block'
                const chartUnder = Highcharts.chart('understendability', { //UDERTENDABILITY CHART (CHANGE OVER TIME)
                    title: {
                        style:{
                            fontSize:'28px',
                            fontWeight:'bold'
                        },
                        text: 'Percentage of triples with label',
                    },
                    subtitle: {
                        style:{
                            fontSize:'18px',
                        },
                        align: 'center',
                        text: 'Best value: 100%'
                    },
                    yAxis: {
                        allowDecimals: false,
                        title: {
                            text: 'Percentage'
                        }
                    },
                    xAxis: {
                        type:'datetime',
                    },
                    rangeSelector: {
                        enabled:true
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.y:.2f}%</b>'
                    },
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                    },
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            },
                        }
                    },       
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                }
                            }
                        }]
                    }
                });
                for(var i = 0; i<ids.length; i++){
                    drawUnderstend(ids[i],chartUnder)
                }
                table = document.createElement('table')
                table.id = 'undInc'
                tr = document.createElement('tr')
                th1 = document.createElement('th')
                th2 = document.createElement('th')
                th3 = document.createElement('th')
                th4 = document.createElement('th')
                th5 = document.createElement('th')
                th1.innerHTML = 'KG name'
                th2.innerHTML = 'Uri regex'
                th3.innerHTML = 'Example'
                th4.innerHTML = 'Vocabulary used in the KG'
                th5.innerHTML = '<a href="#popupUnder" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
                table.appendChild(tr)
                table.className = 'center'
                tr.appendChild(th1)
                tr.appendChild(th2)
                tr.appendChild(th3)
                tr.appendChild(th4)
                tr.appendChild(th5)
                for(var i = 0;i<ids.length; i++){
                    tr2 = document.createElement('tr')
                    drawUnderTab2(ids[i],tr2)
                    table.appendChild(tr2)
                }
                divTab = document.getElementById('wrap-tabUnd2')
                if(divTab.children.length == 0){
                    divTab.appendChild(table)
                }
            }
            else{
                if(document.getElementById('wrap-tabUnd').children.length > 0)
                    document.getElementById('UnderComp').remove()
                document.getElementById('labelDatUnder').style.display = 'block'
                document.getElementById('wrap-tabUnd2').style.display = 'none'
                document.getElementById('understendability').style.display = 'none'
                document.getElementById('exportUnd1').style.display = 'block'
                document.getElementById('exportUnd2').style.display = 'none'
                document.getElementById('wrap-tabUnd').style.display = 'block'
                table = document.createElement('table')  //DYNAMIC BUILDING OF UNDERSTENDABILITY TABLE (BY DAY)
                table.id = 'UnderComp'
                tr = document.createElement('tr')
                th1 = document.createElement('th')
                th2 = document.createElement('th')
                th3 = document.createElement('th')
                th4 = document.createElement('th')
                th5 = document.createElement('th')
                th6 = document.createElement('th')
                th7 = document.createElement ('th')
                th7.innerHTML = '<a href="#popupUnder" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
                th1.innerHTML = 'KG name'
                th2.innerHTML = 'Number of labels'
                th3.innerHTML = 'Percentage of triples with label'
                th4.innerHTML = 'URI regex'
                th5.innerHTML = 'Example'
                th6.innerHTML = 'Vocabulary used in the KG'
                table.appendChild(tr)
                table.className = 'center'
                tr.appendChild(th1)
                tr.appendChild(th2)
                tr.appendChild(th3)
                tr.appendChild(th4)
                tr.appendChild(th5)
                tr.appendChild(th6)
                tr.appendChild(th7)
                divTab = document.getElementById('wrap-tabUnd')
                for(var i = 0; i<ids.length; i++){
                    tr2 = document.createElement('tr')
                    drawUnderTab1(ids[i],tr2)
                    table.appendChild(tr2)
                }
                if(divTab.children.length == 0){
                    divTab.appendChild(table)
                }
            }
            break;
            
        case 'Interpretability':
            hideDiv()
            document.getElementById('wrapSwitchInterp').style.display = 'block'
            document.getElementById('interpretability').style.display = 'block'
            document.getElementById('exportInterp').style.display = 'block'
            if(!document.getElementById('typeInt').checked){
                const chartInterp = Highcharts.chart('interpretability', {  //INTERPRETABILITY TABLE (CHANGE OVER TIME)
                    title: {
                        style:{
                            fontSize:'28px',
                            fontWeight:'bold'
                        },
                        text: 'Blank nodes',
                    },
                    subtitle: {
                        style:{
                            fontSize:'18px',
                        },
                        align: 'center',
                        text: 'The number of blank nodes should be 0 to have a KG with a hight interpretability.'
                    },
                    yAxis: {
                        type: 'logarithmic',
                        allowDecimals: false,
                        title: {
                            text: 'no. blank node'
                        }
                    },
                    xAxis: {
                        type:'datetime',
                    },
                    rangeSelector: {
                        enabled:true
                    },
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                    },
                
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            },
                        }
                    },          
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                }
                            }
                        }]
                    }
                });
                
                for(var i = 0; i<ids.length; i++){
                    drawBlankNode(ids[i],chartInterp)
                }
            }
            else{
                document.getElementById('labelDatInterp').style.display = 'block'
                const chartInterp = Highcharts.chart({  //INTERPRETABILITY CHART (BY DAY)
                    chart: {
                        renderTo: 'interpretability',
                        type: 'column'
                    }, 
                    title: {
                        style:{
                            fontSize:'30px',
                            fontWeight:'bold'
                        },
                        text: 'Interpretability'
                    },
                    subtitle: {
                        style:{
                            fontSize:'18px',
                        },
                        align: 'center',
                        text: 'The number of blank nodes should be 0 to have a KG with a hight interpretability.'
                    },              
                    xAxis: {
                        type:'datetime',
                    },
            
                    yAxis: {
                        type: 'logarithmic',
                        stackLabels: {
                            enabled: true,
                            formatter: function() {
                                return this.stack;
                            }
                        },
                        title: {
                            text: 'no. triples'
                        },
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    },
                    tooltip: {
                        style: {
                            fontSize: '16px',
                            fontWeight: 'bold',
                        },
                        formatter: function () {
                            return '<b>' + this.series.options.id + '</b><br/>' + //KG NAME WHEN OVER IT WITH MOUSE
                                this.series.name + ': ' + this.y + '<br/>'
                            
                        }
                    },
                    legend:{
                        enabled: true
                    },
                    series: [{
                        name: 'Blank nodes',
                        id: 'blank',
                        color: '#FF9648'
                    },
                    {
                        name: 'Triples',
                        id: 'triples',
                        color: '#7CA9F4'
                    }],
                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        },
                        series:{
                            minPointLength:3
                        },
                        bar: {
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                });
                for(var i = 0; i<ids.length; i++){
                    drawSingleInterp(ids[i],chartInterp)
                }
            }
            if(document.getElementById('wrapTabInter').children.length > 0)
                document.getElementById('interpTab').remove()
            divTab = document.getElementById('wrapTabInter')
            divTab.style.display = 'block'
            table = document.createElement('table')  //DYNAMIC BUILDING OF INTERPRETABILITY TABLE (USE OF RDF STRUCTURES)
            table.className = 'center'
            table.id = 'interpTab'
            tr = document.createElement('tr')
            th1 = document.createElement('th')
            th2 = document.createElement('th')
            th3 = document.createElement('th')
            th1.innerHTML = 'KG name'
            th2.innerHTML = 'Use RDF structures'
            th3.innerHTML = '<a href="#popupInterp" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
            tr.appendChild(th1)
            tr.appendChild(th2)
            tr.appendChild(th3)
            table.appendChild(tr)
            for(var i = 0; i<ids.length; i++){
                tr2 = document.createElement('tr')
                drawTabInterp(ids[i],tr2)
                table.appendChild(tr2)
            }
            if(divTab.children.length == 0)
                divTab.appendChild(table)
            break;
            
        case 'Versatility':
            hideDiv()
            document.getElementById('exportVers').style.display = 'block'
            divVers = document.getElementById('versatility')
            divVers.style.display = 'block'
            table = document.createElement('table')
            table.id = 'versTab'  //DYNAMIC BUILDING OF VERSATILITY TABLE
            table.className = 'center'
            tr = document.createElement('tr')
            th1 = document.createElement('th')
            th2 = document.createElement('th')
            th3 = document.createElement('th')
            th4 = document.createElement('th')
            th5 = document.createElement('th')
            th6 = document.createElement('th')
            th1.innerHTML = 'KG name'
            th2.innerHTML = 'Serialization formats'
            th3.innerHTML = 'Available languages'
            th4.innerHTML = 'Link SPARQL endpoint'
            th5.innerHTML = 'Link for download as RDF dump'
            th6.innerHTML = '<a href="#popupVers" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
            table.appendChild(tr)
            tr.appendChild(th1)
            tr.appendChild(th2)
            tr.appendChild(th3)
            tr.appendChild(th4)
            tr.appendChild(th5)
            tr.appendChild(th6)
            for(var i = 0; i<ids.length; i++){
                tr2 = document.createElement('tr')
                drawVersatility(ids[i],tr2)
                table.appendChild(tr2)
            }
            if(divVers.children.length == 0)
                divVers.appendChild(table)
            
            break;

        case 'Score':
            hideDiv()
            document.getElementById('wrapSwitchScore').style.display = 'block'
            if(!document.getElementById('typeScore').checked){
                if (document.body.contains(document.getElementById('scoreTab')) == true){
                    tab = document.getElementById('scoreTab')
                    tab.remove()
                }
                document.getElementById('exportScore-btn').style.display = 'block'
                wrapTab = document.getElementById('wrapScore')
                wrapTab.style.display = 'block'
                table = document.createElement('table')
                table.id = 'scoreTab' 
                table.className = 'center'
                thN = document.createElement('th')
                thV = document.createElement('th')
                th3 = document.createElement('th')
                thN.innerHTML = 'KG name'
                thV.innerHTML = 'Score'
                th3.innerHTML = '<a href="#popupScore" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
                tr1 = document.createElement('tr')
                tr1.appendChild(thN)
                tr1.appendChild(thV)
                tr1.appendChild(th3)
                table.appendChild(tr1)
                let btn1 = document.createElement('button')
                let btn2 = document.createElement('button')
                btn1.innerHTML = 'Asc'
                btn1.id = 'b1S'
                btn1.onclick = function (){
                    sortTable(1,'scoreTab',true)
                };
                btn2.innerHTML = 'Dsc'
                btn2.id = 'b2S'
                btn2.onclick = function (){
                    sortTable(1,'scoreTab',false)
                };
                thV.appendChild(btn1)
                thV.appendChild(btn2)
                for(i = 0; i<ids.length; i++){
                    tr = document.createElement('tr')
                    drawScoreTab(ids[i],tr)
                    table.appendChild(tr)
                }
                if(wrapTab.children.length == 0)
                    wrapTab.appendChild(table)
            }
            else{
                tab = document.getElementById('scoreTab')
                tab.remove()
                document.getElementById('exportScore-btn').style.display = 'block'
                var ids = [];
                var xmlhttp;
                //IF WANT  TO SEE THE COMPLETE RANKING WITH ALL KG ANALYZED, LOAD THE TXT FILE WITH ALL KG ANALYZED TO ADD IT IN THE CLASSIFICATION
                if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp = new XMLHttpRequest();
                } else { // code for IE6, IE5
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        var text = xmlhttp.responseText;
                        // Now convert it into array using regex
                        ids = text.split("\n");
                        fullName = text.trim().split("\n");
                        ids = []
                        names = []
                        nscore = []
                        for(var i = 0; i<fullName.length;i++){
                            idTxt = fullName[i].trim().slice(0, fullName[i].indexOf(' '))
                            ids.push(idTxt)
                            name = fullName[i].trim().slice(fullName[i].indexOf(' '));
                            lastIndex = name.lastIndexOf(" ");
                            name = name.substring(0,lastIndex)
                            names.push(name.trim())
                            n = fullName[i].lastIndexOf(" ");
                            score = fullName[i].substring(n+1)
                            score = score.trim()
                            score = parseFloat(score)
                            nscore.push(score)
                        }
                        wrapTab = document.getElementById('wrapScore')
                        wrapTab.style.display = 'block'
                        table = document.createElement('table')
                        table.id = 'scoreTab' 
                        table.className = 'center'
                        thN = document.createElement('th')
                        thV = document.createElement('th')
                        th3 = document.createElement('th')
                        thN.innerHTML = 'KG name'
                        thV.innerHTML = 'Score'
                        th3.innerHTML = '<a href="#popupScore" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
                        thV.style.marginRight = '50px'
                        tr1 = document.createElement('tr')
                        tr1.appendChild(thN)
                        tr1.appendChild(thV)
                        tr1.appendChild(th3)
                        table.appendChild(tr1)
                        let btn1 = document.createElement('button')
                        let btn2 = document.createElement('button')
                        btn1.innerHTML = 'Asc'
                        btn1.id = 'b1S'
                        btn1.onclick = function (){
                            sortTable(1,'scoreTab',true)
                        };
                        btn2.innerHTML = 'Dsc'
                        btn2.id = 'b2S'
                        btn2.onclick = function (){
                            sortTable(1,'scoreTab',false)
                        };
                        thV.appendChild(btn1)
                        thV.appendChild(btn2)
                        for(i = 0; i<ids.length; i++){
                            tr = document.createElement('tr')
                            drawScoreChart(names[i],tr,nscore[i])
                            table.appendChild(tr)
                        }
                        if(wrapTab.children.length == 0)
                            wrapTab.appendChild(table)
                        }
                }
                xmlhttp.open("GET", "KGid.txt", true);
                xmlhttp.send();        
                }
            break;
        
        case 'Download':
            hideDiv()
            document.getElementById('downloadWrap').style.display = 'block'
            $(document).ready(function() {
                $.ajax({
                    type: "GET",
                    url: './CSVforJS/'+ids[0]+'.csv',
                    dataType: "text",
                    success: function(data) {processData(data)}
                });
                function processData(data){
                    var lines = data.trim().split('\n');
                    var lastLine = lines[lines.length - 1].split(',');
                    analysisDate = []
                    for(var i = 1; i<lines.length; i++){
                        line = lines[i].split(',')
                        analysisDate.push(line[0])
                    }
                    $( "#datepickerDown" ).datepicker({
                        dateFormat:"yy-mm-dd",
                        beforeShowDay: function(date){
                            var sdate = $.datepicker.formatDate('yy-mm-dd',date)
                            if($.inArray(sdate,analysisDate) != -1){
                                return[true]
                            }
                            return[false]
                        }
                    });
                    $("#datepickerDown").datepicker("setDate",lastLine[0])
                }
            });

            break;
        default:
            alert('Error')       
    }
}

//FUNCTIONS TO DRAW ON  CHART EVERY KG SELECTED
function drawAvailabilitySPARQL(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            tdName = document.createElement('td')
            tdName.innerHTML = lastLine[5]
            tr.appendChild(tdName)
            for(var i=1; i<lines.length;i++){
                var line = lines[i].split(',')
                tdSPARQL = document.createElement('td')
                sparql = parseInt(line[1])
                if(sparql == 1){
                    tdSPARQL.innerHTML = 'Online'
                    tdSPARQL.style.backgroundColor = '#00ea89cc'
                }
                else if(sparql == 0){
                    tdSPARQL.innerHTML = 'Offline'
                    tdSPARQL.style.backgroundColor = '#ff6666'
                }
                else if(sparql == -1){
                    tdSPARQL.innerHTML = 'Absent'
                    tdSPARQL.style.background = 'white'
                }
                else if(isNaN(sparql))
                    tdSPARQL.innerHTML = line[1]
                tr.appendChild(tdSPARQL)
            }
        }
    });
}

function drawAvailabilityDump(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            tdName = document.createElement('td')
            tdName.innerHTML = lastLine[5]
            tr.appendChild(tdName)
            for(var i=1; i<lines.length;i++){
                var line = lines[i].split(',')
                tdDump = document.createElement('td')
                dump = parseInt(line[2])
                if(dump == 1){
                    tdDump.innerHTML = 'Online'
                    tdDump.style.backgroundColor = '#00ea89cc'
                }
                else if(dump == 0){
                    tdDump.innerHTML = 'Offline'
                    tdDump.style.backgroundColor = '#ff6666'
                }
                else if(dump == -1){
                    tdDump.innerHTML = 'Absent'
                    tdDump.style.background = 'white'
                }
                else
                    tdDump.innerHTML = sparql
                tr.appendChild(tdDump)
            }
        }
    });
}

function drawScoreChart(name,tr,score){
    kgName = name
    score = parseFloat(score)
    tdN = document.createElement('td')
    tdV = document.createElement('td')
    tdN.innerHTML = kgName
    tdV.innerHTML = score
    tr.appendChild(tdN)
    tr.appendChild(tdV)
}

function drawScoreTab(id,tr,score){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: 'KGid.txt',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            fullName = data.trim().split("\n");
            idsTxt = []
            names = []
            nscore = []
            for(var i = 0; i<fullName.length;i++){
                idTxt = fullName[i].trim().slice(0, fullName[i].indexOf(' '))
                idsTxt.push(idTxt)
                name = fullName[i].trim().slice(fullName[i].indexOf(' '));
                lastIndex = name.lastIndexOf(" ");
                name = name.substring(0,lastIndex)
                names.push(name.trim())
                n = fullName[i].lastIndexOf(" ");
                score = fullName[i].substring(n+1)
                score = score.trim()
                score = parseFloat(score)
                nscore.push(score)
            }
            for(var i = 0; i<idsTxt.length;i++){
                if(id == idsTxt[i]){
                    kgName = names[i]
                    score = parseFloat(nscore[i])
                    tdN = document.createElement('td')
                    tdV = document.createElement('td')
                    tdN.innerHTML = kgName
                    tdV.innerHTML = score
                    tr.appendChild(tdN)
                    tr.appendChild(tdV)
                }
            }

        }
    });
}

function drawEndpoint(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var date = []
            var dataSeries = []
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            var measurements = []
            for(var j = 1; j< lines.length; j++){
                line = lines[j].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                data = [date_utc,parseInt(line[1])]
                measurements.push(data)
            }
            chart.addSeries({
                name : lastLine[5],
                data: measurements,
            },false)
            chart.redraw()
        }
    });
}

function drawDef(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            tdName = document.createElement('td')
            tdName.innerHTML = lastLine[5]
            tr.appendChild(tdName)
            for(var i=1; i<lines.length;i++){
                var line = lines[i].split(',')
                tdDefV = document.createElement('td')
                //defV = parseFloat(line[])
                defV = '-'  //TODO ADD VALUE OF URIs DEFERECIABILITY WHEN AVAILABLE
                tdDefV.innerHTML = defV
                tr.appendChild(tdDefV)
            }
        }
    });
}

function drawBlankNode(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            blankData = []
            for(var i = 1; i<lines.length; i++){
                line = lines[i].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                data = [date_utc,parseInt(line[81])]
                blankData.push(data)
            }
            chart.addSeries({
                name: lastLine[5],
                data: blankData,
            })
        }
    });
}

function drawVersatility(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            td4 = document.createElement('td')
            td5 = document.createElement('td')
            numLinkRDF = lastLine[31]
            if(numLinkRDF != 'Not provided'){
                numLinkRDF = occurrences(lastLine[31],'http')
                if(!isNaN(numLinkRDF))
                    numLinkRDF = numLinkRDF
                if(isNaN(numLinkRDF))
                    numLinkRDF = '-'
            }
            //No language indicated
            languages = lastLine[29]
            if(languages != 'No language indicated' && languages != 'endpoint absent' && languages != 'Could not process formulated query on indicated endpoint.' && languages != 'endpoint offline' && languages.search('error') == -1 && languages!='[]'){
                languages = occurrences(lastLine[29],';')
                if(!isNaN(languages))
                    languages = languages +1 
                if(isNaN(languages) || languages == 0)
                    languages = '-'
                if (languages == '[]')
                    languages = 0

            }
            linkSparql = lastLine[30]
            
            td1.innerHTML = lastLine[5]
            td2.innerHTML = lastLine[28]
            td3.innerHTML = languages
            if(lastLine[30].search('http')!=-1)
                td4.innerHTML = '<a href="' + lastLine[30]+'" target="_blank">'+lastLine[30] + '</a>'
            else
                td4.innerHTML = lastLine[30]

            td5.innerHTML = numLinkRDF
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
        }
    });
}

function drawHistoryCurr(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            historicalUp = lastLine[83].split(';')
			dataHistorical = []
			for(var i = 0; i<historicalUp.length; i++){
				date = historicalUp[i].split('|')[0]
				triples = historicalUp[i].split('|')[1]
				date = date.trim()
				if (triples != undefined)
                triples = triples.trim()
				//console.log(date)
				//console.log(triples)
				var tab_date = date.split('-')
				var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
				data = [date_utc,parseInt(triples)]
				dataHistorical.push(data)
			}

            chart.addSeries({
                name: lastLine[5],
                data: dataHistorical
            })

        }
    });
}

function drawSingleInterp(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            analysisDate = []
            for(var i = 1; i<lines.length; i++){
				line = lines[i].split(',')
				analysisDate.push(line[0])
			}
            $( "#datepickerInterp" ).datepicker({
                dateFormat:"yy-mm-dd",
                beforeShowDay: function(date){
                    var sdate = $.datepicker.formatDate('yy-mm-dd',date)
                    if($.inArray(sdate,analysisDate) != -1){
                        return[true]
                    }
                    return[false]
                }
            });
            $("#datepickerInterp").datepicker("setDate",lastLine[0])
            dataBlank = []
            dataTriples = []
            var tab_date = lastLine[0].split('-')
            var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
            data1 = [date_utc,parseInt(lastLine[81])]
            data2 = [date_utc,parseInt(lastLine[14])]
            dataBlank.push(data1)
            dataTriples.push(data2)

            chart.addSeries({
                id: lastLine[5],
                data:dataBlank,
                name: 'Blank nodes',
                stack: lastLine[15],
                linkedTo: 'blank',
                color: '#FF9648'
            },false)

            chart.addSeries({
                id: lastLine[5],
                data:dataTriples,
                name: 'Triples',
                stack: lastLine[15],
                linkedTo: 'triples',
                color: '#7CA9F4'
            },false)

            chart.redraw()
        }
    });
}

function drawTabInterp(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            td = document.createElement('td')
            td2 = document.createElement('td')
            td.innerHTML = lastLine[5]
            td2.innerHTML = lastLine[82]
            tr.appendChild(td)
            tr.appendChild(td2)
        }
    });
}

function drawAmount(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            triples = []
            entities = []
            properties = []
            for(var i = 1; i<lines.length; i++){
                line = lines[i].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                data = [date_utc,parseInt(line[14])]
                triples.push(data)
                data = [date_utc,parseInt(line[59].split(' ')[0])]
                entities.push(data)
                data = [date_utc,parseInt(line[60])]
                properties.push(data)
            }
            
            chart.addSeries({
                id: lastLine[5],
                name: 'Entities',
                data: entities,
                stack: lastLine[15],
                linkedTo: 'entities',
                color: '#00ff83',
            },false)

            chart.addSeries({
                id: lastLine[5],
                name: 'Properties',
                data: properties,
                stack: lastLine[15],
                linkedTo: 'properties',
                color:'#404552'
            },false)       

            chart.addSeries({
                id: lastLine[5],
                name: 'Triples',
                data: triples,
                stack: lastLine[15],
                linkedTo: 'triples',
                color: '#7CA9F4'
            },false)

            chart.redraw()
        }
    });
}

function drawSingleAmount(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            analysisDate = []
            for(var i = 1; i<lines.length; i++){
				line = lines[i].split(',')
				analysisDate.push(line[0])
			}
            $( "#datepickerAmount" ).datepicker({
                dateFormat:"yy-mm-dd",
                beforeShowDay: function(date){
                    var sdate = $.datepicker.formatDate('yy-mm-dd',date)
                    if($.inArray(sdate,analysisDate) != -1){
                        return[true]
                    }
                    return[false]
                }
            });
            $("#datepickerAmount").datepicker("setDate",lastLine[0])
            triples = []
            entities = []
            properties = []
            var tab_date = lastLine[0].split('-')
            var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
            data = [date_utc,parseInt(lastLine[14])]
            triples.push(data)
            data = [date_utc,parseInt(lastLine[59].split(' ')[0])]
            entities.push(data)
            data = [date_utc,parseInt(lastLine[60])]
            properties.push(data)

            chart.addSeries({
                id: lastLine[5],
                minPointLength: 5,
                name: 'Entities',
                data: entities,
                stack: lastLine[15],
                linkedTo: 'entities',
                color: '#00ff83'
            },false)

            chart.addSeries({
                id: lastLine[5],
                minPointLength: 5,
                name: 'Properties',
                data: properties,
                stack: lastLine[15],
                linkedTo:'properties',
                color:'#404552'
            },false)

            chart.addSeries({
                id: lastLine[5],
                minPointLength: 5,
                name: 'Triples',
                data: triples,
                stack: lastLine[15],
                linkedTo: 'triples',
                color: '#7CA9F4'
            },false)
      
            chart.redraw();
        }
    });
}

function drawCompleteness(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            var dataComp = []
            for(var j = 1; j<lines.length; j++){
                line = lines[j].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                data = [date_utc,parseFloat(line[57])]
                dataComp.push(data)
            }
            chart.addSeries({
                name : lastLine[5],
                data: dataComp,
            })
        }
    });
}

function drawAccuracy(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            var measurementsVoid = []
            var measurementsWhite = []
            var measurementsError = []
            var dataFP = []
            var dataIFP = []
            if (lastLine[88] === 'True'){
                document.getElementById('wrap-warning-acc').style.display = 'block'
                numLimit = lastLine[55].split(' ')[3]
                p = document.createElement('p')
                p.innerHTML = `The SPARQL endpoint of ${lastLine[5]} is limited to ${numLimit} triples.`
                document.getElementById('numTriplesLimit').appendChild(p)
            }
            for(var j = 1; j< lines.length; j++){
                line = lines[j].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                var voidLabel = lastLine[32].slice(0,(lastLine[32].indexOf('.'))+2)
                var voidLabel = parseFloat(voidLabel)
                data = [date_utc,voidLabel]
                measurementsVoid.push(data)
                var whiteSpace = lastLine[33].slice(0,(lastLine[33].indexOf('.'))+2)
                var whiteSpace = parseFloat(whiteSpace)
                data = [date_utc,whiteSpace]
                measurementsWhite.push(data)
                var literalProblem = lastLine[34] = lastLine[34].slice(0,(lastLine[34].indexOf('.'))+2)
                var literalProblem = parseFloat(literalProblem)
                data = [date_utc,literalProblem]
                measurementsError.push(data)
                var fp = lastLine[86] = lastLine[86].slice(0,(lastLine[86].indexOf('.'))+2)
                var fp = parseFloat(fp)
                data = [date_utc,fp]
                dataFP.push(data)
                var ifp = lastLine[87] = lastLine[87].slice(0,(lastLine[87].indexOf('.'))+2)
                var ifp = parseFloat(ifp)
                data = [date_utc,ifp]
                dataIFP.push(data)
            }

            chart.addSeries({
                id: lastLine[5],
                name : 'Empty label',
                data: measurementsVoid,
                stack: lastLine[15],
                linkedTo:'empty',
                color: '#7CA9F4',
            },false)

            chart.addSeries({
                id: lastLine[5],
                name : 'Label with whitespace at the beginning or the end',
                data: measurementsWhite,
                stack: lastLine[15],
                linkedTo:'whitespace',
                color:'#00ff83',
            },false)

            chart.addSeries({
                id: lastLine[5],
                name : 'Literal with datatype problem',
                data: measurementsError,
                stack: lastLine[15],
                linkedTo:'literal',
                color:'#ffc100'
            },false)

            chart.addSeries({
                id: lastLine[5],
                name : 'FP',
                data: dataFP,
                stack: lastLine[15],
                linkedTo:'fp',
                color:'	#ff5863'
            },false)

            chart.addSeries({
                id: lastLine[5],
                name : 'IFP',
                data: dataIFP,
                stack: lastLine[15],
                linkedTo:'ifp',
                color:'#555555'
            },false)

            chart.redraw();
       }
    });
}

function drawSingleCons(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            analysisDate = []
            if (lastLine[88] === 'True'){
                document.getElementById('wrap-warning-cons').style.display = 'block'
                numLimit = lastLine[55].split(' ')[3]
                p = document.createElement('p')
                p.innerHTML = `The SPARQL endpoint of ${lastLine[5]} is limited to ${numLimit} triples.`
                document.getElementById('numTriplesLimitCons').appendChild(p)
            }
            for(var i = 1; i<lines.length; i++){
				line = lines[i].split(',')
				analysisDate.push(line[0])
			}
            $( "#datepickerCons" ).datepicker({
                dateFormat:"yy-mm-dd",
                beforeShowDay: function(date){
                    var sdate = $.datepicker.formatDate('yy-mm-dd',date)
                    if($.inArray(sdate,analysisDate) != -1){
                        return[true]
                    }
                    return[false]
                }
            });
            $("#datepickerCons").datepicker("setDate",lastLine[0])
            lastLine[37] = lastLine[37].slice(0,(lastLine[37].indexOf('.'))+2)
            lastLine[38] = lastLine[38].slice(0,(lastLine[38].indexOf('.'))+2)
            lastLine[39] = lastLine[39].slice(0,(lastLine[39].indexOf('.'))+2)
            lastLine[42] = lastLine[42].slice(0,(lastLine[42].indexOf('.'))+2)
            lastLine[41] = lastLine[41].slice(0,(lastLine[41].indexOf('.'))+2) 
            dataSeries = [parseFloat(lastLine[37]),parseFloat(lastLine[38]),parseFloat(lastLine[39]),parseFloat(lastLine[42]),parseFloat(lastLine[41])]
            
            chart.addSeries({
                name : lastLine[5],
                data: dataSeries,
            },false)

            chart.redraw()
        }
    });
}

function drawSingleAcc(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            analysisDate = []
			for(var i = 1; i<lines.length; i++){
				line = lines[i].split(',')
				analysisDate.push(line[0])
			}
            $( "#datepickerAcc" ).datepicker({
                dateFormat:"yy-mm-dd",
                beforeShowDay: function(date){
                    var sdate = $.datepicker.formatDate('yy-mm-dd',date)
                    if($.inArray(sdate,analysisDate) != -1){
                        return[true]
                    }
                    return[false]
                }
            });
            $("#datepickerAcc").datepicker("setDate",lastLine[0])
            dataVoid = []
			dataWhitespace = []
			datatypeLiteral = []
            if (lastLine[88] === 'True'){
                document.getElementById('wrap-warning-acc').style.display = 'block'
                numLimit = lastLine[55].split(' ')[3]
                p = document.createElement('p')
                p.innerHTML = `The SPARQL endpoint of ${line[5]} is limited to ${numLimit} triples.`
                document.getElementById('numTriplesLimit').appendChild(p)
            }
            var tab_date = lastLine[0].split('-')
            var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
            lastLine[32] = lastLine[32].slice(0,(lastLine[32].indexOf('.'))+2)
            lastLine[33] = lastLine[33].slice(0,(lastLine[33].indexOf('.'))+2)
            lastLine[34] = lastLine[34].slice(0,(lastLine[34].indexOf('.'))+2)
            lastLine[86] = lastLine[86].slice(0,(lastLine[86].indexOf('.'))+2)
            lastLine[87] = lastLine[87].slice(0,(lastLine[87].indexOf('.'))+2)
            data = [parseFloat(lastLine[32]),parseFloat(lastLine[33]),parseFloat(lastLine[34]),parseFloat(lastLine[86]),parseFloat(lastLine[87])]

            chart.addSeries({
                name:lastLine[5],
                data: data,
            },false)

            chart.redraw()
        }
    });
}

function drawConsistency(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var date = []
            var dataSeries = []
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            dataDisj = []
            dataUndefC = []
            dataUndefP = []
            dataDeprec = []
            dataMissP = []
            dataMissC = []
            if (lastLine[88] === 'True'){
                document.getElementById('wrap-warning-cons').style.display = 'block'
                numLimit = lastLine[55].split(' ')[3]
                p = document.createElement('p')
                p.innerHTML = `The SPARQL endpoint of ${lastLine[5]} is limited to ${numLimit} triples.`
                document.getElementById('numTriplesLimitCons').appendChild(p)
            }
            for(var j = 1; j< lines.length; j++){
                line = lines[j].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                lastLine[37] = lastLine[37].slice(0,(lastLine[37].indexOf('.'))+2)
                lastLine[38] = lastLine[38].slice(0,(lastLine[38].indexOf('.'))+2)
                lastLine[39] = lastLine[39].slice(0,(lastLine[39].indexOf('.'))+2)
                lastLine[42] = lastLine[42].slice(0,(lastLine[42].indexOf('.'))+2)
                lastLine[41] = lastLine[41].slice(0,(lastLine[41].indexOf('.'))+2) 
                data = [date_utc,parseFloat(line[37])]
                dataUndefC.push(data)
                data = [date_utc,parseFloat(line[38])]
                dataUndefP.push(data)
                data = [date_utc,parseFloat(line[39])]
                dataDeprec.push(data)
                data = [date_utc,parseFloat(line[41])]
                dataMissP.push(data)
                data = [date_utc,parseFloat(line[42])]
                dataMissC.push(data) 
            }
        
          chart.addSeries({
              id:lastLine[5],
              name : 'Undefined class',
              data: dataUndefC,
              stack: lastLine[15],
              linkedTo: 'undefC',
              color: '#2f7ed8',
          },false)

          chart.addSeries({
              id:lastLine[5],
              name : 'Undefined property',
              data: dataUndefP,
              stack: lastLine[15],
              linkedTo:'undefP',
              color:'#f28f43',
          },false)

          chart.addSeries({
              id:lastLine[5],
              name : 'Deprecated class/property',
              data: dataDeprec,
              stack: lastLine[15],
              linkedTo: 'deprec',
              color:'#c42525',
          },false)

          chart.addSeries({
              id:lastLine[5],
              name : 'Misplaced property',
              data: dataMissP,
              stack: lastLine[15],
              linkedTo: 'misP',
              color: '#a6c96a',
          },false)

          chart.addSeries({
              id:lastLine[5],
              name : 'Misplaced class',
              data: dataMissC,
              stack: lastLine[15],
              linkedTo: 'misC',
              color:'#0eff00',
          },false)

          chart.redraw()
        }
    });
}

function drawUnderstend(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            dataUnd = []
            for(var i = 1; i < lines.length; i++){
                line = lines[i].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                percentage = (parseInt(line[78])/parseInt(line[14])) * 100
                percentage = percentage.toFixed(2)
                data = [date_utc,parseFloat(percentage)]
                dataUnd.push(data)
            }

          chart.addSeries({
              name: lastLine[5],
              data: dataUnd
          })
        }
    });
}

function drawUnderTab1(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            analysisDate = []
            for(var i = 1; i<lines.length; i++){
				line = lines[i].split(',')
				analysisDate.push(line[0])
			}
            $( "#datepickerUnder" ).datepicker({
                dateFormat:"yy-mm-dd",
                beforeShowDay: function(date){
                    var sdate = $.datepicker.formatDate('yy-mm-dd',date)
                    if($.inArray(sdate,analysisDate) != -1){
                        return[true]
                    }
                    return[false]
                }
            });
            $("#datepickerUnder").datepicker("setDate",lastLine[0])
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            td4 = document.createElement('td')
            vocabs = occurrences(lastLine[44],';')
            if(!isNaN(vocabs) && vocabs > 0)
                vocabs = vocabs +1
            else
             vocabs = '-'
            td5 = document.createElement('td')
            td6 = document.createElement('td')
            td1.innerHTML = lastLine[5]
            td2.innerHTML = lastLine[78]
            percentage =  (parseInt(lastLine[78])/parseInt(lastLine[14])) * 100
            if(!isNaN(parseFloat(percentage))){
                percentage = percentage.toFixed(2)
                percentage = percentage+'%' 
                td3.innerHTML = percentage
            }else
                td3.innerHTML = '-'

            td4.innerHTML = lastLine[79]
            td5.innerHTML = lastLine[80]
            td6.innerHTML = vocabs
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
            tr.appendChild(td6)
        }
    });
}

function drawUnderTab2(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            td4 = document.createElement('td')
            vocabs = occurrences(lastLine[44],';')
            if(!isNaN(vocabs) && vocabs > 0)
                vocabs = vocabs +1
            else
             vocabs = '-'
            td1.innerHTML = lastLine[5]
            td2.innerHTML = lastLine[79]
            td3.innerHTML = lastLine[80]
            td4.innerHTML = vocabs
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
        }
    });
}

function drawCompletenessTab(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            analysisDate = []
            for(var i = 1; i<lines.length; i++){
				line = lines[i].split(',')
				analysisDate.push(line[0])
			}
            $( "#datepickerComp" ).datepicker({
                dateFormat:"yy-mm-dd",
                beforeShowDay: function(date){
                    var sdate = $.datepicker.formatDate('yy-mm-dd',date)
                    if($.inArray(sdate,analysisDate) != -1){
                        return[true]
                    }
                    return[false]
                }
            });
            $("#datepickerComp").datepicker("setDate",lastLine[0])
            td = document.createElement('td')
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            td4 = document.createElement('td')
            td.innerHTML = lastLine[5]
            td1.innerHTML = lastLine[14]
            td2.innerHTML = lastLine[58]
            td3.innerHTML = lastLine[57]
            numLinked = parseInt(lastLine[58])
            numTriples = parseInt(lastLine[14])
            percentage = (numLinked/numTriples) * 100
            percentage = percentage.toFixed(2)
            if(!isNaN(percentage) && numTriples > 0){
                td4.innerHTML = percentage + '%'
            }
            else{
                td4.innerHTML = 'Insufficient data'
            }
            tr.appendChild(td)
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)

        }
    });
}

function drawConciseness(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            dataIntC = []
            dataExC = []
            if (lastLine[88] === 'True'){
                document.getElementById('wrap-warning-conc').style.display = 'block'
                numLimit = lastLine[55].split(' ')[3]
                p = document.createElement('p')
                p.innerHTML = `The SPARQL endpoint of ${lastLine[5]} is limited to ${numLimit} triples.`
                document.getElementById('numTriplesLimitConc').appendChild(p)
            }
            for(var j = 1; j< lines.length; j++){
                line = lines[j].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                exC = parseFloat(line[55].split(' ')[0])
                intC = parseFloat(line[56].split(' ')[0])
                exC = exC.toFixed(3)
                intC = intC.toFixed(3)
                data1 = [date_utc,parseFloat(exC)]
                dataExC.push(data1)
                data2 = [date_utc,parseFloat(intC)]
                dataIntC.push(data2)
            }

            chart.addSeries({
                id: lastLine[5],
                name : 'Intensional conciseness',
                data: dataIntC,
                stack: lastLine[15],
                linkedTo: 'intC',
                color:'#0086ad'
            },false)

            chart.addSeries({
                id: lastLine[5],
                name : 'Extensional conciseness',
                data: dataExC,
                stack: lastLine[15],
                linkedTo: 'exC',
                color:'#ff9a00'
            },false)


            chart.redraw()
        }
    });
}

function drawConcisenessTab(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            analysisDate = []
            for(var i = 1; i<lines.length; i++){
				line = lines[i].split(',')
				analysisDate.push(line[0])
			}
            $( "#datepickerConci" ).datepicker({
                dateFormat:"yy-mm-dd",
                beforeShowDay: function(date){
                    var sdate = $.datepicker.formatDate('yy-mm-dd',date)
                    if($.inArray(sdate,analysisDate) != -1){
                        return[true]
                    }
                    return[false]
                }
            });
            if (lastLine[88] === 'True'){
                document.getElementById('wrap-warning-conc').style.display = 'block'
                numLimit = lastLine[55].split(' ')[3]
                p = document.createElement('p')
                p.innerHTML = `The SPARQL endpoint of ${lastLine[5]} is limited to ${numLimit} triples.`
                document.getElementById('numTriplesLimitConc').appendChild(p)
            }
            $("#datepickerConci").datepicker("setDate",lastLine[0])
            exC = lastLine[55].split(' ')[0]
            intC = lastLine[56].split(' ')[0]
            exC = parseFloat(exC)
            intC = parseFloat(intC)
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            if(!isNaN(intC)){
                td1.innerHTML = lastLine[5]
                td3.innerHTML = intC.toFixed(3)
            }else{
                td1.innerHTML = lastLine[5]
                td3.innerHTML = '-'
            }
            if(!isNaN(exC)){
                td1.innerHTML = lastLine[5]
                td2.innerHTML = exC.toFixed(3)
            }     
            else{
                td1.innerHTML = lastLine[5]
                td2.innerHTML = '-'
            }
            console.log(intC)
            console.log(exC)
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
        }
    });
}

function drawDump(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var date = []
            var dataSeries = []
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            var measurements = []
            for(var j = 1; j< lines.length; j++){
                line = lines[j].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                data = [date_utc,parseInt(line[2])]
                measurements.push(data)
            }
            chart.addSeries({
                name : lastLine[5],
                data: measurements
            },false)
            chart.redraw()
        }
    });
}

function drawLatency(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var date = []
            var dataSeries = []
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            var measurements = []
            for(var j = 1; j< lines.length; j++){
                line = lines[j].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                data = [date_utc,parseFloat(line[16]),parseFloat(line[17]),parseFloat(line[18]),parseFloat(line[19]),parseFloat(line[20])]
                measurements.push(data)
            }
            chart.addSeries({
                name : lastLine[5],
                data: measurements
            })
        }
    });
}

function drawTP(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var date = []
            var dataSeries = []
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            var measurements = []
            for(var j = 1; j< lines.length; j++){
                line = lines[j].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                dataT = [date_utc,parseFloat(line[21]),parseFloat(line[22]),parseFloat(line[23]),parseFloat(line[24]),parseFloat(line[25])]
                measurements.push(dataT)
            }
            chart.addSeries({
                name : lastLine[5],
                data: measurements
            })
        }
    });
}

function drawLengthS(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            analysisDate = []
            for(var i = 1; i<lines.length; i++){
				line = lines[i].split(',')
				analysisDate.push(line[0])
			}
            $( "#datepickerRepConci" ).datepicker({
                dateFormat:"yy-mm-dd",
                beforeShowDay: function(date){
                    var sdate = $.datepicker.formatDate('yy-mm-dd',date)
                    if($.inArray(sdate,analysisDate) != -1){
                        return[true]
                    }
                    return[false]
                }
            });
            $("#datepickerRepConci").datepicker("setDate",lastLine[0])

            dataLengthS = []
            var tab_date = lastLine[0].split('-')
            var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
            data = [date_utc,parseInt(lastLine[61]),parseInt(lastLine[62]),parseInt(lastLine[63]),parseInt(lastLine[64]),parseInt(lastLine[65])]
            dataLengthS.push(data)
     
            chart.addSeries({
                name: lastLine[5],
                data: dataLengthS,
            })
        }
    });
}

function drawLengthP(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            dataLengthP = []
            var tab_date = lastLine[0].split('-')
            var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
            data = [date_utc,parseInt(lastLine[66]),parseInt(lastLine[67]),parseInt(lastLine[68]),parseInt(lastLine[69]),parseInt(lastLine[70])]
            dataLengthP.push(data)
            chart.addSeries({
                name: lastLine[5],
                data: dataLengthP,
            })
        }
    });
}

function drawLengthO(id,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            dataLengthO = []
            var tab_date = lastLine[0].split('-')
            var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
            data = [date_utc,parseInt(lastLine[71]),parseInt(lastLine[72]),parseInt(lastLine[73]),parseInt(lastLine[74]),parseInt(lastLine[75])]
            dataLengthO.push(data)
            chart.addSeries({
                name: lastLine[5],
                data: dataLengthO,
            })
        }
    });
}

function drawBeliev(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            trustValue = parseFloat(lastLine[9]);
            tdN = document.createElement('td')
            tdTrust = document.createElement('td')
            tdN.innerHTML = lastLine[5]
            tdTrust.innerHTML = trustValue
            tr.appendChild(tdN)
            tr.appendChild(tdTrust)
        }
    })
}

function drawAvEndpoint(id,div){
    Highcharts.chart({
        chart:{
        type : 'line',
        renderTo: div,
        },
        title: {
            style:{
                fontSize:'28px',
                fontWeight:'bold'
            },
            text: 'Availability of SPARQL endpoint',
        },
        subtitle: {
            text:id,
            style:{
            fontSize:'24px'
            }
        },
        yAxis: {
            title: {
                text: 'Status'
            }
        },
        
        rangeSelector: {
            enabled:true
        },

        data: {
            enablePolling: true,
            csvURL: './CSVforJS/'+id+'.csv',
            complete: function(options) {
            options.series = options.series.filter(data => data.name === 'SPARQL endpoint')
            }
        },
  
        legend:{
            itemStyle: {
                fontSize:'15px',
                font: '13pt Trebuchet MS, Verdana, sans-serif',
                color: '#A0A0A0'
            },
            enabled: true,
            layout : 'vertical',
            labelFormatter: function (){
            return 'SPARQL endpoint status:<br>'+'<p style="color:#fd5e53">Absent:-1</p>&nbsp &nbsp;<p style="color:#fd5e53">Offline:0</p>&nbsp &nbsp;<p style="color:#90ed7d">Online:1</p>';
            }
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true
                }
            }
        },
        series: [{
            lineWidth: 3,
            zones:[{
                value: 0.98,
                color: '#fd5e53'
            },
            { 
                color: '#90ed7d'
            }
          ]}, 
        {
            color: '#c4392d',
        },
      ]
    });
}

function drawAvDump(id,div){
    Highcharts.chart({
        chart:{
            type : 'line',
            renderTo: div,
        },
        title: {
            style:{
                fontSize:'28px',
                fontWeight:'bold'
            },
            text: 'Availability of RDF dump',
        },
        subtitle: {
            text:id,
            style:{
                fontSize:'24px'
            }
        },
        yAxis: {
            title: {
                text: 'Status'
            }
        },
        rangeSelector: {
            enabled:true
        },
        data: {
            enablePolling: true,
            csvURL: './CSVforJS/'+id+'.csv',
            complete: function(options) {
            options.series = options.series.filter(data => data.name === 'RDF dump')
            }
        },
  
        legend:{
            itemStyle: {
                fontSize:'15px',
                font: '13pt Trebuchet MS, Verdana, sans-serif',
                color: '#A0A0A0'
            },
            enabled: true,
            layout : 'vertical',
            labelFormatter: function (){
                return 'RDF dump status:<br>'+'<p style="color:#fd5e53">Absent:-1</p>&nbsp &nbsp;<p style="color:#fd5e53">Offline:0</p>&nbsp &nbsp;<p style="color:#90ed7d">Online:1</p>';
            }
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true
                }
            }
        },
        series: [{
            lineWidth: 3,
            zones:[{
                value: 0.98,
                color: '#fd5e53'
            },
            { 
                color: '#90ed7d'
            }
            ]}, 
          {
              color: '#c4392d',
          },
      ]
    });
}

function drawVolatility(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
  
        function processData(data) {
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            td = document.createElement('td')
            td2 = document.createElement('td')
            td.innerHTML = lastLine[5]
            td2.innerHTML = lastLine[50]
            tr.appendChild(td)
            tr.appendChild(td2)
        }    
    })
}

function drawCurrency(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
  
        function processData(data) {
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            td = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            td4 = document.createElement('td')
            td5 = document.createElement('td')
            td6 = document.createElement('td')
            td.innerHTML = lastLine[5]
            td2.innerHTML = lastLine[51]
            td3.innerHTML = lastLine[52]
            td4.innerHTML = lastLine[53]
            precentageUp = (parseInt(lastLine[53])/parseInt(lastLine[14])) * 100
            precentageUp = precentageUp.toFixed(2)
            if (!isNaN(precentageUp))
                precentageUp = precentageUp + '%'
            else
                precentageUp = 'Insufficient data'
            td5.innerHTML = precentageUp
            
            days = lastLine[54]
            days = parseInt(days)
            if(isNaN(days))
                td6.innerHTML = 'Insufficient data'
            else
                td6.innerHTML = days + ' (days)'
            
            tr.appendChild(td)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
            tr.appendChild(td6)
        }
    })
}

function drawLic(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
      
        function processData(data) {
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            tableCell = document.createElement('td')
            tableCell2 = document.createElement('td')
            tableCell3 = document.createElement('td')
            tableCellM = document.createElement('td')
            tableCell.innerHTML = lastLine[5]
            tableCell2.innerHTML = lastLine[3]
            tableCell3.innerHTML = lastLine[4]
            if(lastLine[89] == '[]')
                tableCellM.innerHTML = 'Not indicated'
            else
                tableCellM.innerHTML = lastLine[89]
            tr.appendChild(tableCell)
            tr.appendChild(tableCell2)
            tr.appendChild(tableCellM)
            tr.appendChild(tableCell3)
        }
    })
}

function drawVerifiability(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
  
        function processData(data) {
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            td4 = document.createElement('td')
            td5 = document.createElement('td')
            td6 = document.createElement('td')
            td7 = document.createElement('td')
            td1.innerHTML = lastLine[5]
            if (lastLine[44] == '[]')
                vocabs = 0
            else if ((lastLine[44] != 'endpoint offline') && (lastLine[44] != 'endpoint absent') && (lastLine[44].search('Could') == -1) && (lastLine[44].search('Could') == -1) && (lastLine[44] != 'Not indicated')){
                vocabs = occurrences(lastLine[44],';')
                vocabs = vocabs + 1
            } 
            else
                vocabs = lastLine[44]
            td2.innerHTML = vocabs
            td3.innerHTML = lastLine[45]
            if (lastLine[46] == '[]')
                publishers = 0
            else if ((lastLine[46] != 'endpoint offline') && (lastLine[46] != 'endpoint absent') && (lastLine[46].search('Could') == -1) && (lastLine[46].search('Could') == -1) && (lastLine[46] != 'Not indicated') && (lastLine[46].search('Error') == -1)){
                publishers = occurrences(lastLine[46],';')
                publishers = publishers + 1
            } 
            else
                publishers = lastLine[46]
            td4.innerHTML = publishers

            if (lastLine[47] == '[]')
                contributors = 0
            else if ((lastLine[47] != 'endpoint offline') && (lastLine[47] != 'endpoint absent') && (lastLine[47].search('Could') == -1) && (lastLine[47].search('Could') == -1) && (lastLine[47] != 'Not indicated') && (lastLine[47].search('Error') == -1)){
                contributors = occurrences(lastLine[47],';')
                contributors = contributors + 1
            } 
            else
                contributors = lastLine[47]
            
            td5.innerHTML = contributors
            td6.innerHTML = lastLine[48]
            td7.innerHTML = lastLine[49]
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
            tr.appendChild(td6)
            tr.appendChild(td7)
        }
    })
}

function drawTabCons(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
  
        function processData(data) {
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            tableCell = document.createElement('td')
            tableCell2 = document.createElement('td')
            tableCell3 = document.createElement('td')
            tableCell3.innerHTML = lastLine[5]
            tableCell.innerHTML = lastLine[36]
            tableCell2.innerHTML = lastLine[40]
            tr.appendChild(tableCell3)
            tr.appendChild(tableCell)
            tr.appendChild(tableCell2)
        }
    })
}

function drawTableInt(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
  
        function processData(data) {
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            td4 = document.createElement('td')
            td5 = document.createElement('td')
            td6 = document.createElement('td')
            td1.innerHTML = lastLine[5]
            td2.innerHTML = lastLine[13]
            td3.innerHTML = lastLine[10]
            td4.innerHTML = lastLine[11]
            td5.innerHTML = lastLine[12]
            td6.innerHTML = lastLine[43]
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
            tr.appendChild(td6)
        }
    })
}

function drawTabIanctive(id,tr){
        $(document).ready(function() {
            $.ajax({
                type: "GET",
                url: './CSVforJS/'+id+'.csv',
                dataType: "text",
                success: function(data) {processData(data)}
            });
      
            function processData(data) {
                var lines = data.trim().split('\n');
                var lastLine = lines[lines.length - 1].split(',');
                td1 = document.createElement('td')
                td2 = document.createElement('td')
                td1.innerHTML = lastLine[5]
                td2.innerHTML = '-' //TODO INSERT INACTIVE LINKS VALUE
                tr.appendChild(td1)
                tr.appendChild(td2)
            }
        })
}

function drawTableSec(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
  
        function processData(data) {
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            td1.innerHTML = lastLine[5]
            td2.innerHTML = lastLine[27]
            td3.innerHTML = lastLine[26]
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
        }
    })
}

function drawInter(div,data){ 
    Highcharts.chart({
        chart:{
            type : 'networkgraph',
            renderTo: div,
          },
          title: {
              style:{
                  fontSize:'30px',
                  fontWeight:'bold'
              },
              text: 'Interlinking',
          },
          subtitle: {
            style:{
                fontSize:'18px',
            },
            align: 'center',
            text: 'Induced graph starting from the selected nodes.'
        },
          plotOptions: {
              networkgraph: {
                  keys: ['from', 'to'],
                  layoutAlgorithm: {
                      enableSimulation: true,
                      friction: -0.9
                  }
              }
          },
          tooltip: {
            formatter: function() {
                for(var i = 0; i<fullName.length;i++){
                    id = fullName[i].trim().slice(0, fullName[i].indexOf(' '))
                    filename = this.point.name.replaceAll('[\\/*?:"<>|]','')
                    filename = filename.replaceAll('-','')
                    filename = filename.replaceAll(' ','')
                    filename = filename.toLowerCase()
                    if(id == filename){
                        name = fullName[i].trim().slice(fullName[i].indexOf(' '));
                        lastIndex = name.lastIndexOf(" ");
                            name = name.substring(0,lastIndex);
                        n = fullName[i].lastIndexOf(" ");
                        score = fullName[i].substring(n+1)
                        score = score.trim()
                        score = parseFloat(score)
                        var text = '<b>KG name:</b> ' + name + '<br>' +
                                    '<b>Score:</b>' + score;
                        return text
                    }
                    else{
                        text = this.point.name	
                    }
                }
              return text;
            }
          },
          series: [{
              dataLabels: {
                  enabled: true,
                  linkFormat: ''
              },
              id: 'Graph',
              marker: {
                  radius: 20
              },
              data: data,
          }]
    });

   
}

function drawIntPie(id,div){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data) {
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            sameAs = parseInt(lastLine[13]);
            numTriples = parseInt(lastLine[14]);
            Highcharts.chart({
                chart: {
                    renderTo:div,
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    style:{
                        fontSize:'30px',
                        fontWeight:'bold'
                    },
                    text: 'SameAs chains',
                },
                subtitle: {
                    text:id,
                    style:{
                        fontSize:'24px'
                    },
                },
                plotOptions: {
                    pie: {
                       allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                series: [{
                    name: 'Data in the graph',
                    data: [{
                        name: 'Number of sameAs chains',
                        color:'#90ed7d',
                        y: sameAs,
                        sliced: true,
                        selected: true
                    }, {
                        name: 'Other triples',
                        y: numTriples,
                        color:'#0090eacc'
                      }
                    ]}]
            });
        }
    });
}

function drawSec(id,div){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data) {
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            if ($('#'+div.id).children().length == 0){
                  $('#'+div.id).append('<p id=tableTitle style="font-size:25px; font-weight:bold;">'+lastLine[5]+'</p>');
                  $('#'+div.id).append('<table id=tabSec ><tr><th>' + "Use HTTPS on the SPARQL endpoint" + '</th><th>Requires authentication to do query<th></tr><tr><td>' + lastLine[27] + '</td><td>' +lastLine[26]+ '</td></tr></table>');
            }
        }
    })
}

function drawPerfLatency(id,div){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            var date = []
            var measurements = []
            for(var i = 1; i< lines.length; i++){
                line = lines[i].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                data = [date_utc,parseFloat(line[16]),parseFloat(line[17]),parseFloat(line[18]),parseFloat(line[19]),parseFloat(line[20])]
                measurements.push(data)
            }
          Highcharts.chart({
              chart: {
                  renderTo:div,
                  type: 'boxplot'
              },
              title: {
                  style:{
                      fontSize:'30px',
                      fontWeight:'bold'
                  },
                  text: 'Latency'
              },

              subtitle: {
                  text:lastLine[5],
                  style:{
                      fontSize:'24px'
                  }
              },
              rangeSelector: {
                  enabled:true
              },
              legend: {
                  enabled: false
              },
    
              xAxis: {
                  type:'datetime',
              },
    
              yAxis: {
                  title: {
                      text: 'Observations'
                  },
              },
              series: [{
                  name: 'Observations',
                  data: measurements,
                  tooltip: {
                      headerFormat: '<em>Date: {point.key}</em><br/>'
                  }
                  },{
                  name: 'Outliers',
                  color: Highcharts.getOptions().colors[0],
                  type: 'scatter',
                  data: [ // x, y positions where 0 is the first category
                ],
                marker: {
                    fillColor: 'white',
                    lineWidth: 1,
                    lineColor: Highcharts.getOptions().colors[0]
                },
                tooltip: {
                    pointFormat: 'Observation: {point.y}'
                }
              }]
          });
        }
    })
}

function drawPerfTP(id,div){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            var date = []
            var measurementsT = []
            for(var i = 1; i<lines.length; i++){
                line = lines[i].split(',')
                var tab_date = line[0].split('-')
                var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                dataT = [date_utc,parseFloat(line[21]),parseFloat(line[22]),parseFloat(line[23]),parseFloat(line[24]),parseFloat(line[25])]
                measurementsT.push(dataT)
            }

            Highcharts.chart({
                chart: {
                    renderTo:div,
                    type: 'boxplot'
                },
      
                title: {
                    style:{
                        fontSize:'30px',
                        fontWeight:'bold'
                    },
                    text: 'Throughput'
                },

                subtitle: {
                    text:lastLine[5],
                    style:{
                        fontSize:'24px'
                    }
                },

                rangeSelector: {
                    enabled:true
                },
        
                legend: {
                    enabled: false
                },
        
                xAxis: {
                    type:'datetime'
                },
        
                yAxis: {
                    title: {
                        text: 'Observations'
                    },
                },
        
                series: [{
                    name: 'Observations',
                    data: measurementsT,
                    tooltip: {
                        headerFormat: '<em>Date: {point.key}</em><br/>'
                    }
                }, {
                    name: 'Outliers',
                    color: Highcharts.getOptions().colors[0],
                    type: 'scatter',
                    data: [ // x, y positions where 0 is the first category
                    
                    ],
                    marker: {
                        fillColor: 'white',
                        lineWidth: 1,
                        lineColor: Highcharts.getOptions().colors[0]
                    },
                    tooltip: {
                        pointFormat: 'Observation: {point.y}'
                    }
                }]
            });
        }
    })
}

function drawRepCons(id,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            if(lastLine[76] != 'No new vocabulary defined'){
                numNewVoc = occurrences(lastLine[76],';')
                if(!isNaN(numNewVoc) && numNewVoc > 0)
                    numNewVoc = numNewVoc +1
                if(isNaN(numNewVoc) || numNewVoc == 0)
                    numNewVoc = '-'
            }
            else
                numNewVoc = 0
            
            if(lastLine[77] != 'No new term defined'){
                numNewTerms = occurrences(lastLine[77],';')
                if(!isNaN(numNewTerms) && numNewTerms > 0)
                    numNewTerms = numNewTerms +1 
                if(isNaN(numNewTerms) || numNewTerms == 0)
                    numNewTerms = '-'
            }
            else
                numNewTerms = 0

            td1.innerHTML = lastLine[5]
            td2.innerHTML = numNewVoc
            td3.innerHTML = numNewTerms
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
        }
    });
}

function convertToValidFilename(string) {
    return (string.replace(/[\/|\\:*?"<>-]/g, ""));
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

function exportTableToCSV(filename,id) {
    var csv = [];
    var c = document.getElementById(id)
    var rows = c.querySelectorAll('table tr')
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++){
            if((cols[j].innerText) != '?' )
                row.push(cols[j].innerText);
        }
            
        
        csv.push(row.join(","));        
  }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

function hideDiv(){
    document.getElementById('exportDef-btn').style.display = 'none' 
    document.getElementById('containerDef').style.display = 'none' 
    document.getElementById('exportIanctive-btn').style.display = 'none'
    document.getElementById('exportDump-btn').style.display = 'none'
    document.getElementById('exportSPARQL-btn').style.display = 'none'
    document.getElementById('containerAvDump').style.display = 'none'
    document.getElementById('containerAvSPARQL').style.display = 'none'
    document.getElementById('containerInactiveL').style.display = 'none'
    document.getElementById('downloadWrap').style.display = 'none'
    document.getElementById('wrap-warning-conc').style.display = 'none'
    document.getElementById('wrap-warning-cons').style.display = 'none'
    document.getElementById('wrap-warning-acc').style.display = 'none'
    document.getElementById('wrapSwitchScore').style.display = 'none'
    document.getElementById('exportScore-btn').style.display = 'none'
    document.getElementById('wrapScore').style.display = 'none'
    document.getElementById('wrapSwitchAcc').style.display = 'none'
    document.getElementById('labelDatAcc').style.display = 'none'
    document.getElementById('labelDatInterp').style.display = 'none'
    document.getElementById('labelDatUnder').style.display = 'none'
    document.getElementById('labelDatAmount').style.display = 'none'
    document.getElementById('labelDatComp').style.display = 'none'
    document.getElementById('labelDatConci').style.display = 'none'
    document.getElementById('labelDatCons').style.display = 'none'
    document.getElementById('historyCurr').style.display = 'none'
    document.getElementById('exportVers').style.display = 'none'
    document.getElementById('understendability').style.display = 'none'
    document.getElementById('wrap-tabUnd').style.display = 'none'
    document.getElementById('amountOfData').style.display = 'none'
    document.getElementById('exportComp-btn').style.display = 'none'
    document.getElementById('wrap-compTab').style.display = 'none'
    document.getElementById('completeness').style.display = 'none'
    document.getElementById('concisenessTab').style.display = 'none'
    document.getElementById('currency').style.display = 'none'
    document.getElementById('exportCurr-btn').style.display = 'none'
    document.getElementById('exportSec-btn').style.display = 'none'
    document.getElementById('exportInt-btn').style.display = 'none'
    document.getElementById('exportLic-btn').style.display = 'none'
    document.getElementById('wrapSec').style.display = 'none'
    document.getElementById('wrapT').style.display = 'none'
    document.getElementById('wrapBeliev').style.display = 'none'
    document.getElementById('wrapLic').style.display = 'none'
    document.getElementById('interlinking').style.display = 'none'
    document.getElementById('wrap-tableInt').style.display = 'none'
    document.getElementById('performanceL').style.display = 'none'
    document.getElementById('performanceT').style.display = 'none'
    document.getElementById('accuracy').style.display = 'none'
    document.getElementById('wrapSwitchCons').style.display = 'none'
    document.getElementById('wrapTab-cons').style.display = 'none'
    document.getElementById('exportCons-btn').style.display = 'none'
    document.getElementById('consistency').style.display = 'none'
    document.getElementById('exportVerif-btn').style.display = 'none'
    document.getElementById('verifiability').style.display = 'none'
    document.getElementById('exportVol-btn').style.display = 'none'
    document.getElementById('volatility').style.display = 'none'
    document.getElementById('exportConc-btn').style.display = 'none'
    document.getElementById('wrapSwitchConc').style.display = 'none'
    document.getElementById('conciseness').style.display = 'none'
    document.getElementById('wrapSwitchComp').style.display = 'none'
    document.getElementById('wrapSwitchAmount').style.display = 'none'
    document.getElementById('wrap-repConc').style.display = 'none'
    document.getElementById('exportComp-btn').style.display = 'none'
    document.getElementById('exportRepCons-btn').style.display = 'none'
    document.getElementById('wrap-repCons').style.display = 'none'
    document.getElementById('wrapSwitchUnd').style.display = 'none'
    document.getElementById('wrap-tabUnd2').style.display = 'none'
    document.getElementById('exportUnd1').style.display = 'none'
    document.getElementById('exportUnd2').style.display = 'none'
    document.getElementById('wrapSwitchUnd').style.display = 'none'
    document.getElementById('wrapSwitchInterp').style.display = 'none'
    document.getElementById('interpretability').style.display = 'none'
    document.getElementById('exportInterp').style.display = 'none'
    document.getElementById('wrapTabInter').style.display = 'none'
    document.getElementById('versatility').style.display = 'none'
}

function changeDataCons(dataSelected,ids){
    chartCons = Highcharts.chart('consistency', {
        chart: {
            polar: true,
            type: 'line'
        },

        title: {
            style:{
                fontSize:'30px',
                fontWeight:'bold'
            },
            text: 'Consistency'
        },
    
        pane: {
            size: '95%'
        },
    
        xAxis: {
            categories: ['Undef.Cls', 'Undef. Prp.', 'Deprecated Cls./Prp.',
                'Misspl. Cls', 'Misspl. Prp.'],
            lineWidth: 0,
            tickmarkPlacement: 'on',
        },
    
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            max: 1,
            plotLines: [{ 
                width:2,
                value: 1,
                color: '#28FF49',
                label: { 
                    style:{
                        color:'#0090eacc',
                        fontSize:'15px',
                        fontWeight:'bold'
                    },
                text: 'Best value: 1', // Content of the label. 
                align: 'left', // Positioning of the label. 
                }
            }],
        },
        tooltip:{
            shared:true
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'
                    },
                    pane: {
                        size: '70%'
                    }
                }
            }]
        }    
    });
    node = document.getElementById('numTriplesLimitCons')
    while (node.hasChildNodes()) {    //in order not to have duplicate alerts if we click again
        node.removeChild(node.lastChild);
    }
    for(var i = 0; i<ids.length;i++){
        addSeriesConsistency(ids[i],dataSelected,chartCons)
    }

    document.getElementById('tabCons').remove()
    table = document.createElement('table')
    table.className = "center"
    table.style.marginTop = '45px'
    table.id = 'tabCons'
    tableRow = document.createElement('tr')
    th = document.createElement('th')
    th1 = document.createElement('th')
    th2 = document.createElement('th')
    th3 = document.createElement('th')
    th.innerHTML = 'KG name'
    th1.innerHTML = 'Ontology hijacking'
    th2.innerHTML = 'Entity as member of disjoint class'
    th3.innerHTML = ' <a href="#popupCons" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
    table.appendChild(tableRow)
    tableRow.appendChild(th)
    tableRow.appendChild(th2)
    tableRow.appendChild(th1)
    tableRow.appendChild(th3)
    for(var i = 0; i<ids.length;i++){
        tr2 = document.createElement('tr')
        addRowCons(ids[i],tr2,dataSelected)
        table.appendChild(tr2)
    }
    wrapTab = document.getElementById('wrapTab-cons')
    if(wrapTab.children.length == 0)
        wrapTab.appendChild(table)
}

function changeDataAcc(dateSelected,ids){
    const chartAcc2 = Highcharts.chart('accuracy', {
        chart: {
            polar: true,
            type: 'line'
        },
        title: {
            style:{
                fontSize:'30px',
                fontWeight:'bold'
            },
            text: 'Accuracy'
        },

        pane: {
            size: '95%'
        },
        xAxis: {
            categories: ['Void label', 'Whitespace Problem', 'Literal datatype problem',
                'FP', 'IFP'],
            lineWidth: 0,
            tickmarkPlacement: 'on',
        },
    
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            max: 1,
            plotLines: [{ 
                width:2,
                value: 1,
                color: '#28FF49',
                label: { 
                    style:{
                        color:'#0090eacc',
                        fontSize:'15px',
                        fontWeight:'bold'
                    },
                text: 'Best value: 1', // Content of the label. 
                align: 'left', // Positioning of the label. 
                }
            }],
        },
        tooltip:{
            shared : true
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'
                    },
                    pane: {
                        size: '70%'
                    }
                }
            }]
        }    
    });
    node = document.getElementById('numTriplesLimit')
    while (node.hasChildNodes()) {    //in order not to have duplicate alerts if we click again
        node.removeChild(node.lastChild);
    }
    for(var i = 0; i<ids.length;i++){
        addSeriesAccuracy(ids[i],dateSelected,chartAcc2)
    }
}

function addSeriesAccuracy(id,dateSelected,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            dataVoid = []
			dataWhitespace = []
			datatypeLiteral = []
            for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dateSelected){
                    line[32] = line[32].slice(0,(line[32].indexOf('.'))+2)
                    line[33] = line[33].slice(0,(line[33].indexOf('.'))+2)
                    line[34] = line[34].slice(0,(line[34].indexOf('.'))+2)
                    line[86] = line[86].slice(0,(line[86].indexOf('.'))+2)
                    line[87] = line[87].slice(0,(line[87].indexOf('.'))+2)
                    data = [parseFloat(line[32]),parseFloat(line[33]),parseFloat(line[34]),parseFloat(line[86]),parseFloat(line[87])]
                    if (line[88] === 'True'){
                        document.getElementById('wrap-warning-acc').style.display = 'block'
                        numLimit = line[55].split(' ')[3]
                        p = document.createElement('p')
                        p.innerHTML = `The SPARQL endpoint of ${line[5]} is limited to ${numLimit} triples.`
                        document.getElementById('numTriplesLimit').appendChild(p)
                    }
                }
            }
            chart.addSeries({
                name:line[5],
                data: data,
            },false)
            
            chart.redraw()
        }
    });
}

function addRowCons(id,tr,dataSelected){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            KGname = '-'
            oh = '-'
            disjoint = '-'
            for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dataSelected){
                    KGname = line[5]
                    oh = line[40]
                    disjoint = line[36]
                    break;
                }
            }
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            td1.innerHTML = KGname
            td2.innerHTML = oh
            td3.innerHTML = disjoint
            tr.appendChild(td1)
            tr.appendChild(td3)
            tr.appendChild(td2)
        }
    }); 
}

function addSeriesConsistency(id,dataSelected,chart){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            dataSeries = []
            for(var i = 1; i<lines.length; i++){
                var line = lines[i].split(',')
                if(line[0] == dataSelected)
                lastLine[37] = lastLine[37].slice(0,(lastLine[37].indexOf('.'))+2)
                lastLine[38] = lastLine[38].slice(0,(lastLine[38].indexOf('.'))+2)
                lastLine[39] = lastLine[39].slice(0,(lastLine[39].indexOf('.'))+2)
                lastLine[42] = lastLine[42].slice(0,(lastLine[42].indexOf('.'))+2)
                lastLine[41] = lastLine[41].slice(0,(lastLine[41].indexOf('.'))+2) 
                dataSeries = [parseFloat(lastLine[37]),parseFloat(lastLine[38]),parseFloat(lastLine[39]),parseFloat(lastLine[42]),parseFloat(lastLine[41])]
                if (line[88] === 'True'){
                    document.getElementById('wrap-warning-cons').style.display = 'block'
                    numLimit = line[55].split(' ')[3]
                    p = document.createElement('p')
                    p.innerHTML = `The SPARQL endpoint of ${line[5]} is limited to ${numLimit} triples.`
                    document.getElementById('numTriplesLimitCons').appendChild(p)
                }
            }
            
            console.log(dataSeries)

            chart.addSeries({
                name : lastLine[5],
                data: dataSeries,
            },false)

            chart.redraw()
        }
    });
}

function changeDataConciseness(dateSelected,ids){
    document.getElementById('concTab').remove()
    table = document.createElement('table')
    table.className = 'center'
    table.id = 'concTab'
    tr = document.createElement('tr')
    th1 = document.createElement('th')
    th2 = document.createElement('th')
    th3 = document.createElement('th')
    th4 = document.createElement('th')
    th1.innerHTML = 'KG name'
    th2.innerHTML = 'Extensional conciseness'
    th3.innerHTML = 'Intensional conciseness'
    th4.innerHTML = '<a href="#popupConc" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
    tr.appendChild(th1)
    tr.appendChild(th2)
    tr.appendChild(th3)
    tr.appendChild(th4)
    table.appendChild(tr)
    node = document.getElementById('numTriplesLimitConc')
    while (node.hasChildNodes()) {    //in order not to have duplicate alerts if we click again
        node.removeChild(node.lastChild);
    }
    for(var i = 0; i<ids.length; i++){
        tr2 = document.createElement('tr')
        addRowConci(ids[i],dateSelected,tr2)
        table.appendChild(tr2)
    }
    if(document.getElementById('concisenessTab').children.length == 0)
        document.getElementById('concisenessTab').appendChild(table)
}

function changeDataAv(dateSelected,ids){
    document.getElementById('tabAv').remove()
    tableAv = document.createElement('table')
    tableAv.id = 'tabAv'

    trAv = document.createElement('tr')
    thKGname = document.createElement('th')
    thKGname.innerHTML = 'KG name'
    thSPARQL = document.createElement('th')
    thSPARQL.innerHTML = 'SPARQL endpoint'
    thRDFdump = document.createElement('th')
    thRDFdump.innerHTML = 'RDF dump'
    trAv.appendChild(thKGname)
    trAv.appendChild(thSPARQL)
    trAv.appendChild(thRDFdump)
    tableAv.appendChild(trAv)

    for(var i = 0; i<ids.length; i++){
        tr2 = document.createElement('tr')
        addRowAv(ids[i],dateSelected,tr2)
        tableAv.appendChild(tr2)
    }

    if(document.getElementById('containerTabAv').children.length == 0)
        document.getElementById('containerTabAv').appendChild(tableAv)
}

function addRowAv(id,dateSelected,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dateSelected){
                    tdName = document.createElement('td')
                    tdSPARQL = document.createElement('td')
                    tdRDFd = document.createElement('td')
                    tdName.innerHTML = line[5]
                    sparql = parseInt(line[1])
                    rdfD = parseInt(line[2])
                    if(sparql == 1)
                        tdSPARQL.innerHTML = 'Online'
                    else if(sparql == 0)
                        tdSPARQL.innerHTML = 'Offline'
                    else if(sparql == -1)
                        tdSPARQL.innerHTML = 'Absent'
                    else
                        tdSPARQL.innerHTML = sparql
                    if(rdfD == 1)
                        tdRDFd.innerHTML = 'Online'
                    else if(rdfD == 0)
                        tdRDFd.innerHTML = 'Offline'
                    else if(rdfD == -1)
                        tdRDFd.innerHTML = 'Absent'
                    else
                        tdRDFd.innerHTML = rdfD
                    tr.appendChild(tdName)
                    tr.appendChild(tdSPARQL)
                    tr.appendChild(tdRDFd)
                
                }
            }
        
        }
    });
}


function addRowConci(id,dateSelected,tr){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            KGname = '-'
            intC = '-'
            excC = '-'
            for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dateSelected){
                    KGname = line[5]
                    excC = line[55].split(' ')[0]
                    intC = line[56].split(' ')[0]
                    excC = parseFloat(excC)
                    intC = parseFloat(intC)
                    if (line[88] === 'True'){
                        document.getElementById('wrap-warning-conc').style.display = 'block'
                        numLimit = line[55].split(' ')[3]
                        p = document.createElement('p')
                        p.innerHTML = `The SPARQL endpoint of ${line[5]} is limited to ${numLimit} triples.`
                        document.getElementById('numTriplesLimitConc').appendChild(p)
                    }
                    break;
                }
            }
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            if(isNaN(excC))
                excC = '-'
            else
                excC = excC.toFixed(3)
            if(isNaN(intC))
                intC = '-'
            else
                intC = intC.toFixed(3)
            td1.innerHTML = KGname
            td2.innerHTML = excC
            td3.innerHTML = intC
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
        }
    });
}

function changeDataCompleteness(dateSelected,ids){
    document.getElementById('compTab').remove()
    table = document.createElement('table')
    table.className = 'center'
    table.id = 'compTab'
    tr = document.createElement('tr')
    th1 = document.createElement('th')
    th2 = document.createElement('th')
    th3 = document.createElement('th')
    th4 = document.createElement('th')
    th5 = document.createElement('th')
    th6 = document.createElement('th')
    th1.innerHTML = 'KG name'
    th2.innerHTML = 'Number of triples'
    th3.innerHTML = 'Number of triples linked'
    th4.innerHTML = 'Interlinking completeness'
    th5.innerHTML = 'Percentage of triples linked'
    th6.innerHTML = '<a href="#popupCompl" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
    tr.appendChild(th1)
    tr.appendChild(th2)
    tr.appendChild(th3)
    tr.appendChild(th4)
    tr.appendChild(th5)
    tr.appendChild(th6)
    table.appendChild(tr)
    for(var i = 0; i<ids.length; i++){
        tr2 = document.createElement('tr')
        addRowCompl(ids[i],tr2,dateSelected)
        table.appendChild(tr2)
    }
    if(document.getElementById('wrap-compTab').children.length == 0)
        document.getElementById('wrap-compTab').appendChild(table)
}

function addRowCompl(id,tr,dateSelected){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            KGname = '-'
            triples = '-'
            interC = '-'
            percentage = '-'
            for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dateSelected){
                    KGname = line[5]
                    triples = line[14]
                    triplesLinked = parseInt(line[58])
                    interC = line[57]
                    numLinked = parseInt(line[58])
                    numTriples = parseInt(line[14])
                    percentage = (numLinked/numTriples) * 100
                    percentage = percentage.toFixed(2)
                    if(!isNaN(percentage) && numTriples > 0){
                        percentage = percentage + '%'
                    }
                    else{
                        percentage = 'Insufficient data'
                    }
                    break;
                }
            }
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            td4 = document.createElement('td')
            td5 = document.createElement('td')
            td1.innerHTML = KGname
            td2.innerHTML = triples
            td3.innerHTML = triplesLinked
            td4.innerHTML = interC
            td5.innerHTML = percentage
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
        }
    });
}

function changeDataAmount(dateSelected,ids){
    const chartAmount = Highcharts.chart({
        chart: {
            renderTo: 'amountOfData',
            type: 'column'
        }, 
        title: {
            style:{
                fontSize:'30px',
                fontWeight:'bold'
            },
            text: 'Amount of data'
        },
        xAxis: {
            type:'datetime',
        },
        yAxis: {
            stackLabels: {
            enabled: true,
            formatter: function() {
                  return this.stack;
            }
            },
            title: {
                text: 'Amount of data'
            },
        },
        tooltip: {
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
            },
            formatter: function () {
                return '<b>' + this.series.options.id + '</b><br/>' + //KG NAME WHEN OVER IT WITH MOUSE
                    this.series.name + ': ' + this.y + '<br/>'
              
            }
        },
        series: [
        {
            name: 'entities',
            id: 'entities',
            color: '#00ff83'
        },
        {
            name: 'properties',
            id: 'properties',
            color: '#404552'
        },
        {
            name: 'triples',
            id: 'triples',
            color: '#7CA9F4'
        },
      ],

      legend:{
          enabled: true
      },
      plotOptions: {
        series:{
            minPointLength:3
        },
          column: {
              stacking: 'normal'
          }
      },
    });

    for(var i = 0; i<ids.length; i++){
        addSeriesAmount(ids[i],chartAmount,dateSelected)
    }
}

function addSeriesAmount(id,chart,dateSelected){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            triples = []
            entities = []
            properties = []
            for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dateSelected){
                    var tab_date = line[0].split('-')
                    var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                    data = [date_utc,parseInt(line[14])]
                    triples.push(data)
                    data = [date_utc,parseInt(line[59].split(' ')[0])]
                    entities.push(data)
                    data = [date_utc,parseInt(line[60])]
                    properties.push(data)
                    break;
                }
            }
            chart.addSeries({
                id: lastLine[5],
                minPointLength: 5,
                name: 'Entities',
                data: entities,
                stack: lastLine[15],
                linkedTo: 'entities',
                color: '#00ff83'
            },false)

            chart.addSeries({
                id: lastLine[5],
                minPointLength: 5,
                name: 'Properties',
                data: properties,
                stack: lastLine[15],
                linkedTo:'properties',
                color:'#404552'
            },false)

            chart.addSeries({
                id: lastLine[5],
                minPointLength: 5,
                name: 'Triples',
                data: triples,
                stack: lastLine[15],
                linkedTo: 'triples',
                color: '#7CA9F4'
            },false)
      
            chart.redraw();
        }
    });
}

function changeDataRepConc(dateSelected,ids){
    const chartS = Highcharts.chart({ //REP. CONCISENESS BOXPLOT
        chart: {
            renderTo:'lengthS',
            type: 'boxplot'
        },
        title: {
            style:{
                fontSize:'30px',
                fontWeight:'bold'
            },
            text: 'URIs length (subject)'
        },
        subtitle: {
            style:{
                fontSize:'24px'
            }
        },

    
        legend: {
            layout: 'horizontal',
            align: 'center',
        },
    
        xAxis: {
            type:'datetime',
        },
    
        yAxis: {
            plotLines: [{
                value: 80,
                color: 'red',
                width: 1,
                label: {
                    text: 'Optimal value: 80',
                    align: 'center',
                    style: {
                        color: 'gray'
                    }
                }
            }],
            title: {
                text: 'Observations'
            },
        },
    });

    const chartP = Highcharts.chart({
        chart: {
            renderTo:'lengthP',
            type: 'boxplot'
        } ,
        title: {
            style:{
                fontSize:'30px',
                fontWeight:'bold'
            },
            text: 'URIs length (predicate)'
        },

        subtitle: {
            style:{
                fontSize:'24px'
            }
        },
    
        legend: {
            layout: 'horizontal',
            align: 'center',
        },
    
        xAxis: {
            type:'datetime',
        },
    
        yAxis: {
            plotLines: [{
                value: 80,
                color: 'red',
                width: 1,
                label: {
                    text: 'Optimal value: 80',
                    align: 'center',
                    style: {
                        color: 'gray'
                    }
                }
            }],
            title: {
                text: 'Observations'
            },
        },
    });
    const chartO = Highcharts.chart({
        chart: {
            renderTo:'lengthO',
            type: 'boxplot'
        },
        title: {
            style:{
                fontSize:'30px',
                fontWeight:'bold'
            },
            text: 'URIs length (object)'
        },

        subtitle: {
            style:{
                fontSize:'24px'
            }
        },

        legend: {
            layout: 'horizontal',
            align: 'center',
        },

        xAxis: {
            type:'datetime',
        },

        yAxis: {
            plotLines: [{
                value: 80,
                color: 'red',
                width: 1,
                label: {
                    text: 'Optimal value: 80',
                    align: 'center',
                style: {
                    color: 'gray'
                }
                }
            }],
        title: {
            text: 'Observations'
        },
        },
    });
    for(var i = 0; i<ids.length; i++){
        addSeriesRepConc(ids[i],chartS,chartP,chartO,dateSelected)
    }
}

function addSeriesRepConc(id,chartS,chartP,chartO,dateSelected){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            dataLengthS = []
            dataLengthP = []
            dataLengthO = []
            for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dateSelected){
                    var tab_date = lastLine[0].split('-')
                    var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                    data = [date_utc,parseInt(line[61]),parseInt(line[62]),parseInt(line[63]),parseInt(line[64]),parseInt(line[65])]
                    dataLengthS.push(data)
                    data = [date_utc,parseInt(line[66]),parseInt(line[67]),parseInt(line[68]),parseInt(line[69]),parseInt(line[70])]
                    dataLengthP.push(data)
                    data = [date_utc,parseInt(line[71]),parseInt(line[72]),parseInt(line[73]),parseInt(line[74]),parseInt(line[75])]
                    dataLengthO.push(data)
                }
            }
            chartS.addSeries({
                name: lastLine[5],
                data: dataLengthS,
            })
            chartP.addSeries({
                name: lastLine[5],
                data: dataLengthP,
            })
            chartO.addSeries({
                name: lastLine[5],
                data: dataLengthO,
            })
        }
    });
}

function changeDataUnder(dateSelected,ids){
    document.getElementById('UnderComp').remove()
    table = document.createElement('table')
    table.id = 'UnderComp'
    tr = document.createElement('tr')
    th1 = document.createElement('th')
    th2 = document.createElement('th')
    th3 = document.createElement('th')
    th4 = document.createElement('th')
    th5 = document.createElement('th')
    th6 = document.createElement('th')
    th7 = document.createElement('th')
    th1.innerHTML = 'KG name'
    th2.innerHTML = 'Number of labels'
    th3.innerHTML = 'Percentage of triples with label'
    th4.innerHTML = 'URI regex'
    th5.innerHTML = 'Example'
    th6.innerHTML = 'Vocabulary used in the KG'
    th7.innerHTML = '<a href="#popupUnder" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
    table.appendChild(tr)
    table.className = 'center'
    tr.appendChild(th1)
    tr.appendChild(th2)
    tr.appendChild(th3)
    tr.appendChild(th4)
    tr.appendChild(th5)
    tr.appendChild(th6)
    tr.appendChild(th7)
    for(var i = 0; i<ids.length;i++){
        tr2 = document.createElement('tr')
        addRowUnder(ids[i],tr2,dateSelected)
        table.appendChild(tr2)
    }
    if(document.getElementById('wrap-tabUnd').children.length == 0)
        document.getElementById('wrap-tabUnd').appendChild(table)

}

function addRowUnder(id,tr,dateSelected){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            KGname = '-'
            labels = '-'
            percentageL = '-'
            regex = '-'
            example = '-'
            vocabs = '-'
            for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dateSelected){
                    vocabs = occurrences(lastLine[44],';')
                    if(!isNaN(vocabs) && vocabs > 0)
                        vocabs = vocabs +1
                    else
                     vocabs = '-'
                    KGname = line[5]
                    labels = line[78]
                    percentageL =  (parseInt(labels)/parseInt(line[14])) * 100
                    if(!isNaN(parseFloat(percentageL))){
                        percentageL = percentageL.toFixed(2)
                        percentageL = percentageL+'%'
                    }else
                        percentageL = '-'
                    regex = line[79]
                    example = line[80]
                    break;
                }
            }
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td3 = document.createElement('td')
            td4 = document.createElement('td')
            td5 = document.createElement('td')
            td6 = document.createElement('td')
            td1.innerHTML = KGname
            td2.innerHTML = labels
            td3.innerHTML = percentageL
            td4.innerHTML = regex
            td5.innerHTML = example
            td6.innerHTML = vocabs
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
            tr.appendChild(td6)
        }
    });
}

function changeDataInterp(dateSelected,ids){
    const chartInterp = Highcharts.chart({
        chart: {
            renderTo: 'interpretability',
            type: 'column'
        }, 
        title: {
            style:{
                fontSize:'30px',
                fontWeight:'bold'
            },
            text: 'Interpretability'
        },
        xAxis: {
            type:'datetime',
        },

        yAxis: {
            type: 'logarithmic',
            stackLabels: {
                enabled: true,
                formatter: function() {
                    return this.stack;
                }
            },
            title: {
                text: 'no. triples'
            },
            style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            }
        },
        tooltip: {
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
            },
            formatter: function () {
                return '<b>' + this.series.options.id + '</b><br/>' + //KG NAME WHEN OVER IT WITH MOUSE
                    this.series.name + ': ' + this.y + '<br/>'
              
            }
        },
        legend:{
            enabled: true
        },
        series: [{
            name: 'Blank nodes',
            id: 'blank',
            color: '#FF9648'
        },
        {
            name: 'Triples',
            id: 'triples',
            color: '#7CA9F4'
        }],
        plotOptions: {
            column: {
                stacking: 'normal'
            },
            series:{
                minPointLength:3
            },
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
    });
    for(var i = 0; i<ids.length; i++){
        addSeriesInterp(ids[i],chartInterp,dateSelected)
    }
    document.getElementById('interpTab').remove()
    table = document.createElement('table')
    table.className = 'center'
    table.id = 'interpTab'
    tr = document.createElement('tr')
    th1 = document.createElement('th')
    th2 = document.createElement('th')
    th3 = document.createElement('th')
    th1.innerHTML = 'KG name'
    th2.innerHTML = 'Use RDF structures'
    th3.innerHTML = '<a href="#popupInterp" class="wrapHelp" ><img src="img/ask.png" width="43" height="43"/></a>'
    tr.appendChild(th1)
    tr.appendChild(th2)
    tr.appendChild(th3)
    table.appendChild(tr)
    for(var i = 0; i<ids.length; i++){
        tr2 = document.createElement('tr')
        drawRowInterp(ids[i],tr2,dateSelected)
        table.appendChild(tr2)
    }
    if(document.getElementById('wrapTabInter').children.length == 0)
        document.getElementById('wrapTabInter').appendChild(table)
}

function drawRowInterp(id,tr,dateSelected){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            KGname = '-'
            rdf = '-'
            for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dateSelected){
                    KGname = line[5]
                    rdf = line[82]
                }
            }
            td1 = document.createElement('td')
            td2 = document.createElement('td')
            td1.innerHTML = KGname
            td2.innerHTML = rdf
            tr.appendChild(td1)
            tr.appendChild(td2)
        }
    });
}

function addSeriesInterp(id,chart,dateSelected){
    $(document).ready(function() {
        $.ajax({
            type: "GET",
            url: './CSVforJS/'+id+'.csv',
            dataType: "text",
            success: function(data) {processData(data)}
        });
        function processData(data){
            var lines = data.trim().split('\n');
            var lastLine = lines[lines.length - 1].split(',');
            dataBlank = []
            dataTriples = []
            for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dateSelected){
                    var tab_date = line[0].split('-')
                    var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
                    data1 = [date_utc,parseInt(line[81])]
                    data2 = [date_utc,parseInt(line[14])]
                    dataBlank.push(data1)
                    dataTriples.push(data2)
                    break;
                }
            }

            chart.addSeries({
                id: lastLine[5],
                data:dataBlank,
                name: 'Blank nodes',
                stack: lastLine[15],
                linkedTo: 'blank',
                color: '#FF9648'
            })

            chart.addSeries({
                id: lastLine[5],
                data:dataTriples,
                name: 'Triples',
                stack: lastLine[15],
                linkedTo: 'triples',
                color: '#7CA9F4'
            })
        }
    });
}

function occurrences(string, subString, allowOverlapping) {
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

function sortTable(colNo,tableId,IsAsc) {
    var table, rows, switching, i, x, y;
    table = document.getElementById(tableId);
    switching = true;
    while (switching) {
      switching = false;
      rows = table.rows;  
      for (i = 1; i < (rows.length - 1); i++) {
        if(rows[i].getElementsByTagName("TD")[colNo] != undefined && rows[i + 1].getElementsByTagName("TD")[colNo] != undefined)
        {
          x = rows[i].getElementsByTagName("TD")[colNo].innerHTML.toLowerCase();
          y = rows[i + 1].getElementsByTagName("TD")[colNo].innerHTML.toLowerCase();
          x = parseFloat(x)
          y = parseFloat(y)
          if ((x < y && IsAsc == false) || (x > y && IsAsc == true)) {
            rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
            switching = true;
            break;
          }
        }
      }    
    }
}

function selectAll(){  
    var selec=document.getElementsByName('KGid');
    for(var i=0; i<selec.length; i++){
        if(selec[i].type=='checkbox')
            selec[i].checked=true;
    }
} 

function downloadFullCSV(dateSelected){
    console.log(dateSelected)
    var a = document.createElement('a')
	fileUrl = 'https://kg-quality-analysis-visualization.com/'+dateSelected+'.csv'
    console.log(fileUrl)
	a.href = fileUrl
	a.setAttribute("download",fileUrl)
	a.click()
}

function hashmapScore(){
    Highcharts.addEvent(
        Highcharts.Series,
        'afterSetOptions',
        function (e) {
                let nodeCounts = {};
                //count connections for each From or To node
                e.options.data.forEach(function (link) {
                    nodeCounts[link[0]] = (nodeCounts[link[0]] || 0) + 1;
                    nodeCounts[link[1]] = (nodeCounts[link[1]] || 0) + 1;
                });
    
                let radiusFactor = 3; //radius multiplier to graphically enlarge nodes
                //map each nodeCount to a node object setting the radius
    
                $(document).ready(function() {
                    $.ajax({
                        type: "GET",
                        url: 'KGid.txt',
                        dataType: "text",
                        async: false,
                        success: function(data) {processData(data)}
                    });
                    function processData(data){
                        fullName = data.trim().split("\n");
                }
                e.options.nodes = Object.keys(nodeCounts).map(function (id) {      
                    for(var i = 0; i<fullName.length;i++){
                        idTxt = fullName[i].trim().slice(0, fullName[i].indexOf(' '))
                        filename = id.replaceAll('[\\/*?:"<>|]','')
                        filename = filename.replaceAll('-','')
                        filename = filename.replaceAll(' ','')
                        filename = filename.toLowerCase()
                        if(filename == idTxt){
                            n = fullName[i].lastIndexOf(" ");
                            score = fullName[i].substring(n+1)
                            score = score.trim()
                            score = parseFloat(score)
                            color = '#d1fbd8'
                            if(score <= 20){
                                console.log('eemoi')
                                color = '#d1fbd8'
                                break;
                            }
                            else if (score <= 40){
                                color = '#a3ee5b'
                                break;
                            }
                            else if(score <= 60){
                                color = '#66d855'
                                break;
                            }
                            else if(score <= 80){
                                color = '#40ba0f'
                                break;
                            }
                            else if(score > 80){
                                color = '#188300'
                                break;
                            }
                        } else {
                            color = '#d1fbd8'
                        }
                    }
                    return {
                    id: id,
                    marker: { },
                    color: color
                    };
            });
            })
        }    
        );	
}