function passValue(x,metric) {
	var m = metric
  	var a = x;
	idKG = x
	m = document.querySelector('input[type="radio"][name="metric"]:checked')
	elements = document.getElementsByClassName("KGbutton")
    for(var i = 0; i< elements.length;i++){
        elements[i].style.backgroundColor = "white"
        elements[i].style.color = "black"
        addClick(elements[i])
    }
    li = document.getElementById(x)
    li.style.backgroundColor = "#00ea89cc"
    li.style.color = "white"
    li.style.borderRadius = "5px"
  	if(m == null){ //IF NO METRIC SELECTED, AVAILABILITY IS SHOWN BY DEFAULT
    	Highcharts.chart({
      		chart:{
        		type : 'line',
        		renderTo: 'container',
      		}, 
      		title: {
          		style:{
            		fontSize:'28px',
            		fontWeight:'bold'
          		},
          		text: 'Availability of SPARQL endpoint',
        	},
        	subtitle: {
          		text:a,
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
          		csvURL: './CSVforJS/'+a+'.csv',
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
              		value: 0.95,
              		color: '#fd5e53'
          		},
           		{ color: '#90ed7d'
          		}
        		]}, 
        	{
          		color: '#c4392d',
          		//fillOpacity: 0.5
      		},
    		]
  		});
  	} 
	else{
		switch(m.value){
			case 'Availability':
				hideDiv()
      			document.getElementById('container').style.display = 'block';
      			document.getElementById('container2').style.display = 'block';
				document.getElementById('containerDef').style.display = 'block'
				$(document).ready(function() { //GETTING CSV FOR THE SELECTED KG
					$.ajax({
				  		type: "GET",
				  		url: './CSVforJS/'+a+'.csv',
				  		dataType: "text",
				  		success: function(data) {processData(data)}
					});
					function processData(data) { //CSV PARSIN AND DATA FORMATTING FOR HIGHCHART GRAPH
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						var measurements = []
						var measurementsRDF = []
						var measurementsDef = []
						linkSparql = lastLine[30]
						for(var j = 1; j< lines.length; j++){
							line = lines[j].split(',')
							var tab_date = line[0].split('-')
							var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
							data = [date_utc,parseInt(line[1])]
							measurements.push(data)
							dataRDF = [date_utc,parseInt(line[2])]
							measurementsRDF.push(dataRDF)
							dataDef = [date_utc,parseFloat(parseFloat(line[91]).toFixed(2))]
							measurementsDef.push(dataDef)
						}		
						Highcharts.chart({ //CHART FOR SPARQL ENDPOINT AVAILABILITY
							chart:{
								type : 'spline',
								renderTo: 'container',
							},
							title: {
								style:{
									fontSize:'28px',
									fontWeight:'bold'
								},
								text: 'Availability of SPARQL endpoint',
								},
							subtitle: {
								text:'<a href="'+linkSparql+'">'+linkSparql+'</a>',
								style:{
									fontSize:'20px'
								}
							},
							xAxis: {
								type:'datetime',
							},
							yAxis: {
								min: -1,
								max: 1,
								allowDecimals: false,
								title: {
									text: 'Status'
								}
							},
							rangeSelector: {
								enabled:true
							},
							tooltip:{
								formatter: function(){
									if(this.y == 1){
										return Highcharts.dateFormat('%Y %B %e',this.x) + '<br> Availability: <p style="color:#90ed7d"><b>Online</b></p>'
									} else if(this.y == 0){
										return Highcharts.dateFormat('%Y %B %e',this.x) + '<br> Availability: <p style="color:#fd5e53"><b>Offline</b></p>'
									} else if (this.y == -1){
										return Highcharts.dateFormat('%Y %B %e',this.x) + '<br> Availability: <p style="color:#fd5e53"><b>Absent</b></p>'
									}
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
								name: 'Availability',
								lineWidth: 3,
								data: measurements,
								zones:[{
									value: 0.95,
									color: '#fd5e53'
								},
								{ 
								color: '#90ed7d'
								}]
							},]
						});
						Highcharts.chart({  //CHART FOR RDF DUMP AVAILABILITY
							chart:{
								type : 'line',
								renderTo: 'container2',
							},
							title: {
								style:{
									fontSize:'28px',
									fontWeight:'bold'
								},
								text: 'Availability of RDF dump',
							},
							subtitle: {
								text:a,
								style:{
									fontSize:'24px'
								}
							},
							yAxis: {
								min: -1,
								max: 1,
								title: {
									text: 'Status'
								}
							},
							xAxis:{
								type:'datetime',
							},
							rangeSelector: {
								enabled:true
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
							tooltip:{
								formatter: function(){
									if(this.y == 1){
										return Highcharts.dateFormat('%Y %B %e',this.x) + '<br> Availability: <p style="color:#90ed7d"><b>Online</b></p>'
									} else if(this.y == 0){
										return Highcharts.dateFormat('%Y %B %e',this.x) + '<br> Availability: <p style="color:#fd5e53"><b>Offline</b></p>'
									} else if (this.y == -1){
										return Highcharts.dateFormat('%Y %B %e',this.x) + '<br> Availability: <p style="color:#fd5e53"><b>Absent</b></p>'
									}
								}
							},
							series: [{
								name: 'Availability',
								lineWidth: 3,
								data: measurementsRDF,
								zones:[{
									value: 0.98,
									color: '#fd5e53'
								},
								{ 
								color: '#90ed7d'
								}]
							},]
						});
						Highcharts.chart({ 
							chart:{
								type : 'line',
								renderTo: 'containerDef',
							},
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
							xAxis: {
								type:'datetime',
							},
							yAxis: {
								allowDecimals: true,
								title: {
									text: 'Value'
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
							rangeSelector: {
								enabled:true
							},
							legend:{
								itemStyle: {
									fontSize:'15px',
									font: '13pt Trebuchet MS, Verdana, sans-serif',
									color: '#A0A0A0'
								},
								enabled: true,
								layout : 'vertical',
							},
							plotOptions: {
								series: {
									marker: {
										enabled: true
									}
								}
							},
							series: [{
								name: 'Deferenceability value',
								lineWidth: 3,
								data: measurementsDef,
							},]
						});
					}
				});
  				break;

			case 'Licensing':
				hideDiv()
    			document.getElementById(`containerLicense`).style.display = 'block';
    			$(document).ready(function() {
      				$.ajax({
        			type: "GET",
					url: './CSVforJS/'+a+'.csv',
					dataType: "text",
					success: function(data) {processData(data)}
      				});
      				function processData(data) {  //DYNAMIC CREATION OF LICENSE TABLE
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						var header1 = document.getElementById('hmr');
						var header2 = document.getElementById('licenseMetadati')
						var header3 = document.getElementById('hhr')
						licenseMr = document.getElementById('licenseMR')
						licenseMR = document.getElementById('licenseM')
						header2.innerHTML = 'License (metadati)'
						header1.innerHTML = 'License machine-redeable'
						header3.innerHTML = 'License human-redeable'
						licenseMR.innerHTML = lastLine[3]
						licenseHR.innerHTML = lastLine[4]
						if (lastLine[89] == '[]')
							licenseMr.innerHTML = 'Not indicated'
						else
							licenseMr.innerHTML = lastLine[89]
      				}
    			})
  				break;
  			
			case 'Believability':
    			$(document).ready(function() {
      				$.ajax({
        			type: "GET",
        			url: './CSVforJS/'+a+'.csv',
        			dataType: "text",
        			success: function(data) {processData(data)}
      				});
     	 			function processData(data){ 
						hideDiv()
						document.getElementById(`reliablePr`).style.display = 'block';
						document.getElementById(`containerTrust`).style.display = 'block';
						document.getElementById(`containerBeliev`).style.display = 'block';
						var lines = data.trim().split('\n');
        				var lastLine = lines[lines.length - 1].split(',');
						believ = document.getElementById('containerBeliev')
						believ.innerHTML = '<p id="title">'+lastLine[5]+'</p><br><a id="urlD" href='+lastLine[7]+' target="_blank">'+lastLine[7]+'</a><br><p id="description">'+lastLine[6]+'</p> ';
						trustValue = parseFloat(lastLine[9]);
						
						Highcharts.chart({  //CHART FOR THE TRUST VALUE
							chart:{
								type : 'solidgauge',
								renderTo: 'containerTrust',
							},
							title: 'Trust value',
							subtitle: {
								style:{
									fontSize:'18px',
								},
								align: 'center',
								text: 'The trust value is a value between -1 and 1. <br> Where 1: absolute belief, -1: absolute disbelief and 0:lack of belief/disbelief'
							},	
							pane: {
								center: ['50%', '85%'],
								size: '140%',
								startAngle: -90,
								endAngle: 90,
								background: {
									backgroundColor:
									Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
									innerRadius: '60%',
									outerRadius: '100%',
									shape: 'arc'
								}
							},

							yAxis: {
								stops: [
								[-1, '#eb4034'], // red
								[0,'#7dd5ed'], // light blue
								[0.5, '#DDDF0D'], // yellow
								[0.75,'#c6eb34'], //green-yellow
								[1, '#90ed7d'] // green
								],
								lineWidth: 0,
								tickWidth: 0,
								minorTickInterval: null,
								tickAmount: 2,
								min: -1,
								max: 1,
								title: {
									text: 'Trust value'
								}
							},
							series: [{
								name: 'Trust value',
								data: [trustValue],
								dataLabels: {
								format:
									'<div style="text-align:center">' +
									'<span style="font-size:25px">{y}</span><br/>' +
									'<span style="font-size:12px;opacity:0.4"></span>' +
									'</div>'
								},
							}]
						});
        
      				}
    			})
 				break;

  			case 'Interlinking':
    			hideDiv()
				document.getElementById('interlinking').style.display = 'block';
				document.getElementById(`mode`).style.display = 'block';
				document.getElementById(`intPie`).style.display = 'block';
				document.getElementById(`tableInt`).style.display = 'block';
				document.getElementById(`wrap-tbInt`).style.display = 'block';
				$(document).ready(function() {
					$.ajax({
						type: "GET",
						url: './Subgraphs/'+a+'.txt',
						dataType: "text",
						success: function(data) {processData(data)}
					});
					function processData(data){  //CHART FOR EXTERNAL LINKS 
						var json = JSON.parse("[" + data + "]" )
						Highcharts.chart({
							chart:{
								type : 'networkgraph',	
								renderTo: 'interlinking',
							},
							title: {
								style:{
									fontSize:'30px',
									fontWeight:'bold'
								},
								text: 'External links',
							},
							subtitle: {
								text:a,
								style:{
									fontSize:'24px'
								}
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
							series: [{
								dataLabels: {
									enabled: true,
									linkFormat: ''
								},
								id: 'Graph',
								marker: {
									radius: 20
								},
								data: json[0],
							}]
						});
					}
				});
 
				$(document).ready(function() {
					$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
					});
					function processData(data) {
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						sameAs = parseInt(lastLine[13]);
						numTriples = parseInt(lastLine[14]);
						dc = lastLine[10]
						ccl = lastLine[11]
						centr = lastLine[12]
						var td1 = document.getElementById('dc');
						var td2 = document.getElementById('ccl');
						var td3 = document.getElementById('cent');
						var td4 = document.getElementById('pr')
						td1.innerHTML = dc;
						td2.innerHTML = ccl;
						td3.innerHTML = centr;
						td4.innerHTML = lastLine[43]
						Highcharts.chart({  //CHART FOR SAMEAS CHAINS
							chart: {
								renderTo:'intPie',
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
								text: 'SameAs chains'
							},

							subtitle: {
								text:a,
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
											color = '#ccf9ff'
											if(nodeCounts[id] <= 20){
												color = '#ccf9ff'
												break;
											}
											else if (nodeCounts[id] <= 40){
												color = '#7ce8ff'
												break;
											}
											else if(nodeCounts[id] <= 60){
												color = '#55d0ff'
												break;
											}
											else if(nodeCounts[id] <= 80){
												color = '#00acdf'
												break;
											}
											else if(nodeCounts[id] > 100){
												color = '#0080bf'
												break;
											}
										} else {
											color = '#ccf9ff'
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
				});
  				break;

  			case 'Performance':
				hideDiv()
    			document.getElementById(`performance`).style.display = 'block';
    			document.getElementById(`performanceT`).style.display = 'block';
    			$(document).ready(function() {
					$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
					});
      				function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						var date = []
						var measurements = []
						var measurementsT = []
						for(var i = 1; i< lines.length; i++){
							line = lines[i].split(',')
							var tab_date = line[0].split('-')
							var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
							data = [date_utc,parseFloat(line[16]),parseFloat(line[17]),parseFloat(line[18]),parseFloat(line[19]),parseFloat(line[20])]
							measurements.push(data)
						}
						for(var i = 1; i<lines.length; i++){
							line = lines[i].split(',')
							var tab_date = line[0].split('-')
							var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
							dataT = [date_utc,parseFloat(line[21]),parseFloat(line[22]),parseFloat(line[23]),parseFloat(line[24]),parseFloat(line[25])]
							measurementsT.push(dataT)
						}

						Highcharts.chart({ //BOXPLOT FOR LATENCY
							chart: {
								renderTo:'performance',
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
							}	,

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

						Highcharts.chart({  //BOXPLOT FOR THROUGHPUT
							chart: {
								renderTo:'performanceT',
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
								type:'datetime',
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
  				break;

  			case 'Security':
				hideDiv()
        		document.getElementById('wrapSec').style.display = 'block';
    			$(document).ready(function() {
      				$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
      				});
      				function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						var td1 = document.getElementById('https'); //DYNAMIC CREATION OF SECURITY TABLE
						var td2 = document.getElementById('auth')
						td1.innerHTML = lastLine[27]
						td2.innerHTML = lastLine[26]
      				}
    			})
  				break;
  
			case 'Accuracy':
    			hideDiv()
				document.getElementById('wrapSwitchAcc').style.display = 'block'
    			document.getElementById('accuracy').style.display = 'block';
    			$(document).ready(function() {
      				$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
        				success: function(data) {processData(data)}
      				});
      				function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						dataVoid = []
						dataWhitespace = []
						datatypeLiteral = []
						dataFP = []
						dataIFP = []
						if (lastLine[88] === 'True'){
							document.getElementById('wrap-warning-acc').style.display = 'block'
							numLimit = lastLine[55].split(' ')[3]
							document.getElementById('numTriplesLimit').innerHTML = `The number of triples recoverable from the SPARQL endpoint is limited to ${numLimit} triples.`
						}
						if(!document.getElementById('typeAcc').checked){
							for(var i = 1; i< lines.length; i++){
								line = lines[i].split(',')
								var tab_date = line[0].split('-')
								var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
								var voidLabel = lastLine[32].slice(0,(lastLine[32].indexOf('.'))+2)
								var voidLabel = parseFloat(voidLabel)
								data = [date_utc,voidLabel]
								dataVoid.push(data)
							}
							for(var i = 1; i< lines.length; i++){
								line = lines[i].split(',')
								var tab_date = line[0].split('-')
								var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
								var whiteSpace = lastLine[33].slice(0,(lastLine[33].indexOf('.'))+2)
								var whiteSpace = parseFloat(whiteSpace)
								data = [date_utc,whiteSpace]
								dataWhitespace.push(data)
							}
							for(var i = 1; i< lines.length; i++){
								line = lines[i].split(',')
								var tab_date = line[0].split('-')
								var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
								var literalProblem = lastLine[34] = lastLine[34].slice(0,(lastLine[34].indexOf('.'))+2)
								var literalProblem = parseFloat(literalProblem)
								data = [date_utc,literalProblem]
								datatypeLiteral.push(data)
							}
							for(var i = 1; i< lines.length; i++){
								line = lines[i].split(',')
								var tab_date = line[0].split('-')
								var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
								var fp = lastLine[86] = lastLine[86].slice(0,(lastLine[86].indexOf('.'))+2)
								var fp = parseFloat(fp)
								data = [date_utc,fp]
								dataFP.push(data)
							}
							for(var i = 1; i< lines.length; i++){
								line = lines[i].split(',')
								var tab_date = line[0].split('-')
								var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
								var ifp = lastLine[87] = lastLine[87].slice(0,(lastLine[87].indexOf('.'))+2)
								var ifp = parseFloat(ifp)
								data = [date_utc,ifp]
								dataIFP.push(data)
							} 
							Highcharts.chart({   //CHART FOR ACCURACY (CHANGE OVER TIME)
								chart: {
									renderTo:'accuracy',
									type: 'line'
								},
								title: {
									style:{
										fontSize:'30px',
										fontWeight:'bold'
									},
									text: lastLine[5]
								},
								rangeSelector: {
									enabled:true
								},

								xAxis: {
									type:'datetime',
								},
								yAxis: {
									min: 0,
									title: {
										text: 'Number of triples'
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
								tooltip: {
									headerFormat: '<span style=" border:0px">{point.key}</span><table style="width=100%; border:0px">',
									pointFormat: '<tr><td id="legendAcc" style="color:{series.color};padding:0">{series.name}: </td>' +
									'<td style="padding:0"><b>{point.y}</b></td></tr>',
									footerFormat: '</table>',
									shared: true,
									useHTML: true
								},
								plotOptions: {
									series:{
										minPointLength:3
									},
									column: {
										pointPadding: 0.2,
										borderWidth: 0
									}
								},
								series: [{
									name: 'Empty label',
									data: dataVoid
								},
								{
									name:'Label with whitespace at the beginning or the end',
									data:dataWhitespace
								},
								{
									name:'Literal with Datatype problem',
									data:datatypeLiteral
								},
								{
									name:'FP',
									data:dataFP
								},
								{
									name:'IFP',
									data:dataIFP
								},
								]
							});
						}
						else{
							document.getElementById('labelDatAcc').style.display = 'block'
							analysisDate = []
							for(var i = 1; i<lines.length; i++){
								line = lines[i].split(',')
								analysisDate.push(line[0])
							}
							$("#datepickerAcc").datepicker({
								dateFormat:"yy-mm-dd",
								beforeShowDay: function(date){
									var sdate = $.datepicker.formatDate('yy-mm-dd',date)
									if($.inArray(sdate,analysisDate) != -1){
										return[true]
									}
									return[false]
								}
								})
							$("#datepickerAcc").datepicker("setDate",lastLine[0])
							$("#datepickerAcc").on("change",function(){
								var selected = $(this).val();
								changeDataAccuracy(selected,idKG)
							});
							var tab_date = lastLine[0].split('-')
							var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
							lastLine[32] = lastLine[32].slice(0,(lastLine[32].indexOf('.'))+2)
							lastLine[33] = lastLine[33].slice(0,(lastLine[33].indexOf('.'))+2)
							lastLine[34] = lastLine[34].slice(0,(lastLine[34].indexOf('.'))+2)
							lastLine[86] = lastLine[86].slice(0,(lastLine[86].indexOf('.'))+2)
							lastLine[87] = lastLine[87].slice(0,(lastLine[87].indexOf('.'))+2)
							data = [parseFloat(lastLine[32]),parseFloat(lastLine[33]),parseFloat(lastLine[34]),parseFloat(lastLine[86]),parseFloat(lastLine[87])]
							Highcharts.chart('accuracy', {
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
								tooltips: {
									enabled: true,
									callbacks: {
										label: function(tooltipItem, data) {
											return data.datasets[tooltipItem.datasetIndex].label + ' : ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
										}
									}
								},
								series:[{
									name: lastLine[5],
									data: data 
								}],
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
						

						}
      				}
    			})
    			break;

    		case 'Consistency':
      		    hideDiv()
				document.getElementById('datepickerAcc').style.display = 'block'
    			document.getElementById('wrapSwitchCons').style.display = 'block'
    			document.getElementById('const-tab').style.display = 'block'
				td = document.getElementById('OHValue')
				td2 = document.getElementById('disjValue')
				var div = document.getElementById('consistency')
				div.style.display = 'block'
    			$(document).ready(function() {
      				$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
      				});
     			    function processData(data){
					    dataDisj = []
						dataUndefC = []
						dataUndefP = []
						dataDeprecated = []
						dataMissP = []
						dataMissC = []
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						analysisDate = []
						for(var i = 1; i<lines.length; i++){
							line = lines[i].split(',')
							analysisDate.push(line[0])
						}
						td.innerHTML = lastLine[40]
						td2.innerHTML = lastLine[36]
						if (lastLine[88] === 'True'){
							document.getElementById('wrap-warning-cons').style.display = 'block'
							numLimit = lastLine[55].split(' ')[3]
							document.getElementById('numTriplesLimitCons').innerHTML = `The number of triples recoverable from the SPARQL endpoint is limited to ${numLimit} triples.`
						}
        				if(document.getElementById('typeCons').checked){
							document.getElementById('labelDatCons').style.display = 'block'
							$("#datepickerCons").datepicker({
								dateFormat:"yy-mm-dd",
								beforeShowDay: function(date){
									var sdate = $.datepicker.formatDate('yy-mm-dd',date)
									if($.inArray(sdate,analysisDate) != -1){
										return[true]
									}
									return[false]
								}
								})
							$("#datepickerCons").datepicker("setDate",lastLine[0])
							$("#datepickerCons").on("change",function(){
								var selected = $(this).val();
								changeDataConsistency(selected,idKG)
							});
							var tab_date = lastLine[0].split('-')
							var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
							lastLine[37] = lastLine[37].slice(0,(lastLine[37].indexOf('.'))+2)
							lastLine[38] = lastLine[38].slice(0,(lastLine[38].indexOf('.'))+2)
							lastLine[39] = lastLine[39].slice(0,(lastLine[39].indexOf('.'))+2)
							lastLine[42] = lastLine[42].slice(0,(lastLine[42].indexOf('.'))+2)
							lastLine[41] = lastLine[41].slice(0,(lastLine[41].indexOf('.'))+2) 
							data = [parseFloat(lastLine[37]),parseFloat(lastLine[38]),parseFloat(lastLine[39]),parseFloat(lastLine[42]),parseFloat(lastLine[41])]
							Highcharts.chart(div, {
								chart: {
									polar: true,
									type: 'line'
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

								title: {
									style:{
										fontSize:'30px',
										fontWeight:'bold'
									},
									text: 'Consistency'
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
								tooltips: {
									enabled: true,
									callbacks: {
										label: function(tooltipItem, data) {
											return data.datasets[tooltipItem.datasetIndex].label + ' : ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
										}
									}
								},
								series:[{
									name: lastLine[5],
									data: data 
								}],
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
						} 
						else{
							dataUndefC = []
							dataUndefP = []
							dataDeprecated = []
							dataMissP = []
							dataMissC = []
							for(var i = 1; i< lines.length; i++){
								line = lines[i].split(',')
								var tab_date = line[0].split('-')
								var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
								lastLine[37] = lastLine[37].slice(0,(lastLine[37].indexOf('.'))+2)
								lastLine[38] = lastLine[38].slice(0,(lastLine[38].indexOf('.'))+2)
								lastLine[39] = lastLine[39].slice(0,(lastLine[39].indexOf('.'))+2)
								lastLine[42] = lastLine[42].slice(0,(lastLine[42].indexOf('.'))+2)
								lastLine[41] = lastLine[41].slice(0,(lastLine[41].indexOf('.'))+2) 
								line[37] = parseFloat(line[37])
								data = [date_utc,line[37]]
								dataUndefC.push(data)
								line[38] = parseFloat(line[38])
								data = [date_utc,line[38]]
								dataUndefP.push(data)
								line[39] = parseFloat(line[39])
								data = [date_utc,line[39]]
								dataDeprecated.push(data)
								line[41] = parseFloat(line[41])
								data = [date_utc,line[41]]
								dataMissP.push(data)
								line[42] = parseFloat(line[42])
								data = [date_utc,line[42]]
								dataMissC.push(data)
							}
							Highcharts.chart({   //CONSISTENCY CHART (CHANGE OVER TIME)
								chart: {
									renderTo:'consistency',
									type: 'line'
								},
								title: {
									style:{
										fontSize:'30px',
										fontWeight:'bold'
									},
									text: lastLine[5]
								},

								rangeSelector: {
									enabled:true
								},

								dataGrouping:{
									enabled: false
								},

								xAxis: {
									type:'datetime',
								},
								yAxis: {
									min: 0,
									title: {
										text: 'Number of triples'
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
								tooltip: {
									headerFormat: '<span style=" border:0px">{point.key}</span><table style="width=100%; border:0px">',
									pointFormat: '<tr><td id="legendAcc" style="color:{series.color};padding:0">{series.name}: </td>' +
									'<td style="padding:0"><b>{point.y}</b></td></tr>',
									footerFormat: '</table>',
									shared: true,
									useHTML: true
								},
								plotOptions: {
									column: {
										pointPadding: 0.2,
										borderWidth: 0
									}
								},
								series: [
								{
									name:'Undefined class',
									data:dataUndefC
								},
								{
									name:'Undefined property',
									data:dataUndefP
								},
								{
									name:'Deprecated class/property',
									data:dataDeprecated
								},
								{
									name:'Misplaced property',
									data:dataMissP
								},
								{
									name:'Misplaced class',
									data:dataMissC
								},
								]
							});
						}
					}
				})
  				break;

    		case 'Verifiability':
				hideDiv()
      			document.getElementById('verifiability').style.display = 'block'
      			div = document.getElementById('verifiability')
      			$(document).ready(function() {
        			$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
        			});
        			function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						td1 = document.getElementById('nameV')  //BUILDING TABLE FOR VERIFIABILITY
						td2 = document.getElementById('vocabs')
						td3 = document.getElementById('auths')
						td4 = document.getElementById('pubs')
						td5 = document.getElementById('contribs')
						td6 = document.getElementById('sources')
						td7 = document.getElementById('signed')
						h1 = document.getElementById('headPub')
						h2 = document.getElementById('headVoc')
						h3 = document.getElementById('headContr')
						if (lastLine[44] == '[]')
							vocabs = 0
						else if ((lastLine[44] != 'endpoint offline') && (lastLine[44] != 'endpoint absent') && (lastLine[44].search('Could') == -1) && (lastLine[44].search('Could') == -1) && (lastLine[44] != 'Not indicated')){
							vocabs = occurrences(lastLine[44],';')
							vocabs = vocabs + 1
						} 
						else
							vocabs = lastLine[44]
						h2.innerHTML = `Vocabularies (${vocabs})`
						
						if (lastLine[46] == '[]')
							publishers = 0
						else if ((lastLine[46] != 'endpoint offline') && (lastLine[46] != 'endpoint absent') && (lastLine[46].search('Could') == -1) && (lastLine[46].search('Could') == -1) && (lastLine[46] != 'Not indicated') && (lastLine[46].search('Error') == -1)){
							publishers = occurrences(lastLine[46],';')
							publishers = publishers + 1
						} 
						else
							publishers = lastLine[46]
						h1.innerHTML = `Publishers (${publishers})`

						if (lastLine[47] == '[]')
							contributors = 0
						else if ((lastLine[47] != 'endpoint offline') && (lastLine[47] != 'endpoint absent') && (lastLine[47].search('Could') == -1) && (lastLine[47].search('Could') == -1) && (lastLine[47] != 'Not indicated') && (lastLine[47].search('Error') == -1)){
							contributors = occurrences(lastLine[47],';')
							contributors = contributors + 1
						} 
						else
							contributors = lastLine[47]
						h3.innerHTML = `Contributors (${contributors})`
						
						td1.innerHTML = lastLine[5]
						td2.innerHTML = lastLine[44]
						td3.innerHTML = lastLine[45]
						td4.innerHTML = lastLine[46]
						td5.innerHTML = lastLine[47]
						td6.innerHTML = lastLine[48]
						td7.innerHTML = lastLine[49]
        			}
      			});
    			break;

    		case 'Volatility':
      			hideDiv()
      			document.getElementById('volatility').style.display = 'block'
      			$(document).ready(function() {
        			$.ajax({
					type: "GET",
					url: './CSVforJS/'+a+'.csv',
					dataType: "text",
					success: function(data) {processData(data)}
        			});
        			function processData(data){
          				var lines = data.trim().split('\n');
          				var lastLine = lines[lines.length - 1].split(',');
          				td = document.getElementById('frequency')
          				td.innerHTML = lastLine[50]
        			}
      			});
    			break;
    		
			case 'Currency':
      			hideDiv()
      			document.getElementById('currency').style.display = 'block'
				document.getElementById('currTimeline').style.display = 'block'
      			$(document).ready(function() {
        			$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
        			});
        			function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						triples = parseInt(lastLine[14])
						triplesUp = parseInt(lastLine[53])
						otherTriples = triples - triplesUp
						historicalUp = lastLine[83].split(';')
						dataHistorical = []
						for(var i = 0; i<historicalUp.length; i++){
							date = historicalUp[i].split('|')[0]
							triples = historicalUp[i].split('|')[1]
							console.log(triples)
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
						Highcharts.chart({  //CHART FOR HISTORICAL UPDATE
							chart: {
								renderTo:'currTimeline',
								type: 'line'
							},
							title: {
								style:{
									fontSize:'30px',
									fontWeight:'bold'
								},
								text: 'Historical updates'
							},
							subtitle:{
								text: lastLine[5]
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
							series: [
								{
									name:'Triples updated',
									data:dataHistorical
								},
							]
						});
						td1 = document.getElementById('creation')
						td2 = document.getElementById('modification')
						td3 = document.getElementById('lastM')
						td4 = document.getElementById('updated')
						td1.innerHTML = lastLine[51]
						td2.innerHTML = lastLine[52]
						td3.innerHTML = lastLine[54]
						td4.innerHTML = lastLine[53]
					}
				});
      			break;

      		case 'Conciseness':
        		hideDiv()
        		document.getElementById('wrapSwitchConc').style.display = 'block'
      			div = document.getElementById('conciseness')
				div.style.display = 'block'
				$(document).ready(function() {
					$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
					});
        			function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						dataExC = []
						dataIntC = []
						if (lastLine[88] === 'True'){
							document.getElementById('wrap-warning-conc').style.display = 'block'
							numLimit = lastLine[55].split(' ')[3]
							document.getElementById('numTriplesLimitConc').innerHTML = `The number of triples recoverable from the SPARQL endpoint is limited to ${numLimit} triples.`
						}
          				if(!document.getElementById('typeConc').checked){
							for(var i = 1; i<lines.length; i++){
								line = lines[i].split(',')
								var tab_date = line[0].split('-')
								var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
								exC = line[55].split(' ')[0]
								intC = line[56].split(' ')[0]
								exC = parseFloat(exC)
								intC = parseFloat(intC)
								exC = exC.toFixed(3)
								intC = intC.toFixed(3)
								data1 = [date_utc,parseFloat(exC)]
								data2 = [date_utc,parseFloat(intC)]
								dataExC.push(data1)
								dataIntC.push(data2)
							}
							Highcharts.chart({  //CONCISENESS LINE-CHART
								chart: {
									renderTo:div,
									type: 'spline'
								},
								title: {
									style:{
										fontSize:'30px',
										fontWeight:'bold'
									},
									text: lastLine[5]
								},
								tooltip: {
									shared: true,
								},
								rangeSelector: {
									enabled:true
								},
								xAxis: {
									type:'datetime',
								},
								yAxis: {
									min:0,
									max:1,
									title: {
										text: 'Values conciseness'
									},
									plotLines: [{ 
										width:2,
										value: 1,
										color: '#0090eacc',
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
								plotOptions: {
									column: {
										pointPadding: 0.2,
										borderWidth: 0
									}
								},
								series: [
									{
										name:'Extensional conciseness',
										data:dataExC
									},
									{
										name:'Intensional conciseness',
										data:dataIntC
									}
								]
							});
						}
						else{
							document.getElementById('labelDatConci').style.display = 'block'
							analysisDate = []
							for(var i = 1; i<lines.length; i++){
								line = lines[i].split(',')
								analysisDate.push(line[0])
							}
							$("#datepickerConci").datepicker({
								dateFormat:"yy-mm-dd",
								beforeShowDay: function(date){
									var sdate = $.datepicker.formatDate('yy-mm-dd',date)
									if($.inArray(sdate,analysisDate) != -1){
										return[true]
									}
									return[false]
								}
								})
							$("#datepickerConci").datepicker("setDate",lastLine[0])
							$("#datepickerConci").on("change",function(){
								var selected = $(this).val();
								changeDataConciseness(selected,idKG)
							});
							dataExC = []
							dataIntC = []
							var tab_date = lastLine[0].split('-')
							var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
							exC = lastLine[55].split(' ')[0]
							intC = lastLine[56].split(' ')[0]
							exC = parseFloat(exC).toFixed(3)
							intC = parseFloat(intC).toFixed(3)
							data1 = [date_utc,parseFloat(exC)]
							data2 = [date_utc,parseFloat(intC)]
							dataExC.push(data1)
							dataIntC.push(data2)
							Highcharts.chart(div, {  //CONCISENESS BAR-CHART
								chart: {
									type: 'column'
								},
								title: {
									style:{
										fontSize:'30px',
										fontWeight:'bold'
									},
									text: lastLine[5]
								},
								xAxis: {
									type:'datetime',
								},
								yAxis: {
									min:0,
									max:1,
									title: {
										text: 'Values conciseness'
									},
									plotLines: [{ 
										width:2,
										value: 1,
										color: '#0090eacc',
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
								plotOptions: {
									column: {
										dataLabels: {
											enabled: true,
											crop: false,
											overflow: 'none'
										}
									}
								},
								series: [{
									name:'Extensional conciseness',
									data:dataExC
								},
								{
									name:'Intensional conciseness',
									data:dataIntC
								}]
							});
						}
					}
				});
      			break;

			case 'Completeness':
				hideDiv()
				document.getElementById('wrapSwitchComp').style.display = 'block'
        		divComp = document.getElementById('completeness')
        		divComp.style.display = 'block'
        		$(document).ready(function() {
          			$.ajax({
                    	type: "GET",
            			url: './CSVforJS/'+a+'.csv',
            			dataType: "text",
            		   	success: function(data) {processData(data)}
          			});
          			function processData(data){
						if(!document.getElementById('typeComp').checked){
							document.getElementById('singleC').style.display = 'none'
							document.getElementById('tabC').style.display = 'none'
							var lines = data.trim().split('\n');
							var lastLine = lines[lines.length - 1].split(',');
							dataCompl = []
							for(var i = 1; i<lines.length; i++){
								line = lines[i].split(',')
								var tab_date = line[0].split('-')
								var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
								interCom = parseFloat(line[57])
								data=[date_utc,interCom]
								dataCompl.push(data)
							}
              				Highcharts.chart({  //INTERLINKING COMPLETENESS CHART (CHANGE OVER TIME)
								chart: {
									renderTo:divComp,
									type: 'spline'
								},
								title: {
									style:{
										fontSize:'30px',
										fontWeight:'bold'
									},
									text: lastLine[5]
								},
								rangeSelector: {
									enabled:true
								},
								xAxis: {
									type:'datetime',
								},
								yAxis: {
									min:0,
									max:1.3,
									title: {
										text: 'Completeness value'
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
								plotOptions: {
									column: {
										pointPadding: 0.2,
										borderWidth: 0
									}
								},
								series: [{
									name:'Interlinking completeness',
									data:dataCompl
								},]
							});
						}
						else{
							document.getElementById('labelDatComp').style.display = 'block'
							var lines = data.trim().split('\n');
							var lastLine = lines[lines.length - 1].split(',');
							analysisDate = []
							for(var i = 1; i<lines.length; i++){
								line = lines[i].split(',')
								analysisDate.push(line[0])
							}
							divComp.style.display = 'none'
							divPie = document.getElementById('singleC')
							divPie.style.display = 'block'
							document.getElementById('tabC').style.display = 'block'
							$("#datepickerComp").datepicker({
								dateFormat:"yy-mm-dd",
								beforeShowDay: function(date){
									var sdate = $.datepicker.formatDate('yy-mm-dd',date)
									if($.inArray(sdate,analysisDate) != -1){
										return[true]
									}
									return[false]
								}
								})
							$("#datepickerComp").datepicker("setDate",lastLine[0])
							$("#datepickerComp").on("change",function(){
								var selected = $(this).val();
								changeDataCompleteness(selected,idKG)
							});
							td1 = document.getElementById('numTriplesComp')  //DYNAMIC CREATION OF TABLE FOR INTERLINKING COMLETENESS (BY DAY)
							td2 = document.getElementById('numTriplesLinked')
							td3 = document.getElementById('percentageLinked')
							tdInt = document.getElementById('interlinkingC')
							td1.innerHTML = lastLine[14]
							td2.innerHTML = lastLine[58]
							percentage = (parseInt(lastLine[58])/parseInt(lastLine[14])) * 100
							if(!isNaN(percentage)){
								percentage = percentage.toFixed(2)
								percentage = percentage+'%'
							}else
								percentage = '-'
							td3.innerHTML = percentage
							tdInt.innerHTML = lastLine[57]
						}
					}
				});
     			 break;

      		case 'Amount':
        		hideDiv()
        		document.getElementById('wrapSwitchAmount').style.display = 'block'
				divAmount = document.getElementById('amountOfData')
				divAmount.style.display = 'block'
				$(document).ready(function() {
					$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
					});
          			function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						triples = []
						entities = []
						properties = []
            			if(!document.getElementById('typeAmount').checked){
              				for(var i = 1; i<lines.length; i++){
                				line = lines[i].split(',')
               	 				var tab_date = line[0].split('-')
                				var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
								data = [date_utc,parseInt(line[14])]
								triples.push(data)
								data = [date_utc,parseInt(line[59])]
								entities.push(data)
								data = [date_utc,parseInt(line[60])]
								properties.push(data)
								console.log(entities,triples,properties);
							}
              				Highcharts.chart({  //AMOUNT OF DATA CHART (CHANGE OVER TIME)
								chart: {
									renderTo: divAmount,
									type: 'spline'
								},
								title: {
									style:{
										fontSize:'30px',
										fontWeight:'bold'
									},
									text: lastLine[5]
								}, 
								rangeSelector: {
									enabled:true
								},
								tooltip: {
									shared: true,
								},
								xAxis: {
									type:'datetime',
								},
								yAxis: {
									title: {
										text: 'amount of data'
									},
								},
								series: [{
									name:'Triples',
									data:triples
								},
								{
									name:'Entities',
									data:entities
								},
								{
									name:'Properties',
									data:properties
								},]
							});
						}
						else{
							document.getElementById('labelDatAmount').style.display = 'block'
							analysisDate = []
							for(var i = 1; i<lines.length; i++){
								line = lines[i].split(',')
								analysisDate.push(line[0])
							}
							$("#datepickerAmount").datepicker({
								dateFormat:"yy-mm-dd",
								beforeShowDay: function(date){
									var sdate = $.datepicker.formatDate('yy-mm-dd',date)
									if($.inArray(sdate,analysisDate) != -1){
										return[true]
									}
									return[false]
								}
								})
							$("#datepickerAmount").datepicker("setDate",lastLine[0])
							$("#datepickerAmount").on("change",function(){
								var selected = $(this).val();
								changeDataAmount(selected,idKG)
							});
							var tab_date = lastLine[0].split('-')
							var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
							data = [date_utc,parseInt(lastLine[14])]
							triples.push(data)
							data = [date_utc,parseInt(lastLine[59].split(' ')[0])]
							entities.push(data)
							data = [date_utc,parseInt(lastLine[60])]
							properties.push(data)
         					Highcharts.chart(divAmount, {  //AMOUNT OF DATA CHART (BY DAY)
								chart: {
									type: 'bar'
								},
								title: {
									style:{
										fontSize:'30px',
										fontWeight:'bold'
									},
									text: lastLine[5]
								}, 
								xAxis: {
									type:'datetime'
								},
								yAxis: {
									title: {
										text: 'Amount of data',
										align: 'high'
									},
									labels: {
									overflow: 'justify',
									}	
								},
								tooltip: {	
								},
								plotOptions: {
									bar: {
										dataLabels: {
											enabled: true
										}
									}
								},
								legend: {
									layout: 'vertical',
									align: 'right',
									verticalAlign: 'top',
									x: -40,
									y: 80,
									floating: false,
									borderWidth: 1,
									backgroundColor:
										Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
									shadow: true
								},
								credits: {
									enabled: false
								},
								series: [{
									minPointLength: 10,
									name: 'Triples',
									data: triples
								}, {
								minPointLength: 10,
									name: 'Entities',
									data: entities
								}, {
								minPointLength: 10,
									name: 'Properties',
									data: properties
								}]
							});
						}
					}
				});
      			break;

        	case 'RepresentationalConciseness':
          		hideDiv()
          		divRepConc = document.getElementById('wrap-repConc')
          		divRepConc.style.display = 'block'
          		$(document).ready(function() {
            		$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
            		});
            		function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						lengthS = []
						lengthP = []
						lengthO = []
						for(var i = 1; i<lines.length; i++){
							line = lines[i].split(',')
							var tab_date = line[0].split('-')
							var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
							data = [date_utc,parseFloat(line[61]),parseFloat(line[62]),parseFloat(line[63]),parseFloat(line[64]),parseFloat(line[65])]
							lengthS.push(data)
							data = [date_utc,parseFloat(line[66]),parseFloat(line[67]),parseFloat(line[68]),parseFloat(line[69]),parseFloat(line[70])]
							lengthP.push(data)
							data = [date_utc,parseFloat(line[71]),parseFloat(line[72]),parseFloat(line[73]),parseFloat(line[74]),parseFloat(line[75])]
							lengthO.push(data)
              			}
              			Highcharts.chart({ //BOXPLOT FOR URIs LENGTH
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
								}]
							},   
							series: [{
								name: 'Observations',
								data: lengthS,
								}, 
							]
						});
            			Highcharts.chart({
							chart: {
								renderTo:'lengthP',
								type: 'boxplot'
							},
							title: {
								style:{
									fontSize:'30px',
									fontWeight:'bold'
								},
								text: 'URIs length (predicate)'
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
								}]
							},   
							series: [{
								name: 'Observations',
								data: lengthP,
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
						Highcharts.chart({
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
								}]
							},   
							series: [{
								name: 'Observations',
								data: lengthO,
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
				});
				break;

        	case 'RepresentationalConsistency':
          		hideDiv()
          		document.getElementById('wrap-repCons').style.display = 'block'
          		$(document).ready(function() {
            		$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
            		});
            		function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						th1 = document.getElementById('numNewV')
						th2 = document.getElementById('numNewT')
						if(lastLine[76] != 'No new vocabulary defined'){
							numNewVoc = occurrences(lastLine[76],';')  //COUNTNG NUMBER OF NEW VOCABS
							if(!isNaN(numNewVoc) && numNewVoc > 0)
								numNewVoc = numNewVoc +1
							if(isNaN(numNewVoc) || numNewVoc == 0)
								numNewVoc = '-'
						}
						else
							numNewVoc = 0
						
						if(lastLine[77] != 'No new term defined'){
							numNewTerms = occurrences(lastLine[77],';')
							if(!isNaN(numNewTerms) && numNewTerms > 0) //COUNTING NUMBER OF NEW TERMS
								numNewTerms = numNewTerms +1 
							if(isNaN(numNewTerms) || numNewTerms == 0)
								numNewTerms = '-'
						}
						else
							numNewTerms = 0
						th1.innerHTML = 'New vocabularies defined in the dataset'+' ('+numNewVoc+')'
						th2.innerHTML = 'New terms defined in the dataset'+' ('+numNewTerms+')'
						vocabs = document.getElementById('newVocabs')
						terms = document.getElementById('newTerms')
						vocabs.innerHTML = lastLine[76]
						terms.innerHTML = lastLine[77]
            		}
          		});
        		break;

        	case 'Understendability':
				hideDiv()
          		document.getElementById('wrapSwitchUnder').style.display = 'block' 
          		document.getElementById('wrap-und').style.display = 'block'
          		$(document).ready(function() {
            		$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
            		});
            		function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						dataTriples =  []
						dataLabels = []
						for(var i = 1; i<lines.length; i++){
							line = lines[i].split(',')
							var tab_date = line[0].split('-')
							var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
							data = [date_utc,parseInt(line[14])]
							data2 = [date_utc,parseInt(line[78])]
							dataTriples.push(data)
							dataLabels.push(data2)
              			}
            			if(!document.getElementById('typeUnder').checked){ //UDERSTENDABILITY CHART (CHANGE OVER TIME)
           					Highcharts.chart('understendability', {
								chart: {
									type: 'column'
								},
								title: {
									style:{
										fontSize:'30px',
										fontWeight:'bold'
									},
									text: 'Understendability'
								},
								subtitle: {
									text:a,
									style:{
										fontSize:'24px'
									}
								},
								xAxis: {
									type: 'datetime',
								},
								yAxis: {
									min: 0,
									title: {
										text: 'no. triples'
									},
									labels: {
										overflow: 'justify',
									},
									plotLines: [{ 
										width:2,
										value: parseInt(lastLine[14]),
										color: '#28FF49',
										label: { 
											style:{
												color:'#0090eacc',
												fontSize:'15px',
												fontWeight:'bold'
											},
										text: 'Best value for labels', // Content of the label. 
										align: 'left', // Positioning of the label. 
										}
									}],
								},
								plotOptions: {
									bar: {
										dataLabels: {
											enabled: true
										}
									}
								},
								tooltip: {
									pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
								},
								series: [{
									name: 'Triples',
									data: dataTriples
								},
								{
								name: 'Labels',
								data: dataLabels
								}]
							});
						} 
						else{
							document.getElementById('labelDatUnder').style.display = 'block'
							analysisDate = []
							for(var i = 1; i<lines.length; i++){
								line = lines[i].split(',')
								analysisDate.push(line[0])
							}
							$("#datepickerUnder").datepicker({
								dateFormat:"yy-mm-dd",
								beforeShowDay: function(date){
									var sdate = $.datepicker.formatDate('yy-mm-dd',date)
									if($.inArray(sdate,analysisDate) != -1){
										return[true]
									}
									return[false]
								}
								})
							$("#datepickerUnder").datepicker("setDate",lastLine[0])
							$("#datepickerUnder").on("change",function(){
								var selected = $(this).val();
								changeDataUnder(selected,idKG)
							});
							triples = parseInt(lastLine[14])
							labels = parseInt(lastLine[78])
							othtiples = triples - labels
							Highcharts.chart({  //UNDERSTENDABILITY CHART (BY DAY)
								chart: {
									renderTo:'understendability',
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
									text: 'Triples'
								},
								subtitle: {
									text:a,
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
									name: 'Triples',	
									data: [{
										name: 'Number of triples with label',
										color:'#90ed7d',
										y: labels,
										sliced: true,
										selected: true
									}, {
										name: 'Number of triples without label',
										y: othtiples,
										color:'#0090eacc'
									}]
								}]
							});
						}
            			regex = document.getElementById('regex')
						vocabulary = document.getElementById('vocablurayU')
						example = document.getElementById('example')
						regex.innerHTML = lastLine[79]
						vocabulary.innerHTML = lastLine[44]
						example.innerHTML = lastLine[80]
					}
				});
        		break;

			case 'Interpretability':
          		hideDiv()
          		document.getElementById('wrapInterp').style.display = 'block'
          		document.getElementById('wrapSwitchInterp').style.display = 'block'
          		if(!document.getElementById('typeInterp').checked){
					$(document).ready(function() {
						$.ajax({
							type: "GET",
							url: './CSVforJS/'+a+'.csv',
							dataType: "text",
							success: function(data) {processData(data)}
						});
              			function processData(data){
							dataBlank = []
							var lines = data.trim().split('\n');
							var lastLine = lines[lines.length - 1].split(',');
							for(var i = 1; i<lines.length; i++){
								line = lines[i].split(',')
								var tab_date = line[0].split('-')
								var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
								data=[date_utc,parseInt(line[81])]
								dataBlank.push(data)
							}
            				Highcharts.chart({  //INTERPRETABILITY CHART (CHANGE OVER TIME)
								chart: {
									renderTo: 'interpretability',
									type: 'spline'
								},
								title: {
									style:{
										fontSize:'30px',
										fontWeight:'bold'
									},
									text: lastLine[5]
								}, 
								subtitle: {
									style:{
										fontSize:'18px',
									},
									align: 'center',
									text: 'The number of blank nodes should be 0 to have a KG with a hight interpretability.'
								},	
								rangeSelector: {
									enabled:true
								},
								xAxis: {
									type:'datetime',
								},
								yAxis: {
									title: {
										text: 'no. blank nodes'
									},
									
								},
								plotOptions: { //TO SHOW 0 VALUES
									series:{
										minPointLength:3
									},
									bar: {
										dataLabels: {
											enabled: true
										}
									}
								},
								series: [{
									name:'Blank nodes',
									data:dataBlank,
									color: 'black'
									}]
							});
						}
					});
				} 
				else {
					document.getElementById('labelDatInterp').style.display = 'block'
					$(document).ready(function() {
              			$.ajax({
							type: "GET",
							url: './CSVforJS/'+a+'.csv',
							dataType: "text",
							success: function(data) {processData(data)}
              			});
              			function processData(data){
							dataBlank = []
							dataTriples = []
							var lines = data.trim().split('\n');
							var lastLine = lines[lines.length - 1].split(',');
							analysisDate = []
							for(var i = 1; i<lines.length; i++){
								line = lines[i].split(',')
								analysisDate.push(line[0])
							}
							$("#datepickerInterp").datepicker({
								dateFormat:"yy-mm-dd",
								beforeShowDay: function(date){
									var sdate = $.datepicker.formatDate('yy-mm-dd',date)
									if($.inArray(sdate,analysisDate) != -1){
										return[true]
									}
									return[false]
								}
								})
							$("#datepickerInterp").datepicker("setDate",lastLine[0])
							$("#datepickerInterp").on("change",function(){
								var selected = $(this).val();
								changeDataInterp(selected,idKG)
							});
							var tab_date = lastLine[0].split('-')
							var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
							triples = parseInt(lastLine[14])
							blankNodes = parseInt(lastLine[81])
							data1 = [date_utc,triples]
							data2 = [date_utc,blankNodes]
							dataTriples.push(data1)
							dataBlank.push(data2)
                			Highcharts.chart('interpretability', {  //INTERPRETABILITY CHART (BY DAY)
								chart: {
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
									type: 'datetime',
								},
								yAxis: [{
									type:'logarithminc',
									title: {
									text: 'no. triples'
								},
									labels: {
										overflow: 'justify',
									},
								},
								{
									id: 'second-y-axis',
									opposite:true,
									min:0,
								}],
								plotOptions: { //TO SHOW 0 VALUES
									series:{
									minPointLength:3
									},
									bar: {
										dataLabels: {
											enabled: true
										}
									}
								},
								tooltip: {
									pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
								},
								series: [{
									name: 'Triples',
									data: dataTriples
								},
								{
								name: 'Blank nodes',
								data: dataBlank,
								// yAxis:'second-y-axis'
								}]
							});
						}
					});
				}
				td = document.getElementById('rdfInt')
          		$(document).ready(function() {
            		$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
            		});
            		function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						td.innerHTML = lastLine[82]
            		}
          		});
          		break;

          	case 'Versatility':
				hideDiv()  
              	document.getElementById('wrapVers').style.display = 'block'
              	$(document).ready(function() {
                	$.ajax({
                  		type: "GET",
                  		url: './CSVforJS/'+a+'.csv',
                  		dataType: "text",
                  		success: function(data) {processData(data)}
                	});
                	function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');  
						td1 = document.getElementById('serializations')  //DYNAMIC CONSTRUCTION OF VERSATILITY TABLE
						td2 = document.getElementById('languages')
						td3 = document.getElementById('linkSPARQL')
						td4 = document.getElementById('linkRDF')
						
						while (td4.hasChildNodes()) {
							td4.removeChild(td4.lastChild);
						}
							
						td1.innerHTML = lastLine[28]
						td2.innerHTML = lastLine[29]
						if(lastLine[30].search('http')!=-1)
               				td3.innerHTML = '<a href="' + lastLine[30]+'" target="_blank">'+lastLine[30] + '</a>'
            			else
                			td3.innerHTML = lastLine[30]
						//td4.innerHTML = lastLine[31]
						
						links = lastLine[31].split(';')
						for(var i = 0; i<links.length; i++){
							if(links[i]!= 'Not provided'){
								link = document.createElement('a')
								title = document.createTextNode(links[i])
								link.appendChild(title)
								link.title = links[i]
								link.href = links[i]
								link.target = '_blank'
								link.style.marginBottom = '3px'
								td4.appendChild(link)
							} 
							else {
								td4.appendChild(document.createTextNode(links[i]))
							}
						}
						console.log(links)
                	}
				});
				break;

			case 'Score':
				hideDiv()
				document.getElementById('wrapSwitchScore').style.display = 'block'
				scoreCont = document.getElementById('scoreCont')
				scoreCont.style.display = 'block'
				$(document).ready(function() {
					$.ajax({
						type: "GET",
						url: './CSVforJS/'+a+'.csv',
						dataType: "text",
						success: function(data) {processData(data)}
					});
        			function processData(data){
						var lines = data.trim().split('\n');
						var lastLine = lines[lines.length - 1].split(',');
						normalizedScore = lastLine[85]
						if(!document.getElementById('typeScore').checked){
							scoreValues = []
							for(var i = 1; i<lines.length; i++){
								line = lines[i].split(',')
								var tab_date = line[0].split('-')
								var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
								data=[date_utc,parseFloat(line[85])]
								scoreValues.push(data)
							}
							console.log(scoreValues)
							Highcharts.chart({ 
								chart: {
									renderTo: 'scoreChart',
									type: 'spline'
								},
								title: {
									style:{
										fontSize:'30px',
										fontWeight:'bold'
									},
									text: lastLine[5]
								},
								subtitle: {
									style:{
										fontSize:'18px',
									},
									align: 'center',
									text: 'Each dataset was given an aggregated value on the metrics that marked the final ranking. All values were normalised as percentages [0%-100%]'
								}, 
								rangeSelector: {
									enabled:true
								},
								xAxis: {
									type:'datetime',
								},
								yAxis: {
									title: {
										text: 'Score value'
									},
									plotLines: [{ 
										width:2,
										value: 100.00,
										color: '#0090eacc',
										label: { 
											style:{
												color:'#0090eacc',
												fontSize:'15px',
												fontWeight:'bold'
											},
										text: 'Best value: 100', // Content of the label. 
										align: 'left', // Positioning of the label. 
										}
									}],
								},
								plotOptions: { //TO SHOW 0 VALUES
									series:{
										minPointLength:3
									},
									bar: {
										dataLabels: {
											enabled: true
										}
									}
								},
								series: [{
									name:'Score',
									data: scoreValues,
									color: '#32ff96'
									}]
							});
						}
						else{
							var lines = data.trim().split('\n');
							var lastLine = lines[lines.length - 1].split(',');
							normalizedScore = parseFloat(lastLine[85])
							document.getElementById('labelDatScore').style.display = 'block'
							analysisDate = []
							for(var i = 1; i<lines.length; i++){
								line = lines[i].split(',')
								analysisDate.push(line[0])
							}
							$("#datepickerScore").datepicker({
								dateFormat:"yy-mm-dd",
								beforeShowDay: function(date){
									var sdate = $.datepicker.formatDate('yy-mm-dd',date)
									if($.inArray(sdate,analysisDate) != -1){
										return[true]
									}
									return[false]
								}
								})
							$("#datepickerScore").datepicker("setDate",lastLine[0])
							$("#datepickerScore").on("change",function(){
								var selected = $(this).val();
								changeDataScore(selected,idKG)
							});

							Highcharts.chart({  
								chart:{
									type : 'solidgauge',
									renderTo: 'scoreChart',
								},
								title: null,	
								pane: {
									center: ['50%', '85%'],
									size: '140%',
									startAngle: -90,
									endAngle: 90,
									background: {
										backgroundColor: 
										Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
										innerRadius: '60%',
										outerRadius: '100%',
										shape: 'arc'
									}
								},
			
								yAxis: {
									stops: [
										[0, '#32ff96'], // green
										],
									lineWidth: 0,
									tickWidth: 0,
									minorTickInterval: null,
									tickAmount: 0,
									min: 0,
									max: 100,
									title: {
										text: 'Score'
									}
								},
								series: [{
									
									name: 'Score',
									data: [normalizedScore],
									dataLabels: {
									format:
										'<div style="text-align:center">' +
										'<span style="font-size:25px">{y}</span><br/>' +
										'<span style="font-size:12px;opacity:0.4"></span>' +
										'</div>'
									},
								}]
							});
						}
					}
				});
				
				

				break;
			
			default:
  				alert('error, select a valid metric');
		}
	}
}

