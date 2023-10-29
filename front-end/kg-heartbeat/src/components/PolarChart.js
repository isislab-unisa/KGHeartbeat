import React from 'react';
import Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official';

function create_options(chart_title,series,y_min,y_max,x_categories){

    const options = {
        chart: {
            polar: true,
            type: "line"
        }, 
        title: {
            style:{
                fontSize:'30px',
                fontWeight:'bold'
            },
            text: chart_title
        },
        pane: {
            size: '95%'
        },
        xAxis: {
            categories: x_categories,
            lineWidth: 0,
            tickmarkPlacement: 'on',
            tickAmount:0.1,
        },
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: y_min,
            max: y_max,
            tickAmount:0.1,
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
                    align: 'center', // Positioning of the label. 
                    x: -90
                }
            }],
        },
        tooltip: {
            shared: true
        },

        series: series,

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
    
    }
 
    return options
  }

const PolarChart = ({chart_title, series, y_min, y_max, x_categories}) => <HighchartsReact 
  highcharts={Highcharts}
  options={create_options(chart_title,series,y_min,y_max,x_categories)}
/>

export default PolarChart;