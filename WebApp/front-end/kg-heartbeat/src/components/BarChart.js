import React from 'react';
import Highcharts from "highcharts/highstock";
import HighchartsReact from 'highcharts-react-official';
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

function create_options(chart_title, series, y_min,y_max, sub_title){

    const options = {
        chart: {
            type: 'bar'
        },
        title: {
            style:{
                fontSize:'30px',
                fontWeight:'bold'
            },
            text: chart_title
        },
        subtitle:{
            text: sub_title
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
                text: 'Values'
            },
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: series
    }

    return options;
}

const BarChart = ({chart_title, series, y_min, y_max, sub_title}) => <HighchartsReact
    highcharts={Highcharts}
    options={create_options(chart_title,series, y_min, y_max, sub_title)}
/>

export default BarChart;