function hideDiv(){
	document.getElementById('containerDef').style.display = 'none'
	document.getElementById('wrap-warning-conc').style.display = 'none'
	document.getElementById('wrap-warning-cons').style.display = 'none'
	document.getElementById('wrap-warning-acc').style.display = 'none'
	document.getElementById('labelDatScore').style.display = 'none'
	document.getElementById('wrapSwitchScore').style.display = 'none'
	document.getElementById('scoreCont').style.display = 'none'
	document.getElementById('wrapSwitchAcc').style.display = 'none'
	document.getElementById('labelDatAcc').style.display = 'none'
	document.getElementById('currTimeline').style.display = 'none'
	document.getElementById('labelDatInterp').style.display = 'none'
	document.getElementById('labelDatUnder').style.display = 'none'
	document.getElementById('labelDatAmount').style.display = 'none'
	document.getElementById('labelDatComp').style.display = 'none'
	document.getElementById('labelDatConci').style.display = 'none'
	document.getElementById('labelDatCons').style.display = 'none'
	document.getElementById('wrapVers').style.display = 'none'
    document.getElementById('wrapSwitchUnder').style.display = 'none'
	document.getElementById('completeness').style.display = 'none'
	document.getElementById('tabC').style.display = 'none'
	document.getElementById('singleC').style.display = 'none'
	document.getElementById('tabC').style.display = 'none'
	document.getElementById('singleC').style.display = 'none'
	document.getElementById('tabC').style.display = 'none'
	document.getElementById(`wrap-tbInt`).style.display = 'none';
	document.getElementById(`reliablePr`).style.display = 'none';
	document.getElementById(`containerTrust`).style.display = 'none';
	document.getElementById(`containerBeliev`).style.display = 'none';
	document.getElementById('container').style.display = 'none'
	document.getElementById('container2').style.display = 'none'
	document.getElementById(`containerLicense`).style.display = 'none';
	document.getElementById('interlinking').style.display = 'none';
	document.getElementById(`mode`).style.display = 'none';
	document.getElementById(`intPie`).style.display = 'none';
	document.getElementById(`tableInt`).style.display = 'none';
	document.getElementById(`performance`).style.display = 'none';
	document.getElementById(`performanceT`).style.display = 'none';
	document.getElementById('wrapSec').style.display = 'none';
	document.getElementById('accuracy').style.display = 'none';
	document.getElementById('const-tab').style.display = 'none'
	document.getElementById('consistency').style.display = 'none'
	document.getElementById('wrapSwitchCons').style.display = 'none'
	document.getElementById('verifiability').style.display = 'none'
	document.getElementById('volatility').style.display = 'none'
	document.getElementById('currency').style.display = 'none'
	document.getElementById('wrapSwitchConc').style.display = 'none'
	document.getElementById('wrapSwitchConc').style.display = 'none'
	document.getElementById('conciseness').style.display = 'none'
	document.getElementById('wrapSwitchComp').style.display = 'none'
	document.getElementById('wrapSwitchAmount').style.display = 'none'
	document.getElementById('amountOfData').style.display = 'none'
	document.getElementById('wrap-repConc').style.display = 'none'
	document.getElementById('wrap-repCons').style.display = 'none'
	document.getElementById('wrap-und').style.display = 'none'
	document.getElementById('wrapSwitchUnder').style.display = 'none'
	document.getElementById('wrapInterp').style.display = 'none'
	document.getElementById('wrapSwitchInterp').style.display = 'none'
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

function convertToValidFilename(string) {
    return (string.replace(/[\/|\\:*?"<>-]/g, ""));
}

//CHANGE OF DATA IN THE GRAPH BASED ON THE SELECTED DATE
function changeDataConsistency(dataSelected,id){ 
	$(document).ready(function() {
		$.ajax({
			  type: "GET",
			  url: './CSVforJS/'+id+'.csv',
			  dataType: "text",
			  success: function(data) {processData(data)}
		});
		function processData(data){
			var lines = data.trim().split('\n');
			dataDisj = []
			dataUndefC = []
			dataUndefP = []
			dataDeprecated = []
			dataMissP = []
			dataMissC = []
			disjoint = '-'
			oh = '-'
			for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dataSelected){		
					var tab_date = line[0].split('-')
					var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
					line[37] = line[37].slice(0,(line[37].indexOf('.'))+2)
					line[38] = line[38].slice(0,(line[38].indexOf('.'))+2)
					line[39] = line[39].slice(0,(line[39].indexOf('.'))+2)
					line[42] = line[42].slice(0,(line[42].indexOf('.'))+2)
					line[41] = line[41].slice(0,(line[41].indexOf('.'))+2) 
					data = [parseFloat(line[37]),parseFloat(line[38]),parseFloat(line[39]),parseFloat(line[42]),parseFloat(line[41])]
					disjoint = line[36]
					oh = line[40]
				}
			}
			Highcharts.chart('consistency', {
				chart: {
					polar: true,
					type: 'line'
				},
			
				pane: {
					size: '95%'
				},
				title: {
					style:{
						fontSize:'30px',
						fontWeight:'bold'
					},
					text: 'Consistency'
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
					max: 1
				},
				tooltips: {
					enabled: true,
					callbacks: {
						label: function(tooltipItem, data) {
							return data.datasets[tooltipItem.datasetIndex].label + ' : ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
						}
					}
				},
				series:[{
					name: line[5],
					data: data 
				}],
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

			td = document.getElementById('OHValue')
			td2 = document.getElementById('disjValue')
			td.innerHTML = oh
			td2.innerHTML = disjoint
		}
	});
}

function changeDataConciseness(dataSelected,id){
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
			dataExC = []
			dataIntC = []
			for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dataSelected){
					var tab_date = line[0].split('-')
					var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
					exC = line[55].split(' ')[0]
					intC = line[56].split(' ')[0]
					exC = parseFloat(exC)
					intC = parseFloat(intC)
					exC.toFixed(3)
					intC.toFixed(3)
					data1 = [date_utc,parseFloat(exC)]
					data2 = [date_utc,parseFloat(intC)]
					dataExC.push(data1)
					dataIntC.push(data2)
				}
			}

			Highcharts.chart('conciseness', {
				chart: {
					type: 'column'
				},
				title: {
					style:{
						fontSize:'30px',
						fontWeight:'bold'
					},
					text: lastLine[5]
				},
				xAxis: {
					type:'datetime',
				},
				yAxis: {
					min:0,
					max:1,
					title: {
						text: 'Values conciseness'
					},
					plotLines: [{ 
						width:4,
						value: 1,
						color: '#0090eacc',
						label: { 
							style:{
								color:'#0090eacc',
								fontSize:'15px',
								fontWeight:'bold'
							},
							text: 'Best value: 1', // Content of the label. 
							align: 'left', // Positioning of the label. 
						}
					}]
				},
				plotOptions: {
					column: {
						dataLabels: {
							enabled: true,
							crop: false,
							overflow: 'none'
						}
					}
				},
				series: [{
					name:'Extensional conciseness',
					data:dataExC
				},
				{
					name:'Intensional conciseness',
					data:dataIntC
				}]
			});
		}
	});

}

