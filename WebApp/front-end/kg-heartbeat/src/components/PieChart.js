import React from 'react';
import Highcharts from "highcharts";
import HighchartsReact from 'highcharts-react-official';

function create_options(chart_title,series){
    const options = {
        chart : {
            type: 'pie'
        },
        title: {
            text: chart_title
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
        series: series
    }
    
    return options
}


const PieChart = ({chart_title, series}) => <HighchartsReact
    highcharts={Highcharts}
    options={create_options(chart_title,series)}
/>

export default PieChart;