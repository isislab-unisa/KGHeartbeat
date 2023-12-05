import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from "highcharts/highstock";

function create_options(chart_title, series,y_min,y_max,y_title,x_categories){
    
    const options = {
        chart: {
            type: "column"
        }, 
        title: {
            text: chart_title
        },
        xAxis: {
            categories: x_categories
        },
        yAxis: {
            allowDecimals: false,
            min: y_min,
            max: y_max,
            title: {
                text: y_title
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
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        legend:{
            enabled: true
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: series
    }
    
      return options
}

const StackedChartAmount = ({chart_title,series,y_min,y_max,y_title, x_categories}) => <HighchartsReact
    highcharts={Highcharts}
    options={create_options(chart_title,series, y_min,y_max,y_title,x_categories)}
/>

export default StackedChartAmount;