function changeDataCompleteness(dataSelected,id){
	$(document).ready(function() {
		$.ajax({
			  type: "GET",
			  url: './CSVforJS/'+id+'.csv',
			  dataType: "text",
			  success: function(data) {processData(data)}
		});
		function processData(data){
			var lines = data.trim().split('\n');
			triples = ''
			triplesLinked = ''
			percentage = ''
			intC = ''
			for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dataSelected){
					td1 = document.getElementById('numTriplesComp')
					td2 = document.getElementById('numTriplesLinked')
					td3 = document.getElementById('percentageLinked')
					tdInt = document.getElementById('interlinkingC')
					triples = line[14]
					triplesLinked = line[58]
					percentage = (parseInt(line[58])/parseInt(line[14])) * 100
					if(!isNaN(percentage)){
						percentage = percentage.toFixed(2)
						percentage = percentage+'%'
					}else
						percentage = '-'
					intC = line[57]
				}
			}
			td1.innerHTML = triples
			td2.innerHTML = triplesLinked
			td3.innerHTML = percentage
			tdInt.innerHTML = intC
		}
	});	
}

function changeDataAmount(dataSelected,id){
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
				if(line[0] == dataSelected){
					var tab_date = line[0].split('-')
					var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
					data = [date_utc,parseInt(line[14])]
					triples.push(data)
					data = [date_utc,parseInt(line[59].split(' ')[0])]
					entities.push(data)
					data = [date_utc,parseInt(line[60])]
					properties.push(data)
				}
			}
			Highcharts.chart('amountOfData', {
				chart: {
					type: 'bar'
				},
				title: {
					style:{
						fontSize:'30px',
						fontWeight:'bold'
					},
					text: lastLine[5]
				}, 
				xAxis: {
					type:'datetime'
				},
				yAxis: {
					title: {
						text: 'Amount of data',
						align: 'high'
					},
					labels: {
					overflow: 'justify',
					}	
				},
				tooltip: {	
				},
				plotOptions: {
					bar: {
						dataLabels: {
							enabled: true
						}
					}
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'top',
					x: -40,
					y: 80,
					floating: false,
					borderWidth: 1,
					backgroundColor:
						Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
					shadow: true
				},
				credits: {
					enabled: false
				},
				series: [{
					minPointLength: 10,
					name: 'Triples',
					data: triples
				}, {
				minPointLength: 10,
					name: 'Entities',
					data: entities
				}, {
				minPointLength: 10,
					name: 'Properties',
					data: properties
				}]
			});
		
		}
	});
}

