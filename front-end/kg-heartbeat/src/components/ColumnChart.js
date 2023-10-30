import React from 'react';
import Highcharts from "highcharts/highstock";
import HighchartsReact from 'highcharts-react-official';
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

function create_options(chart_title, series, y_min,y_max){

    const options = {
        chart: {
            type: 'column'
        },
        title: {
            style:{
                fontSize:'30px',
                fontWeight:'bold'
            },
            text: chart_title
        },
        xAxis: {
            type:'datetime',
        },
        yAxis: {
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: 'gray'
                },
                formatter: function() {
                    return  this.stack;
                }
            },
            min:y_min,
            max:y_max,
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
                verticalAlign: 'top',
                allowOverlap: true,
                enabled: true,
                inside: true
              },
            }
          },
        series: series
    }

    return options;
}

const ColumnChart = ({chart_title, series, y_min, y_max}) => <HighchartsReact
    highcharts={Highcharts}
    options={create_options(chart_title,series, y_min, y_max)}
/>

export default ColumnChart;