function changeDataUnder(dataSelected,id){
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
			var triples = -1
			var labels = -1
			var otTriples = -1
			re = '-'
			voc = '-'
			ex = '-'
			for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dataSelected){
					triples = parseInt(line[14])
					labels = parseInt(line[78])
					otTriples = triples - labels
					regex = document.getElementById('regex')
					vocabulary = document.getElementById('vocablurayU')
					example = document.getElementById('example')
					re = line[79]
					voc = line[44]
					ex = line[80]
				}
			}

			regex.innerHTML = re
			vocabulary.innerHTML = voc
			example.innerHTML = ex

			Highcharts.chart({
				chart: {
					renderTo:'understendability',
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
					text: 'Triples'
				},
				subtitle: {
					text:lastLine[5],
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
					name: 'Triples',	
					data: [{
						name: 'Number of triples with label',
						color:'#90ed7d',
						y: labels,
						sliced: true,
						selected: true
					}, {
						name: 'Number of triples without label',
						y: otTriples,
						color:'#0090eacc'
					}]
				}]
			});
		}
	});
}

function changeDataInterp(dataSelected,id){
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
			rdf = '-'
			for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dataSelected){
					var tab_date = line[0].split('-')
					var date_utc = Date.UTC(parseInt(tab_date[0]),parseInt(tab_date[1])-1,parseInt(tab_date[2]));
					triples = parseInt(line[14])
					blankNodes = parseInt(line[81])
					data1 = [date_utc,triples]
					data2 = [date_utc,blankNodes]
					dataTriples.push(data1)
					dataBlank.push(data2)
					rdf = line[82]
				}
			}
			Highcharts.chart('interpretability', {
				chart: {
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
					type: 'datetime',
				},
				yAxis: [{
					type:'logarithminc',
					title: {
					text: 'no. triples'
				},
					labels: {
						overflow: 'justify',
					},
				},
				{
					id: 'second-y-axis',
					opposite:true,
					min:0,
				}],
				plotOptions: { //TO SHOW 0 VALUES
					series:{
					minPointLength:3
					},
					bar: {
						dataLabels: {
							enabled: true
						}
					}
				},
				tooltip: {
					pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
				},
				series: [{
					name: 'Triples',
					data: dataTriples
				},
				{
				name: 'Blank nodes',
				data: dataBlank,
				// yAxis:'second-y-axis'
				}]
			});

			td = document.getElementById('rdfInt')
			td.innerHTML = rdf
		}
	});
}

function changeDataCurrency(dataSelected,id){
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
			creationDate = '-'
			modificationDate = '-'
			lastM = '-'
			updated = '-'
			for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dataSelected){
					td1 = document.getElementById('creation')
					td2 = document.getElementById('modification')
					td3 = document.getElementById('lastM')
					td4 = document.getElementById('updated')
					creationDate = line[51]
					modificationDate = line[52]
					updated = line[53]
					lastM = line[54]
				}
			}
			td1.innerHTML = creationDate
			td2.innerHTML = modificationDate
			td3.innerHTML = lastM
			td4.innerHTML = updated
		}
	});
}

function changeDataAccuracy(dateSelected,id){
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
				}
			}				
			Highcharts.chart('accuracy', {
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
					max: 1
				},
				tooltips: {
					enabled: true,
					callbacks: {
						label: function(tooltipItem, data) {
							return data.datasets[tooltipItem.datasetIndex].label + ' : ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
						}
					}
				},
				series:[{
					name: line[5],
					data: data 
				}],
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
		}
	});
}

function changeDataScore(dateSelected,id){
	$(document).ready(function() {
		$.ajax({
			  type: "GET",
			  url: './CSVforJS/'+id+'.csv',
			  dataType: "text",
			  success: function(data) {processData(data)}
		});
		function processData(data){
			var normalizedScore;
			var lines = data.trim().split('\n');
			var lastLine = lines[lines.length - 1].split(',');
			for(var i = 1; i<lines.length; i++){
				var line = lines[i].split(',')
				if(line[0] == dateSelected){
					normalizedScore = parseFloat(line[85])
				}
			}		
			
			Highcharts.chart({  //CHART FOR THE TRUST VALUE
				chart:{
					type : 'solidgauge',
					renderTo: 'scoreChart',
				},
				title: null,	
				pane: {
					center: ['50%', '85%'],
					size: '140%',
					startAngle: -90,
					endAngle: 90,
					background: {
						backgroundColor:
						Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
						innerRadius: '60%',
						outerRadius: '100%',
						shape: 'arc'
					}
				},

				yAxis: {
					stops: [
						[0, '#32ff96'], // green
						],
					lineWidth: 0,
					tickWidth: 0,
					minorTickInterval: null,
					tickAmount: 0,
					min: 0,
					max: 100,
					title: {
						text: 'Score'
					}
				},
				series: [{
					name: 'Score',
					data: [normalizedScore],
					dataLabels: {
					format:
						'<div style="text-align:center">' +
						'<span style="font-size:25px">{y}</span><br/>' +
						'<span style="font-size:12px;opacity:0.4"></span>' +
						'</div>'
					},
				}]
			});
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

function downloadFullCSV(id) {
	var a = document.createElement('a')
	fileUrl = 'CSVforJS/'+id+'.csv'
	a.href = fileUrl
	a.setAttribute("download",fileUrl)
	a.click()
  }
  
function myFunction() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("mySearch");
	filter = input.value.toUpperCase();
	ul = document.getElementById("myMenu");
	li = ul.getElementsByTagName("li");
	for (i = 0; i < li.length; i++) {
	  a = li[i].getElementsByTagName("button")[0];
	  if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
		li[i].style.display = "";
	  } else {
		li[i].style.display = "none";
	  }
	}
}

function addClick(li){
    li.addEventListener("click",function(){
        li.style.backgroundColor = "#00ea89cc"
        li.style.color = "white"
    });
}